import { stripe } from '$lib/server/stripe.js';
import { json } from '@sveltejs/kit';
import { ordersService } from '$lib/server/services/orders-service.js';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';

/**
 * Stripe Webhook Endpoint
 * Receives events from Stripe (e.g. checkout.session.completed)
 * Verifies signature and updates order status after payment
 */
export const POST = async ({ request }) => {
  const sig = request.headers.get('stripe-signature');

  const rawBody = await request.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log(`✅ Webhook received: ${event.type}`);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = Number(session.metadata?.orderId);
    const paymentIntentId = session.payment_intent;

    if (!orderId) {
      console.warn('⚠️  checkout.session.completed without orderId metadata');
      return json({ received: true });
    }

    try {
      await ordersService.updateOrder(orderId, {
        status: 'paid',
        paymentIntentId
      });

      console.log(`✅ Order #${orderId} marked as paid`);
    } catch (err) {
      console.error(`❌ Failed to update order #${orderId}:`, err);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  return json({ received: true });
};