export function validateCreateProduct(body) {
  const errors = [];
  if (!body) {
    errors.push('Payload vacío');
    return { valid: false, errors };
  }

  const { sku, nombre, precio, category_id } = body;
  if (!sku || typeof sku !== 'string' || sku.trim() === '') errors.push('SKU es requerido');
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') errors.push('Nombre es requerido');
  if (precio === undefined || isNaN(Number(precio))) errors.push('Precio inválido');
  if (!category_id) errors.push('category_id es requerido');

  return { valid: errors.length === 0, errors };
}

export function validateUpdateProduct(body) {
  const errors = [];
  if (!body) return { valid: false, errors: ['Payload vacío'] };
  if (body.precio !== undefined && isNaN(Number(body.precio))) errors.push('Precio inválido');
  return { valid: errors.length === 0, errors };
}
