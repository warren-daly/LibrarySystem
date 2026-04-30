import { rentalService } from '$lib/server/services/rental-service.js';
import { bookService } from '$lib/server/services/books-service.js';
import { db } from '$lib/server/db';
import { review, book } from '$lib/server/db/schema';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { ZodError } from 'zod';
import { sendRentalConfirmationEmail, sendReturnConfirmationEmail, sendLateReturnEmail } from '$lib/server/email/email-service.js';

export async function load({ url, locals }) {
	try {
		const rentals = await rentalService.getAllrentals();
		const books = await bookService.getAllBooks();
		const selectedBookId = url.searchParams.get('bookId');

		const memberRentals = locals.user
			? rentals.filter((r) => Number(r.userId) === Number(locals.user.id))
			: [];

		const rentalsWithReviewStatus = await Promise.all(
			memberRentals.map(async (r) => {
				const existingReview = await db.query.review.findFirst({
					where: and(eq(review.bookId, r.bookId), eq(review.userId, locals.user.id))
				});

				return {
					...r,
					hasReview: !!existingReview,
					rating: existingReview?.rating || null
				};
			})
		);

		return {
			rentals: rentalsWithReviewStatus,
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
	startRental: async ({ locals, request }) => {
		if (!locals.user) throw error(401, 'Not authenticated');
		const data = await request.formData();
		const bookId = Number(data.get('bookId'));
		throw redirect(303, `/member/rentals?bookId=${bookId}`);
	},

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

			const allRentals = await rentalService.getAllrentals();

			const hasLateRental = allRentals.some(
				(r) => Number(r.userId) === Number(locals.user.id) && r.status === 'late'
			);

			if (hasLateRental) {
				return fail(400, {
					errors: {
						general: 'You have late rental fees to pay before renting another book.'
					}
				});
			}

			const alreadyRentedThisBook = allRentals.some(
				(r) =>
					Number(r.userId) === Number(locals.user.id) &&
					Number(r.bookId) === Number(bookId) &&
					(r.status === 'rented' || r.status === 'late')
			);

			if (alreadyRentedThisBook) {
				return fail(400, {
					errors: {
						general: 'You already have an active rental of this book.'
					}
				});
			}

			const selectedBook = await db.query.book.findFirst({
				where: eq(book.id, bookId)
			});

			if (!selectedBook || selectedBook.stock <= 0) {
				return fail(400, {
					errors: { general: 'This book is out of stock.' }
				});
			}

			const rentalData = {
				userId: Number(locals.user.id),
				bookId,
				returnDate: new Date(Date.now() + rentalDays * 24 * 60 * 60 * 1000),
				status: 'rented'
			};

			await rentalService.createRental(rentalData);

			await db
				.update(book)
				.set({ stock: selectedBook.stock - 1 })
				.where(eq(book.id, bookId));

			sendRentalConfirmationEmail({
				to: locals.user.email,
				bookTitle: selectedBook.title,
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
					if (field) errors[field] = issue.message;
				});
				return fail(400, { errors });
			}

			return fail(500, {
				errors: { general: err instanceof Error ? err.message : 'Failed to create rental' }
			});
		}
	},

	returnRental: async ({ request, locals }) => {
		try {
			const formData = await request.formData();
			const id = Number(formData.get('rentalId'));

			const existingRental = await rentalService.getRentalById(id);

			if (!existingRental) {
				return fail(404, {
					errors: { general: 'Rental not found' }
				});
			}

			if (Number(existingRental.userId) !== Number(locals.user?.id)) {
				return fail(403, {
					errors: { general: 'Not allowed' }
				});
			}

			if (existingRental.status === 'returned' || existingRental.status === 'cancelled') {
				return fail(400, {
					errors: { general: 'This rental cannot be returned' }
				});
			}

			const isLate = new Date() > new Date(existingRental.returnDate);

			if (isLate) {
				await rentalService.updateRental(id, {
					bookId: existingRental.bookId,
					returnDate: existingRental.returnDate,
					status: 'late'
				});

				const lateBook = await db.query.book.findFirst({
						where: eq(book.id, existingRental.bookId)
					});

				sendLateReturnEmail({
					to: locals.user.email,
					bookTitle: lateBook?.title ?? `Book ID ${existingRental.bookId}`,
					returnDate: existingRental.returnDate
				}).catch((err) => {
					console.error('Late return email failed:', err);
				});

				throw redirect(303, `/member/late-fee/${id}`);
			}

			await rentalService.updateRental(id, {
				bookId: existingRental.bookId,
				returnDate: existingRental.returnDate,
				status: 'returned'
			});

			const returnedBook = await db.query.book.findFirst({
				where: eq(book.id, existingRental.bookId)
			});

			if (returnedBook) {
				await db
					.update(book)
					.set({ stock: returnedBook.stock + 1 })
					.where(eq(book.id, existingRental.bookId));
			}

			sendReturnConfirmationEmail({
				to: locals.user.email,
				bookTitle: returnedBook?.title ?? `Book ID ${existingRental.bookId}`
			}).catch((err) => {
				console.error('Return confirmation email failed:', err);
			});

			return { success: true };
			} catch (err) {
				if (err?.status === 303) {
					throw err;
				}

			console.error('Error returning rental:', err);

			if (err instanceof ZodError) {
				const errors = {};
				err.issues.forEach((issue) => {
					const field = issue.path[0]?.toString();
					if (field) errors[field] = issue.message;
				});
				return fail(400, { errors });
			}

			return fail(500, {
				errors: { general: err instanceof Error ? err.message : 'Failed to return rental' }
			});
		}
	},

	LeaveReview: async ({ request, locals }) => {
		try {
			const data = await request.formData();
			const bookId = Number(data.get('bookId'));
			const rating = Number(data.get('rating'));
			const reviewText = data.get('reviewText') || null;
			const userId = locals.user.id;

			if (!bookId || !rating) {
				return fail(400, { error: 'Book and rating are required' });
			}

			if (rating < 1 || rating > 5) {
				return fail(400, { error: 'Rating must be between 1 and 5' });
			}

			const existingReview = await db.query.review.findFirst({
				where: and(eq(review.bookId, bookId), eq(review.userId, userId))
			});

			if (existingReview) {
				return fail(400, { error: 'You have already reviewed this book' });
			}

			await db.insert(review).values({
				bookId,
				userId,
				rating,
				reviewText
			});

			return { success: true, message: 'Review submitted successfully!' };
		} catch (error) {
			console.error('Error creating review:', error);
			return fail(500, { error: 'Failed to submit review' });
		}
	}
};