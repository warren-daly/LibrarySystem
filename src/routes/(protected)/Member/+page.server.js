import { rentalService } from '$lib/server/services/rental-service.js';
import { bookService } from '$lib/server/services/books-service.js';
import { error, fail } from '@sveltejs/kit';
import { ZodError } from 'zod';
import { sendRentalConfirmationEmail } from '$lib/server/email/email-service.js';

export async function load({ url, locals }) {
	try {
		const rentals = await rentalService.getAllrentals();
		const books = await bookService.getAllBooks();
		const selectedBookId = url.searchParams.get('bookId');

		const memberRentals = locals.user
			? rentals.filter((r) => Number(r.userId) === Number(locals.user.id))
			: [];

		return {
			rentals: memberRentals,
			books,
			selectedBookId: selectedBookId ? Number(selectedBookId) : null,
			currentUser: locals.user ?? null
		};
	} catch (err) {
		console.error('Error retrieving rentals:', err);
		throw error(500, 'Failed to load rentals');
	}
}

export const actions = {
	createRental: async ({ request, locals }) => {
		try {
			if (!locals.user) {
				return fail(401, {
					errors: { general: 'You must be logged in to create a rental' }
				});
			}

			const formData = await request.formData();
			const rentalDays = Number(formData.get('rentalDays'));
			const bookId = Number(formData.get('bookId'));

			if (!bookId) {
				return fail(400, {
					errors: { bookId: 'Book is required' }
				});
			}

			if (!rentalDays || rentalDays < 1 || rentalDays > 14) {
				return fail(400, {
					errors: { rentalDays: 'Please select a rental duration between 1 and 14 days' }
				});
			}

			const rentalData = {
				userId: Number(locals.user.id),
				bookId,
				returnDate: new Date(Date.now() + rentalDays * 24 * 60 * 60 * 1000),
				status: 'rented'
			};

			await rentalService.createRental(rentalData);

			const book = await bookService.getBookById(bookId);

			sendRentalConfirmationEmail({
				to: locals.user.email,
				bookTitle: book?.title ?? `Book ID ${bookId}`,
				returnDate: rentalData.returnDate
			}).catch((err) => {
				console.error('Rental confirmation email failed:', err);
			});

			return { success: true };
		} catch (err) {
			console.error('Error creating rental:', err);

			if (err instanceof ZodError) {
				const errors = {};
				err.issues.forEach((issue) => {
					const field = issue.path[0]?.toString();
					if (field) {
						errors[field] = issue.message;
					}
				});
				return fail(400, { errors });
			}

			return fail(500, {
				errors: { general: err instanceof Error ? err.message : 'Failed to create rental' }
			});
		}
	}
};