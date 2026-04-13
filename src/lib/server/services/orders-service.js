import { ordersDataAccess } from '../data-access/orders-data-access.js';
import { cartDataAccess } from '../data-access/cart-data-access.js';
import { NotFoundError } from '../utils/errors.js';

export const ordersService = {

  async getOrderWithDetails(id) {
    const order = await ordersDataAccess.findByIdWithDetails(id);
    if (!order) throw new NotFoundError('Rental not found');
    return order;
  },

  async createOrderFromCart(user) {
    const userId = Number(user.id);
    if (!Number.isInteger(userId) || userId < 1) {
      throw new Error('Invalid user ID');
    }

    const cart = await cartDataAccess.getOrCreateCart(userId);
    const items = await cartDataAccess.getCartItems(cart.id);

    if (!items.length) {
      throw new Error('Cart is empty');
    }

    const total = items.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0);

    // Set return date to 14 days from now
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 14);

    const orderData = {
      userId: userId,
      bookId: items[0].bookId,
      status: 'rented',
      total: total,
      returnDate: returnDate
    };

    const order = await ordersDataAccess.createFromCart(orderData, items);

    await cartDataAccess.clearCart(cart.id);

    return order;
  }
};