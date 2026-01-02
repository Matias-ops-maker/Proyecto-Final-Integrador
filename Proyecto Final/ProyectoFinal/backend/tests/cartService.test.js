import { jest } from '@jest/globals';

await jest.unstable_mockModule('../src/models/index.js', () => ({
  Cart: {
    findOne: jest.fn(),
    create: jest.fn()
  },
  CartItem: {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn()
  },
  Product: {
    findByPk: jest.fn()
  },
  Category: {},
  Brand: {},
  Vehicle: {}
}));

const { default: CartService } = await import('../src/services/cartService.js');

describe('CartService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getCart creates new cart if none exists', async () => {
    const models = await import('../src/models/index.js');
    const newCart = { id: 1, user_id: 10, toJSON: () => ({ id: 1, user_id: 10 }) };
    models.Cart.findOne.mockResolvedValue(null);
    models.Cart.create.mockResolvedValue(newCart);

    const res = await CartService.getCart(10);
    expect(res.id).toBe(1);
    expect(res.total).toBe(0);
  });

  test('getCart returns cart with items and totals', async () => {
    const models = await import('../src/models/index.js');
    const cart = {
      id: 2,
      user_id: 10,
      CartItems: [
        { cantidad: 2, Product: { precio: 100 } },
        { cantidad: 1, Product: { precio: 50 } }
      ],
      toJSON: () => ({ id: 2, user_id: 10 })
    };
    models.Cart.findOne.mockResolvedValue(cart);

    const res = await CartService.getCart(10);
    expect(res.total).toBe(250);
    expect(res.totalItems).toBe(3);
  });

  test('addItem throws when product not found', async () => {
    const models = await import('../src/models/index.js');
    models.Product.findByPk.mockResolvedValue(null);

    await expect(CartService.addItem(10, 99, 1)).rejects.toThrow();
  });

  test('addItem throws when insufficient stock', async () => {
    const models = await import('../src/models/index.js');
    models.Product.findByPk.mockResolvedValue({ id: 1, stock: 2 });

    await expect(CartService.addItem(10, 1, 5)).rejects.toThrow();
  });

  test('addItem creates cart and item if neither exist', async () => {
    const models = await import('../src/models/index.js');
    models.Product.findByPk.mockResolvedValue({ id: 1, stock: 10 });
    models.Cart.findOne.mockResolvedValueOnce(null);
    const mockCart = { id: 5, user_id: 10, actualizado_en: new Date(), save: jest.fn() };
    models.Cart.create.mockResolvedValue(mockCart);
    models.CartItem.findOne.mockResolvedValue(null);
    const mockItem = { id: 10, cart_id: 5, product_id: 1, cantidad: 1 };
    models.CartItem.create.mockResolvedValue(mockItem);
    const withProduct = { ...mockItem, Product: { precio: 50 } };
    models.CartItem.findByPk.mockResolvedValue(withProduct);

    const res = await CartService.addItem(10, 1, 1);
    expect(models.Cart.create).toHaveBeenCalledWith({ user_id: 10 });
    expect(models.CartItem.create).toHaveBeenCalled();
  });

  test('updateItem returns null when not found', async () => {
    const models = await import('../src/models/index.js');
    models.CartItem.findByPk.mockResolvedValue(null);

    const res = await CartService.updateItem(999, 10, 5);
    expect(res).toBeNull();
  });

  test('removeItem returns false when not found', async () => {
    const models = await import('../src/models/index.js');
    models.CartItem.findByPk.mockResolvedValue(null);

    const res = await CartService.removeItem(999, 10);
    expect(res).toBe(false);
  });

  test('clear returns false when cart not found', async () => {
    const models = await import('../src/models/index.js');
    models.Cart.findOne.mockResolvedValue(null);

    const res = await CartService.clear(10);
    expect(res).toBe(false);
  });
});
