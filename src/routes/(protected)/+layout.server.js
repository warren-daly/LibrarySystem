import { redirect } from '@sveltejs/kit';
import { page } from '$app/stores';

export function load({ locals, url }) {
	if (!locals.user) {
		throw redirect(302, `/auth/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	return {
		user: locals.user
	};
}