"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const prisma_1 = __importDefault(require("../lib/prisma"));
const milestoneService_1 = require("../services/milestoneService");
const marineTraffic_1 = require("../services/marineTraffic");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate, auth_1.requireAdmin);
// ─── Orders ──────────────────────────────────────────────────────────────────
router.get('/orders', async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const statusFilter = req.query.status;
    const where = statusFilter ? { status: statusFilter } : {};
    const [orders, total] = await prisma_1.default.$transaction([
        prisma_1.default.order.findMany({
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
        prisma_1.default.order.count({ where }),
    ]);
    res.json({ orders, total, page, limit, totalPages: Math.ceil(total / limit) });
});
router.get('/orders/:orderId', async (req, res) => {
    const order = await prisma_1.default.order.findUnique({
        where: { id: req.params.orderId },
        include: {
            user: { select: { id: true, email: true, name: true, createdAt: true } },
            listing: { select: { id: true, make: true, model: true, year: true } },
            shipment: { include: { trackingEvents: { orderBy: { timestamp: 'desc' } } } },
        },
    });
    if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
    }
    res.json(order);
});
const milestoneSchema = zod_1.z.object({
    milestone: zod_1.z.nativeEnum(client_1.Milestone),
    notes: zod_1.z.string().max(1000).optional(),
    gpsLat: zod_1.z.number().min(-90).max(90).optional(),
    gpsLng: zod_1.z.number().min(-180).max(180).optional(),
    vesselName: zod_1.z.string().max(200).optional(),
    vesselImo: zod_1.z.string().max(20).optional(),
    billOfLading: zod_1.z.string().max(100).optional(),
});
router.post('/shipments/:shipmentId/milestone', async (req, res) => {
    const parsed = milestoneSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    const { shipmentId } = req.params;
    const { milestone, notes, gpsLat, gpsLng, vesselName, vesselImo, billOfLading } = parsed.data;
    if (vesselImo !== undefined || billOfLading !== undefined) {
        const data = {};
        if (vesselImo !== undefined)
            data.vesselImo = vesselImo;
        if (billOfLading !== undefined)
            data.billOfLading = billOfLading;
        await prisma_1.default.shipment.update({ where: { id: shipmentId }, data });
    }
    const advanced = await (0, milestoneService_1.advanceMilestone)({ shipmentId, milestone, notes, gpsLat, gpsLng, vesselName });
    if (advanced === false) {
        const exists = await prisma_1.default.shipment.findUnique({ where: { id: shipmentId }, select: { id: true } });
        if (!exists) {
            res.status(404).json({ error: 'Shipment not found' });
            return;
        }
    }
    res.json({ success: true, advanced });
});
router.post('/shipments/:shipmentId/refresh-vessel', async (req, res) => {
    const shipment = await prisma_1.default.shipment.findUnique({
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
        const position = await (0, marineTraffic_1.fetchVesselPosition)(shipment.vesselImo);
        if (!position) {
            await prisma_1.default.shipment.update({ where: { id: shipment.id }, data: { marineTrafficError: true } });
            res.status(502).json({ error: 'No position data returned by MarineTraffic' });
            return;
        }
        await prisma_1.default.vesselPosition.create({
            data: {
                shipmentId: shipment.id,
                lat: position.lat,
                lng: position.lng,
                speed: position.speed,
                heading: position.heading,
                timestamp: position.timestamp,
            },
        });
        await prisma_1.default.shipment.update({ where: { id: shipment.id }, data: { marineTrafficError: false } });
        res.json({ position });
    }
    catch (err) {
        await prisma_1.default.shipment.update({ where: { id: shipment.id }, data: { marineTrafficError: true } });
        throw err;
    }
});
router.get('/shipments', async (_req, res) => {
    const shipments = await prisma_1.default.shipment.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            order: { include: { user: { select: { id: true, email: true, name: true } } } },
            trackingEvents: { orderBy: { timestamp: 'desc' }, take: 1 },
        },
    });
    res.json(shipments);
});
router.post('/orders/:orderId/shipment', async (req, res) => {
    const parsed = zod_1.z.object({
        billOfLading: zod_1.z.string().max(100).optional(),
        vesselImo: zod_1.z.string().max(20).optional(),
    }).safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    const order = await prisma_1.default.order.findUnique({ where: { id: req.params.orderId } });
    if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
    }
    const existing = await prisma_1.default.shipment.findUnique({ where: { orderId: order.id } });
    if (existing) {
        res.status(409).json({ error: 'A shipment already exists for this order', shipmentId: existing.id });
        return;
    }
    const shipment = await prisma_1.default.shipment.create({
        data: { orderId: order.id, ...parsed.data },
    });
    await prisma_1.default.trackingEvent.create({
        data: { shipmentId: shipment.id, milestone: client_1.Milestone.PURCHASED, timestamp: new Date(), notes: 'Shipment record created.' },
    });
    res.status(201).json(shipment);
});
// ─── Listings ─────────────────────────────────────────────────────────────────
const listingSchema = zod_1.z.object({
    make: zod_1.z.string().min(1).max(100),
    model: zod_1.z.string().min(1).max(200),
    year: zod_1.z.number().int().min(2000).max(new Date().getFullYear() + 2),
    mileage: zod_1.z.number().int().min(0).default(0),
    condition: zod_1.z.enum(['NEW', 'USED']).default('NEW'),
    fuelType: zod_1.z.nativeEnum(client_1.FuelType),
    transmission: zod_1.z.nativeEnum(client_1.Transmission),
    power: zod_1.z.number().int().min(1).optional(),
    engineSize: zod_1.z.number().positive().optional(),
    color: zod_1.z.string().max(100).optional(),
    bodyType: zod_1.z.string().max(100).optional(),
    photos: zod_1.z.array(zod_1.z.string()).min(1),
    basePrice: zod_1.z.number().positive(),
    shippingCost: zod_1.z.number().positive().default(1200),
    taxRate: zod_1.z.number().min(0).max(1).default(0.14),
    customsRate: zod_1.z.number().min(0).max(1).default(0.05),
    status: zod_1.z.nativeEnum(client_1.ListingStatus).default(client_1.ListingStatus.AVAILABLE),
    sourceUrl: zod_1.z.string().optional(),
    sourceSite: zod_1.z.string().max(100).optional(),
    features: zod_1.z.array(zod_1.z.string()).optional(),
    mjPrompt: zod_1.z.string().max(1000).optional(),
});
router.get('/listings', async (_req, res) => {
    const listings = await prisma_1.default.carListing.findMany({
        orderBy: { createdAt: 'desc' },
    });
    res.json(listings);
});
router.post('/listings', async (req, res) => {
    const parsed = listingSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    const listing = await prisma_1.default.carListing.create({ data: parsed.data });
    res.status(201).json(listing);
});
router.put('/listings/:id', async (req, res) => {
    const parsed = listingSchema.partial().safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    const existing = await prisma_1.default.carListing.findUnique({ where: { id: req.params.id } });
    if (!existing) {
        res.status(404).json({ error: 'Listing not found' });
        return;
    }
    const listing = await prisma_1.default.carListing.update({
        where: { id: req.params.id },
        data: parsed.data,
    });
    res.json(listing);
});
router.delete('/listings/:id', async (req, res) => {
    const existing = await prisma_1.default.carListing.findUnique({ where: { id: req.params.id } });
    if (!existing) {
        res.status(404).json({ error: 'Listing not found' });
        return;
    }
    await prisma_1.default.carListing.delete({ where: { id: req.params.id } });
    res.json({ success: true });
});
exports.default = router;
//# sourceMappingURL=admin.js.map