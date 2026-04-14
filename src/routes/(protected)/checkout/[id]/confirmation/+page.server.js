import { db } from '$lib/server/db';
import { order, orderItem, book } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function load({ params, locals }) {
  if (!locals.user) throw error(401, 'Not authenticated');

  const orderId = Number(params.id);
  if (!Number.isInteger(orderId) || orderId < 1) {
    throw error(400, 'Invalid order ID');
  }

  // Get the order from the new order table
  const orderResult = await db.select().from(order).where(eq(order.id, orderId)).limit(1);

  if (!orderResult.length) {
    throw error(404, 'Order not found');
  }

  const orderData = orderResult[0];
  if (orderData.userId !== locals.user.id) {
    throw error(403, 'Unauthorized');
  }

  // Get order items
  const items = await db.select().from(orderItem).where(eq(orderItem.orderId, orderId));

  // Get book titles
  const itemsWithTitles = [];
  for (const item of items) {
    const bookData = await db.select().from(book).where(eq(book.id, item.bookId)).limit(1);
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
      total: orderData.total || total
    }
  };
}