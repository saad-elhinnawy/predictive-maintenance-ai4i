import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth';
import { sendOrderConfirmation } from '../services/email';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

// GET /api/orders — authenticated user's own orders
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    include: {
      shipment: {
        select: { id: true, currentMilestone: true, billOfLading: true },
      },
    },
  });

  res.json(orders);
});

// GET /api/orders/:id — full order detail with shipment + tracking events
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
    include: {
      shipment: {
        include: {
          trackingEvents: {
            orderBy: { timestamp: 'desc' },
          },
        },
      },
    },
  });

  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  res.json(order);
});

const createOrderSchema = z.object({
  carModel: z.string().min(1).max(200),
  configuration: z.record(z.unknown()),
  totalPrice: z.number().positive(),
});

// POST /api/orders — create a new order from the quote form
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { carModel, configuration, totalPrice } = parsed.data;

  const order = await prisma.order.create({
    data: {
      userId: req.user!.id,
      carModel,
      configuration,
      totalPrice,
    },
  });

  // Fetch user for email — non-blocking
  prisma.user
    .findUnique({ where: { id: req.user!.id }, select: { email: true, name: true } })
    .then((user) => {
      if (user) {
        return sendOrderConfirmation(user.email, user.name, carModel, order.id);
      }
    })
    .catch(console.error);

  res.status(201).json({ orderId: order.id });
});

export default router;
