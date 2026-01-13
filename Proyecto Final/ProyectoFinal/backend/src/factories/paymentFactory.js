import { MercadoPagoClient } from '../clients/MercadoPagoClient.js';
import { FakePaymentClient } from '../clients/FakePaymentClient.js';

export class PaymentFactory {
    static create() {
        const provider = process.env.PAYMENT_PROVIDER || 'fake';

        switch (provider) {
            case 'mercadopago':
                return new MercadoPagoClient();
            case 'fake':
            default:
                return new FakePaymentClient();
        }
    }
}
