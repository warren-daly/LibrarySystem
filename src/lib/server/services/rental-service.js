import { rentalDataAccess } from '$lib/server/data-access/rental-data-access.js';
import { insertRentalSchema, idSchema } from '$lib/server/db/validation.js';
import { db } from '$lib/server/db';
import { book } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

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

	async markLateFeePaid(id) {
		const validated = idSchema.parse({ id });

		const existingRental = await rentalDataAccess.findById(validated.id);

		if (!existingRental) {
			throw new Error('Rental not found');
		}

		const updated = await rentalDataAccess.update(validated.id, {
			bookId: existingRental.bookId,
			returnDate: existingRental.returnDate,
			status: 'returned'
		});

		if (!updated) {
			throw new Error('Rental not found');
		}

		const returnedBook = await db.query.book.findFirst({
			where: eq(book.id, existingRental.bookId)
		});

		if (returnedBook) {
			await db
				.update(book)
				.set({ stock: returnedBook.stock + 1 })
				.where(eq(book.id, existingRental.bookId));
		}

		return updated;
	}
};