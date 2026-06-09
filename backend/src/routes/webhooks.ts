/**
 * Webhook routes for external integrations.
 *
 * POST /api/webhooks/marinetraffic/arrival
 *   Receives an arrival notification from MarineTraffic, validates the
 *   HMAC-SHA256 signature, stores the vessel position, and advances the
 *   shipment to PORT_ARRIVAL via the shared milestoneService.
 *
 * Env vars:
 *   MARINETRAFFIC_WEBHOOK_SECRET — shared secret used to sign payloads
 */

import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { Milestone } from '@prisma/client';
import prisma from '../lib/prisma';
import { advanceMilestone } from '../services/milestoneService';

const router = Router();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function verifySignature(req: Request): boolean {
  const secret = process.env.MARINETRAFFIC_WEBHOOK_SECRET;
  if (!secret) {
    // No secret configured → skip verification (dev mode)
    console.warn('[webhooks] MARINETRAFFIC_WEBHOOK_SECRET not set — skipping signature check');
    return true;
  }

  const signature = req.headers['x-marinetraffic-signature'] as string | undefined;
  if (!signature) return false;

  const body = JSON.stringify(req.body);
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expected,  'hex'),
  );
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * POST /api/webhooks/marinetraffic/arrival
 *
 * Expected body:
 * {
 *   imo:       string,   // vessel IMO number
 *   lat:       number,
 *   lng:       number,
 *   speed?:    number,
 *   heading?:  number,
 *   vesselName?: string,
 *   timestamp?: string,  // ISO-8601; defaults to now
 * }
 */
router.post('/marinetraffic/arrival', async (req: Request, res: Response): Promise<void> => {
  if (!verifySignature(req)) {
    res.status(401).json({ error: 'Invalid signature' });
    return;
  }

  const { imo, lat, lng, speed, heading, vesselName, timestamp } = req.body;

  if (!imo || typeof lat !== 'number' || typeof lng !== 'number') {
    res.status(400).json({ error: 'imo, lat, and lng are required' });
    return;
  }

  // Find the shipment by vessel IMO
  const shipment = await prisma.shipment.findFirst({
    where: { vesselImo: String(imo) },
    select: { id: true },
  });

  if (!shipment) {
    // Return 200 so MT doesn't keep retrying for unknown vessels
    res.json({ received: true, action: 'no_shipment_found' });
    return;
  }

  const eventTime = timestamp ? new Date(timestamp) : new Date();

  // Store the position
  await prisma.vesselPosition.create({
    data: {
      shipmentId: shipment.id,
      lat,
      lng,
      speed:     speed   ?? null,
      heading:   heading ?? null,
      timestamp: eventTime,
    },
  });

  // Advance milestone
  const advanced = await advanceMilestone({
    shipmentId: shipment.id,
    milestone:  Milestone.PORT_ARRIVAL,
    notes:      'Vessel arrival confirmed via MarineTraffic webhook',
    gpsLat:     lat,
    gpsLng:     lng,
    vesselName: vesselName ? String(vesselName) : undefined,
  });

  res.json({ received: true, advanced });
});

export default router;
