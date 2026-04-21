import { db } from '$lib/server/db';
import { order, orderItem, book } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe.js';

export async function load({ url, locals }) {
  if (!locals.user) throw error(401, 'Not authenticated');

  const sessionId = url.searchParams.get('session_id');
  if (!sessionId) throw error(400, 'Missing session ID');

  try {
    // Get Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      throw error(400, 'Payment not completed');
    }

    const orderId = Number(session.metadata?.orderId);
    if (!orderId) throw error(400, 'No order found');

    // Get the order
    const orderResult = await db
      .select()
      .from(order)
      .where(eq(order.id, orderId))
      .limit(1);

    if (!orderResult.length) {
      throw error(404, 'Order not found');
    }

    const orderData = orderResult[0];

    // Verify user owns this order
    if (orderData.userId !== locals.user.id) {
      throw error(403, 'Access denied');
    }

    // Get order items with book titles
    const items = await db
      .select()
      .from(orderItem)
      .where(eq(orderItem.orderId, orderId));

    const itemsWithTitles = [];
    for (const item of items) {
      const bookData = await db
        .select()
        .from(book)
        .where(eq(book.id, item.bookId))
        .limit(1);
      itemsWithTitles.push({
        ...item,
        title: bookData[0]?.title || 'Unknown Book'
      });
    }

    return {
      order: {
        ...orderData,
        items: itemsWithTitles
      }
    };
  } catch (err) {
    console.error('Error loading order:', err);
    throw error(500, 'Failed to load order');
  }
}