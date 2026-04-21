import { db } from '$lib/server/db';
import { order, orderItem, book } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function load({ params, locals }) {
  if (!locals.user) throw error(401, 'Not authenticated');

  const orderId = Number(params.id);
  if (!Number.isInteger(orderId) || orderId < 1) {
    throw error(400, 'Invalid order ID');
  }

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
}