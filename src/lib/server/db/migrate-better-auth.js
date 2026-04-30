import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.TURSO_DATABASE_URL) throw new Error('TURSO_DATABASE_URL is not set');
if (!process.env.TURSO_AUTH_TOKEN) throw new Error('TURSO_AUTH_TOKEN is not set');

const client = createClient({
	url: process.env.TURSO_DATABASE_URL,
	authToken: process.env.TURSO_AUTH_TOKEN
});

const db = drizzle(client);

async function migrateAuth() {
	try {
		// USER
		await db.run(sql`
			CREATE TABLE IF NOT EXISTS user (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				email TEXT NOT NULL UNIQUE,
				email_verified INTEGER NOT NULL DEFAULT 0,
				image TEXT,
				role TEXT NOT NULL DEFAULT 'MEMBER',
				created_at INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
				updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
			);
		`);

		// SESSION
		await db.run(sql`
			CREATE TABLE IF NOT EXISTS session (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				expires_at INTEGER NOT NULL,
				token TEXT NOT NULL UNIQUE,
				created_at INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
				updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
				ip_address TEXT,
				user_agent TEXT,
				user_id INTEGER NOT NULL
			);
		`);

		// ACCOUNT
		await db.run(sql`
			CREATE TABLE IF NOT EXISTS account (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				account_id TEXT NOT NULL,
				provider_id TEXT NOT NULL,
				user_id INTEGER NOT NULL,
				access_token TEXT,
				refresh_token TEXT,
				id_token TEXT,
				access_token_expires_at INTEGER,
				refresh_token_expires_at INTEGER,
				scope TEXT,
				password TEXT,
				created_at INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
				updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
			);
		`);

		// VERIFICATION
		await db.run(sql`
			CREATE TABLE IF NOT EXISTS verification (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				identifier TEXT NOT NULL,
				value TEXT NOT NULL,
				expires_at INTEGER NOT NULL,
				created_at INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
				updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
			);
		`);

		console.log('✅ Better Auth tables created successfully!');
	} catch (err) {
		console.error('❌ Auth migration error:', err);
	}
}

migrateAuth();