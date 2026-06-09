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

// import sgMail from '@sendgrid/mail';
// if (process.env.SENDGRID_API_KEY) sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ─── Constants ────────────────────────────────────────────────────────────────

const MILESTONE_ORDER = [
  'PURCHASED',
  'INLAND_TO_PORT',
  'LOADING',
  'OCEAN_TRANSIT',
  'PORT_ARRIVAL',
  'CUSTOMS',
  'INLAND_TO_CUSTOMER',
  'DELIVERED',
];

const MILESTONE_LABELS: Record<string, string> = {
  PURCHASED:          'Order Purchased',
  INLAND_TO_PORT:     'In Transit to Port',
  LOADING:            'Loading onto Vessel',
  OCEAN_TRANSIT:      'Ocean Transit',
  PORT_ARRIVAL:       'Arrived at Destination Port',
  CUSTOMS:            'Customs Clearance',
  INLAND_TO_CUSTOMER: 'In Transit to Delivery Address',
  DELIVERED:          'Delivered',
};

const MILESTONE_ICONS: Record<string, string> = {
  PURCHASED:          '🏭',
  INLAND_TO_PORT:     '🚛',
  LOADING:            '⚓',
  OCEAN_TRANSIT:      '🚢',
  PORT_ARRIVAL:       '🏖',
  CUSTOMS:            '🛃',
  INLAND_TO_CUSTOMER: '🚚',
  DELIVERED:          '✅',
};

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface MilestoneEmailOptions {
  email:         string;
  name:          string;
  carModel:      string;
  orderId:       string;
  milestone:     string;
  nextMilestone: string | null | undefined;
}

// ─── HTML template builder ─────────────────────────────────────────────────────

