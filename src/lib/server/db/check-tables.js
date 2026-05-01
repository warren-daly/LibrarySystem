import 'dotenv/config';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { sql } from 'drizzle-orm';
import * as schema from './schema.js';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

async function checkTables() {
  const tables = [
    { name: 'product_category', table: schema.productCategory },
    { name: 'product', table: schema.product },
    { name: 'product_review', table: schema.productReview },
    { name: 'order', table: schema.order },
    { name: 'order_detail', table: schema.orderDetail },
    { name: 'cart', table: schema.cart },
    { name: 'cart_item', table: schema.cartItem },
  ];

  for (const { name, table } of tables) {
    const count = await db.select({ c: sql`COUNT(*)` }).from(table);
    console.log(`${name}: ${count[0].c} row(s)`);
  }
}

checkTables().catch(console.error);