import { eq, desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { rental } from '$lib/server/db/schema.js';

export const rentalDataAccess = {
	async findById(id) {
		return await db.query.rental.findFirst({
			where: eq(rental.id, id),
			with: {
				book: true,
				user: true
			}
		});
	},

	async findAll() {
		return await db.query.rental.findMany({
			with: {
				book: true,
				user: true
			},
			orderBy: [desc(rental.id)]
		});
	}
};