function buildMilestoneHtml(opts: MilestoneEmailOptions): string {
  const { name, carModel, orderId, milestone, nextMilestone } = opts;
  const trackingUrl = `${process.env.APP_URL ?? 'https://yourdomain.com'}/#/tracking/${orderId}`;

  const currentLabel = MILESTONE_LABELS[milestone] ?? milestone;
  const currentIcon  = MILESTONE_ICONS[milestone]  ?? '📍';
  const currentIdx   = MILESTONE_ORDER.indexOf(milestone);

  // Progress step rows
  const progressRows = MILESTONE_ORDER.map((m, i) => {
    const label   = MILESTONE_LABELS[m] ?? m;
    const done    = i < currentIdx;
    const current = i === currentIdx;
    const color   = current ? '#0A2540' : done ? '#48BB78' : '#A0AEC0';
    const weight  = current ? '700' : done ? '500' : '400';
    const dotIcon = done ? '&#10003;' : current ? '&#9670;' : '&#9675;';
    const nowBadge = current
      ? `<td align="right" style="padding:3px 0;">
           <span style="background:#00D4FF;color:#0A2540;font-size:9px;font-weight:700;
                        padding:2px 8px;border-radius:100px;letter-spacing:.5px;">NOW</span>
         </td>`
      : '<td></td>';

    return `<tr>
      <td width="26" style="padding:3px 0;text-align:center;font-size:13px;
                            color:${done ? '#48BB78' : color};vertical-align:top;">${dotIcon}</td>
      <td style="padding:3px 0 3px 4px;font-size:13px;color:${color};
                 font-weight:${weight};line-height:1.4;">${label}</td>
      ${nowBadge}
    </tr>`;
  }).join('\n');

  const nextNote = nextMilestone
    ? `<tr><td style="padding-top:14px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="background:#f0f9ff;border-left:3px solid #00D4FF;
                      border-radius:0 6px 6px 0;padding:10px 14px;">
          <tr><td style="font-size:13px;color:#2D3748;">
            <strong>Next step:</strong>&nbsp;${MILESTONE_LABELS[nextMilestone] ?? nextMilestone}
          </td></tr>
        </table>
       </td></tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>BMW Export &mdash; Shipment Update</title>
</head>
<body style="margin:0;padding:0;background:#f2f4f6;
             font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="background:#f2f4f6;padding:32px 16px;">
    <tr><td align="center">

      <table role="presentation" cellpadding="0" cellspacing="0"
             style="max-width:600px;width:100%;">

        <!-- ── Header ─────────────────────────────────────── -->
        <tr>
          <td style="background:#0A2540;border-radius:12px 12px 0 0;padding:24px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="color:#fff;font-size:18px;font-weight:700;letter-spacing:.5px;">
                    BMW Export Tracker
                  </div>
                  <div style="color:#8BA3BC;font-size:12px;margin-top:3px;">
                    Shipment Status Notification
                  </div>
                </td>
                <td align="right" style="font-size:28px;line-height:1;">&#128663;</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── Milestone banner ────────────────────────────── -->
        <tr>
          <td style="background:#00D4FF;padding:18px 32px;">
            <div style="font-size:10px;font-weight:700;color:#0A2540;
                        text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;">
              Milestone Reached
            </div>
            <div style="font-size:22px;font-weight:700;color:#0A2540;">
              ${currentIcon}&nbsp;${currentLabel}
            </div>
          </td>
        </tr>

        <!-- ── Body ───────────────────────────────────────── -->
        <tr>
          <td style="background:#fff;padding:32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

              <tr><td>
                <p style="margin:0 0 8px;font-size:16px;font-weight:600;color:#1A202C;">
                  Hi ${name},
                </p>
                <p style="margin:0 0 24px;font-size:14px;color:#4A5568;line-height:1.6;">
                  Your <strong>${carModel}</strong> has reached a new milestone
                  in its export journey.
                </p>
              </td></tr>

              <!-- Progress steps -->
              <tr><td style="padding-bottom:24px;">
                <div style="font-size:11px;font-weight:700;color:#718096;
                            text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">
                  Shipment Progress
                </div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                       style="background:#f8fafc;border-radius:8px;padding:14px 18px;">
                  ${progressRows}
                </table>
              </td></tr>

              ${nextNote}

              <!-- CTA -->
              <tr><td style="padding-top:${nextMilestone ? '16px' : '0'};">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr><td>
                    <a href="${trackingUrl}" target="_blank"
                       style="display:inline-block;background:#0A2540;color:#00D4FF;
                              font-size:14px;font-weight:600;padding:13px 26px;
                              border-radius:8px;text-decoration:none;letter-spacing:.3px;">
                      Track Your Shipment &rarr;
                    </a>
                  </td></tr>
                </table>
              </td></tr>

              <!-- Order ID -->
              <tr><td style="padding-top:24px;border-top:1px solid #EDF2F7;">
                <p style="margin:12px 0 0;font-size:12px;color:#A0AEC0;">
                  Order&nbsp;ID:
                  <code style="background:#f0f4f8;padding:2px 6px;border-radius:3px;
                               font-size:11px;color:#4A5568;">${orderId}</code>
                </p>
              </td></tr>

            </table>
          </td>
        </tr>

        <!-- ── Footer ─────────────────────────────────────── -->
        <tr>
          <td style="background:#0A2540;border-radius:0 0 12px 12px;padding:18px 32px;">
            <p style="margin:0;font-size:12px;color:#8BA3BC;text-align:center;">
              &copy; BMW Export Team &middot;
              <a href="${trackingUrl}" style="color:#00D4FF;text-decoration:none;">
                View Tracking
              </a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildMilestoneText(opts: MilestoneEmailOptions): string {
  const { name, carModel, orderId, milestone, nextMilestone } = opts;
  const trackingUrl = `${process.env.APP_URL ?? 'https://yourdomain.com'}/#/tracking/${orderId}`;
  const label = MILESTONE_LABELS[milestone] ?? milestone;
  const next  = nextMilestone ? `\nNext step: ${MILESTONE_LABELS[nextMilestone] ?? nextMilestone}\n` : '';

  return [
    `Hi ${name},`,
    '',
    `Your ${carModel} has reached a new milestone: ${label}.`,
    next,
    `Track your shipment: ${trackingUrl}`,
    '',
    `Order ID: ${orderId}`,
    '',
    'Best regards,',
    'BMW Export Team',
  ].join('\n');
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function sendMilestoneUpdate(opts: MilestoneEmailOptions): Promise<void> {
  const label = MILESTONE_LABELS[opts.milestone] ?? opts.milestone;
  const subject = `Your BMW ${opts.carModel} — ${label}`;

  if (process.env.NODE_ENV !== 'production' || !process.env.SENDGRID_API_KEY) {
    // Development: pretty-print to console
    console.log(
      [
        '',
        '╔══════════════════════════════════════════════════╗',
        '║  [EMAIL] milestone_update (dev — not sent)       ║',
        '╚══════════════════════════════════════════════════╝',
        `  To:      ${opts.email}`,
        `  Subject: ${subject}`,
        `  Body:`,
        ...buildMilestoneText(opts).split('\n').map((l) => `    ${l}`),
        '',
      ].join('\n'),
    );
    return;
  }

  // Production — SendGrid
  // await sgMail.send({
  //   to:      opts.email,
  //   from:    process.env.SENDGRID_FROM_EMAIL!,
  //   subject,
  //   text:    buildMilestoneText(opts),
  //   html:    buildMilestoneHtml(opts),
  // });
}

export async function sendOrderConfirmation(
  email:    string,
  name:     string,
  carModel: string,
  orderId:  string,
): Promise<void> {
  const orderUrl = `${process.env.APP_URL ?? 'https://yourdomain.com'}/#/tracking/${orderId}`;
  const subject  = `Order Confirmed — BMW ${carModel}`;

  if (process.env.NODE_ENV !== 'production' || !process.env.SENDGRID_API_KEY) {
    console.log(`[EMAIL] order_confirmation → ${email} | orderId=${orderId} | ${carModel}`);
    return;
  }

  // await sgMail.send({
  //   to:      email,
  //   from:    process.env.SENDGRID_FROM_EMAIL!,
  //   subject,
  //   text: [
  //     `Hi ${name},`,
  //     '',
  //     `Your order for a ${carModel} (ID: ${orderId}) has been confirmed.`,
  //     '',
  //     `Track your shipment: ${orderUrl}`,
  //   ].join('\n'),
  //   html: `<p>Hi ${name},</p>
  //          <p>Your <strong>${carModel}</strong> (ID: <code>${orderId}</code>) is confirmed.</p>
  //          <p><a href="${orderUrl}" style="color:#00D4FF;">Track your shipment &rarr;</a></p>`,
  // });
  void orderUrl; // silence unused warning when commented
}
