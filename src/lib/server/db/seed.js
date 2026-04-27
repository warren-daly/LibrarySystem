import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { eq } from 'drizzle-orm';
import * as schema from './schema.js';
import * as authSchema from './auth.schema.js';

const env = Object.fromEntries(
	readFileSync('.env', 'utf-8')
		.split('\n')
		.filter((line) => line.includes('='))
		.map((line) => {
			const [key, ...rest] = line.split('=');
			return [key.trim(), rest.join('=').trim().replace(/^["']|["']$/g, '')];
		})
);

const client = createClient({ url: env.DATABASE_URL });
const db = drizzle(client, { schema: { ...schema, ...authSchema } });

async function seed() {
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

    // Update role directly in the database
    const client = createClient({ url: env.DATABASE_URL });
    const db = drizzle(client, { schema: { ...schema } });

    await db.update(authSchema.user)
        .set({ role: 'ADMIN' })
        .where(eq(authSchema.user.email, 'admin@admin.com'));

    console.log('Demo user created successfully!');

	const existingBooks = await db.select().from(schema.book).limit(1);

	if (existingBooks.length === 0) {
		await db.insert(schema.book).values([
			{
				title: 'The Hobbit',
				author: 'J.R.R. Tolkien',
				description: 'A hobbit goes on an unexpected journey.',
				genre: 'Fantasy',
				price: 1499,
				stock: 10,
				image: 'hobbit.jpg'
			},
			{
				title: 'Dune',
				author: 'Frank Herbert',
				description: 'A sci-fi epic on Arrakis.',
				genre: 'Science Fiction',
				price: 1799,
				stock: 8,
				image: 'dune.jpg'
			},
			{
				title: 'The Martian',
				author: 'Andy Weir',
				description: 'Survival on Mars.',
				genre: 'Science Fiction',
				price: 1399,
				stock: 12,
				image: 'martian.jpg'
			},
			{
				title: 'Stormbreaker',
				author: 'Anthony Horowitz',
				description: 'The first Alex Rider adventure.',
				genre: 'Action Adventure',
				price: 799,
				stock: 10,
				image: 'stormbreaker.jpg'
			}
		]);

		console.log('Books seeded.');
	} else {
		console.log('Books already exist — skipping.');
	}

	process.exit(0);
}

seed().catch((e) => {
	console.error(e);
	process.exit(1);
});