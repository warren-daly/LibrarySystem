import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { order } from '$lib/server/db/schema';
import { bookService } from '$lib/server/services/books-service.js';
import { usersDataAccess } from '$lib/server/data-access/users-data-access.js';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	if (locals.user.role !== "ADMIN") {
		throw redirect(302, '/users');
	}

	const books = await bookService.getAllBooks();
	const users = await usersDataAccess.findAll();
	
	// Get total orders (both rentals and purchases are now in one table)
	const orders = await db.select().from(order);
	const rentalOrders = orders.filter(o => o.status === 'rented');
	const purchaseOrders = orders.filter(o => o.status === 'completed');

	return {
		user: locals.user,
		totalUsers: users?.length ?? 0,
		totalBooks: books?.length ?? 0,
		totalRentals: rentalOrders?.length ?? 0,
		totalPurchases: purchaseOrders?.length ?? 0,
		recentUsers: users?.slice(0, 5) ?? []
	};
};