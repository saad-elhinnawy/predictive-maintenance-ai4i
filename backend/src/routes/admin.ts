import { Router, Response } from 'express';
import { PrismaClient, Milestone } from '@prisma/client';
import { z } from 'zod';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { sendMilestoneUpdate } from '../services/email';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate, requireAdmin);

// GET /api/admin/orders?page=1&limit=20&status=PENDING
router.get('/orders', async (req: AuthRequest, res: Response): Promise<void> => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;

  const statusFilter = req.query.status as string | undefined;
  const where = statusFilter ? { status: statusFilter as any } : {};

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, name: true } },
        shipment: { select: { id: true, currentMilestone: true, billOfLading: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  res.json({
    orders,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

const milestoneSchema = z.object({
  milestone: z.nativeEnum(Milestone),
  notes: z.string().max(1000).optional(),
  gpsLat: z.number().min(-90).max(90).optional(),
  gpsLng: z.number().min(-180).max(180).optional(),
  vesselName: z.string().max(200).optional(),
  vesselImo: z.string().max(20).optional(),
  billOfLading: z.string().max(100).optional(),
});

// POST /api/admin/shipments/:shipmentId/milestone
router.post('/shipments/:shipmentId/milestone', async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = milestoneSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { shipmentId } = req.params;
  const { milestone, notes, gpsLat, gpsLng, vesselName, vesselImo, billOfLading } = parsed.data;

  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: {
      order: {
        include: { user: { select: { email: true, name: true } } },
      },
    },
  });

  if (!shipment) {
    res.status(404).json({ error: 'Shipment not found' });
    return;
  }

  const updateData: Record<string, unknown> = { currentMilestone: milestone };
  if (vesselImo !== undefined) updateData.vesselImo = vesselImo;
  if (billOfLading !== undefined) updateData.billOfLading = billOfLading;

  await prisma.$transaction([
    prisma.shipment.update({
      where: { id: shipmentId },
      data: updateData,
    }),
    prisma.trackingEvent.create({
      data: {
        shipmentId,
        milestone,
        timestamp: new Date(),
        notes,
        gpsLat,
        gpsLng,
        vesselName,
      },
    }),
  ]);

  // Also sync order status when key milestones are hit
  const orderStatusMap: Partial<Record<Milestone, string>> = {
    [Milestone.PURCHASED]: 'PAID',
    [Milestone.INLAND_TO_PORT]: 'SHIPPING',
    [Milestone.DELIVERED]: 'DELIVERED',
  };
  const newOrderStatus = orderStatusMap[milestone];
  if (newOrderStatus) {
    await prisma.order.update({
      where: { id: shipment.orderId },
      data: { status: newOrderStatus as any },
    });
  }

  // Fire-and-forget email notification
  const { user } = shipment.order;
  sendMilestoneUpdate(user.email, user.name, shipment.order.carModel, milestone).catch(console.error);

  res.json({ success: true });
});

// GET /api/admin/shipments — list all shipments
router.get('/shipments', async (_req: AuthRequest, res: Response): Promise<void> => {
  const shipments = await prisma.shipment.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      order: {
        include: { user: { select: { id: true, email: true, name: true } } },
      },
      trackingEvents: { orderBy: { timestamp: 'desc' }, take: 1 },
    },
  });

  res.json(shipments);
});

// POST /api/admin/orders/:orderId/shipment — create a shipment for an order
router.post('/orders/:orderId/shipment', async (req: AuthRequest, res: Response): Promise<void> => {
  const shipmentCreateSchema = z.object({
    billOfLading: z.string().max(100).optional(),
    vesselImo: z.string().max(20).optional(),
  });

  const parsed = shipmentCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const order = await prisma.order.findUnique({ where: { id: req.params.orderId } });
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  const existing = await prisma.shipment.findUnique({ where: { orderId: order.id } });
  if (existing) {
    res.status(409).json({ error: 'A shipment already exists for this order', shipmentId: existing.id });
    return;
  }

  const shipment = await prisma.shipment.create({
    data: {
      orderId: order.id,
      billOfLading: parsed.data.billOfLading,
      vesselImo: parsed.data.vesselImo,
    },
  });

  await prisma.trackingEvent.create({
    data: {
      shipmentId: shipment.id,
      milestone: Milestone.PURCHASED,
      timestamp: new Date(),
      notes: 'Shipment record created.',
    },
  });

  res.status(201).json(shipment);
});

export default router;
