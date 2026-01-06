import { MercadoPagoAdapter } from '../adapters/mercadoPagoAdapter.js';

export class MercadoPagoClient {
  constructor(adapter = new MercadoPagoAdapter()) {
    this.adapter = adapter;
  }

  async createPreference(body) {
    return this.adapter.createPreference(body);
  }
}
