import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { user } from './auth.schema.js';

export const book = sqliteTable('book', {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  author: text().notNull(),
  description: text(),
  genre: text(),
  price: integer().notNull(),
  image: text(),
  stock: integer().notNull().default(0)
});

export const cart = sqliteTable('cart', {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: integer().notNull()
});

export const cartItem = sqliteTable('cart_item', {
  id: integer().primaryKey({ autoIncrement: true }),
  cartId: integer().notNull(),
  bookId: integer().notNull(),
  quantity: integer().notNull().default(1)
});

export const rental = sqliteTable('rental', {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: integer().notNull(),
  bookId: integer().notNull(),
  rentalDate: integer({ mode: 'timestamp_ms' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  returnDate: integer({ mode: 'timestamp_ms' }).notNull(),
  status: text().notNull().default('rented'),
  total: integer().notNull().default(0)
});

export const rentalDetail = sqliteTable('rental_detail', {
  id: integer().primaryKey({ autoIncrement: true }),
  rentalId: integer().notNull(),
  bookId: integer().notNull(),
  quantity: integer().notNull().default(1),
  unitPrice: integer().notNull().default(0)
});

export const userRelations = relations(user, ({ many }) => ({ rentals: many(rental) }));

export const rentalRelations = relations(rental, ({ many, one }) => ({
  user: one(user, { fields: [rental.userId], references: [user.id] }),
  rentalDetails: many(rentalDetail)
}));

export const rentalDetailRelations = relations(rentalDetail, ({ one }) => ({
  rental: one(rental, { fields: [rentalDetail.rentalId], references: [rental.id] }),
  book: one(book, { fields: [rentalDetail.bookId], references: [book.id] })
}));

export const bookRelations = relations(book, ({ many }) => ({ rentalDetails: many(rentalDetail) }));

export const cartRelations = relations(cart, ({ many, one }) => ({
  user: one(user, { fields: [cart.userId], references: [user.id] }),
  cartItems: many(cartItem)
}));

export const cartItemRelations = relations(cartItem, ({ one }) => ({
  cart: one(cart, { fields: [cartItem.cartId], references: [cart.id] }),
  book: one(book, { fields: [cartItem.bookId], references: [book.id] })
}));

export * from './auth.schema.js';