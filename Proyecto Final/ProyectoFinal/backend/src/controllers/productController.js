import ProductService from '../services/productService.js';
import { validateCreateProduct, validateUpdateProduct } from '../services/validators/productValidator.js';

export async function listProducts(req, res) {
  try {
    const result = await ProductService.list(req.query);
    res.json({
      data: result.rows,
      pagination: {
        page: +req.query.page || 1,
        pageSize: +req.query.pageSize || 12,
        total: result.count,
        totalPages: Math.ceil(result.count / (req.query.pageSize || 12))
      }
    });
  } catch (error) {
    console.error('❌ Error en listProducts:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function getProduct(req, res) {
  try {
    const prod = await ProductService.getById(req.params.id);
    if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(prod);
  } catch (error) {
    console.error('❌ Error en getProduct:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function createProduct(req, res) {
  try {
    const { valid, errors } = validateCreateProduct(req.body);
    if (!valid) return res.status(400).json({ errors });

    const newProduct = await ProductService.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    if (error.code === 'SKU_EXISTS') return res.status(400).json({ error: 'El SKU ya existe' });
    console.error('❌ Error en createProduct:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function updateProduct(req, res) {
  try {
    const { valid, errors } = validateUpdateProduct(req.body);
    if (!valid) return res.status(400).json({ errors });

    const updated = await ProductService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(updated);
  } catch (error) {
    if (error.code === 'SKU_EXISTS') return res.status(400).json({ error: 'El SKU ya existe' });
    console.error('❌ Error en updateProduct:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const ok = await ProductService.delete(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ msg: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('❌ Error en deleteProduct:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function getProductsByVehicle(req, res) {
  try {
    const { vehicle_id } = req.params;
    const { page = 1, pageSize = 12 } = req.query;
    const products = await ProductService.getByVehicle(vehicle_id, page, pageSize);
    res.json({
      data: products.rows,
      pagination: {
        page: +page,
        pageSize: +pageSize,
        total: products.count,
        totalPages: Math.ceil(products.count / pageSize)
      }
    });
  } catch (error) {
    console.error('❌ Error en getProductsByVehicle:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


