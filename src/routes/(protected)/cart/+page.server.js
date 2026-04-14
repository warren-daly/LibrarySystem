import { cartService } from '$lib/server/services/cart-service.js';
import { ordersService } from '$lib/server/services/orders-service.js';
import { redirect, error } from '@sveltejs/kit';

export async function load({ locals }) {
  if (!locals.user) throw error(401, 'Not authenticated');

  const cart = await cartService.getOrCreateCart(locals.user.id);
  const items = await cartService.getItems(cart.id);

  // Log the items with their types
  console.log('=== CART ITEMS ===');
  items.forEach(item => {
    console.log(`Book: ${item.title}, Type: ${item.type}, Quantity: ${item.quantity}`);
  });
  console.log('==================');

  const total = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return { cart, items, total };
}

export const actions = {
  updateQuantity: async ({ locals, request }) => {
    if (!locals.user) throw error(401);

    const data = await request.formData();
    const cartItemId = Number(data.get('cartItemId'));
    const quantity = Number(data.get('quantity'));

    if (!Number.isInteger(cartItemId) || cartItemId < 1) {
      throw error(400, 'Invalid cart item');
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw error(400, 'Invalid quantity');
    }

    await cartService.updateItemQuantity(cartItemId, quantity);
  },

  removeItem: async ({ locals, request }) => {
    if (!locals.user) throw error(401);

    const data = await request.formData();
    const cartItemId = Number(data.get('cartItemId'));

    await cartService.removeItem(cartItemId);
  },

  checkout: async ({ locals }) => {
  if (!locals.user) throw error(401);

  try {
    console.log('=== CHECKOUT START ===');
    const result = await ordersService.createOrderFromCart(locals.user);
    
    console.log('Order created:', result);
    
    if (!result || !result.id) {
      console.error('No order ID returned');
      throw error(500, 'Failed to create order');
    }

    console.log('Redirecting to /checkout/' + result.id + '/confirmation');
    throw redirect(303, `/checkout/${result.id}/confirmation`);
  } catch (err) {
    console.error('Checkout error:', err);
    throw err;
  }
}
};