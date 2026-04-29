import { rentalService } from '$lib/server/services/rental-service.js';
import { db } from '$lib/server/db';
import { rental, book, user } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export async function load() {
	const allRentals = await db.query.rental.findMany({
		with: {
			book: true,
			user: true
		},
		orderBy: [desc(rental.id)]
	});
	
	return {
		rentals: allRentals
	};
}

export const actions = {
	returnRental: async ({ request }) => {
		const formData = await request.formData();
		const rentalId = formData.get('rentalId');
		return rentalService.handleReturnRental(rentalId);
	}
};