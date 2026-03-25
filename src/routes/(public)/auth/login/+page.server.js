import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';

export const load = async (event) => {
    if (event.locals.user) {
        const redirectTo = event.url.searchParams.get('redirectTo');
        throw redirect(302, redirectTo || '/Member');
    }
    return {};
};

export const actions = {
    signInEmail: async (event) => {
        const formData = await event.request.formData();
        const email = formData.get('email')?.toString() ?? '';
        const password = formData.get('password')?.toString() ?? '';
        const redirectTo = formData.get('redirectTo')?.toString() || '/Member';

        try {
            await auth.api.signInEmail({
                body: { email, password },
                headers: event.request.headers
            });
        } catch (error) {
            if (error instanceof APIError) return fail(400, { message: error.message || 'Signin failed' });
            return fail(500, { message: 'Unexpected error' });
        }

        console.log('redirectTo:', redirectTo);
        throw redirect(302, redirectTo);
    }
};