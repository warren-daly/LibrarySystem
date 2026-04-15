import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { eq } from 'drizzle-orm';
import * as schema from './schema.js';
import * as authSchema from './auth.schema.js';

const env = Object.fromEntries(
    readFileSync('.env', 'utf-8')
        .split('\n')
        .filter(line => line.includes('='))
        .map(line => {
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
            'Origin': env.ORIGIN
        },
        body: JSON.stringify({
            name: 'Admin',
            email: 'admin@admin.com',
            password: 'admin123',
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
    process.exit(0);
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});