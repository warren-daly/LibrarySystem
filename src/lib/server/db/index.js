import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import * as authSchema from './auth.schema';
import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from '$env/static/private';

if (!TURSO_DATABASE_URL) throw new Error('TURSO_DATABASE_URL is not set');

const client = createClient({ 
  url: TURSO_DATABASE_URL, 
  authToken: TURSO_AUTH_TOKEN, 
}); 
export const db = drizzle(client, { schema: { ...schema, ...authSchema } });