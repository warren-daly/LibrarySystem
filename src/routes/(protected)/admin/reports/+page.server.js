import { bookService } from '$lib/server/services/books-service.js';
import { usersDataAccess } from '$lib/server/data-access/users-data-access.js';
import { db } from '$lib/server/db';
import { rental, order } from '$lib/server/db/schema';
import { eq, and, gte } from 'drizzle-orm';

export const load = async ({ locals }) => {
	const books = await bookService.getAllBooks();
	const users = await usersDataAccess.findAll();
	
	const allRentals = await db.query.rental.findMany({
		with: {
			book: true,
			user: true
		}
	});

	const rentedRentals = allRentals.filter(r => r.status === 'rented');
	const lateRentals = allRentals.filter(r => r.status === 'late');
	const returnedRentals = allRentals.filter(r => r.status === 'returned');

	const allOrders = await db.query.order.findMany({
		where: eq(order.status, 'completed')
	});

	const totalOrderRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);

	const allLateFees = allRentals.filter(r => r.lateReturned === true);
	const lateFeeRevenue = allLateFees.length * 500;
	const totalRevenue = totalOrderRevenue + lateFeeRevenue;
	
	const monthlyRevenue = await db.query.order.findMany({
		where: and(
			eq(order.status, 'completed'),
			gte(order.createdAt, new Date(new Date().setMonth(new Date().getMonth() - 1)))
		)
	});

	const currentMonthRevenue = monthlyRevenue.reduce((sum, o) => sum + o.total, 0);

	return {
		user: locals.user,
		totalUsers: users?.length ?? 0,
		totalBooks: books?.length ?? 0,
		totalRentals: allRentals?.length ?? 0,
		rentedCount: rentedRentals?.length ?? 0,
		lateCount: lateRentals?.length ?? 0,
		returnedCount: returnedRentals?.length ?? 0,
		totalRevenue,
		currentMonthRevenue,
		totalOrders: allOrders?.length ?? 0,
		recentMembers: users?.slice(0, 5) ?? []
	};
};