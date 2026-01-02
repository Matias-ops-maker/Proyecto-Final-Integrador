import { Brand, Product } from '../models/index.js';
import { Op } from 'sequelize';

export const BrandService = {
  async list(page = 1, pageSize = 20, q) {
    const offset = (page - 1) * pageSize;
    const filtros = q ? { nombre: { [Op.like]: `%${q}%` } } : {};

    return await Brand.findAndCountAll({
      where: filtros,
      order: [['nombre', 'ASC']],
      offset: parseInt(offset),
      limit: parseInt(pageSize)
    });
  },

  async getById(id) {
    return await Brand.findByPk(id, {
      include: [{
        model: Product,
        attributes: ['id', 'sku', 'nombre', 'precio', 'stock']
      }]
    });
  },

  async create(nombre) {
    const existing = await Brand.findOne({ where: { nombre } });
    if (existing) {
      const err = new Error('BRAND_EXISTS');
      err.code = 'BRAND_EXISTS';
      throw err;
    }
    return await Brand.create({ nombre });
  },

  async update(id, data) {
    const brand = await Brand.findByPk(id);
    if (!brand) return null;

    if (data.nombre && data.nombre !== brand.nombre) {
      const existing = await Brand.findOne({ where: { nombre: data.nombre } });
      if (existing) {
        const err = new Error('BRAND_EXISTS');
        err.code = 'BRAND_EXISTS';
        throw err;
      }
    }

    await brand.update(data);
    return brand;
  },

  async delete(id) {
    const brand = await Brand.findByPk(id);
    if (!brand) return null;

    const count = await Product.count({ where: { brand_id: id } });
    if (count > 0) {
      const err = new Error('HAS_PRODUCTS');
      err.code = 'HAS_PRODUCTS';
      throw err;
    }

    await brand.destroy();
    return brand;
  }
};

export default BrandService;
