import { db } from '../db/index.js';
import { order, orderItem, book } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';

export const ordersDataAccess = {

  async findByIdWithDetails(id) {
    const orderResult = await db
      .select()
      .from(order)
      .where(eq(order.id, id))
      .limit(1);
      
    if (!orderResult.length) return null;

    const items = await db.select().from(orderItem).where(eq(orderItem.orderId, id));

    // Get book titles
    const itemsWithTitles = [];
    for (const item of items) {
      const bookData = await db.select().from(book).where(eq(book.id, item.bookId)).limit(1);
      itemsWithTitles.push({
        ...item,
        title: bookData[0]?.title || 'Unknown Book'
      });
    }

    return { ...orderResult[0], items: itemsWithTitles };
  },

  async createOrder(orderData, items) {
    try {
      console.log('ordersDataAccess.createOrder called with:', { orderData, itemsCount: items.length });
      
      const result = await db.transaction(async (tx) => {
        // Check stock for all items
        for (const item of items) {
          const result = await tx
            .select()
            .from(book)
            .where(eq(book.id, item.bookId))
            .limit(1);

          const dbBook = result[0];
          if (!dbBook || dbBook.stock < item.quantity) {
            throw new Error(`Not enough stock for ${item.title}`);
          }
        }

        // Reduce stock for all items
        for (const item of items) {
          await tx
            .update(book)
            .set({ stock: sql`${book.stock} - ${item.quantity}` })
            .where(eq(book.id, item.bookId));
        }

        // Create order
        console.log('Inserting order with data:', orderData);
        const orderResult = await tx
          .insert(order)
          .values(orderData)
          .returning();

        console.log('Order insert result:', orderResult);
        const newOrder = orderResult[0];

        if (!newOrder) {
          throw new Error('Order insertion returned no result');
        }

        // Create order items
        console.log('Creating order items for orderId:', newOrder.id);
        await tx.insert(orderItem).values(
          items.map(i => ({
            orderId: newOrder.id,
            bookId: i.bookId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            type: i.type
          }))
        );

        console.log('Order created successfully with id:', newOrder.id);
        return newOrder;
      });

      console.log('Transaction result:', result);
      return result;
    } catch (err) {
      console.error('createOrder error:', err);
      throw err;
    }
  }
};