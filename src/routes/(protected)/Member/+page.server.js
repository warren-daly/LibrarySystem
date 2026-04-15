import { bookService } from '$lib/server/services/books-service.js';
import { rentalService } from '$lib/server/services/rental-service.js';

export const load = async ({ locals }) => {
	const books = await bookService.getAllBooks();
	const rentals = await rentalService.getAllrentals();

	const memberRentals = rentals.filter((r) => Number(r.userId) === Number(locals.user.id));
	const activeRentals = memberRentals.filter((r) => r.status === 'rented');
	const lateRentals = memberRentals.filter((r) => r.status === 'late');

	return {
		user: locals.user,
		totalBooks: books?.length ?? 0,
		totalRentals: memberRentals?.length ?? 0,
		activeRentals: activeRentals?.length ?? 0,
		lateRentals: lateRentals?.length ?? 0,
		recentRentals: memberRentals?.slice(0, 5) ?? []
	};
};