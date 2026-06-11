"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
// GET /api/track/:id — public, no auth
router.get('/:id', async (req, res) => {
    const order = await prisma_1.default.order.findUnique({
        where: { id: req.params.id },
        select: {
            id: true,
            carModel: true,
            status: true,
            totalPrice: true,
            customerName: true,
            createdAt: true,
            shipment: {
                select: {
                    billOfLading: true,
                    currentMilestone: true,
                    trackingEvents: {
                        orderBy: { timestamp: 'asc' },
                        select: {
                            milestone: true,
                            timestamp: true,
                            notes: true,
                            vesselName: true,
                        },
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
exports.default = router;
//# sourceMappingURL=track.js.map