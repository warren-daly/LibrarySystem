import { usersService } from '$lib/server/services/users-service.js';
import { cartService } from '$lib/server/services/cart-service.js';

export async function load({ locals }) {
  if (!locals.user) {
    return {
      user: null,
      cartCount: 0
    };
  }

  try {
    const fullUser = await usersService.getById(Number(locals.user.id));
    const cart = await cartService.getOrCreateCart(locals.user.id);
    const items = await cartService.getItems(cart.id);

    return {
      user: fullUser,
      cartCount: items.length
    };
  } catch (err) {
    console.error('Layout load error:', err);
    return {
      user: locals.user,
      cartCount: 0
    };
  }
}