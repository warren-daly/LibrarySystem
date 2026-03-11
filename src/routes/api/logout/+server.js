import { db } from '$lib/server/db/index.js';
import { session } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export async function POST({ cookies }) {
    const sessionId = cookies.get('session');
    if (sessionId) {
        await db.delete(session).where(eq(session.id, sessionId));
        cookies.delete('session', { path: '/' });
    }
    redirect(303, '/');
}