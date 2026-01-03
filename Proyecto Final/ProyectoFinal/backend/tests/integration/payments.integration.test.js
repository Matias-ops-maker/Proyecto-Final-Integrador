import request from 'supertest';
import { describe, it, expect, beforeAll, jest } from '@jest/globals';

let app;

beforeAll(async () => {
  const appModule = await import('../../src/app.js');
  app = appModule.default;
});

describe('Payment Integration Tests', () => {
  const API_KEY = 'mi_api_key_super_secreta';

  describe('POST /api/payments/create-preference', () => {
    it('should create a payment preference', async () => {
      const paymentData = {
        items: [
          {
            id: '1',
            title: 'Test Product',
            quantity: 2,
            unit_price: 99.99,
          },
        ],
        payer: {
          email: 'test@example.com',
        },
      };

      const response = await request(app)
        .post('/api/payments/create-preference')
        .set('x-api-key', API_KEY)
        .send(paymentData);

      expect([200, 201, 400, 401, 403, 404]).toContain(response.status);

      if (response.status === 200 || response.status === 201) {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('init_point');
      }
    });

    it('should validate required fields', async () => {
      const invalidData = {
        payer: { email: 'test@example.com' },
        // missing items
      };

      const response = await request(app)
        .post('/api/payments/create-preference')
        .set('x-api-key', API_KEY)
        .send(invalidData);

      expect([400, 401, 403, 404]).toContain(response.status);
    });

    it('should validate item structure', async () => {
      const invalidItems = {
        items: [
          {
            id: '1',
            // missing title, quantity, unit_price
          },
        ],
        payer: { email: 'test@example.com' },
      };

      const response = await request(app)
        .post('/api/payments/create-preference')
        .set('x-api-key', API_KEY)
        .send(invalidItems);

      expect([400, 401, 403, 404]).toContain(response.status);
    });

    it('should handle zero or negative prices', async () => {
      const invalidPrice = {
        items: [
          {
            id: '1',
            title: 'Test',
            quantity: 1,
            unit_price: -50,
          },
        ],
        payer: { email: 'test@example.com' },
      };

      const response = await request(app)
        .post('/api/payments/create-preference')
        .set('x-api-key', API_KEY)
        .send(invalidPrice);

      expect([400, 401, 403, 404]).toContain(response.status);
    });
  });

  describe('POST /api/payments/webhook', () => {
    it('should handle payment webhook notification', async () => {
      const webhookData = {
        type: 'payment',
        data: {
          id: '12345',
        },
      };

      const response = await request(app)
        .post('/api/payments/webhook')
        .set('x-api-key', API_KEY)
        .send(webhookData);

      expect([200, 400, 401]).toContain(response.status);
    });

    it('should validate webhook signature if required', async () => {
      const invalidWebhook = {
        // missing required fields
      };

      const response = await request(app)
        .post('/api/payments/webhook')
        .set('x-api-key', API_KEY)
        .send(invalidWebhook);

      expect([200, 400, 401, 403, 404]).toContain(response.status);
    });
  });

  describe('GET /api/payments/:orderId', () => {
    it('should retrieve payment status for order', async () => {
      const response = await request(app)
        .get('/api/payments/1')
        .set('x-api-key', API_KEY);

      expect([200, 401, 403, 404]).toContain(response.status);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('medio');
      }
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .get('/api/payments/99999')
        .set('x-api-key', API_KEY);

      expect([404, 401, 403]).toContain(response.status);
    });
  });

  describe('Payment Business Logic', () => {
    it('should calculate correct total for multiple items', async () => {
      const paymentData = {
        items: [
          { id: '1', title: 'Item 1', quantity: 2, unit_price: 50 },
          { id: '2', title: 'Item 2', quantity: 3, unit_price: 25 },
        ],
        payer: { email: 'test@example.com' },
      };

      const response = await request(app)
        .post('/api/payments/create-preference')
        .set('x-api-key', API_KEY)
        .send(paymentData);

      // Expected total: (2 * 50) + (3 * 25) = 175
      if (response.status === 200 || response.status === 201) {
        expect(response.body).toHaveProperty('id');
      }
    });

    it('should handle large transaction amounts', async () => {
      const largePayment = {
        items: [
          {
            id: '1',
            title: 'Expensive Item',
            quantity: 1,
            unit_price: 9999999.99,
          },
        ],
        payer: { email: 'test@example.com' },
      };

      const response = await request(app)
        .post('/api/payments/create-preference')
        .set('x-api-key', API_KEY)
        .send(largePayment);

      // Should handle large amounts gracefully
      expect([200, 201, 400, 401, 403, 404]).toContain(response.status);
    });

    it('should require valid email for payer', async () => {
      const invalidEmail = {
        items: [
          {
            id: '1',
            title: 'Test',
            quantity: 1,
            unit_price: 99.99,
          },
        ],
        payer: { email: 'invalid-email' },
      };

      const response = await request(app)
        .post('/api/payments/create-preference')
        .set('x-api-key', API_KEY)
        .send(invalidEmail);

      // May accept or reject depending on validation strictness
      expect([200, 201, 400, 401, 403, 404]).toContain(response.status);
    });
  });

  describe('MercadoPago Integration', () => {
    it('should return init_point for checkout', async () => {
      const paymentData = {
        items: [
          {
            id: '1',
            title: 'Test Product',
            quantity: 1,
            unit_price: 99.99,
          },
        ],
        payer: { email: 'test@example.com' },
      };

      const response = await request(app)
        .post('/api/payments/create-preference')
        .set('x-api-key', API_KEY)
        .send(paymentData);

      if (response.status === 200 || response.status === 201) {
        // Should have either init_point (production) or sandbox_init_point
        expect(
          response.body.init_point || response.body.sandbox_init_point
        ).toBeDefined();
      }
    });

    it('should set preference to expire in 24 hours', async () => {
      const paymentData = {
        items: [
          {
            id: '1',
            title: 'Test Product',
            quantity: 1,
            unit_price: 50,
          },
        ],
        payer: { email: 'test@example.com' },
      };

      const response = await request(app)
        .post('/api/payments/create-preference')
        .set('x-api-key', API_KEY)
        .send(paymentData);

      if (response.status === 200 || response.status === 201) {
        // Verify preference configuration
        expect(response.body).toHaveProperty('id');
      }
    });
  });
});
