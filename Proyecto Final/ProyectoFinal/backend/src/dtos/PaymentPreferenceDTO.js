export class PaymentPreferenceDTO {
  constructor({
    items,
    payer,
    back_urls,
    external_reference,
    notification_url,
    metadata = {}
  }) {
    this.items = items;
    this.payer = payer;
    this.back_urls = back_urls;
    this.external_reference = external_reference;
    this.notification_url = notification_url;
    this.metadata = metadata;

    // Campos controlados por backend
    this.auto_return = 'approved';
    this.statement_descriptor = 'RepuestosAuto';
    this.expires = true;
    this.expiration_date_from = new Date().toISOString();
    this.expiration_date_to = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString();
  }

  toMercadoPago() {
    return {
      items: this.items,
      payer: this.payer,
      back_urls: this.back_urls,
      auto_return: this.auto_return,
      external_reference: this.external_reference,
      notification_url: this.notification_url,
      statement_descriptor: this.statement_descriptor,
      metadata: this.metadata,
      expires: this.expires,
      expiration_date_from: this.expiration_date_from,
      expiration_date_to: this.expiration_date_to
    };
  }
}
