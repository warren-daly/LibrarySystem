import { ordersDataAccess } from '../data-access/orders-data-access.js';
import { cartDataAccess } from '../data-access/cart-data-access.js';
import { NotFoundError } from '../utils/errors.js';

export const ordersService = {

  async getOrderWithDetails(id) {
    const order = await ordersDataAccess.findByIdWithDetails(id);
    if (!order) throw new NotFoundError('Order not found');
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

    const rentalItems = items.filter(i => i.type === 'rent');
    const purchaseItems = items.filter(i => i.type === 'buy');

    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 14);

    let lastOrderId = null;

    // Create rental order if there are rentals
    if (rentalItems.length > 0) {
      const rentalOrderData = {
        userId,
        status: 'rented',
        rentalDate: new Date(),
        returnDate: returnDate,
        total: rentalItems.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0)
      };
      const rentalOrder = await ordersDataAccess.createOrder(rentalOrderData, rentalItems);
      lastOrderId = rentalOrder.id;
    }

    // Create purchase order if there are purchases
    if (purchaseItems.length > 0) {
      const purchaseOrderData = {
        userId,
        status: 'completed',
        rentalDate: null,
        returnDate: null,
        total: purchaseItems.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0)
      };
      const purchaseOrder = await ordersDataAccess.createOrder(purchaseOrderData, purchaseItems);
      lastOrderId = purchaseOrder.id;
    }

    await cartDataAccess.clearCart(cart.id);

    return { id: lastOrderId };
  }
};