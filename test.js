// test-connection.js
import 'dotenv/config';
import { createClient } from '@libsql/client';

console.log('DATABASE_URL:', process.env.TURSO_DATABASE_URL);
console.log('AUTH_TOKEN:', process.env.TURSO_AUTH_TOKEN ? 'SET' : 'NOT SET');

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

try {
  const result = await client.execute('SELECT 1');
  console.log('✓ Connection successful!');
  console.log(result);
} catch (err) {
  console.error('✗ Connection failed:', err.message);
}