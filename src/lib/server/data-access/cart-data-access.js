import { db } from '../db/index.js';
import { cart, cartItem, book } from '../db/schema.js';
import { eq, and, sql } from 'drizzle-orm';

export const cartDataAccess = {

  async getOrCreateCart(userId) {
    const result = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, userId))
      .limit(1);

    if (result[0]) return result[0];

    const created = await db
      .insert(cart)
      .values({ userId })
      .returning();

    return created[0] ?? null;
  },

  async addItem(cartId, bookId, quantity, type = 'buy') {
    console.log(`cartDataAccess.addItem called with: cartId=${cartId}, bookId=${bookId}, quantity=${quantity}, type=${type}`);
    
    const result = await db
      .select()
      .from(cartItem)
      .where(
        and(
          eq(cartItem.cartId, cartId),
          eq(cartItem.bookId, bookId),
          eq(cartItem.type, type)
        )
      )
      .limit(1);

    if (result[0]) {
      const updated = await db
        .update(cartItem)
        .set({ quantity: result[0].quantity + quantity })
        .where(eq(cartItem.id, result[0].id))
        .returning();

      console.log(`Updated existing item: ${JSON.stringify(updated[0])}`);
      return updated[0] ?? null;
    }

    const inserted = await db
      .insert(cartItem)
      .values({ cartId, bookId, quantity, type })
      .returning();

    console.log(`Inserted new item: ${JSON.stringify(inserted[0])}`);
    return inserted[0] ?? null;
  },

  async getCartItems(cartId) {
    return await db
      .select({
        id: cartItem.id,
        quantity: cartItem.quantity,
        type: cartItem.type,
        bookId: book.id,
        title: book.title,
        unitPrice: sql`CASE WHEN ${cartItem.type} = 'rent' THEN 0 ELSE ${book.price} END`
      })
      .from(cartItem)
      .innerJoin(book, eq(cartItem.bookId, book.id))
      .where(eq(cartItem.cartId, cartId));
  },

  async updateItemQuantity(cartItemId, quantity) {
    const updated = await db
      .update(cartItem)
      .set({ quantity })
      .where(eq(cartItem.id, cartItemId))
      .returning();

    return updated[0] ?? null;
  },

  async removeItem(cartItemId) {
    await db.delete(cartItem).where(eq(cartItem.id, cartItemId));
  },

  async clearCart(cartId) {
    await db.delete(cartItem).where(eq(cartItem.cartId, cartId));
  }
};