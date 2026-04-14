import { rentalDataAccess } from '$lib/server/data-access/rental-data-access.js';
import { insertRentalSchema, idSchema } from '$lib/server/db/validation.js';

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
		const validatedId = idSchema.parse({ id });
		const existingRental = await rentalDataAccess.findById(validatedId.id);

		if (!existingRental) {
			throw new Error('Rental not found');
		}

		if (existingRental.status === 'rented' && new Date() > existingRental.returnDate) {
			await rentalDataAccess.update(validatedId.id, { status: 'late' });
			existingRental.status = 'late';
		}

		if (rentalData.status === 'cancelled' && existingRental.status !== 'rented') {
			throw new Error('Only rentals with status "rented" can be cancelled');
		}

		const validated = updateRentalSchema.parse(rentalData);
		return await rentalDataAccess.update(validatedId.id, validated);
	},

	async deleteRental(id) {
		const validated = deleteRentalSchema.parse({ id });
		const deleted = await rentalDataAccess.delete(validated.id);

		if (!deleted) {
			throw new Error('Rental not found to delete');
		}

		return deleted;
	}
};