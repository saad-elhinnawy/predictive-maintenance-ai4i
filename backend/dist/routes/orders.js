"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../lib/prisma"));
const email_1 = require("../services/email");
const listings_1 = require("./listings");
const router = (0, express_1.Router)();
const createOrderSchema = zod_1.z.object({
    listingId: zod_1.z.string(),
    customerName: zod_1.z.string().min(2),
    customerEmail: zod_1.z.string().email(),
    customerPhone: zod_1.z.string().min(7),
});
// POST /api/orders — public, no auth required
router.post('/', async (req, res) => {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    const { listingId, customerName, customerEmail, customerPhone } = parsed.data;
    const listing = await prisma_1.default.carListing.findUnique({ where: { id: listingId } });
    if (!listing) {
        res.status(404).json({ error: 'Listing not found' });
        return;
    }
    if (listing.status !== 'AVAILABLE') {
        res.status(409).json({ error: 'This vehicle is no longer available' });
        return;
    }
    const totalPrice = (0, listings_1.calcFinalPrice)(listing.basePrice, listing.shippingCost, listing.taxRate, listing.customsRate);
    const order = await prisma_1.default.order.create({
        data: {
            customerName,
            customerEmail,
            customerPhone,
            listingId: listing.id,
            carModel: `${listing.year} ${listing.make} ${listing.model}`,
            configuration: {
                color: listing.color ?? 'Not specified',
                fuel: listing.fuelType,
                transmission: listing.transmission,
                bodyType: listing.bodyType ?? 'Sedan',
                mileage: listing.mileage,
            },
            totalPrice,
        },
    });
    (0, email_1.sendOrderConfirmation)(customerEmail, customerName, order.carModel, order.id).catch(console.error);
    res.status(201).json({ orderId: order.id });
});
exports.default = router;
//# sourceMappingURL=orders.js.map