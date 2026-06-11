import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

const router = Router();

export function calcFinalPrice(
  basePrice: number,
  shippingCost: number,
  taxRate: number,
  customsRate: number,
): number {
  const duties = basePrice * (taxRate + customsRate);
  const profit = basePrice * 0.3;
  return Math.round(basePrice + shippingCost + duties + profit);
}

// GET /api/listings?make=BMW&bodyType=Sedan&fuelType=PETROL&minPrice=50000&maxPrice=200000&sort=newest&page=1&limit=20
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const make      = req.query.make      as string | undefined;
    const bodyType  = req.query.bodyType  as string | undefined;
    const fuelType  = req.query.fuelType  as string | undefined;
    const minPrice  = req.query.minPrice  ? parseFloat(req.query.minPrice  as string) : undefined;
    const maxPrice  = req.query.maxPrice  ? parseFloat(req.query.maxPrice  as string) : undefined;
    const sort      = (req.query.sort     as string) || 'newest';
    const page      = Math.max(1, parseInt(req.query.page  as string) || 1);
    const limit     = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip      = (page - 1) * limit;

    const where: Record<string, unknown> = { status: 'AVAILABLE' };
    if (make)     where.make     = make;
    if (bodyType) where.bodyType = bodyType;
    if (fuelType) where.fuelType = fuelType;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      };
    }

    const orderBy =
      sort === 'priceAsc'  ? { basePrice: 'asc'  as const } :
      sort === 'priceDesc' ? { basePrice: 'desc' as const } :
      { createdAt: 'desc' as const };

    const [listings, total] = await prisma.$transaction([
      prisma.carListing.findMany({
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
      prisma.carListing.count({ where }),
    ]);

    res.json({ listings, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// GET /api/listings/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const listing = await prisma.carListing.findUnique({
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

    if (!listing) { res.status(404).json({ error: 'Listing not found' }); return; }
    res.json(listing);
  } catch (err) {
    next(err);
  }
});

export default router;
