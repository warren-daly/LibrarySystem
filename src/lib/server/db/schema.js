import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
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

export const rental = sqliteTable('rental', {
	id: integer().primaryKey({ autoIncrement: true }),
	userId: integer().notNull(),
	bookId: integer().notNull(),
	rentalDate: integer({ mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
	returnDate: integer({ mode: 'timestamp_ms' }).notNull(),
	status: text().notNull().default('rented')
});

export const review = sqliteTable('review', {
  id: integer().primaryKey({ autoIncrement: true }),
  bookId: integer().notNull(),
  userId: integer().notNull(),
  rating: integer().notNull(), // 1-5
  reviewText: text(),
  createdAt: integer({ mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(strftime('%s', 'now') * 1000)`),
  updatedAt: integer({ mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(strftime('%s', 'now') * 1000)`)
});

export const reviewRelations = relations(review, ({ one }) => ({
  user: one(user, { fields: [review.userId], references: [user.id] }),
  book: one(book, { fields: [review.bookId], references: [book.id] })
}));

export const userRelations = relations(user, ({ many }) => ({
	rentals: many(rental),
  reviews: many(review)
}));

export const rentalRelations = relations(rental, ({ one }) => ({
	user: one(user, { fields: [rental.userId], references: [user.id] }),
	book: one(book, { fields: [rental.bookId], references: [book.id] })
}));

export const bookRelations = relations(book, ({ many }) => ({
	rentals: many(rental),
  reviews: many(review)
}));


export const cart = sqliteTable('cart', {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: integer().notNull()
});

export const cartItem = sqliteTable('cart_item', {
  id: integer().primaryKey({ autoIncrement: true }),
  cartId: integer().notNull(),
  bookId: integer().notNull(),
  quantity: integer().notNull().default(1),
  type: text().notNull().default('buy') // Changed from varchar to text for SQLite
});

export const purchase = sqliteTable('purchase', {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: integer().notNull(),
  bookId: integer().notNull(),
  quantity: integer().notNull().default(1),
  unitPrice: integer().notNull().default(0),
  status: text().notNull().default('completed'),
  orderId: text()
});

export const purchaseRelations = relations(purchase, ({ one }) => ({
  user: one(user, { fields: [purchase.userId], references: [user.id] }),
  book: one(book, { fields: [purchase.bookId], references: [book.id] })
}));

export const cartRelations = relations(cart, ({ many, one }) => ({
  user: one(user, { fields: [cart.userId], references: [user.id] }),
  cartItems: many(cartItem)
}));

export const cartItemRelations = relations(cartItem, ({ one }) => ({
  cart: one(cart, { fields: [cartItem.cartId], references: [cart.id] }),
  book: one(book, { fields: [cartItem.bookId], references: [book.id] })
}));

export const order = sqliteTable('order', {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: integer().notNull(),
  status: text().notNull().default('completed'), // completed, rented, etc
  rentalDate: integer({ mode: 'timestamp_ms' }),
  returnDate: integer({ mode: 'timestamp_ms' }),
  total: integer().notNull().default(0),
  createdAt: integer({ mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(strftime('%s', 'now') * 1000)`)
});

export const orderItem = sqliteTable('order_item', {
  id: integer().primaryKey({ autoIncrement: true }),
  orderId: integer().notNull(),
  bookId: integer().notNull(),
  quantity: integer().notNull().default(1),
  unitPrice: integer().notNull().default(0),
  type: text().notNull().default('buy') // 'buy' or 'rent'
});

export const orderRelations = relations(order, ({ many, one }) => ({
  user: one(user, { fields: [order.userId], references: [user.id] }),
  items: many(orderItem)
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, { fields: [orderItem.orderId], references: [order.id] }),
  book: one(book, { fields: [orderItem.bookId], references: [book.id] })
}));

export * from './auth.schema.js';