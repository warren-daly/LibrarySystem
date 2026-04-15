import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { order, orderItem, book } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { stripe } from '$lib/server/stripe.js';

export async function load({ url, params, locals }) {
  if (!locals.user) {
    throw error(401, 'Not authenticated');
  }

  const userId = Number(locals.user.id);
  if (!Number.isInteger(userId)) {
    throw error(401, 'Invalid user');
  }


  const orderId = Number(params.id);
  if (!Number.isInteger(orderId) || orderId < 1) {
    throw error(400, 'Invalid order ID');
  }

  const sessionId = url.searchParams.get('session_id');
  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      // Ensure payment is complete
      if (session.payment_status !== 'paid') {
        throw error(400, 'Payment not completed');
      }

      console.log(`✅ Payment verified for order #${orderId}`);
    } catch (err) {
      console.error(`❌ Stripe verification failed:`, err);
      throw error(400, 'Payment verification failed');
    }
  }

  const orderResult = await db
    .select()
    .from(order)
    .where(eq(order.id, orderId))
    .limit(1);

  if (!orderResult.length) {
    throw error(404, 'Order not found');
  }

  const orderData = orderResult[0];

  if (orderData.userId !== userId) {
    throw error(403, 'Access denied');
  }

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

  const total = itemsWithTitles.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0);

  return {
    order: {
      id: orderId,
      userId: orderData.userId,
      rentalDate: orderData.rentalDate,
      returnDate: orderData.returnDate,
      status: orderData.status,
      items: itemsWithTitles,
      total: orderData.total || total,
      paymentVerified: !!sessionId
    }
  };
}