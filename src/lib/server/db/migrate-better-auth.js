// ./src/lib/server/db/migrate-better-auth.js
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
    console.log('Creating Better Auth tables...');

    // User table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS "user" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        email_verified INTEGER NOT NULL DEFAULT 0,
        image TEXT,
        role TEXT NOT NULL DEFAULT 'MEMBER',
        created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
        updated_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer))
      );
    `);
    console.log('✓ Created user table');

    // Session table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS session (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        expires_at INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
        updated_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
        ip_address TEXT,
        user_agent TEXT,
        user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
      );
    `);
    console.log('✓ Created session table');

    // Create index on session.user_id
    await db.run(sql`
      CREATE INDEX IF NOT EXISTS session_userId_idx ON session(user_id);
    `);
    console.log('✓ Created session_userId_idx');

    // Account table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS account (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id TEXT NOT NULL,
        provider_id TEXT NOT NULL,
        user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        access_token TEXT,
        refresh_token TEXT,
        id_token TEXT,
        access_token_expires_at INTEGER,
        refresh_token_expires_at INTEGER,
        scope TEXT,
        password TEXT,
        created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
        updated_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer))
      );
    `);
    console.log('✓ Created account table');

    // Create index on account.user_id
    await db.run(sql`
      CREATE INDEX IF NOT EXISTS account_userId_idx ON account(user_id);
    `);
    console.log('✓ Created account_userId_idx');

    // Verification table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS verification (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
        updated_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer))
      );
    `);
    console.log('✓ Created verification table');

    // Create index on verification.identifier
    await db.run(sql`
      CREATE INDEX IF NOT EXISTS verification_identifier_idx ON verification(identifier);
    `);
    console.log('✓ Created verification_identifier_idx');

    console.log('\n✓ Better Auth migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('✗ Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();