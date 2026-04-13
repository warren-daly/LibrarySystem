import { db } from '$lib/server/db';
import { book } from '$lib/server/db/schema';
import { cartService } from '$lib/server/services/cart-service.js';
import { redirect, error } from '@sveltejs/kit';

export async function load() {
    const books = await db.select().from(book);

    return {
        books
    };
}

export const actions = {
    addToCart: async ({ locals, request }) => {
        if (!locals.user) {
            throw redirect(303, '/auth/login');
        }

        const data = await request.formData();
        const bookId = Number(data.get('bookId'));

        if (!bookId) throw error(400, 'Invalid book');

        await cartService.addItem(locals.user.id, bookId, 1);

        return { success: true };
    }
};