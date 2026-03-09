import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const book = sqliteTable('book', {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  author: text().notNull(),
  description: text(),
  genre: text(),
  price: integer().notNull(), 
  image: text(),
  stock: integer().notNull().default(0),
});
