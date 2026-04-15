import { cartService } from '$lib/server/services/cart-service.js';
import { ordersService } from '$lib/server/services/orders-service.js';
import { redirect, error } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe.js'; 
import { ORIGIN } from '$env/static/private'; 

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
  if (!locals.user) throw error(401, 'Not authenticated');

  const cart = await cartService.getOrCreateCart(locals.user.id);
  const items = await cartService.getItems(cart.id);

  if (!items.length) throw error(400, 'Cart is empty');

  const rentals = items.filter(i => i.type === 'rent');
  const purchases = items.filter(i => i.type === 'buy');

  const order = await ordersService.createOrderFromCart(locals.user);

  if (purchases.length === 0) {
    await cartService.clearCart(cart.id);
    throw redirect(303, `/checkout/${order.id}/confirmation`);
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',                    
    payment_method_types: ['card'],
    customer_email: locals.user.email,
    metadata: {
      orderId: order.id.toString()
    },
    line_items: purchases.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.title },
        unit_amount: item.unitPrice
      },
      quantity: item.quantity
    })),
    success_url: `${ORIGIN}/checkout/${order.id}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${ORIGIN}/cart`
  });

  throw redirect(303, session.url);
}
};