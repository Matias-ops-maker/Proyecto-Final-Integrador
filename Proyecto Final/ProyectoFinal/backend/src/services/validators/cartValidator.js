export function validateAddToCart(body) {
  const errors = [];
  if (!body) return { valid: false, errors: ['Payload vacío'] };
  const { product_id, cantidad } = body;
  if (!product_id) errors.push('product_id es requerido');
  if (!cantidad || cantidad <= 0 || !Number.isInteger(cantidad)) errors.push('cantidad debe ser un entero > 0');
  return { valid: errors.length === 0, errors };
}

export function validateUpdateCartItem(body) {
  const errors = [];
  if (!body) return { valid: false, errors: ['Payload vacío'] };
  const { cantidad } = body;
  if (!cantidad || cantidad <= 0 || !Number.isInteger(cantidad)) errors.push('cantidad debe ser un entero > 0');
  return { valid: errors.length === 0, errors };
}
