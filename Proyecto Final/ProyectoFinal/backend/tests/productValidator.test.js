import { validateCreateProduct, validateUpdateProduct } from '../src/services/validators/productValidator.js';

describe('Product Validator', () => {
  test('validateCreateProduct: valid payload', () => {
    const payload = { sku: 'SKU123', nombre: 'Producto', precio: 100, category_id: 1 };
    const { valid, errors } = validateCreateProduct(payload);
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  test('validateCreateProduct: missing fields', () => {
    const payload = { sku: '', nombre: '', precio: 'abc' };
    const { valid, errors } = validateCreateProduct(payload);
    expect(valid).toBe(false);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('validateUpdateProduct: invalid precio', () => {
    const payload = { precio: 'no-num' };
    const { valid, errors } = validateUpdateProduct(payload);
    expect(valid).toBe(false);
    expect(errors).toContain('Precio inválido');
  });
});
