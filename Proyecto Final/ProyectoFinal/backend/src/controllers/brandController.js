import BrandService from '../services/brandService.js';
import { ApiResponse } from '../helpers/apiHelpers.js';

export async function listBrands(req, res) {
  try {
    const { page = 1, pageSize = 20, q } = req.query;
    const { rows, count } = await BrandService.list(page, pageSize, q);

    res.json(ApiResponse.paginated(rows, count, page, pageSize));
  } catch (error) {
    console.error('❌ Error en listBrands:', error);
    res.status(500).json(ApiResponse.error('Error interno del servidor'));
  }
}

export async function getBrand(req, res) {
  try {
    const brand = await BrandService.getById(req.params.id);
    if (!brand) return res.status(404).json(ApiResponse.error('Marca no encontrada', null, 404));
    res.json(brand);
  } catch (error) {
    console.error('❌ Error en getBrand:', error);
    res.status(500).json(ApiResponse.error('Error interno del servidor'));
  }
}

export async function createBrand(req, res) {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json(ApiResponse.error('El nombre de la marca es requerido', null, 400));

    const brand = await BrandService.create(nombre);
    res.status(201).json(brand);
  } catch (error) {
    if (error.code === 'BRAND_EXISTS') return res.status(400).json(ApiResponse.error('La marca ya existe', 'BRAND_EXISTS', 400));
    console.error('❌ Error en createBrand:', error);
    res.status(500).json(ApiResponse.error('Error interno del servidor'));
  }
}

export async function updateBrand(req, res) {
  try {
    const brand = await BrandService.update(req.params.id, req.body);
    if (!brand) return res.status(404).json(ApiResponse.error('Marca no encontrada', null, 404));
    res.json(brand);
  } catch (error) {
    if (error.code === 'BRAND_EXISTS') return res.status(400).json(ApiResponse.error('El nombre de marca ya existe', 'BRAND_EXISTS', 400));
    console.error('❌ Error en updateBrand:', error);
    res.status(500).json(ApiResponse.error('Error interno del servidor'));
  }
}

export async function deleteBrand(req, res) {
  try {
    const brand = await BrandService.delete(req.params.id);
    if (!brand) return res.status(404).json(ApiResponse.error('Marca no encontrada', null, 404));
    res.json({ msg: 'Marca eliminada exitosamente' });
  } catch (error) {
    if (error.code === 'HAS_PRODUCTS') return res.status(400).json(ApiResponse.error('No se puede eliminar la marca porque tiene productos asociados', 'HAS_PRODUCTS', 400));
    console.error('❌ Error en deleteBrand:', error);
    res.status(500).json(ApiResponse.error('Error interno del servidor'));
  }
}
