import { db } from '$lib/server/db';
import { order, orderItem, book } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
  if (!locals.user) throw error(401, 'Not authenticated');

  const userId = locals.user.id;

  // Get all orders for this user
  const orders = await db
    .select({
      id: order.id,
      status: order.status,
      rentalDate: order.rentalDate,
      returnDate: order.returnDate,
      total: order.total,
      createdAt: order.createdAt
    })
    .from(order)
    .where(eq(order.userId, userId));

  // Get items for each order
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
    orderItemsMap[o.id] = items || [];
  }

  // Separate rentals and purchases
  const rentals = orders
    .filter(o => o.status === 'rented')
    .map(r => ({ ...r, items: orderItemsMap[r.id] || [] }));
  
  const purchases = orders
    .filter(o => o.status === 'completed')
    .map(p => ({ ...p, items: orderItemsMap[p.id] || [] }));

  return {
    user: locals.user,
    rentals,
    purchases
  };
}

export const actions = {
  returnBook: async ({ locals, request }) => {
    if (!locals.user) throw error(401, 'Not authenticated');

    const formData = await request.formData();
    const orderId = Number(formData.get('orderId'));
    const orderItemId = Number(formData.get('orderItemId'));

    if (!Number.isInteger(orderId) || orderId < 1) {
      throw error(400, 'Invalid order ID');
    }
    if (!Number.isInteger(orderItemId) || orderItemId < 1) {
      throw error(400, 'Invalid item ID');
    }

    // Verify order belongs to user and is rented
    const orderResult = await db
      .select()
      .from(order)
      .where(eq(order.id, orderId))
      .limit(1);

    if (!orderResult.length) {
      throw error(404, 'Order not found');
    }

    const orderData = orderResult[0];
    if (orderData.userId !== locals.user.id) {
      throw error(403, 'Unauthorized');
    }

    if (orderData.status !== 'rented') {
      throw error(400, 'This order is not a rental');
    }

    // Get the specific item
    const itemResult = await db
      .select()
      .from(orderItem)
      .where(eq(orderItem.id, orderItemId))
      .limit(1);

    if (!itemResult.length) {
      throw error(404, 'Item not found');
    }

    const item = itemResult[0];

    // Restock this book
    await db
      .update(book)
      .set({ stock: sql`${book.stock} + ${item.quantity}` })
      .where(eq(book.id, item.bookId));

    // Delete this order item
    await db.delete(orderItem).where(eq(orderItem.id, orderItemId));

    // Check if order has any items left
    const remainingItems = await db
      .select()
      .from(orderItem)
      .where(eq(orderItem.orderId, orderId));

    // If no items left, mark order as fully returned
    if (remainingItems.length === 0) {
      await db
        .update(order)
        .set({ status: 'returned' })
        .where(eq(order.id, orderId));
    }

    throw redirect(303, '/member');
  }
};