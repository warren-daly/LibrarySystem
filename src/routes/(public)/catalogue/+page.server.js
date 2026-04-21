import { db } from '$lib/server/db';
import { book, review } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { cartService } from '$lib/server/services/cart-service.js';
import { redirect, error } from '@sveltejs/kit';

export async function load() {
	const books = await db.select().from(book);

	const booksWithRatings = await Promise.all(
		books.map(async (b) => {
			const reviews = await db.query.review.findMany({
				where: eq(review.bookId, b.id)
			});

			const averageRating = reviews.length > 0
				? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
				: null;

			return {
				...b,
				averageRating,
				reviewCount: reviews.length
			};
		})
	);

	return {
		books: booksWithRatings
	};
}

export const actions = {
	addToCart: async ({ locals, request }) => {
		if (!locals.user) {
			throw redirect(303, '/auth/login');
		}

		const data = await request.formData();
		const bookId = Number(data.get('bookId'));
		const type = data.get('type');

		console.log('SERVER RECEIVED:', { bookId, type });
		console.log('All form data:', Object.fromEntries(data));

		if (!bookId) throw error(400, 'Invalid book');
		if (!type || !['rent', 'buy'].includes(type)) {
			throw error(400, 'Invalid type');
		}

		await cartService.addItem(locals.user.id, bookId, 1, type);

		return { success: true };
	}
};