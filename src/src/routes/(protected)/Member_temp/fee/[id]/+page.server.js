import { error, redirect } from '@sveltejs/kit';
import { rentalService } from '$lib/server/services/rental-service.js';
import { stripe } from '$lib/server/stripe.js';
import { ORIGIN } from '$env/static/private';

export async function load({ params, locals }) {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	const rentalId = Number(params.id);
	if (!Number.isInteger(rentalId) || rentalId < 1) {
		throw error(400, 'Invalid rental id');
	}

	const rental = await rentalService.getRentalById(rentalId);

	if (!rental) {
		throw error(404, 'Rental not found');
	}

	return {
		rental,
		feeEuro: 5
	};
}

export const actions = {
	payLateFee: async ({ params, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/auth/login');
		}

		const rentalId = Number(params.id);
		const rental = await rentalService.getRentalById(rentalId);

		if (!rental) {
			throw error(404, 'Rental not found');
		}

		const feeEuro = 5;
		const feeCents = feeEuro * 100;

		const session = await stripe.checkout.sessions.create({
			mode: 'payment',
			payment_method_types: ['card'],
			customer_email: locals.user.email,
			metadata: {
				rentalId: rental.id.toString(),
				type: 'late_fee'
			},
			line_items: [
				{
					price_data: {
						currency: 'eur',
						product_data: {
							name: `Late fee for ${rental.book?.title ?? `Book #${rental.bookId}`}`
						},
						unit_amount: feeCents
					},
					quantity: 1
				}
			],
			success_url: `${ORIGIN}/member/rentals`,
			cancel_url: `${ORIGIN}/member/rentals`
		});

		throw redirect(303, session.url);
	}
};