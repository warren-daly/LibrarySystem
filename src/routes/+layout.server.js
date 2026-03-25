import { redirect } from '@sveltejs/kit';


import { auth } from '$lib/server/auth';


export const load = async (event) => {if (!event.locals.user) {
    }
    return { user: event.locals.user };
};