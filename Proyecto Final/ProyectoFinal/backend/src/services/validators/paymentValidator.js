export function validateCreatePayment(body) {
  const errors = [];
  if (!body) return { valid: false, errors: ['Payload vacío'] };
  const { items, payer, back_urls } = body;
  if (!items || !Array.isArray(items) || items.length === 0) errors.push('items debe ser un array no vacío');
  if (!payer || typeof payer !== 'object') errors.push('payer es requerido');
  if (!back_urls || typeof back_urls !== 'object') errors.push('back_urls es requerido');
  return { valid: errors.length === 0, errors };
}
