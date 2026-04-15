import { db } from '../db/index.js';
import { book } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const bookDataAccess = {

  async findById(id) {
    const result = await db
      .select()
      .from(book)
      .where(eq(book.id, id))
      .limit(1);

    return result[0] ?? null;
  },
  
  async findByTitle(title) {
    const result = await db
      .select()
      .from(book)
      .where(eq(book.title, title))
      .limit(1);

    return result[0] ?? null;
  },

  async findByGenre(genre) {
    return db
      .select()
      .from(book)
      .where(eq(book.genre, genre));
  },

  async findAll() {
    return db.select().from(book);
  },

  async create(bookData) {
    const result = await db
      .insert(book)
      .values(bookData)
      .returning();

    return result[0];
  },

  async update(id, bookData) {
    const result = await db
      .update(book)
      .set(bookData)
      .where(eq(book.id, id))
      .returning();

    return result[0] ?? null;
  },

  async delete(id) {
    const result = await db
      .delete(book)
      .where(eq(book.id, id));

    return result.rowsAffected > 0;
  }
};
