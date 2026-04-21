import { stripe } from '$lib/server/stripe.js';
import { json } from '@sveltejs/kit';
import { ordersService } from '$lib/server/services/orders-service.js';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';

import { db } from '$lib/server/db';
import { order } from '$lib/server/db/schema.js';
import { cartService } from '$lib/server/services/cart-service.js';
import { eq } from 'drizzle-orm';

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

  if (!orderId) {
    console.warn('⚠️ No orderId in metadata');
    return json({ received: true });
  }

  try {
    // Mark order as paid
    await db
      .update(order)
      .set({ status: 'paid' })
      .where(eq(order.id, orderId));

    // Clear the user's cart
    const orderData = await db
      .select()
      .from(order)
      .where(eq(order.id, orderId))
      .limit(1);
    
    if (orderData.length > 0) {
      const cart = await cartService.getOrCreateCart(orderData[0].userId);
      await cartService.clearCart(cart.id);
    }

    console.log(`✅ Order #${orderId} paid and cart cleared`);
  } catch (err) {
    console.error(`❌ Failed to process order #${orderId}:`, err);
    return new Response('Internal Server Error', { status: 500 });
  }
}

return json({ received: true });

  return json({ received: true });
};