import { Router, Response } from 'express';
import { FuelType, Transmission, ListingStatus, Milestone } from '@prisma/client';
import { z } from 'zod';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { advanceMilestone } from '../services/milestoneService';
import { fetchVesselPosition } from '../services/marineTraffic';
import { calcFinalPrice } from './listings';

const router = Router();

router.use(authenticate, requireAdmin);

// ─── Orders ──────────────────────────────────────────────────────────────────

router.get('/orders', async (req: AuthRequest, res: Response): Promise<void> => {
  const page   = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit  = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip   = (page - 1) * limit;
  const statusFilter = req.query.status as string | undefined;
  const where  = statusFilter ? { status: statusFilter as any } : {};

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

  res.json({ orders, total, page, limit, totalPages: Math.ceil(total / limit) });
});

router.get('/orders/:orderId', async (req: AuthRequest, res: Response): Promise<void> => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.orderId },
    include: {
      user:    { select: { id: true, email: true, name: true, createdAt: true } },
      listing: { select: { id: true, make: true, model: true, year: true } },
      shipment: { include: { trackingEvents: { orderBy: { timestamp: 'desc' } } } },
    },
  });

  if (!order) { res.status(404).json({ error: 'Order not found' }); return; }
  res.json(order);
});

const milestoneSchema = z.object({
  milestone:    z.nativeEnum(Milestone),
  notes:        z.string().max(1000).optional(),
  gpsLat:       z.number().min(-90).max(90).optional(),
  gpsLng:       z.number().min(-180).max(180).optional(),
  vesselName:   z.string().max(200).optional(),
  vesselImo:    z.string().max(20).optional(),
  billOfLading: z.string().max(100).optional(),
});

router.post('/shipments/:shipmentId/milestone', async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = milestoneSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const { shipmentId } = req.params;
  const { milestone, notes, gpsLat, gpsLng, vesselName, vesselImo, billOfLading } = parsed.data;

  if (vesselImo !== undefined || billOfLading !== undefined) {
    const data: Record<string, unknown> = {};
    if (vesselImo    !== undefined) data.vesselImo    = vesselImo;
    if (billOfLading !== undefined) data.billOfLading = billOfLading;
    await prisma.shipment.update({ where: { id: shipmentId }, data });
  }

  const advanced = await advanceMilestone({ shipmentId, milestone, notes, gpsLat, gpsLng, vesselName });

  if (advanced === false) {
    const exists = await prisma.shipment.findUnique({ where: { id: shipmentId }, select: { id: true } });
    if (!exists) { res.status(404).json({ error: 'Shipment not found' }); return; }
  }

  res.json({ success: true, advanced });
});

router.post('/shipments/:shipmentId/refresh-vessel', async (req: AuthRequest, res: Response): Promise<void> => {
  const shipment = await prisma.shipment.findUnique({
    where: { id: req.params.shipmentId },
    select: { id: true, vesselImo: true, currentMilestone: true },
  });

  if (!shipment) { res.status(404).json({ error: 'Shipment not found' }); return; }
  if (!shipment.vesselImo) { res.status(422).json({ error: 'Shipment has no vesselImo set' }); return; }

  try {
    const position = await fetchVesselPosition(shipment.vesselImo);

    if (!position) {
      await prisma.shipment.update({ where: { id: shipment.id }, data: { marineTrafficError: true } });
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

    await prisma.shipment.update({ where: { id: shipment.id }, data: { marineTrafficError: false } });
    res.json({ position });
  } catch (err) {
    await prisma.shipment.update({ where: { id: shipment.id }, data: { marineTrafficError: true } });
    throw err;
  }
});

router.get('/shipments', async (_req: AuthRequest, res: Response): Promise<void> => {
  const shipments = await prisma.shipment.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      order: { include: { user: { select: { id: true, email: true, name: true } } } },
      trackingEvents: { orderBy: { timestamp: 'desc' }, take: 1 },
    },
  });
  res.json(shipments);
});

router.post('/orders/:orderId/shipment', async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = z.object({
    billOfLading: z.string().max(100).optional(),
    vesselImo:    z.string().max(20).optional(),
  }).safeParse(req.body);

  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const order = await prisma.order.findUnique({ where: { id: req.params.orderId } });
  if (!order) { res.status(404).json({ error: 'Order not found' }); return; }

  const existing = await prisma.shipment.findUnique({ where: { orderId: order.id } });
  if (existing) {
    res.status(409).json({ error: 'A shipment already exists for this order', shipmentId: existing.id });
    return;
  }

  const shipment = await prisma.shipment.create({
    data: { orderId: order.id, ...parsed.data },
  });

  await prisma.trackingEvent.create({
    data: { shipmentId: shipment.id, milestone: Milestone.PURCHASED, timestamp: new Date(), notes: 'Shipment record created.' },
  });

  res.status(201).json(shipment);
});

// ─── Listings ─────────────────────────────────────────────────────────────────

const listingSchema = z.object({
  make:         z.string().min(1).max(100),
  model:        z.string().min(1).max(200),
  year:         z.number().int().min(2000).max(new Date().getFullYear() + 2),
  mileage:      z.number().int().min(0).default(0),
  condition:    z.enum(['NEW', 'USED']).default('NEW'),
  fuelType:     z.nativeEnum(FuelType),
  transmission: z.nativeEnum(Transmission),
  power:        z.number().int().min(1).optional(),
  engineSize:   z.number().positive().optional(),
  color:        z.string().max(100).optional(),
  bodyType:     z.string().max(100).optional(),
  photos:       z.array(z.string()).min(1),
  basePrice:    z.number().positive(),
  shippingCost: z.number().positive().default(1200),
  taxRate:      z.number().min(0).max(1).default(0.14),
  customsRate:  z.number().min(0).max(1).default(0.05),
  status:       z.nativeEnum(ListingStatus).default(ListingStatus.AVAILABLE),
  sourceUrl:    z.string().optional(),
  sourceSite:   z.string().max(100).optional(),
  features:     z.array(z.string()).optional(),
  mjPrompt:     z.string().max(1000).optional(),
});

router.get('/listings', async (_req: AuthRequest, res: Response): Promise<void> => {
  const listings = await prisma.carListing.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(listings);
});

router.post('/listings', async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = listingSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const listing = await prisma.carListing.create({ data: parsed.data as any });
  res.status(201).json(listing);
});

router.put('/listings/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = listingSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const existing = await prisma.carListing.findUnique({ where: { id: req.params.id } });
  if (!existing) { res.status(404).json({ error: 'Listing not found' }); return; }

  const listing = await prisma.carListing.update({
    where: { id: req.params.id },
    data:  parsed.data as any,
  });
  res.json(listing);
});

router.delete('/listings/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const existing = await prisma.carListing.findUnique({ where: { id: req.params.id } });
  if (!existing) { res.status(404).json({ error: 'Listing not found' }); return; }

  await prisma.carListing.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
