import CartService from '../services/cartService.js';
import { validateAddToCart, validateUpdateCartItem } from '../services/validators/cartValidator.js';

export async function getCart(req, res) {
  try {
    const cart = await CartService.getCart(req.user.id);
    res.json(cart);
  } catch (error) {
    console.error('❌ Error en getCart:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function addToCart(req, res) {
  try {
    const { valid, errors } = validateAddToCart(req.body);
    if (!valid) return res.status(400).json({ errors });

    const item = await CartService.addItem(req.user.id, req.body.product_id, req.body.cantidad);
    res.json(item);
  } catch (error) {
    if (error.code === 'PRODUCT_NOT_FOUND') return res.status(404).json({ error: 'Producto no existe' });
    if (error.code === 'INSUFFICIENT_STOCK') return res.status(400).json({ error: 'Stock insuficiente' });
    console.error('❌ Error en addToCart:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function updateCartItem(req, res) {
  try {
    const { valid, errors } = validateUpdateCartItem(req.body);
    if (!valid) return res.status(400).json({ errors });

    const item = await CartService.updateItem(req.params.id, req.user.id, req.body.cantidad);
    if (!item) return res.status(404).json({ error: 'Item del carrito no encontrado' });
    res.json(item);
  } catch (error) {
    if (error.code === 'INSUFFICIENT_STOCK') return res.status(400).json({ error: 'Stock insuficiente' });
    console.error('❌ Error en updateCartItem:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function removeCartItem(req, res) {
  try {
    const ok = await CartService.removeItem(req.params.id, req.user.id);
    if (!ok) return res.status(404).json({ error: 'Item del carrito no encontrado' });
    res.json({ msg: 'Item eliminado del carrito' });
  } catch (error) {
    console.error('❌ Error en removeCartItem:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function clearCart(req, res) {
  try {
    const ok = await CartService.clear(req.user.id);
    if (!ok) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json({ msg: 'Carrito vaciado exitosamente' });
  } catch (error) {
    console.error('❌ Error en clearCart:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

