"use strict";
/**
 * Shared milestone-advancement logic used by both the vessel poller cron
 * and the MarineTraffic webhook handler.
 *
 * Centralising this keeps admin.ts, the cron, and the webhook in sync:
 * all three update the DB, write a TrackingEvent, sync order status,
 * and fire the email in exactly the same way.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.advanceMilestone = advanceMilestone;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../lib/prisma"));
const email_1 = require("./email");
const MILESTONE_ORDER = [
    client_1.Milestone.PURCHASED,
    client_1.Milestone.INLAND_TO_PORT,
    client_1.Milestone.LOADING,
    client_1.Milestone.OCEAN_TRANSIT,
    client_1.Milestone.PORT_ARRIVAL,
    client_1.Milestone.CUSTOMS,
    client_1.Milestone.INLAND_TO_CUSTOMER,
    client_1.Milestone.DELIVERED,
];
const ORDER_STATUS_MAP = {
    [client_1.Milestone.PURCHASED]: 'PAID',
    [client_1.Milestone.INLAND_TO_PORT]: 'SHIPPING',
    [client_1.Milestone.DELIVERED]: 'DELIVERED',
};
/**
 * Atomically advance a shipment's milestone, write a TrackingEvent,
 * sync the parent Order status, and send the customer email.
 *
 * Safe to call with a milestone that's already current or past —
 * the function will skip the update and return false.
 */
async function advanceMilestone(input) {
    const { shipmentId, milestone, notes, gpsLat, gpsLng, vesselName } = input;
    const shipment = await prisma_1.default.shipment.findUnique({
        where: { id: shipmentId },
        include: { order: { include: { user: true } } },
    });
    if (!shipment) {
        console.error(`[milestoneService] Shipment ${shipmentId} not found`);
        return false;
    }
    const currentIdx = MILESTONE_ORDER.indexOf(shipment.currentMilestone);
    const newIdx = MILESTONE_ORDER.indexOf(milestone);
    if (newIdx <= currentIdx) {
        console.info(`[milestoneService] Skipping ${milestone} for shipment ${shipmentId} — ` +
            `already at ${shipment.currentMilestone}`);
        return false;
    }
    const nextMilestone = MILESTONE_ORDER[newIdx + 1] ?? null;
    // Atomic: update milestone + create tracking event
    await prisma_1.default.$transaction([
        prisma_1.default.shipment.update({
            where: { id: shipmentId },
            data: { currentMilestone: milestone, marineTrafficError: false },
        }),
        prisma_1.default.trackingEvent.create({
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
    // Sync order status for key milestones
    const newOrderStatus = ORDER_STATUS_MAP[milestone];
    if (newOrderStatus) {
        await prisma_1.default.order.update({
            where: { id: shipment.orderId },
            data: { status: newOrderStatus },
        });
    }
    // Fire-and-forget email
    if (shipment.order.user) {
        (0, email_1.sendMilestoneUpdate)({
            email: shipment.order.user.email,
            name: shipment.order.user.name,
            carModel: shipment.order.carModel,
            orderId: shipment.orderId,
            milestone,
            nextMilestone,
        }).catch((err) => console.error('[milestoneService] Email error:', err));
    }
    else if (shipment.order.customerEmail) {
        (0, email_1.sendMilestoneUpdate)({
            email: shipment.order.customerEmail,
            name: shipment.order.customerName ?? 'Customer',
            carModel: shipment.order.carModel,
            orderId: shipment.orderId,
            milestone,
            nextMilestone,
        }).catch((err) => console.error('[milestoneService] Email error:', err));
    }
    console.info(`[milestoneService] ${shipment.order.carModel} (${shipmentId}) ` +
        `advanced to ${milestone}`);
    return true;
}
//# sourceMappingURL=milestoneService.js.map