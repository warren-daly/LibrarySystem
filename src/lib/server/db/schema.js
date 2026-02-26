import { sqliteTable, text, integer,real } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
//**TEMP DATABASE */
export const book = sqliteTable('book', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  author: text('author').notNull(),
  description: text('description'),
  genre: text('genre'),
  publishedYear: integer('published_year'),
  price: real('price'),
});