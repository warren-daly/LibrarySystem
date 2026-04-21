import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { sendPasswordResetEmail } from '$lib/server/email/email-service';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,

	advanced: {
		database: {
			generateId: 'serial'
		}
	},

	database: drizzleAdapter(db, { provider: 'sqlite' }),

	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url }) => {
			await sendPasswordResetEmail({
				to: user.email,
				url
			});
			console.log('Password reset email sent to', user.email);
			console.log('Reset URL', url);
		}
	},

	plugins: [sveltekitCookies(getRequestEvent)]
});