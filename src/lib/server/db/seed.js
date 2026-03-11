import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { user } from './schema.js';
import bcrypt from 'bcrypt';
import { readFileSync } from 'fs';

// Read .env file manually
const env = Object.fromEntries(
    readFileSync('.env', 'utf-8')
        .split('\n')
        .filter(line => line.includes('='))
        .map(line => {
            const [key, ...rest] = line.split('=');
            return [key.trim(), rest.join('=').trim()]; // .trim() removes \r
        })
);

const client = createClient({ url: env.DATABASE_URL });
const db = drizzle(client);

async function seed() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    await db.insert(user).values({
        membershipNumber: 'MEM001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'ADMIN'
    });

    console.log('User added successfully!');
    process.exit(0);
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});