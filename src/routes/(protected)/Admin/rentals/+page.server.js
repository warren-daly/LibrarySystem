import { db } from '$lib/server/db';
import { order, orderItem, book, user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function load({ locals }) {
  if (!locals.user || locals.user.role !== 'ADMIN') {
    throw error(403, 'Unauthorized');
  }

  // Get all orders with user info
  const orders = await db
    .select({
      id: order.id,
      userId: order.userId,
      userName: user.name,
      status: order.status,
      rentalDate: order.rentalDate,
      returnDate: order.returnDate,
      total: order.total
    })
    .from(order)
    .innerJoin(user, eq(order.userId, user.id));

  // Get order items with book titles
  const orderItemsMap = {};
  for (const o of orders) {
    const items = await db
      .select({
        id: orderItem.id,
        bookId: orderItem.bookId,
        title: book.title,
        quantity: orderItem.quantity,
        unitPrice: orderItem.unitPrice,
        type: orderItem.type
      })
      .from(orderItem)
      .innerJoin(book, eq(orderItem.bookId, book.id))
      .where(eq(orderItem.orderId, o.id));
    orderItemsMap[o.id] = items;
  }

  // Separate rentals and purchases
  const rentals = orders.filter(o => o.status === 'rented').map(r => ({ ...r, items: orderItemsMap[r.id] }));
  const purchases = orders.filter(o => o.status === 'completed').map(p => ({ ...p, items: orderItemsMap[p.id] }));

  return { rentals, purchases };
}