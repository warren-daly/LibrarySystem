import { auth } from '$lib/server/auth.js';

export async function POST({ request }) {
    return auth.handler(request);
}

export async function GET({ request }) {
    return auth.handler(request);
}