import 'dotenv/config';
import { createClient } from '@libsql/client';
import { sql } from 'drizzle-orm';

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL is not set');
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function fixDatabase() {
  try {
    console.log('🔧 Starting database fix...\n');

    // 1. Check current cart_item schema
    console.log('📋 Checking current cart_item table schema...');
    const currentSchema = await client.execute('PRAGMA table_info(cart_item)');
    console.log('Current columns:', currentSchema.rows.map(r => r.name).join(', '));

    // 2. Drop old cart_item table
    console.log('\n🗑️ Dropping old cart_item table...');
    try {
      await client.execute('DROP TABLE IF EXISTS cart_item');
      console.log('✓ Old table dropped');
    } catch (err) {
      console.log('Note: Could not drop table (might not exist)');
    }

    // 3. Recreate cart_item with correct schema
    console.log('\n🏗️ Creating new cart_item table with correct schema...');
    await client.execute(`
      CREATE TABLE cart_item (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cartId INTEGER NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
        bookId INTEGER NOT NULL REFERENCES book(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        type TEXT NOT NULL DEFAULT 'buy'
      )
    `);
    console.log('✓ New cart_item table created');

    // 4. Verify the new schema
    console.log('\n✅ Verifying new cart_item table schema...');
    const newSchema = await client.execute('PRAGMA table_info(cart_item)');
    console.log('New columns:');
    newSchema.rows.forEach(row => {
      console.log(`  - ${row.name} (${row.type})`);
    });

    // 5. Check if order_item needs fixing too
    console.log('\n📋 Checking order_item table schema...');
    try {
      const orderItemSchema = await client.execute('PRAGMA table_info(order_item)');
      const hasType = orderItemSchema.rows.some(r => r.name === 'type');
      
      if (!hasType) {
        console.log('⚠️ order_item table is missing type column, fixing...');
        
        // Recreate order_item with type column
        await client.execute('DROP TABLE IF EXISTS order_item');
        await client.execute(`
          CREATE TABLE order_item (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            orderId INTEGER NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
            bookId INTEGER NOT NULL REFERENCES book(id) ON DELETE CASCADE,
            quantity INTEGER NOT NULL DEFAULT 1,
            unitPrice INTEGER NOT NULL DEFAULT 0,
            type TEXT NOT NULL DEFAULT 'buy'
          )
        `);
        console.log('✓ order_item table fixed');
      } else {
        console.log('✓ order_item table already has type column');
      }
    } catch (err) {
      console.log('Note: Could not verify order_item table:', err.message);
    }

    console.log('\n🎉 Database fix complete!');
    console.log('✓ cart_item table now has: id, cartId, bookId, quantity, type');
    console.log('\nYou can now:');
    console.log('1. Restart your dev server');
    console.log('2. Commit and push to Git');
    console.log('3. Deploy to Vercel');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Database fix failed:', err.message);
    console.error(err);
    process.exit(1);
  }
}

fixDatabase();