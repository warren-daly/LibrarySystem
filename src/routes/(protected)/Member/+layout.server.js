import { redirect } from '@sveltejs/kit';

export function load({ locals, url }) {
	if (!locals.user) {
		throw redirect(302, `/auth/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	if (locals.user.role === 'ADMIN') {
		throw redirect(302, '/admin');
	}

	return {
		user: locals.user
	};
}