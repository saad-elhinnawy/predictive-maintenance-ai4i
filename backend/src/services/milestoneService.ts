/**
 * Shared milestone-advancement logic used by both the vessel poller cron
 * and the MarineTraffic webhook handler.
 *
 * Centralising this keeps admin.ts, the cron, and the webhook in sync:
 * all three update the DB, write a TrackingEvent, sync order status,
 * and fire the email in exactly the same way.
 */

import { Milestone } from '@prisma/client';
import prisma from '../lib/prisma';
import { sendMilestoneUpdate } from './email';

const MILESTONE_ORDER: Milestone[] = [
  Milestone.PURCHASED,
  Milestone.INLAND_TO_PORT,
  Milestone.LOADING,
  Milestone.OCEAN_TRANSIT,
  Milestone.PORT_ARRIVAL,
  Milestone.CUSTOMS,
  Milestone.INLAND_TO_CUSTOMER,
  Milestone.DELIVERED,
];

const ORDER_STATUS_MAP: Partial<Record<Milestone, string>> = {
  [Milestone.PURCHASED]:      'PAID',
  [Milestone.INLAND_TO_PORT]: 'SHIPPING',
  [Milestone.DELIVERED]:      'DELIVERED',
};

export interface AdvanceMilestoneInput {
  shipmentId:  string;
  milestone:   Milestone;
  notes?:      string;
  gpsLat?:     number;
  gpsLng?:     number;
  vesselName?: string;
}

/**
 * Atomically advance a shipment's milestone, write a TrackingEvent,
 * sync the parent Order status, and send the customer email.
 *
 * Safe to call with a milestone that's already current or past —
 * the function will skip the update and return false.
 */
export async function advanceMilestone(input: AdvanceMilestoneInput): Promise<boolean> {
  const { shipmentId, milestone, notes, gpsLat, gpsLng, vesselName } = input;

  const shipment = await prisma.shipment.findUnique({
    where:   { id: shipmentId },
    include: { order: { include: { user: true } } },
  });

  if (!shipment) {
    console.error(`[milestoneService] Shipment ${shipmentId} not found`);
    return false;
  }

  const currentIdx = MILESTONE_ORDER.indexOf(shipment.currentMilestone);
  const newIdx     = MILESTONE_ORDER.indexOf(milestone);

  if (newIdx <= currentIdx) {
    console.info(
      `[milestoneService] Skipping ${milestone} for shipment ${shipmentId} — ` +
      `already at ${shipment.currentMilestone}`,
    );
    return false;
  }

  const nextMilestone = MILESTONE_ORDER[newIdx + 1] ?? null;

  // Atomic: update milestone + create tracking event
  await prisma.$transaction([
    prisma.shipment.update({
      where: { id: shipmentId },
      data:  { currentMilestone: milestone, marineTrafficError: false },
    }),
    prisma.trackingEvent.create({
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
    await prisma.order.update({
      where: { id: shipment.orderId },
      data:  { status: newOrderStatus as any },
    });
  }

  // Fire-and-forget email
  sendMilestoneUpdate({
    email:         shipment.order.user.email,
    name:          shipment.order.user.name,
    carModel:      shipment.order.carModel,
    orderId:       shipment.orderId,
    milestone,
    nextMilestone,
  }).catch((err) => console.error('[milestoneService] Email error:', err));

  console.info(
    `[milestoneService] ${shipment.order.carModel} (${shipmentId}) ` +
    `advanced to ${milestone}`,
  );

  return true;
}
