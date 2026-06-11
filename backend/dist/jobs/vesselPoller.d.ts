/**
 * Vessel position poller — runs every 2 hours via node-cron.
 *
 * For each shipment in LOADING or OCEAN_TRANSIT with a vesselImo set:
 *   1. Fetch the current position from MarineTraffic.
 *   2. Store it in VesselPosition.
 *   3. If within ALEXANDRIA_RADIUS_DEG of Alexandria, advance to PORT_ARRIVAL.
 *   4. Mark marineTrafficError=true on any fetch failure.
 */
export declare function startVesselPollerCron(): void;
//# sourceMappingURL=vesselPoller.d.ts.map