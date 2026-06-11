"use strict";
/**
 * Vessel position poller — runs every 2 hours via node-cron.
 *
 * For each shipment in LOADING or OCEAN_TRANSIT with a vesselImo set:
 *   1. Fetch the current position from MarineTraffic.
 *   2. Store it in VesselPosition.
 *   3. If within ALEXANDRIA_RADIUS_DEG of Alexandria, advance to PORT_ARRIVAL.
 *   4. Mark marineTrafficError=true on any fetch failure.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startVesselPollerCron = startVesselPollerCron;
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../lib/prisma"));
const marineTraffic_1 = require("../services/marineTraffic");
const milestoneService_1 = require("../services/milestoneService");
const TRACKED_MILESTONES = [client_1.Milestone.LOADING, client_1.Milestone.OCEAN_TRANSIT];
async function pollVessels() {
    console.info('[vesselPoller] Starting vessel position poll…');
    const shipments = await prisma_1.default.shipment.findMany({
        where: {
            currentMilestone: { in: TRACKED_MILESTONES },
            vesselImo: { not: null },
        },
        select: { id: true, vesselImo: true, currentMilestone: true },
    });
    console.info(`[vesselPoller] Polling ${shipments.length} shipment(s)…`);
    await Promise.allSettled(shipments.map(async (shipment) => {
        const imo = shipment.vesselImo;
        try {
            const position = await (0, marineTraffic_1.fetchVesselPosition)(imo);
            if (!position) {
                console.warn(`[vesselPoller] No position data for IMO ${imo} (shipment ${shipment.id})`);
                return;
            }
            await prisma_1.default.vesselPosition.create({
                data: {
                    shipmentId: shipment.id,
                    lat: position.lat,
                    lng: position.lng,
                    speed: position.speed,
                    heading: position.heading,
                    timestamp: position.timestamp,
                },
            });
            // Clear any previous error flag now that we have a good reading
            await prisma_1.default.shipment.update({
                where: { id: shipment.id },
                data: { marineTrafficError: false },
            });
            if ((0, marineTraffic_1.isNearAlexandria)(position.lat, position.lng)) {
                const advanced = await (0, milestoneService_1.advanceMilestone)({
                    shipmentId: shipment.id,
                    milestone: client_1.Milestone.PORT_ARRIVAL,
                    notes: 'Vessel arrived near Alexandria port (auto-detected by poller)',
                    gpsLat: position.lat,
                    gpsLng: position.lng,
                    vesselName: position.vesselName ?? undefined,
                });
                if (advanced) {
                    console.info(`[vesselPoller] Auto-advanced shipment ${shipment.id} to PORT_ARRIVAL`);
                }
            }
        }
        catch (err) {
            console.error(`[vesselPoller] Failed to fetch position for IMO ${imo}:`, err);
            await prisma_1.default.shipment.update({
                where: { id: shipment.id },
                data: { marineTrafficError: true },
            });
        }
    }));
    console.info('[vesselPoller] Poll complete.');
}
function startVesselPollerCron() {
    // Run at minute 0 of every 2nd hour
    node_cron_1.default.schedule('0 */2 * * *', () => {
        pollVessels().catch((err) => console.error('[vesselPoller] Unhandled error in pollVessels:', err));
    });
    console.info('[vesselPoller] Cron scheduled — every 2 hours.');
}
//# sourceMappingURL=vesselPoller.js.map