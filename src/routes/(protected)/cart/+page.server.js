import { cartService } from '$lib/server/services/cart-service.js';
import { ordersDataAccess } from '$lib/server/data-access/orders-data-access.js';
import { redirect, error } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe.js'; 
import { ORIGIN } from '$env/static/private'; 

export async function load({ locals }) {
  if (!locals.user) throw error(401, 'Not authenticated');

  const cart = await cartService.getOrCreateCart(locals.user.id);
  const items = await cartService.getItems(cart.id);

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

  // If only rentals (no purchases), create order immediately
  if (purchases.length === 0) {
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 14);
    
    const rentalOrderData = {
      userId: locals.user.id,
      status: 'paid',
      rentalDate: new Date(),
      returnDate: returnDate,
      total: rentals.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0)
    };
    
    const order = await ordersDataAccess.createOrder(rentalOrderData, rentals);
    await cartService.clearCart(cart.id);
    throw redirect(303, `/checkout/${order.id}/confirmation`);
  }

  // Create purchase order (with stock reduction)
  const purchaseOrderData = {
    userId: locals.user.id,
    status: 'pending',
    rentalDate: null,
    returnDate: null,
    total: purchases.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0)
  };
  
  const order = await ordersDataAccess.createOrder(purchaseOrderData, purchases);

  // Create Stripe session with the order ID
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
    cancel_url: `${ORIGIN}/cart?cancelled=true`
  });

  throw redirect(303, session.url);
}
};