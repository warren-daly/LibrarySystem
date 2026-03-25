import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
    readFileSync('.env', 'utf-8')
        .split('\n')
        .filter(line => line.includes('='))
        .map(line => {
            const [key, ...rest] = line.split('=');
            return [key.trim(), rest.join('=').trim().replace(/^["']|["']$/g, '')];
        })
);

async function seed() {
    const response = await fetch(`${env.ORIGIN}/api/auth/sign-up/email`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Origin': env.ORIGIN
        },
        body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
        })
    });

    if (!response.ok) {
        const text = await response.text();
        console.error('Status:', response.status);
        console.error('Response:', text);
        process.exit(1);
}

console.log('Demo user created successfully!');
process.exit(0);
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});