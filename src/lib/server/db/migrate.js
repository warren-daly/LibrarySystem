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

async function migrate() {
	try {
		// BOOK
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

		// RENTAL
		await db.run(sql`
			CREATE TABLE IF NOT EXISTS rental (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				userId INTEGER NOT NULL,
				bookId INTEGER NOT NULL,
				rentalDate INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
				returnDate INTEGER NOT NULL,
				status TEXT NOT NULL DEFAULT 'rented',
				lateReturned INTEGER DEFAULT 0
			);
		`);

		// REVIEW
		await db.run(sql`
			CREATE TABLE IF NOT EXISTS review (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				bookId INTEGER NOT NULL,
				userId INTEGER NOT NULL,
				rating INTEGER NOT NULL,
				reviewText TEXT,
				createdAt INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
				updatedAt INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
			);
		`);

		// CART
		await db.run(sql`
			CREATE TABLE IF NOT EXISTS cart (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				userId INTEGER NOT NULL
			);
		`);

		// CART ITEM
		await db.run(sql`
			CREATE TABLE IF NOT EXISTS cart_item (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				cartId INTEGER NOT NULL,
				bookId INTEGER NOT NULL,
				quantity INTEGER NOT NULL DEFAULT 1,
				type TEXT NOT NULL DEFAULT 'buy'
			);
		`);

		// PURCHASE
		await db.run(sql`
			CREATE TABLE IF NOT EXISTS purchase (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				userId INTEGER NOT NULL,
				bookId INTEGER NOT NULL,
				quantity INTEGER NOT NULL DEFAULT 1,
				unitPrice INTEGER NOT NULL DEFAULT 0,
				status TEXT NOT NULL DEFAULT 'completed',
				orderId TEXT
			);
		`);

		// ORDER
		await db.run(sql`
			CREATE TABLE IF NOT EXISTS "order" (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				userId INTEGER NOT NULL,
				status TEXT NOT NULL DEFAULT 'completed',
				rentalDate INTEGER,
				returnDate INTEGER,
				total INTEGER NOT NULL DEFAULT 0,
				createdAt INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
			);
		`);

		// ORDER ITEM
		await db.run(sql`
			CREATE TABLE IF NOT EXISTS order_item (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				orderId INTEGER NOT NULL,
				bookId INTEGER NOT NULL,
				quantity INTEGER NOT NULL DEFAULT 1,
				unitPrice INTEGER NOT NULL DEFAULT 0,
				type TEXT NOT NULL DEFAULT 'buy'
			);
		`);

		console.log('✅ App tables created successfully!');
	} catch (err) {
		console.error('❌ Migration error:', err);
	}
}

migrate();