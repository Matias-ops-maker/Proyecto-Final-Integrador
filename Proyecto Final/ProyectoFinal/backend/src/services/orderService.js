import { Order, OrderItem, Cart, CartItem, Product, User, Category, Brand, Payment } from '../models/index.js';
import { sequelize } from '../models/index.js';
import { Op } from 'sequelize';

export const OrderService = {
  async create(userId, shipping_address, payment_method = 'tarjeta') {
    const t = await sequelize.transaction();
    try {
      const cart = await Cart.findOne({
        where: { user_id: userId },
        include: { model: CartItem, include: Product }
      });

      if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
        const err = new Error('EMPTY_CART');
        err.code = 'EMPTY_CART';
        throw err;
      }

      for (const item of cart.CartItems) {
        if (item.Product.stock < item.cantidad) {
          const err = new Error('INSUFFICIENT_STOCK');
          err.code = 'INSUFFICIENT_STOCK';
          err.details = `${item.Product.nombre}. Stock disponible: ${item.Product.stock}`;
          throw err;
        }
      }

      const total = cart.CartItems.reduce((sum, item) => sum + (parseFloat(item.Product.precio) * item.cantidad), 0);

      const order = await Order.create(
        { user_id: userId, total: total.toFixed(2), estado: 'pendiente' },
        { transaction: t }
      );

      for (const item of cart.CartItems) {
        await OrderItem.create(
          { order_id: order.id, product_id: item.product_id, cantidad: item.cantidad, precio_unitario: item.Product.precio },
          { transaction: t }
        );
        item.Product.stock -= item.cantidad;
        await item.Product.save({ transaction: t });
      }

      await Payment.create(
        { order_id: order.id, medio: payment_method, status: 'pendiente' },
        { transaction: t }
      );

      await CartItem.destroy({ where: { cart_id: cart.id }, transaction: t });
      await t.commit();

      return await Order.findByPk(order.id, {
        include: [
          { model: OrderItem, include: { model: Product, attributes: ['id', 'sku', 'nombre', 'precio'] } },
          { model: Payment }
        ]
      });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  async list(userId, userRole, page = 1, pageSize = 20, filters = {}) {
    const offset = (page - 1) * pageSize;
    const where = {};

    if (userRole === 'admin') {
      if (filters.userId) where.user_id = filters.userId;
    } else {
      where.user_id = userId;
    }

    if (filters.estado) where.estado = filters.estado;
    if (filters.dateFrom) where.creado_en = { ...where.creado_en, [Op.gte]: new Date(filters.dateFrom) };
    if (filters.dateTo) where.creado_en = { ...where.creado_en, [Op.lte]: new Date(filters.dateTo) };

    return await Order.findAndCountAll({
      where,
      include: [
        { model: User, attributes: ['id', 'nombre', 'email'] },
        { model: OrderItem, include: { model: Product, attributes: ['id', 'sku', 'nombre'] } },
        { model: Payment, attributes: ['medio', 'status'] }
      ],
      order: [['creado_en', 'DESC']],
      offset: parseInt(offset),
      limit: parseInt(pageSize)
    });
  },

  async getById(orderId, userId, userRole) {
    const where = { id: orderId };
    if (userRole !== 'admin') where.user_id = userId;

    return await Order.findOne({
      where,
      include: [
        { model: User, attributes: ['id', 'nombre', 'email', 'telefono'] },
        { model: OrderItem, include: { model: Product } },
        { model: Payment }
      ]
    });
  },

  async updateStatus(orderId, newStatus) {
    const order = await Order.findByPk(orderId);
    if (!order) return null;
    await order.update({ estado: newStatus });
    return order;
  }
};

export default OrderService;
