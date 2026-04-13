import { db } from '../db/index.js';
import { rental, rentalDetail, book } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';

export const ordersDataAccess = {

  async findByIdWithDetails(id) {
    const rentalResult = await db.select().from(rental).where(eq(rental.id, id)).limit(1);
    if (!rentalResult.length) return null;

    const items = await db.select().from(rentalDetail).where(eq(rentalDetail.rentalId, id));

    return { ...rentalResult[0], items };
  },

  async createFromCart(orderData, items) {
    return await db.transaction(async (tx) => {

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

      for (const item of items) {
        await tx
          .update(book)
          .set({ stock: sql`${book.stock} - ${item.quantity}` })
          .where(eq(book.id, item.bookId));
      }

      const rentalResult = await tx
        .insert(rental)
        .values(orderData)
        .returning();

      const newRental = rentalResult[0];

      await tx.insert(rentalDetail).values(
        items.map(i => ({
          rentalId: newRental.id,
          bookId: i.bookId,
          quantity: i.quantity,
          unitPrice: i.unitPrice
        }))
      );

      return newRental;
    });
  }
};