import { Router, Response } from 'express';
import { Milestone } from '@prisma/client';
import { z } from 'zod';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { advanceMilestone } from '../services/milestoneService';
import { fetchVesselPosition } from '../services/marineTraffic';

const router = Router();

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
        shipment: {
          select: {
            id: true,
            currentMilestone: true,
            billOfLading: true,
            trackingEvents: { select: { timestamp: true }, orderBy: { timestamp: 'desc' }, take: 1 },
          },
        },
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

// GET /api/admin/orders/:orderId — full order detail for admin
router.get('/orders/:orderId', async (req: AuthRequest, res: Response): Promise<void> => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.orderId },
    include: {
      user: { select: { id: true, email: true, name: true, createdAt: true } },
      shipment: {
        include: {
          trackingEvents: { orderBy: { timestamp: 'desc' } },
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

  // Update optional shipment fields before advancing milestone
  if (vesselImo !== undefined || billOfLading !== undefined) {
    const data: Record<string, unknown> = {};
    if (vesselImo    !== undefined) data.vesselImo    = vesselImo;
    if (billOfLading !== undefined) data.billOfLading = billOfLading;
    await prisma.shipment.update({ where: { id: shipmentId }, data });
  }

  const advanced = await advanceMilestone({ shipmentId, milestone, notes, gpsLat, gpsLng, vesselName });

  if (advanced === false) {
    // advanceMilestone returns false when shipment not found OR milestone already reached
    const exists = await prisma.shipment.findUnique({ where: { id: shipmentId }, select: { id: true } });
    if (!exists) {
      res.status(404).json({ error: 'Shipment not found' });
      return;
    }
  }

  res.json({ success: true, advanced });
});

// POST /api/admin/shipments/:shipmentId/refresh-vessel
router.post('/shipments/:shipmentId/refresh-vessel', async (req: AuthRequest, res: Response): Promise<void> => {
  const shipment = await prisma.shipment.findUnique({
    where: { id: req.params.shipmentId },
    select: { id: true, vesselImo: true, currentMilestone: true },
  });

  if (!shipment) {
    res.status(404).json({ error: 'Shipment not found' });
    return;
  }

  if (!shipment.vesselImo) {
    res.status(422).json({ error: 'Shipment has no vesselImo set' });
    return;
  }

  try {
    const position = await fetchVesselPosition(shipment.vesselImo);

    if (!position) {
      await prisma.shipment.update({
        where: { id: shipment.id },
        data:  { marineTrafficError: true },
      });
      res.status(502).json({ error: 'No position data returned by MarineTraffic' });
      return;
    }

    await prisma.vesselPosition.create({
      data: {
        shipmentId: shipment.id,
        lat:        position.lat,
        lng:        position.lng,
        speed:      position.speed,
        heading:    position.heading,
        timestamp:  position.timestamp,
      },
    });

    await prisma.shipment.update({
      where: { id: shipment.id },
      data:  { marineTrafficError: false },
    });

    res.json({ position });
  } catch (err) {
    await prisma.shipment.update({
      where: { id: shipment.id },
      data:  { marineTrafficError: true },
    });
    throw err;
  }
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
