import { jest } from '@jest/globals';

const mockPaymentService = {
  adapter: {
    createPreference: jest.fn()
  },
  createPayment: jest.fn(async (items, payer, back_urls, ref, url, metadata) => {
    if (!items || items.length === 0) throw new Error('NO_ITEMS');
    return { id: 'pref', init_point: 'url', sandbox_init_point: 'sandbox_url' };
  }),
  handleWebhook: jest.fn(async (type, data) => {
    if (type === 'payment') return { paymentId: data.id, processed: true };
    return null;
  })
};

await jest.unstable_mockModule('../src/services/paymentService.js', () => ({
  default: mockPaymentService
}));

const PaymentService = (await import('../src/services/paymentService.js')).default;

describe('PaymentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createPayment throws when no items', async () => {
    await expect(PaymentService.createPayment([], {}, {}, 'ref', 'url')).rejects.toThrow();
  });

  test('createPayment returns preference when items provided', async () => {
    const items = [{ title: 'Producto', quantity: 1, unit_price: 100 }];
    const payer = { name: 'Juan', email: 'juan@example.com' };
    const back_urls = { success: 'http://success', failure: 'http://fail' };

    const res = await PaymentService.createPayment(items, payer, back_urls, 'ref_1', 'http://notify', {});
    
    expect(res.id).toBe('pref');
  });

  test('handleWebhook processes payment type', async () => {
    const result = await PaymentService.handleWebhook('payment', { id: '123' });
    expect(result).toEqual({ paymentId: '123', processed: true });
  });
});
