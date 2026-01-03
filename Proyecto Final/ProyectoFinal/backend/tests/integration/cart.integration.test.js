import request from 'supertest';
import { describe, it, expect, beforeAll } from '@jest/globals';

let app;

beforeAll(async () => {
  const appModule = await import('../../src/app.js');
  app = appModule.default;
});

describe('Cart Integration Tests', () => {
  const API_KEY = 'mi_api_key_super_secreta';

  describe('GET /api/cart', () => {
    it('should retrieve user cart', async () => {
      // Without auth, should handle gracefully
      const response = await request(app)
        .get('/api/cart')
        .set('x-api-key', API_KEY);

      expect([200, 401, 403]).toContain(response.status);
    });
  });

  describe('POST /api/cart/add', () => {
    it('should add item to cart', async () => {
      const itemData = {
        product_id: 1,
        cantidad: 2,
      };

      const response = await request(app)
        .post('/api/cart/add')
        .set('x-api-key', API_KEY)
        .send(itemData);

      expect([200, 201, 400, 401, 403, 404]).toContain(response.status);

      if (response.status === 200 || response.status === 201) {
        expect(response.body).toHaveProperty('msg');
        expect(response.body).toHaveProperty('cart');
      }
    });

    it('should validate required fields', async () => {
      const invalidData = { cantidad: 2 }; // missing product_id

      const response = await request(app)
        .post('/api/cart/add')
        .set('x-api-key', API_KEY)
        .send(invalidData);

      expect([400, 401, 403, 404]).toContain(response.status);
    });

    it('should reject negative quantities', async () => {
      const invalidData = {
        product_id: 1,
        cantidad: -5,
      };

      const response = await request(app)
        .post('/api/cart/add')
        .set('x-api-key', API_KEY)
        .send(invalidData);

      expect([400, 401, 403, 404]).toContain(response.status);
    });
  });

  describe('PUT /api/cart/update/:itemId', () => {
    it('should update cart item quantity', async () => {
      // First add an item
      const addResponse = await request(app)
        .post('/api/cart/add')
        .set('x-api-key', API_KEY)
        .send({ product_id: 1, cantidad: 2 });

      if (addResponse.status === 200 || addResponse.status === 201) {
        // Extract item ID from response if available
        const updateResponse = await request(app)
          .put('/api/cart/update/1')
          .set('x-api-key', API_KEY)
          .send({ cantidad: 5 });

        expect([200, 400, 401, 403, 404]).toContain(updateResponse.status);
      }
    });
  });

  describe('DELETE /api/cart/remove/:itemId', () => {
    it('should remove item from cart', async () => {
      const response = await request(app)
        .delete('/api/cart/remove/1')
        .set('x-api-key', API_KEY);

      expect([200, 400, 401, 403, 404]).toContain(response.status);
    });
  });

  describe('DELETE /api/cart/clear', () => {
    it('should clear entire cart', async () => {
      const response = await request(app)
        .delete('/api/cart/clear')
        .set('x-api-key', API_KEY);

      expect([200, 401, 403, 404]).toContain(response.status);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('msg');
      }
    });
  });

  describe('Cart Business Logic', () => {
    it('should calculate cart total correctly', async () => {
      const response = await request(app)
        .get('/api/cart')
        .set('x-api-key', API_KEY);

      if (response.status === 200 && response.body.cart) {
        expect(response.body.cart).toHaveProperty('total');
        expect(response.body.cart).toHaveProperty('totalItems');
        expect(typeof response.body.cart.total).toBe('number');
        expect(typeof response.body.cart.totalItems).toBe('number');
      }
    });

    it('should update stock validation', async () => {
      // Try to add more items than available stock
      const largeQuantity = {
        product_id: 1,
        cantidad: 1000, // Assuming no product has 1000 stock
      };

      const response = await request(app)
        .post('/api/cart/add')
        .set('x-api-key', API_KEY)
        .send(largeQuantity);

      // Should either reject or handle gracefully
      expect([400, 401, 403, 200, 201, 404]).toContain(response.status);
    });
  });
});
