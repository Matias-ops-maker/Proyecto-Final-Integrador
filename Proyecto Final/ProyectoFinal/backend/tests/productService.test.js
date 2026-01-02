import { jest } from '@jest/globals';

await jest.unstable_mockModule('../src/models/index.js', () => ({
  Product: {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn()
  },
  Fitment: {
    bulkCreate: jest.fn(),
    destroy: jest.fn()
  },
  Category: {},
  Brand: {},
  Vehicle: {}
}));

const { default: ProductService } = await import('../src/services/productService.js');

describe('ProductService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('list returns rows and count', async () => {
    const models = await import('../src/models/index.js');
    const mockResult = { rows: [{ id: 1, nombre: 'P' }], count: 1 };
    models.Product.findAndCountAll.mockResolvedValue(mockResult);
    const res = await ProductService.list({ page: 1, pageSize: 12 });
    expect(res).toEqual(mockResult);
  });

  test('getById returns product', async () => {
    const models = await import('../src/models/index.js');
    const product = { id: 2, nombre: 'Producto' };
    models.Product.findByPk.mockResolvedValue(product);
    const res = await ProductService.getById(2);
    expect(res).toBe(product);
  });

  test('create throws when SKU exists', async () => {
    const models = await import('../src/models/index.js');
    models.Product.findOne.mockResolvedValue({ id: 99 });
    await expect(ProductService.create({ sku: 'X', nombre: 'n', precio: 10, category_id: 1 }))
      .rejects.toThrow();
  });

  test('create succeeds and creates fitments', async () => {
    const models = await import('../src/models/index.js');
    models.Product.findOne.mockResolvedValue(null);
    models.Product.create.mockResolvedValue({ id: 10 });
    const created = { id: 10, nombre: 'Nuevo' };
    models.Product.findByPk.mockResolvedValue(created);
    models.Fitment.bulkCreate.mockResolvedValue();

    const res = await ProductService.create({ sku: 'S1', nombre: 'n', precio: 5, category_id: 1, vehicles: [1, 2] });
    expect(models.Product.create).toHaveBeenCalled();
    expect(models.Fitment.bulkCreate).toHaveBeenCalled();
    expect(res).toBe(created);
  });

  test('update returns null when product not found', async () => {
    const models = await import('../src/models/index.js');
    models.Product.findByPk.mockResolvedValue(null);
    const res = await ProductService.update(999, { nombre: 'X' });
    expect(res).toBeNull();
  });

  test('delete removes fitments and destroys product', async () => {
    const models = await import('../src/models/index.js');
    const prod = { id: 5, destroy: jest.fn().mockResolvedValue() };
    models.Product.findByPk.mockResolvedValue(prod);
    models.Fitment.destroy.mockResolvedValue();

    const res = await ProductService.delete(5);
    expect(res).toBe(true);
    expect(prod.destroy).toHaveBeenCalled();
  });
});
