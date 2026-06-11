/**
 * Shared milestone-advancement logic used by both the vessel poller cron
 * and the MarineTraffic webhook handler.
 *
 * Centralising this keeps admin.ts, the cron, and the webhook in sync:
 * all three update the DB, write a TrackingEvent, sync order status,
 * and fire the email in exactly the same way.
 */
import { Milestone } from '@prisma/client';
export interface AdvanceMilestoneInput {
    shipmentId: string;
    milestone: Milestone;
    notes?: string;
    gpsLat?: number;
    gpsLng?: number;
    vesselName?: string;
}
/**
 * Atomically advance a shipment's milestone, write a TrackingEvent,
 * sync the parent Order status, and send the customer email.
 *
 * Safe to call with a milestone that's already current or past —
 * the function will skip the update and return false.
 */
export declare function advanceMilestone(input: AdvanceMilestoneInput): Promise<boolean>;
//# sourceMappingURL=milestoneService.d.ts.map