import { db } from '../db/index.js';
import { cart, cartItem, book } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

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

  async addItem(cartId, bookId, quantity) {
    const result = await db
      .select()
      .from(cartItem)
      .where(and(eq(cartItem.cartId, cartId), eq(cartItem.bookId, bookId)))
      .limit(1);

    if (result[0]) {
      const updated = await db
        .update(cartItem)
        .set({ quantity: result[0].quantity + quantity })
        .where(eq(cartItem.id, result[0].id))
        .returning();

      return updated[0] ?? null;
    }

    const inserted = await db
      .insert(cartItem)
      .values({ cartId, bookId, quantity })
      .returning();

    return inserted[0] ?? null;
  },

  async getCartItems(cartId) {
    return await db
      .select({
        id: cartItem.id,
        quantity: cartItem.quantity,
        bookId: book.id,
        title: book.title,
        unitPrice: book.price
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