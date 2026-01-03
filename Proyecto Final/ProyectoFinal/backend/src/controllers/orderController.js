import OrderService from '../services/orderService.js';
import { ApiResponse } from '../helpers/apiHelpers.js';
import { Order, OrderItem, Product, sequelize } from '../models/index.js';

const VALID_ORDER_STATES = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];

export async function placeOrder(req, res) {
  try {
    const { shipping_address, payment_method } = req.body;
    const order = await OrderService.create(req.user.id, shipping_address, payment_method);
    res.status(201).json({ msg: 'Orden creada exitosamente', order });
  } catch (error) {
    if (error.code === 'EMPTY_CART') return res.status(400).json(ApiResponse.error('Carrito vacío', 'EMPTY_CART', 400));
    if (error.code === 'INSUFFICIENT_STOCK') return res.status(400).json(ApiResponse.error(`Stock insuficiente para ${error.details}`, 'INSUFFICIENT_STOCK', 400));
    console.error('❌ Error en placeOrder:', error);
    res.status(500).json(ApiResponse.error('Error interno del servidor'));
  }
}

export async function listOrders(req, res) {
  try {
    const { page = 1, pageSize = 20, estado, userId, dateFrom, dateTo } = req.query;
    const filters = { ...(estado && { estado }), ...(userId && { userId }), ...(dateFrom && { dateFrom }), ...(dateTo && { dateTo }) };
    const { rows, count } = await OrderService.list(req.user.id, req.user.rol, page, pageSize, filters);
    res.json(ApiResponse.paginated(rows, count, page, pageSize));
  } catch (error) {
    console.error('❌ Error en listOrders:', error);
    res.status(500).json(ApiResponse.error('Error interno del servidor'));
  }
}

export async function getOrder(req, res) {
  try {
    const order = await OrderService.getById(req.params.id, req.user.id, req.user.rol);
    if (!order) return res.status(404).json(ApiResponse.error('Orden no encontrada', null, 404));
    if (req.user.rol !== 'admin' && order.user_id !== req.user.id) return res.status(403).json(ApiResponse.error('No autorizado', null, 403));
    res.json(order);
  } catch (error) {
    console.error('❌ Error en getOrder:', error);
    res.status(500).json(ApiResponse.error('Error interno del servidor'));
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { estado } = req.body;
    if (!estado || !VALID_ORDER_STATES.includes(estado)) return res.status(400).json(ApiResponse.error('Estado inválido', null, 400));
    if (req.user.rol !== 'admin') return res.status(403).json(ApiResponse.error('No autorizado', null, 403));

    const order = await OrderService.updateStatus(req.params.id, estado);
    if (!order) return res.status(404).json(ApiResponse.error('Orden no encontrada', null, 404));

    if (estado === 'cancelado') {
      const items = await OrderItem.findAll({ where: { order_id: order.id }, include: Product });
      for (const item of items) {
        item.Product.stock += item.cantidad;
        await item.Product.save();
      }
    }

    res.json({ msg: 'Estado de orden actualizado', order });
  } catch (error) {
    console.error('❌ Error en updateOrderStatus:', error);
    res.status(500).json(ApiResponse.error('Error interno del servidor'));
  }
}

export async function getOrderStats(req, res) {
  try {
    if (req.user.rol !== 'admin') return res.status(403).json(ApiResponse.error('No autorizado', null, 403));

    const stats = await Order.findAll({
      attributes: [
        'estado',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('total')), 'total']
      ],
      group: ['estado']
    });

    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum('total');

    res.json({
      byStatus: stats,
      totalOrders,
      totalRevenue: totalRevenue || 0
    });
  } catch (error) {
    console.error('❌ Error en getOrderStats:', error);
    res.status(500).json(ApiResponse.error('Error interno del servidor'));
  }
}
