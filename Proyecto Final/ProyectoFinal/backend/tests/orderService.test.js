import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

let OrderService;
let Order, OrderItem, Cart, CartItem, Product, Payment, User;

beforeEach(async () => {
  await jest.unstable_mockModule('../src/models/index.js', () => ({
    Order: {
      create: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      count: jest.fn(),
      sum: jest.fn(),
    },
    OrderItem: {
      create: jest.fn(),
      findAll: jest.fn(),
      destroy: jest.fn(),
    },
    Cart: {
      findOne: jest.fn(),
    },
    CartItem: {
      destroy: jest.fn(),
    },
    Product: {
      findByPk: jest.fn(),
    },
    Payment: {
      create: jest.fn(),
    },
    User: {
      findByPk: jest.fn(),
    },
    Brand: {},
    Category: {},
    Fitment: {},
    Vehicle: {},
    AuditLog: {},
    Address: {},
    sequelize: {
      transaction: jest.fn(),
      fn: jest.fn(),
      col: jest.fn(),
    },
  }));

  const modelModule = await import('../src/models/index.js');
  Order = modelModule.Order;
  OrderItem = modelModule.OrderItem;
  Cart = modelModule.Cart;
  CartItem = modelModule.CartItem;
  Product = modelModule.Product;
  Payment = modelModule.Payment;
  User = modelModule.User;

  const serviceModule = await import('../src/services/orderService.js');
  OrderService = serviceModule.default;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('OrderService', () => {
  describe('create', () => {
    it('should create an order with cart items and deduct stock', async () => {
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };
      const { sequelize } = await import('../src/models/index.js');
      sequelize.transaction.mockResolvedValue(mockTransaction);

      const mockProduct = { id: 1, precio: 100, stock: 10, save: jest.fn() };
      const mockCart = {
        CartItems: [
          {
            product_id: 1,
            cantidad: 2,
            Product: mockProduct,
          },
        ],
      };

      Cart.findOne.mockResolvedValue(mockCart);
      Order.create.mockResolvedValue({ id: 1, total: 200, user_id: 1 });
      OrderItem.create.mockResolvedValue({});
      Payment.create.mockResolvedValue({});

      const order = await OrderService.create(1, '123 Street', 'tarjeta');

      expect(Order.create).toHaveBeenCalled();
      expect(OrderItem.create).toHaveBeenCalled();
      expect(Payment.create).toHaveBeenCalled();
      expect(mockProduct.save).toHaveBeenCalled();
    });

    it('should throw EMPTY_CART error if cart is empty', async () => {
      const mockTransaction = {
        rollback: jest.fn(),
      };
      const { sequelize } = await import('../src/models/index.js');
      sequelize.transaction.mockResolvedValue(mockTransaction);

      Cart.findOne.mockResolvedValue(null);

      try {
        await OrderService.create(1, '123 Street', 'tarjeta');
      } catch (error) {
        expect(error.code).toBe('EMPTY_CART');
      }
    });

    it('should throw INSUFFICIENT_STOCK error if product stock is insufficient', async () => {
      const mockTransaction = {
        rollback: jest.fn(),
      };
      const { sequelize } = await import('../src/models/index.js');
      sequelize.transaction.mockResolvedValue(mockTransaction);

      const mockCart = {
        CartItems: [
          {
            product_id: 1,
            cantidad: 20,
            Product: { id: 1, nombre: 'TestProduct', precio: 100, stock: 5 },
          },
        ],
      };

      Cart.findOne.mockResolvedValue(mockCart);

      try {
        await OrderService.create(1, '123 Street', 'tarjeta');
      } catch (error) {
        expect(error.code).toBe('INSUFFICIENT_STOCK');
      }
    });
  });

  describe('list', () => {
    it('should list orders with pagination', async () => {
      const mockOrders = [
        { id: 1, user_id: 1, estado: 'pendiente' },
        { id: 2, user_id: 1, estado: 'enviado' },
      ];

      Order.findAndCountAll.mockResolvedValue({ rows: mockOrders, count: 2 });

      const result = await OrderService.list(1, 'user', 1, 10, {});

      expect(result.rows).toEqual(mockOrders);
      expect(result.count).toBe(2);
    });

    it('should filter orders by estado', async () => {
      Order.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

      await OrderService.list(1, 'user', 1, 10, { estado: 'entregado' });

      expect(Order.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ estado: 'entregado' }),
        })
      );
    });
  });

  describe('getById', () => {
    it('should return order if user is authorized', async () => {
      const mockOrder = { id: 1, user_id: 1 };
      Order.findOne = jest.fn().mockResolvedValue(mockOrder);

      const result = await OrderService.getById(1, 1, 'user');

      expect(result).toEqual(mockOrder);
    });

    it('should return null if order not found', async () => {
      Order.findOne = jest.fn().mockResolvedValue(null);

      const result = await OrderService.getById(999, 1, 'user');

      expect(result).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const mockOrder = { id: 1, estado: 'pendiente', update: jest.fn().mockResolvedValue() };
      Order.findByPk.mockResolvedValue(mockOrder);

      const result = await OrderService.updateStatus(1, 'enviado');

      expect(mockOrder.update).toHaveBeenCalledWith({ estado: 'enviado' });
    });

    it('should return null if order not found', async () => {
      Order.findByPk.mockResolvedValue(null);

      const result = await OrderService.updateStatus(999, 'enviado');

      expect(result).toBeNull();
    });
  });
});
