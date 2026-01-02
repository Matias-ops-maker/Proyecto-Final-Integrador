import { Category, Product } from '../models/index.js';
import { Op } from 'sequelize';

export const CategoryService = {
  async listHierarchy() {
    return await Category.findAll({
      include: [
        {
          model: Category,
          as: 'subcategories',
          include: [{
            model: Category,
            as: 'subcategories'
          }]
        },
        {
          model: Category,
          as: 'parent'
        }
      ],
      where: { parent_id: null },
      order: [['nombre', 'ASC']]
    });
  },

  async listFlat() {
    return await Category.findAll({
      include: [{
        model: Category,
        as: 'parent',
        attributes: ['id', 'nombre']
      }],
      order: [['nombre', 'ASC']]
    });
  },

  async getById(id) {
    return await Category.findByPk(id, {
      include: [
        { model: Category, as: 'parent', attributes: ['id', 'nombre'] },
        { model: Category, as: 'subcategories', attributes: ['id', 'nombre', 'descripcion'] },
        { model: Product, attributes: ['id', 'sku', 'nombre', 'precio', 'stock'] }
      ]
    });
  },

  async create(nombre, descripcion, parent_id) {
    if (parent_id) {
      const parent = await Category.findByPk(parent_id);
      if (!parent) {
        const err = new Error('PARENT_NOT_FOUND');
        err.code = 'PARENT_NOT_FOUND';
        throw err;
      }
    }

    const existing = await Category.findOne({
      where: { nombre, parent_id: parent_id || null }
    });
    if (existing) {
      const err = new Error('CATEGORY_EXISTS');
      err.code = 'CATEGORY_EXISTS';
      throw err;
    }

    const cat = await Category.create({ nombre, descripcion, parent_id });
    return await Category.findByPk(cat.id, {
      include: [{ model: Category, as: 'parent', attributes: ['id', 'nombre'] }]
    });
  },

  async update(id, data) {
    const cat = await Category.findByPk(id);
    if (!cat) return null;

    if (data.parent_id && data.parent_id !== cat.parent_id) {
      if (data.parent_id === id) {
        const err = new Error('SELF_PARENT');
        err.code = 'SELF_PARENT';
        throw err;
      }
      const parent = await Category.findByPk(data.parent_id);
      if (!parent) {
        const err = new Error('PARENT_NOT_FOUND');
        err.code = 'PARENT_NOT_FOUND';
        throw err;
      }
    }

    if (data.nombre && data.nombre !== cat.nombre) {
      const existing = await Category.findOne({
        where: {
          nombre: data.nombre,
          parent_id: data.parent_id || cat.parent_id || null,
          id: { [Op.ne]: id }
        }
      });
      if (existing) {
        const err = new Error('CATEGORY_EXISTS');
        err.code = 'CATEGORY_EXISTS';
        throw err;
      }
    }

    await cat.update(data);
    return cat;
  },

  async delete(id) {
    const cat = await Category.findByPk(id);
    if (!cat) return null;

    const count = await Product.count({ where: { category_id: id } });
    if (count > 0) {
      const err = new Error('HAS_PRODUCTS');
      err.code = 'HAS_PRODUCTS';
      throw err;
    }

    const childCount = await Category.count({ where: { parent_id: id } });
    if (childCount > 0) {
      const err = new Error('HAS_CHILDREN');
      err.code = 'HAS_CHILDREN';
      throw err;
    }

    await cat.destroy();
    return cat;
  }
};

export default CategoryService;
