/**
 * Email service — SendGrid with HTML brand templates.
 *
 * Dev mode (no SENDGRID_API_KEY): logs the email body to stdout.
 * Prod mode: sends via SendGrid.
 *
 * To enable SendGrid:
 *   npm install @sendgrid/mail
 *   set SENDGRID_API_KEY and SENDGRID_FROM_EMAIL in .env
 */
export interface MilestoneEmailOptions {
    email: string;
    name: string;
    carModel: string;
    orderId: string;
    milestone: string;
    nextMilestone: string | null | undefined;
}
export declare function sendMilestoneUpdate(opts: MilestoneEmailOptions): Promise<void>;
export declare function sendOrderConfirmation(email: string, name: string, carModel: string, orderId: string): Promise<void>;
//# sourceMappingURL=email.d.ts.map