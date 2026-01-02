import { MercadoPagoConfig, Preference } from 'mercadopago';

// Adaptador para MercadoPago (permite inyección de dependencias e mocking)
export class MercadoPagoAdapter {
  constructor(accessToken = process.env.MP_ACCESS_TOKEN) {
    this.client = new MercadoPagoConfig({ 
      accessToken,
      options: { timeout: 5000 }
    });
    this.preference = new Preference(this.client);
  }

  async createPreference(body) {
    return await this.preference.create({ body });
  }
}

export const PaymentService = {
  adapter: new MercadoPagoAdapter(),

  async createPayment(items, payer, back_urls, external_reference, notification_url, metadata = {}) {
    if (!items || items.length === 0) {
      const err = new Error('NO_ITEMS');
      err.code = 'NO_ITEMS';
      throw err;
    }

    const body = {
      items,
      payer,
      back_urls,
      auto_return: 'approved',
      external_reference,
      notification_url,
      statement_descriptor: 'RepuestosAuto',
      metadata,
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    return await this.adapter.createPreference(body);
  },

  async handleWebhook(type, data) {
    if (type === 'payment') {
      // TODO: Update payment status in DB
      return { paymentId: data.id, processed: true };
    }
    return null;
  }
};

export default PaymentService;
