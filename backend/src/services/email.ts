// Email service — SendGrid integration ready to enable.
// Install: npm install @sendgrid/mail
// Then uncomment the sgMail lines and set SENDGRID_API_KEY + SENDGRID_FROM_EMAIL in .env

// import sgMail from '@sendgrid/mail';
// sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const MILESTONE_LABELS: Record<string, string> = {
  PURCHASED: 'Order Purchased',
  INLAND_TO_PORT: 'In Transit to Port',
  LOADING: 'Loading onto Vessel',
  OCEAN_TRANSIT: 'Ocean Transit',
  PORT_ARRIVAL: 'Arrived at Destination Port',
  CUSTOMS: 'Customs Clearance',
  INLAND_TO_CUSTOMER: 'In Transit to Delivery Address',
  DELIVERED: 'Delivered',
};

export async function sendMilestoneUpdate(
  email: string,
  name: string,
  carModel: string,
  milestone: string,
): Promise<void> {
  const label = MILESTONE_LABELS[milestone] ?? milestone;
  const trackUrl = `${process.env.APP_URL}/orders`;

  console.log(`[EMAIL] milestone_update → ${email} | ${carModel} | ${label}`);

  // await sgMail.send({
  //   to: email,
  //   from: process.env.SENDGRID_FROM_EMAIL!,
  //   subject: `Your BMW ${carModel} — ${label}`,
  //   text: [
  //     `Hi ${name},`,
  //     '',
  //     `Your ${carModel} has reached a new milestone: ${label}.`,
  //     '',
  //     `Track your shipment at ${trackUrl}`,
  //     '',
  //     'Best regards,',
  //     'BMW Export Team',
  //   ].join('\n'),
  //   html: `
  //     <p>Hi ${name},</p>
  //     <p>Your <strong>${carModel}</strong> has reached a new milestone:</p>
  //     <h2>${label}</h2>
  //     <p><a href="${trackUrl}">Track your shipment</a></p>
  //     <p>Best regards,<br>BMW Export Team</p>
  //   `,
  // });
}

export async function sendOrderConfirmation(
  email: string,
  name: string,
  carModel: string,
  orderId: string,
): Promise<void> {
  const orderUrl = `${process.env.APP_URL}/orders/${orderId}`;

  console.log(`[EMAIL] order_confirmation → ${email} | orderId=${orderId} | ${carModel}`);

  // await sgMail.send({
  //   to: email,
  //   from: process.env.SENDGRID_FROM_EMAIL!,
  //   subject: `Order Confirmed — BMW ${carModel}`,
  //   text: [
  //     `Hi ${name},`,
  //     '',
  //     `Your order for a ${carModel} (ID: ${orderId}) has been confirmed.`,
  //     '',
  //     `Track your order at ${orderUrl}`,
  //     '',
  //     'Best regards,',
  //     'BMW Export Team',
  //   ].join('\n'),
  //   html: `
  //     <p>Hi ${name},</p>
  //     <p>Your order for a <strong>${carModel}</strong> (ID: <code>${orderId}</code>) has been confirmed.</p>
  //     <p><a href="${orderUrl}">Track your order</a></p>
  //     <p>Best regards,<br>BMW Export Team</p>
  //   `,
  // });
}
