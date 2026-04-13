import { redirect } from '@sveltejs/kit';
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

	return {
		user: locals.user,
		totalUsers: users?.length ?? 0,
		totalBooks: books?.length ?? 0,
		totalRentals: 0,
		recentUsers: users?.slice(0, 5) ?? []
	};
};