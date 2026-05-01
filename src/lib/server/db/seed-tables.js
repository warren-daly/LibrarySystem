import 'dotenv/config';
import { createClient } from '@libsql/client';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.js'; // adjust path if needed

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

async function seed() {
  console.log('Deleting existing data...');

  // ===== Delete existing data in correct order to satisfy FK constraints =====
  await db.run(sql`DELETE FROM product_review`);
  await db.run(sql`DELETE FROM order_detail`);
  await db.run(sql`DELETE FROM "order"`);
  await db.run(sql`DELETE FROM cart_item`);
  await db.run(sql`DELETE FROM cart`);
  await db.run(sql`DELETE FROM product`);
  await db.run(sql`DELETE FROM product_category`);
  await db.run(sql`DELETE FROM account`);
  await db.run(sql`DELETE FROM session`);
  await db.run(sql`DELETE FROM user`);

  console.log('Existing data cleared. Seeding new data...');

  // ===== Seed default user =====
  const [defaultUser] = await db
    .insert(schema.user)
    .values({
      id: 1,
      name: 'John Doe',
      email: 'user@example.com',
      emailVerified: 0,
      role: 'user',
      banned: 0
    })
    .returning({ id: schema.user.id });

  const userId = defaultUser.id;

  // ===== Seed Product Categories =====
  const categories = await db
    .insert(schema.productCategory)
    .values([
      { id: 1, name: 'Electronics', description: 'Electronic items' },
      { id: 2, name: 'Books', description: 'All kinds of books' },
      { id: 3, name: 'Clothing', description: 'Apparel and clothing' }
    ])
    .returning({ id: schema.productCategory.id });

  // ===== Seed Products =====
  const products = await db
    .insert(schema.product)
    .values([
      { id: 1, name: 'Smartphone', description: 'Latest smartphone', price: 69900, image: 'phone.jpg', quantity: 10, categoryId: 1 },
      { id: 2, name: 'Laptop', description: 'High performance laptop', price: 129900, image: 'laptop.jpg', quantity: 5, categoryId: 1 },
      { id: 3, name: 'Novel Book', description: 'Bestselling novel', price: 1599, image: 'book.jpg', quantity: 20, categoryId: 2 },
      { id: 4, name: 'T-Shirt', description: 'Cotton t-shirt', price: 1999, image: 'shirt.jpg', quantity: 50, categoryId: 3 }
    ])
    .returning({ id: schema.product.id });

  // ===== Seed an Order =====
  const [order] = await db
    .insert(schema.order)
    .values({
      userId,
      status: 'pending',
      total: 69900
    })
    .returning({ id: schema.order.id });

  const orderId = order.id;

  // ===== Seed Order Details =====
  await db.insert(schema.orderDetail).values({
    orderId,
    productId: 1,
    quantity: 1,
    unitPrice: 69900
  });

  // ===== Seed Cart =====
  const [cart] = await db
    .insert(schema.cart)
    .values({ userId })
    .returning({ id: schema.cart.id });

  const cartId = cart.id;

  // ===== Seed Cart Items =====
  await db.insert(schema.cartItem).values({
    cartId,
    productId: 2,
    quantity: 2
  });

  // ===== Seed Product Reviews =====
  await db.insert(schema.productReview).values([
    {
      productId: 1,
      userId,
      rating: 5,
      comment: 'Amazing smartphone!'
    },
    {
      productId: 3,
      userId,
      rating: 4,
      comment: 'Great read, highly recommended.'
    }
  ]);

  console.log('Seeding complete!');
}

seed().catch(console.error);