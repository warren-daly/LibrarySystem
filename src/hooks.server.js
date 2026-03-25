import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { db } from '$lib/server/db/index.js';
import { session, user } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

async function originalHandle({ event, resolve }) {
	const sessionId = event.cookies.get('session');

	if (sessionId) {
		const found = await db.query.session.findFirst({ where: eq(session.id, sessionId) });

		if (found) {
			const loggedInUser = await db.query.user.findFirst({
				where: eq(user.membershipNumber, found.membershipNumber)
			});

			event.locals.user = loggedInUser;
		}
	}

	return resolve(event);
}

/** @type {import('@sveltejs/kit').Handle} */ const handleBetterAuth = async ({
	event,
	resolve
}) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle = sequence(originalHandle, handleBetterAuth);
