import 'dotenv/config';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { sql } from 'drizzle-orm';

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL is not set');
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

async function migrate() {
  try {
    console.log('Creating application tables...');

    // Book table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        description TEXT,
        genre TEXT,
        price INTEGER NOT NULL,
        image TEXT,
        stock INTEGER NOT NULL DEFAULT 0
      );
    `);
    console.log('✓ Created book table');

    // Rental table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS rental (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        bookId INTEGER NOT NULL REFERENCES book(id) ON DELETE CASCADE,
        rentalDate INTEGER NOT NULL,
        returnDate INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'rented',
        lateReturned INTEGER DEFAULT 0
      );
    `);
    console.log('✓ Created rental table');

    // Review table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS review (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bookId INTEGER NOT NULL REFERENCES book(id) ON DELETE CASCADE,
        userId INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL,
        reviewText TEXT,
        createdAt INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
        updatedAt INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer))
      );
    `);
    console.log('✓ Created review table');

    // Cart table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
      );
    `);
    console.log('✓ Created cart table');

    // Cart item table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS cart_item (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cartId INTEGER NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
        bookId INTEGER NOT NULL REFERENCES book(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        type TEXT NOT NULL DEFAULT 'buy'
      );
    `);
    console.log('✓ Created cart_item table');

    // Purchase table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS purchase (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        bookId INTEGER NOT NULL REFERENCES book(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        unitPrice INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'completed',
        orderId TEXT
      );
    `);
    console.log('✓ Created purchase table');

    // Order table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS "order" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        status TEXT NOT NULL DEFAULT 'completed',
        rentalDate INTEGER,
        returnDate INTEGER,
        total INTEGER NOT NULL DEFAULT 0,
        createdAt INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer))
      );
    `);
    console.log('✓ Created order table');

    // Order item table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS order_item (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
        bookId INTEGER NOT NULL REFERENCES book(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        unitPrice INTEGER NOT NULL DEFAULT 0,
        type TEXT NOT NULL DEFAULT 'buy'
      );
    `);
    console.log('✓ Created order_item table');

    console.log('\n✓ Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('✗ Migration failed:', err.message);
    console.error(err);
    process.exit(1);
  }
}

migrate();