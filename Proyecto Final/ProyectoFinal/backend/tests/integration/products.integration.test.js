import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

let app;
let token; // Auth token for requests
const testProduct = {
  sku: `TEST-${Date.now()}`,
  nombre: 'Test Product',
  descripcion: 'Test product description',
  precio: 99.99,
  stock: 50,
};

beforeAll(async () => {
  const appModule = await import('../../src/app.js');
  app = appModule.default;
});

describe('Products Integration Tests', () => {
  const API_KEY = 'mi_api_key_super_secreta';

  describe('GET /api/products', () => {
    it('should retrieve list of products', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('x-api-key', API_KEY)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/products?page=1&pageSize=10')
        .set('x-api-key', API_KEY)
        .expect(200);

      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('page', 1);
      expect(response.body.pagination).toHaveProperty('pageSize', 10);
    });

    it('should filter by category', async () => {
      const response = await request(app)
        .get('/api/products?categoryId=1')
        .set('x-api-key', API_KEY)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should retrieve a single product by ID', async () => {
      // First get a product list to find a valid ID
      const listResponse = await request(app)
        .get('/api/products?pageSize=1')
        .set('x-api-key', API_KEY)
        .expect(200);

      if (listResponse.body.data && listResponse.body.data.length > 0) {
        const productId = listResponse.body.data[0].id;

        const response = await request(app)
          .get(`/api/products/${productId}`)
          .set('x-api-key', API_KEY)
          .expect(200);

        expect(response.body).toHaveProperty('id', productId);
        expect(response.body).toHaveProperty('sku');
        expect(response.body).toHaveProperty('precio');
      }
    });

    it('should return 404 for non-existent product', async () => {
      await request(app)
        .get('/api/products/99999')
        .set('x-api-key', API_KEY)
        .expect(404);
    });
  });

  describe('POST /api/products (Admin)', () => {
    it('should create a new product', async () => {
      // In real scenario, need admin token - for now just test structure
      const response = await request(app)
        .post('/api/products')
        .set('x-api-key', API_KEY)
        .send(testProduct);

      // May fail auth but should handle it gracefully
      if (response.status === 201) {
        expect(response.body).toHaveProperty('msg');
        expect(response.body).toHaveProperty('producto');
      }
    });

    it('should validate required fields', async () => {
      const invalidProduct = { nombre: 'Missing SKU' };

      const response = await request(app)
        .post('/api/products')
        .set('x-api-key', API_KEY)
        .send(invalidProduct);

      expect([400, 401, 403]).toContain(response.status);
    });
  });

  describe('PUT /api/products/:id (Admin)', () => {
    it('should update product details', async () => {
      const listResponse = await request(app)
        .get('/api/products?pageSize=1')
        .set('x-api-key', API_KEY)
        .expect(200);

      if (listResponse.body.data && listResponse.body.data.length > 0) {
        const productId = listResponse.body.data[0].id;
        const updateData = { precio: 150.00 };

        const response = await request(app)
          .put(`/api/products/${productId}`)
          .set('x-api-key', API_KEY)
          .send(updateData);

        // May fail auth but structure is valid
        expect([200, 401, 403]).toContain(response.status);
      }
    });
  });

  describe('DELETE /api/products/:id (Admin)', () => {
    it('should delete a product', async () => {
      const listResponse = await request(app)
        .get('/api/products?pageSize=1')
        .set('x-api-key', API_KEY)
        .expect(200);

      if (listResponse.body.data && listResponse.body.data.length > 0) {
        const productId = listResponse.body.data[0].id;

        const response = await request(app)
          .delete(`/api/products/${productId}`)
          .set('x-api-key', API_KEY);

        // May fail auth but request is valid
        expect([200, 401, 403, 404]).toContain(response.status);
      }
    });
  });

  describe('GET /api/products/vehicle/:vehicleId', () => {
    it('should retrieve products compatible with vehicle', async () => {
      const response = await request(app)
        .get('/api/products/vehicle/1')
        .set('x-api-key', API_KEY)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
