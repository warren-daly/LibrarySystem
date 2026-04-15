import { cartDataAccess } from '../data-access/cart-data-access.js';

export const cartService = {

  async getOrCreateCart(userId) {
    return cartDataAccess.getOrCreateCart(userId);
  },

  async addItem(userId, bookId, quantity = 1, type = 'buy') {
    console.log(`cartService.addItem called with: userId=${userId}, bookId=${bookId}, quantity=${quantity}, type=${type}`);
    
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error('Invalid quantity');
    }
    if (!['rent', 'buy'].includes(type)) {
      throw new Error('Invalid type');
    }
    const cart = await cartDataAccess.getOrCreateCart(userId);
    
    console.log(`Calling cartDataAccess.addItem with: cartId=${cart.id}, bookId=${bookId}, quantity=${quantity}, type=${type}`);
    return cartDataAccess.addItem(cart.id, bookId, quantity, type);
  },

  async getItems(cartId) {
    return cartDataAccess.getCartItems(cartId);
  },

  async updateItemQuantity(cartItemId, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error('Invalid quantity');
    }
    return cartDataAccess.updateItemQuantity(cartItemId, quantity);
  },

  async removeItem(cartItemId) {
    return cartDataAccess.removeItem(cartItemId);
  },

  async clearCart(cartId) {
    return cartDataAccess.clearCart(cartId);
  }
};