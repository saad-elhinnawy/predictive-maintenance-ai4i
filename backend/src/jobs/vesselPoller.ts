/**
 * Vessel position poller — runs every 2 hours via node-cron.
 *
 * For each shipment in LOADING or OCEAN_TRANSIT with a vesselImo set:
 *   1. Fetch the current position from MarineTraffic.
 *   2. Store it in VesselPosition.
 *   3. If within ALEXANDRIA_RADIUS_DEG of Alexandria, advance to PORT_ARRIVAL.
 *   4. Mark marineTrafficError=true on any fetch failure.
 */

import cron from 'node-cron';
import { Milestone } from '@prisma/client';
import prisma from '../lib/prisma';
import { fetchVesselPosition, isNearAlexandria } from '../services/marineTraffic';
import { advanceMilestone } from '../services/milestoneService';

const TRACKED_MILESTONES: Milestone[] = [Milestone.LOADING, Milestone.OCEAN_TRANSIT];

async function pollVessels(): Promise<void> {
  console.info('[vesselPoller] Starting vessel position poll…');

  const shipments = await prisma.shipment.findMany({
    where: {
      currentMilestone: { in: TRACKED_MILESTONES },
      vesselImo: { not: null },
    },
    select: { id: true, vesselImo: true, currentMilestone: true },
  });

  console.info(`[vesselPoller] Polling ${shipments.length} shipment(s)…`);

  await Promise.allSettled(
    shipments.map(async (shipment) => {
      const imo = shipment.vesselImo!;

      try {
        const position = await fetchVesselPosition(imo);

        if (!position) {
          console.warn(`[vesselPoller] No position data for IMO ${imo} (shipment ${shipment.id})`);
          return;
        }

        await prisma.vesselPosition.create({
          data: {
            shipmentId: shipment.id,
            lat:        position.lat,
            lng:        position.lng,
            speed:      position.speed,
            heading:    position.heading,
            timestamp:  position.timestamp,
          },
        });

        // Clear any previous error flag now that we have a good reading
        await prisma.shipment.update({
          where: { id: shipment.id },
          data:  { marineTrafficError: false },
        });

        if (isNearAlexandria(position.lat, position.lng)) {
          const advanced = await advanceMilestone({
            shipmentId: shipment.id,
            milestone:  Milestone.PORT_ARRIVAL,
            notes:      'Vessel arrived near Alexandria port (auto-detected by poller)',
            gpsLat:     position.lat,
            gpsLng:     position.lng,
            vesselName: position.vesselName ?? undefined,
          });

          if (advanced) {
            console.info(`[vesselPoller] Auto-advanced shipment ${shipment.id} to PORT_ARRIVAL`);
          }
        }
      } catch (err) {
        console.error(`[vesselPoller] Failed to fetch position for IMO ${imo}:`, err);
        await prisma.shipment.update({
          where: { id: shipment.id },
          data:  { marineTrafficError: true },
        });
      }
    }),
  );

  console.info('[vesselPoller] Poll complete.');
}

export function startVesselPollerCron(): void {
  // Run at minute 0 of every 2nd hour
  cron.schedule('0 */2 * * *', () => {
    pollVessels().catch((err) =>
      console.error('[vesselPoller] Unhandled error in pollVessels:', err),
    );
  });

  console.info('[vesselPoller] Cron scheduled — every 2 hours.');
}
