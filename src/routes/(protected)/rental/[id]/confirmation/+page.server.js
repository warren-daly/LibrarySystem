import { error } from '@sveltejs/kit';
import { ordersDataAccess } from '$lib/server/data-access/orders-data-access.js';

export async function load({ params, locals }) {
  if (!locals.user) throw error(401, 'Not authenticated');

  const rentalId = Number(params.id);
  const userId = Number(locals.user.id);

  if (!Number.isInteger(rentalId) || rentalId < 1) {
    throw error(400, 'Invalid rental');
  }

  const order = await ordersDataAccess.findByIdWithDetails(rentalId);

  if (!order || order.userId !== userId) {
    throw error(404, 'Rental not found');
  }

  return { order };
}