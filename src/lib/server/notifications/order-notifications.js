import { sendPaymentConfirmationEmail } from '../email/email-service.js';

export async function notifyOrderCreated({ order, user }) {
  await sendPaymentConfirmationEmail({
    to: user.email,
    orderId: order.id,
    total: order.total
  });
}
