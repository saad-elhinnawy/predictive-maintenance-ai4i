import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/track/:id — public, no auth
router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      select: {
        id:           true,
        carModel:     true,
        status:       true,
        totalPrice:   true,
        customerName: true,
        createdAt:    true,
        shipment: {
          select: {
            billOfLading:     true,
            currentMilestone: true,
            trackingEvents: {
              orderBy: { timestamp: 'asc' },
              select: {
                milestone:  true,
                timestamp:  true,
                notes:      true,
                vesselName: true,
              },
            },
          },
        },
      },
    });

    if (!order) { res.status(404).json({ error: 'Order not found' }); return; }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

export default router;
