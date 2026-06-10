import { Router, Request, Response } from 'express';
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

// GET /api/listings?make=BMW&page=1&limit=20
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const make  = req.query.make as string | undefined;
  const page  = Math.max(1, parseInt(req.query.page  as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip  = (page - 1) * limit;

  const where: Record<string, unknown> = { status: 'AVAILABLE' };
  if (make) where.make = make;

  const [listings, total] = await prisma.$transaction([
    prisma.carListing.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, make: true, model: true, year: true,
        mileage: true, condition: true, fuelType: true,
        transmission: true, power: true, color: true,
        bodyType: true, photos: true, basePrice: true,
        shippingCost: true, taxRate: true, customsRate: true,
        status: true, sourceSite: true,
      },
    }),
    prisma.carListing.count({ where }),
  ]);

  res.json({ listings, total, page, limit, totalPages: Math.ceil(total / limit) });
});

// GET /api/listings/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const listing = await prisma.carListing.findUnique({
    where: { id: req.params.id },
    select: {
      id: true, make: true, model: true, year: true,
      mileage: true, condition: true, fuelType: true,
      transmission: true, power: true, engineSize: true,
      color: true, bodyType: true, photos: true,
      basePrice: true, shippingCost: true, taxRate: true,
      customsRate: true, status: true, sourceSite: true,
      sourceUrl: true, features: true, mjPrompt: true,
      createdAt: true,
    },
  });

  if (!listing) {
    res.status(404).json({ error: 'Listing not found' });
    return;
  }

  res.json(listing);
});

export default router;
