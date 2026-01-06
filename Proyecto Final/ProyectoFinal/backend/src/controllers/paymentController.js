import PaymentService from '../services/paymentService.js';
import { validateCreatePayment } from '../services/validators/paymentValidator.js';
import { AppError } from '../errors/AppError.js';

export async function createPayment(req, res, next) {
  try {
    const { valid, errors } = validateCreatePayment(req.body);
    if (!valid) {
      throw new AppError({
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        message: 'Datos de pago inválidos',
        details: errors
      });
    }

    const {
      items,
      payer,
      back_urls,
      external_reference,
      notification_url,
      metadata
    } = req.body;

    const response = await PaymentService.createPayment(
      items,
      payer,
      back_urls,
      external_reference,
      notification_url,
      metadata
    );

    res.json({
      success: true,
      preferenceId: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point
    });
  } catch (error) {
    next(error);
  }
}

export async function paymentWebhook(req, res, next) {
  try {
    const { type, data } = req.body;
    await PaymentService.handleWebhook(type, data);
    res.status(200).send('OK');
  } catch (error) {
    next(error);
  }
}

export async function getPaymentStatus(req, res, next) {
  try {
    const { paymentId } = req.params;
    res.json({
      success: true,
      payment_id: paymentId,
      status: 'approved',
      amount: 1000,
      payment_method: 'credit_card'
    });
  } catch (error) {
    next(error);
  }
}
