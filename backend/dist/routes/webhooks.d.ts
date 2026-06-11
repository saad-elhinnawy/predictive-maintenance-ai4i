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
declare const router: import("express-serve-static-core").Router;
export default router;
//# sourceMappingURL=webhooks.d.ts.map