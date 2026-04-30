import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { eq } from 'drizzle-orm';
import * as schema from './schema.js';
import * as authSchema from './auth.schema.js';
import { books } from './seed-books-data.js';
import 'dotenv/config';

const env = Object.fromEntries(
	readFileSync('.env', 'utf-8')
		.split('\n')
		.filter((line) => line.includes('='))
		.map((line) => {
			const [key, ...rest] = line.split('=');
			return [key.trim(), rest.join('=').trim().replace(/^["']|["']$/g, '')];
		})
);

const client = createClient({
	url: env.TURSO_DATABASE_URL,
	authToken: env.TURSO_AUTH_TOKEN
});
const db = drizzle(client, { schema: { ...schema, ...authSchema } });

async function seedBooks() {
	for (const bookData of books) {
		const existingBook = await db.query.book.findFirst({
			where: eq(schema.book.title, bookData.title)
		});

		if (!existingBook) {
			await db.insert(schema.book).values(bookData);
			console.log(`Book Added: ${bookData.title}`);
		} else {
			console.log(`Book Skipped: ${bookData.title}`);
		}
	}

	console.log('Book seeding complete');
}

async function seed() {
	const existingAdmin = await db.query.user.findFirst({
		where: eq(authSchema.user.email, 'admin@admin.com')
	});

	if (!existingAdmin) {
		const response = await fetch(`${env.ORIGIN}/api/auth/sign-up/email`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Origin: env.ORIGIN
			},
			body: JSON.stringify({
				name: 'Admin',
				email: 'admin@admin.com',
				password: 'admin123'
			})
		});

		if (!response.ok) {
			const text = await response.text();
			console.error('Status:', response.status);
			console.error('Response:', text);
			process.exit(1);
		}

		console.log('Demo user created successfully!');
	} else {
		console.log('Admin already exists.');
	}

	await db
		.update(authSchema.user)
		.set({ role: 'ADMIN' })
		.where(eq(authSchema.user.email, 'admin@admin.com'));

	console.log('Admin role ready.');

	await seedBooks();

	process.exit(0);
}

seed().catch((e) => {
	console.error(e);
	process.exit(1);
});