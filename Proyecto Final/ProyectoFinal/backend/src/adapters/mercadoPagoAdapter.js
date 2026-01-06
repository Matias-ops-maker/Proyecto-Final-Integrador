import { MercadoPagoConfig, Preference } from 'mercadopago';

export class MercadoPagoAdapter {
  constructor(accessToken = process.env.MP_ACCESS_TOKEN) {
    this.client = new MercadoPagoConfig({
      accessToken,
      options: { timeout: 5000 }
    });
    this.preference = new Preference(this.client);
  }

  async createPreference(body) {
    return this.preference.create({ body });
  }
}
