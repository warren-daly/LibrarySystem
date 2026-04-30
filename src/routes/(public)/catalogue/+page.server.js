import { db } from '$lib/server/db';
import { book, review, rental } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { cartService } from '$lib/server/services/cart-service.js';
import { redirect, error, fail } from '@sveltejs/kit';

export async function load() {
	const books = await db.select().from(book);

	const allRentals = await db.query.rental.findMany({
		with: {
			book: true
		}
	});

	const booksWithRatings = await Promise.all(
		books.map(async (b) => {
			const reviews = await db.query.review.findMany({
				where: eq(review.bookId, b.id)
			});

			const averageRating =
				reviews.length > 0
					? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
					: null;

			const activeRental = allRentals.find(
				r => r.bookId === b.id && r.status === 'rented'
			);

			return {
				...b,
				averageRating,
				reviewCount: reviews.length,
				nextAvailableDate: activeRental?.returnDate || null
			};
		})
	);

	return { books: booksWithRatings };
}

export const actions = {

	addToCart: async ({ locals, request }) => {
		if (!locals.user) {
			throw redirect(303, '/auth/login?redirectTo=/catalogue');
		}
		const data = await request.formData();
		const bookId = Number(data.get('bookId'));
		const type = data.get('type');

		if (!bookId) throw error(400, 'Invalid book');
		if (!type || type !== 'buy') throw error(400, 'Invalid type');

		if (!locals.user) {
			throw redirect(303, '/auth/login?redirectTo=/catalogue');
		}

		const selectedBook = await db.query.book.findFirst({
			where: eq(book.id, bookId)
		});

		if (!selectedBook || selectedBook.stock <= 0) {
			return fail(400, {
				errors: { general: 'This book is out of stock.' }
			});
		}

		await cartService.addItem(locals.user.id, bookId, 1, type);

		await db
			.update(book)
			.set({ stock: selectedBook.stock - 1 })
			.where(eq(book.id, bookId));

		return { success: true };
	},

	startRental: async ({ locals, request }) => {
		
		const data = await request.formData();
		const bookId = Number(data.get('bookId'));
		if (!bookId) throw error(400, 'Invalid book');
		if (!locals.user) {
			throw redirect(303, '/auth/login?redirectTo=/catalogue');
		}
		throw redirect(303, `/member/rentals?bookId=${bookId}`);
	}
};