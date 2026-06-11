"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcFinalPrice = calcFinalPrice;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
function calcFinalPrice(basePrice, shippingCost, taxRate, customsRate) {
    const duties = basePrice * (taxRate + customsRate);
    const profit = basePrice * 0.3;
    return Math.round(basePrice + shippingCost + duties + profit);
}
// GET /api/listings?make=BMW&bodyType=Sedan&fuelType=PETROL&minPrice=50000&maxPrice=200000&sort=newest&page=1&limit=20
router.get('/', async (req, res) => {
    const make = req.query.make;
    const bodyType = req.query.bodyType;
    const fuelType = req.query.fuelType;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined;
    const sort = req.query.sort || 'newest';
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const where = { status: 'AVAILABLE' };
    if (make)
        where.make = make;
    if (bodyType)
        where.bodyType = bodyType;
    if (fuelType)
        where.fuelType = fuelType;
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.basePrice = {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
        };
    }
    const orderBy = sort === 'priceAsc' ? { basePrice: 'asc' } :
        sort === 'priceDesc' ? { basePrice: 'desc' } :
            { createdAt: 'desc' };
    const [listings, total] = await prisma_1.default.$transaction([
        prisma_1.default.carListing.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            select: {
                id: true, make: true, model: true, year: true,
                mileage: true, condition: true, fuelType: true,
                transmission: true, power: true, color: true,
                bodyType: true, photos: true, basePrice: true,
                shippingCost: true, taxRate: true, customsRate: true,
                status: true,
            },
        }),
        prisma_1.default.carListing.count({ where }),
    ]);
    res.json({ listings, total, page, limit, totalPages: Math.ceil(total / limit) });
});
// GET /api/listings/:id
router.get('/:id', async (req, res) => {
    const listing = await prisma_1.default.carListing.findUnique({
        where: { id: req.params.id },
        select: {
            id: true, make: true, model: true, year: true,
            mileage: true, condition: true, fuelType: true,
            transmission: true, power: true, engineSize: true,
            color: true, bodyType: true, photos: true,
            basePrice: true, shippingCost: true, taxRate: true,
            customsRate: true, status: true, features: true,
            createdAt: true,
        },
    });
    if (!listing) {
        res.status(404).json({ error: 'Listing not found' });
        return;
    }
    res.json(listing);
});
exports.default = router;
//# sourceMappingURL=listings.js.map