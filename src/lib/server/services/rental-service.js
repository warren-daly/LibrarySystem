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
	}
};