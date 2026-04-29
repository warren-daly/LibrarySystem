import { rentalDataAccess } from '$lib/server/data-access/rental-data-access.js';
import { insertRentalSchema, idSchema } from '$lib/server/db/validation.js';
import { db } from '$lib/server/db';
import { book } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';

export const rentalService = {
	async getRentalById(id) {
		const validated = idSchema.parse({ id });
		const existingRental = await rentalDataAccess.findById(validated.id);

		if (!existingRental) {
			throw new Error('Rental not found');
		}

		if (existingRental.status === 'rented' && new Date() > existingRental.returnDate) {
			return await rentalDataAccess.update(validated.id, { status: 'late' });
		}

		return existingRental;
	},

	async getAllrentals() {
		const rentals = await rentalDataAccess.findAll();

		for (const rental of rentals) {
			if (rental.status === 'rented' && new Date() > rental.returnDate) {
				await rentalDataAccess.update(rental.id, { status: 'late' });
				rental.status = 'late';
			}
		}

		return rentals;
	},

	async createRental(rentalData) {
		const validated = insertRentalSchema.parse(rentalData);
		return await rentalDataAccess.create(validated);
	},

	async updateRental(id, rentalData) {
		const validated = idSchema.parse({ id });
		const updated = await rentalDataAccess.update(validated.id, rentalData);
		
		if (!updated) {
			throw new Error('Rental not found');
		}
		
		return updated;
	},

	async handleReturnRental(rentalId, userId = null) {
		try {
			const id = Number(rentalId);
			const existingRental = await this.getRentalById(id);

			if (userId && Number(existingRental.userId) !== Number(userId)) {
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
				await this.updateRental(id, {
					bookId: existingRental.bookId,
					returnDate: existingRental.returnDate,
					status: 'late'
				});

				if (userId) {
					throw redirect(303, `/member/late-fee/${id}`);
				}
				return { success: true, late: true };
			}

			await this.updateRental(id, {
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

			return { success: true };
		} catch (err) {
			if (err?.status === 303) {
				throw err;
			}

			console.error('Error returning rental:', err);
			return fail(500, {
				errors: { general: err instanceof Error ? err.message : 'Failed to return rental' }
			});
		}
	}
};