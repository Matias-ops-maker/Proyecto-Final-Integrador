import { Cart, CartItem, Product, Category, Brand } from '../models/index.js';

export const CartService = {
  async getCart(userId) {
    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: {
        model: CartItem,
        include: {
          model: Product,
          include: [
            { model: Category, attributes: ['id', 'nombre'] },
            { model: Brand, attributes: ['id', 'nombre'] }
          ]
        }
      }
    });

    if (!cart) {
      const newCart = await Cart.create({ user_id: userId });
      return { id: newCart.id, user_id: newCart.user_id, CartItems: [], total: 0, totalItems: 0 };
    }

    let total = 0, totalItems = 0;
    if (cart.CartItems) {
      cart.CartItems.forEach(item => {
        total += item.cantidad * item.Product.precio;
        totalItems += item.cantidad;
      });
    }

    return { ...cart.toJSON(), total, totalItems };
  },

  async addItem(userId, product_id, cantidad) {
    const product = await Product.findByPk(product_id);
    if (!product) {
      const err = new Error('PRODUCT_NOT_FOUND');
      err.code = 'PRODUCT_NOT_FOUND';
      throw err;
    }
    if (product.stock < cantidad) {
      const err = new Error('INSUFFICIENT_STOCK');
      err.code = 'INSUFFICIENT_STOCK';
      throw err;
    }

    let cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) cart = await Cart.create({ user_id: userId });

    let cartItem = await CartItem.findOne({ where: { cart_id: cart.id, product_id } });
    if (cartItem) {
      const newQuantity = cartItem.cantidad + cantidad;
      if (product.stock < newQuantity) {
        const err = new Error('INSUFFICIENT_STOCK');
        err.code = 'INSUFFICIENT_STOCK';
        throw err;
      }
      cartItem.cantidad = newQuantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({ cart_id: cart.id, product_id, cantidad });
    }

    cart.actualizado_en = new Date();
    await cart.save();

    return await CartItem.findByPk(cartItem.id, {
      include: {
        model: Product,
        include: [
          { model: Category, attributes: ['id', 'nombre'] },
          { model: Brand, attributes: ['id', 'nombre'] }
        ]
      }
    });
  },

  async updateItem(cartItemId, userId, cantidad) {
    const cartItem = await CartItem.findByPk(cartItemId, {
      include: [
        { model: Product },
        { model: Cart, where: { user_id: userId } }
      ]
    });

    if (!cartItem) return null;
    if (cartItem.Product.stock < cantidad) {
      const err = new Error('INSUFFICIENT_STOCK');
      err.code = 'INSUFFICIENT_STOCK';
      throw err;
    }

    cartItem.cantidad = cantidad;
    await cartItem.save();
    cartItem.Cart.actualizado_en = new Date();
    await cartItem.Cart.save();

    return await CartItem.findByPk(cartItem.id, {
      include: {
        model: Product,
        include: [
          { model: Category, attributes: ['id', 'nombre'] },
          { model: Brand, attributes: ['id', 'nombre'] }
        ]
      }
    });
  },

  async removeItem(cartItemId, userId) {
    const cartItem = await CartItem.findByPk(cartItemId, {
      include: { model: Cart, where: { user_id: userId } }
    });

    if (!cartItem) return false;
    await cartItem.destroy();
    cartItem.Cart.actualizado_en = new Date();
    await cartItem.Cart.save();
    return true;
  },

  async clear(userId) {
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) return false;
    await CartItem.destroy({ where: { cart_id: cart.id } });
    cart.actualizado_en = new Date();
    await cart.save();
    return true;
  }
};

export default CartService;
