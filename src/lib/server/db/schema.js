import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const book = sqliteTable('book', {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  author: text().notNull(),
  description: text(),
  price: integer().notNull(), // stored in cents
  image: text(),
  stock: integer().notNull().default(0),
  createdAt: integer({ mode: 'timestamp_ms' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});
