import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { sendOrderConfirmation } from '../services/email';
import { calcFinalPrice } from './listings';

const router = Router();

const createOrderSchema = z.object({
  listingId:     z.string(),
  customerName:  z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(7),
});

// POST /api/orders — public, no auth required
router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

    const { listingId, customerName, customerEmail, customerPhone } = parsed.data;

    const listing = await prisma.carListing.findUnique({ where: { id: listingId } });
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
        customerName,
        customerEmail,
        customerPhone,
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

    sendOrderConfirmation(customerEmail, customerName, order.carModel, order.id).catch(console.error);

    res.status(201).json({ orderId: order.id });
  } catch (err) {
    next(err);
  }
});

export default router;
