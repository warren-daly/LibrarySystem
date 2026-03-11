import { db } from '$lib/server/db/index.js';
import { session, user } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export async function handle({ event, resolve }) {
    const sessionId = event.cookies.get('session');

    if (sessionId) {
        const found = await db.query.session.findFirst({
            where: eq(session.id, sessionId)
        });

        if (found) {
            const loggedInUser = await db.query.user.findFirst({
                where: eq(user.membershipNumber, found.membershipNumber)
            });
            event.locals.user = loggedInUser;
        }
    }

    return resolve(event);
}