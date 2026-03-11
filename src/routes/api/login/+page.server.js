import { db } from '$lib/server/db/index.js';
import { user, session } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        const found = await db.query.user.findFirst({
            where: eq(user.email, email)
        });

        if (!found || !(await bcrypt.compare(password, found.password))) {
            return fail(401, { error: 'Invalid credentials' });
        }

        const sessionId = randomUUID();
        const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30;

        await db.insert(session).values({
            id: sessionId,           // ← your schema uses 'session_id'
            membershipNumber: found.membershipNumber,
            expiresAt: expiresAt
        });

        cookies.set('session', sessionId, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30
        });

        redirect(303, '/');
    }
};