import { cartService } from '$lib/server/services/cart-service.js';
import { redirect, error } from '@sveltejs/kit';

export const actions = {
  addToCart: async ({ locals, request }) => {
    if (!locals.user) {
      throw redirect(303, '/auth/login');
    }

    const data = await request.formData();
    const productId = Number(data.get('productId'));

    if (!productId) throw error(400, 'Invalid product');

    await cartService.addItem(locals.user.id, productId, 1);

    return { success: true };
  }
};