import { Router, Response } from 'express';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { sendOrderConfirmation } from '../services/email';
import { calcFinalPrice } from './listings';

const router = Router();

router.use(authenticate);

// GET /api/orders
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const orders = await prisma.order.findMany({
    where:   { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    include: {
      shipment: { select: { id: true, currentMilestone: true, billOfLading: true } },
      listing:  { select: { id: true, photos: true } },
    },
  });
  res.json(orders);
});

// GET /api/orders/:id
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
    include: {
      shipment: { include: { trackingEvents: { orderBy: { timestamp: 'desc' } } } },
      listing:  { select: { id: true, photos: true, make: true, model: true, year: true, color: true } },
    },
  });

  if (!order) { res.status(404).json({ error: 'Order not found' }); return; }
  res.json(order);
});

// POST /api/orders — create from a catalogue listing
const createOrderSchema = z.object({
  listingId: z.string(),
});

router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const listing = await prisma.carListing.findUnique({
    where: { id: parsed.data.listingId },
  });

  if (!listing) { res.status(404).json({ error: 'Listing not found' }); return; }
  if (listing.status !== 'AVAILABLE') {
    res.status(409).json({ error: 'This vehicle is no longer available' });
    return;
  }

  const totalPrice = calcFinalPrice(
    listing.basePrice,
    listing.shippingCost,
    listing.taxRate,
    listing.customsRate,
  );

  const order = await prisma.order.create({
    data: {
      userId:    req.user!.id,
      listingId: listing.id,
      carModel:  `${listing.year} ${listing.make} ${listing.model}`,
      configuration: {
        color:        listing.color ?? 'Not specified',
        fuel:         listing.fuelType,
        transmission: listing.transmission,
        bodyType:     listing.bodyType ?? 'Sedan',
        mileage:      listing.mileage,
      },
      totalPrice,
    },
  });

  prisma.user
    .findUnique({ where: { id: req.user!.id }, select: { email: true, name: true } })
    .then((user) => {
      if (user) return sendOrderConfirmation(user.email, user.name, order.carModel, order.id);
    })
    .catch(console.error);

  res.status(201).json({ orderId: order.id });
});

export default router;
