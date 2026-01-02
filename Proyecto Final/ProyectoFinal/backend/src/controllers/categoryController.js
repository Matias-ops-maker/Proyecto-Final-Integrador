import CategoryService from '../services/categoryService.js';
import { ApiResponse } from '../helpers/apiHelpers.js';

export async function listCategories(req, res) {
  try {
    const { includeHierarchy = false } = req.query;
    const categories = includeHierarchy === 'true'
      ? await CategoryService.listHierarchy()
      : await CategoryService.listFlat();
    res.json(categories);
  } catch (error) {
    console.error('❌ Error en listCategories:', error);
    res.status(500).json(ApiResponse.error('Error interno del servidor'));
  }
}

export async function getCategory(req, res) {
  try {
    const cat = await CategoryService.getById(req.params.id);
    if (!cat) return res.status(404).json(ApiResponse.error('Categoría no encontrada', null, 404));
    res.json(cat);
  } catch (error) {
    console.error('❌ Error en getCategory:', error);
    res.status(500).json(ApiResponse.error('Error interno del servidor'));
  }
}

export async function createCategory(req, res) {
  try {
    const { nombre, descripcion, parent_id } = req.body;
    if (!nombre) return res.status(400).json(ApiResponse.error('El nombre de la categoría es requerido', null, 400));

    const cat = await CategoryService.create(nombre, descripcion, parent_id);
    res.status(201).json(cat);
  } catch (error) {
    if (error.code === 'PARENT_NOT_FOUND') return res.status(400).json(ApiResponse.error('La categoría padre no existe', 'PARENT_NOT_FOUND', 400));
    if (error.code === 'CATEGORY_EXISTS') return res.status(400).json(ApiResponse.error('La categoría ya existe', 'CATEGORY_EXISTS', 400));
    console.error('❌ Error en createCategory:', error);
    res.status(500).json(ApiResponse.error('Error interno del servidor'));
  }
}

export async function updateCategory(req, res) {
  try {
    const cat = await CategoryService.update(req.params.id, req.body);
    if (!cat) return res.status(404).json(ApiResponse.error('Categoría no encontrada', null, 404));
    res.json(cat);
  } catch (error) {
    if (error.code === 'SELF_PARENT') return res.status(400).json(ApiResponse.error('Una categoría no puede ser padre de sí misma', 'SELF_PARENT', 400));
    if (error.code === 'PARENT_NOT_FOUND') return res.status(400).json(ApiResponse.error('La categoría padre no existe', 'PARENT_NOT_FOUND', 400));
    if (error.code === 'CATEGORY_EXISTS') return res.status(400).json(ApiResponse.error('El nombre de categoría ya existe', 'CATEGORY_EXISTS', 400));
    console.error('❌ Error en updateCategory:', error);
    res.status(500).json(ApiResponse.error('Error interno del servidor'));
  }
}

export async function deleteCategory(req, res) {
  try {
    const cat = await CategoryService.delete(req.params.id);
    if (!cat) return res.status(404).json(ApiResponse.error('Categoría no encontrada', null, 404));
    res.json({ msg: 'Categoría eliminada exitosamente' });
  } catch (error) {
    if (error.code === 'HAS_PRODUCTS') return res.status(400).json(ApiResponse.error('No se puede eliminar la categoría porque tiene productos asociados', 'HAS_PRODUCTS', 400));
    if (error.code === 'HAS_CHILDREN') return res.status(400).json(ApiResponse.error('No se puede eliminar la categoría porque tiene subcategorías', 'HAS_CHILDREN', 400));
    console.error('❌ Error en deleteCategory:', error);
    res.status(500).json(ApiResponse.error('Error interno del servidor'));
  }
}
