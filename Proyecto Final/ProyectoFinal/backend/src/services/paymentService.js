import { PaymentFactory } from '../factories/paymentFactory.js';
import { AppError } from '../errors/AppError.js';
import { PaymentPreferenceDTO } from '../dtos/PaymentPreferenceDTO.js';


const paymentClient = PaymentFactory.create();

export const PaymentService = {
  async createPayment(payload) {
    const { items } = payload;

    // Validación de negocio
    if (!items || items.length === 0) {
      throw new AppError({
        code: 'NO_ITEMS',
        statusCode: 400,
        message: 'El pago debe contener al menos un item'
      });
    }

    //  DTO
    const preferenceDTO = new PaymentPreferenceDTO(payload);

    //  Delegación al cliente 
    return paymentClient.createPreference(
      preferenceDTO.toProvider()
    );
  },

  async handleWebhook(type, data) {
    if (type === 'payment') {
      return {
        paymentId: data.id,
        processed: true
      };
    }

    return null;
  }
};

export default PaymentService;
