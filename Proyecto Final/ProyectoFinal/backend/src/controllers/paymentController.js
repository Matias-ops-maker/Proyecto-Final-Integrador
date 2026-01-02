import PaymentService from '../services/paymentService.js';
import { validateCreatePayment } from '../services/validators/paymentValidator.js';

export async function createPayment(req, res) {
  try {
    const { valid, errors } = validateCreatePayment(req.body);
    if (!valid) return res.status(400).json({ errors });

    const { items, payer, back_urls, external_reference, notification_url, metadata } = req.body;
    const response = await PaymentService.createPayment(items, payer, back_urls, external_reference, notification_url, metadata);
    
    res.json({
      success: true,
      preferenceId: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point
    });
  } catch (error) {
    if (error.code === 'NO_ITEMS') return res.status(400).json({ success: false, message: 'No hay items en el carrito' });
    console.error('❌ Error en createPayment:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la preferencia de pago',
      error: error.message,
      details: error.response?.data || null
    });
  }
}

export async function paymentWebhook(req, res) {
  try {
    const { type, data } = req.body;
    await PaymentService.handleWebhook(type, data);
    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Error en paymentWebhook:', error);
    res.status(500).send('Error');
  }
}

export async function getPaymentStatus(req, res) {
  try {
    const { paymentId } = req.params;
    res.json({
      payment_id: paymentId,
      status: 'approved',
      amount: 1000,
      payment_method: 'credit_card'
    });
  } catch (error) {
    console.error('❌ Error en getPaymentStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el estado del pago'
    });
  }
}



