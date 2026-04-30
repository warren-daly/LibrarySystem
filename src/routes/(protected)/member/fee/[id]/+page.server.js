import { error, redirect } from '@sveltejs/kit';
import { rentalService } from '$lib/server/services/rental-service.js';
import { stripe } from '$lib/server/stripe.js';
import { ORIGIN } from '$env/static/private';

export async function load({ params, locals, url }) {
	if (!locals.user) throw redirect(302, '/auth/login');

	const rentalId = Number(params.id);

	if (!Number.isInteger(rentalId) || rentalId < 1) {
		throw error(400, 'Invalid rental id');
	}

	const rentalRecord = await rentalService.getRentalById(rentalId);

	if (!rentalRecord) throw error(404, 'Rental not found');

	if (Number(rentalRecord.userId) !== Number(locals.user.id)) {
		throw error(403, 'Not allowed');
	}

	const success = url.searchParams.get('success');
	const sessionId = url.searchParams.get('session_id');

	if (success === '1' && sessionId && rentalRecord.status === 'late') {
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (
			session.payment_status === 'paid' &&
			session.metadata?.type === 'late_fee' &&
			Number(session.metadata?.rentalId) === rentalId
		) {
			await rentalService.markLateFeePaid(rentalId);
			throw redirect(303, '/member/rentals?payment=success');
		}

		throw redirect(303, '/member/rentals?payment=failed');
	}

	return {
		rental: rentalRecord,
		feeEuro: 5
	};
}

export const actions = {
	payLateFee: async ({ params, locals }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const rentalId = Number(params.id);

		if (!Number.isInteger(rentalId) || rentalId < 1) {
			throw error(400, 'Invalid rental id');
		}

		const rentalRecord = await rentalService.getRentalById(rentalId);

		if (!rentalRecord) throw error(404, 'Rental not found');

		if (Number(rentalRecord.userId) !== Number(locals.user.id)) {
			throw error(403, 'Not allowed');
		}

		if (rentalRecord.status !== 'late') {
			throw redirect(303, '/member/rentals');
		}

		const session = await stripe.checkout.sessions.create({
			mode: 'payment',
			payment_method_types: ['card'],
			customer_email: locals.user.email,
			metadata: {
				type: 'late_fee',
				rentalId: rentalId.toString()
			},
			line_items: [
				{
					price_data: {
						currency: 'eur',
						product_data: {
							name: `Late fee for ${rentalRecord.book?.title ?? `Book #${rentalRecord.bookId}`}`
						},
						unit_amount: 500
					},
					quantity: 1
				}
			],
			success_url: `${ORIGIN}/member/fee/${rentalId}?success=1&session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${ORIGIN}/member/fee/${rentalId}`
		});

		throw redirect(303, session.url);
	}
};