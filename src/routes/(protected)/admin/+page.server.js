import { bookService } from '$lib/server/services/books-service.js';
import { usersDataAccess } from '$lib/server/data-access/users-data-access.js';
import { db } from '$lib/server/db';
import { rental } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	const books = await bookService.getAllBooks();
	const users = await usersDataAccess.findAll();
	
	const allRentals = await db.query.rental.findMany();
	const rentedBooks = await db.query.rental.findMany({
		where: eq(rental.status, 'rented')
	});
	const lateRentals = await db.query.rental.findMany({
		where: eq(rental.status, 'late')
	});

	return {
		user: locals.user,
		totalUsers: users?.length ?? 0,
		totalBooks: books?.length ?? 0,
		totalRentals: allRentals?.length ?? 0,
		rentedCount: rentedBooks?.length ?? 0,
		lateCount: lateRentals?.length ?? 0,
		recentMembers: users?.slice(0, 5) ?? []
	};
};