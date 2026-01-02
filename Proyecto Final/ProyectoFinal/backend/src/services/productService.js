import { Product, Category, Brand, Vehicle, Fitment } from '../models/index.js';
import { Op } from 'sequelize';

export const ProductService = {
  async list(options = {}) {
    const {
      page = 1,
      pageSize = 12,
      q,
      category_id,
      brand_id,
      inStock,
      minPrice,
      maxPrice,
      orderBy = 'creado_en',
      orderDir = 'DESC'
    } = options;

    const offset = (page - 1) * pageSize;

    const filtros = {};
    if (q) {
      filtros[Op.or] = [
        { nombre: { [Op.like]: `%${q}%` } },
        { descripcion: { [Op.like]: `%${q}%` } },
        { sku: { [Op.like]: `%${q}%` } }
      ];
    }
    if (category_id) filtros.category_id = category_id;
    if (brand_id) filtros.brand_id = brand_id;
    if (inStock === 'true') filtros.stock = { [Op.gt]: 0 };
    if (minPrice || maxPrice) {
      filtros.precio = {};
      if (minPrice) filtros.precio[Op.gte] = parseFloat(minPrice);
      if (maxPrice) filtros.precio[Op.lte] = parseFloat(maxPrice);
    }

    return await Product.findAndCountAll({
      where: filtros,
      include: [
        { model: Category, attributes: ['id', 'nombre'] },
        { model: Brand, attributes: ['id', 'nombre'] }
      ],
      order: [[orderBy, orderDir]],
      offset: parseInt(offset),
      limit: parseInt(pageSize)
    });
  },

  async getById(id) {
    return await Product.findByPk(id, {
      include: [
        { model: Category, attributes: ['id', 'nombre'] },
        { model: Brand, attributes: ['id', 'nombre'] },
        {
          model: Vehicle,
          through: { attributes: [] },
          attributes: ['id', 'marca', 'modelo', 'ano_desde', 'ano_hasta', 'motor']
        }
      ]
    });
  },

  async create(payload) {
    const { sku, vehicles = [], ...rest } = payload;

    const existingSku = await Product.findOne({ where: { sku } });
    if (existingSku) {
      const err = new Error('SKU_EXISTS');
      err.code = 'SKU_EXISTS';
      throw err;
    }

    const prod = await Product.create({ sku, ...rest });

    if (vehicles.length > 0) {
      const fitments = vehicles.map(vehicle_id => ({ product_id: prod.id, vehicle_id }));
      await Fitment.bulkCreate(fitments);
    }

    return await Product.findByPk(prod.id, {
      include: [
        { model: Category, attributes: ['id', 'nombre'] },
        { model: Brand, attributes: ['id', 'nombre'] }
      ]
    });
  },

  async update(id, payload) {
    const prod = await Product.findByPk(id);
    if (!prod) return null;

    const { vehicles, ...updateData } = payload;

    if (updateData.sku && updateData.sku !== prod.sku) {
      const existingSku = await Product.findOne({ where: { sku: updateData.sku } });
      if (existingSku) {
        const err = new Error('SKU_EXISTS');
        err.code = 'SKU_EXISTS';
        throw err;
      }
    }

    await prod.update(updateData);

    if (vehicles) {
      await Fitment.destroy({ where: { product_id: prod.id } });
      if (vehicles.length > 0) {
        const fitments = vehicles.map(vehicle_id => ({ product_id: prod.id, vehicle_id }));
        await Fitment.bulkCreate(fitments);
      }
    }

    return await Product.findByPk(prod.id, {
      include: [
        { model: Category, attributes: ['id', 'nombre'] },
        { model: Brand, attributes: ['id', 'nombre'] }
      ]
    });
  },

  async delete(id) {
    const prod = await Product.findByPk(id);
    if (!prod) return false;
    await Fitment.destroy({ where: { product_id: prod.id } });
    await prod.destroy();
    return true;
  },

  async getByVehicle(vehicle_id, page = 1, pageSize = 12) {
    const offset = (page - 1) * pageSize;
    return await Product.findAndCountAll({
      include: [
        {
          model: Vehicle,
          where: { id: vehicle_id },
          through: { attributes: [] },
          attributes: []
        },
        { model: Category, attributes: ['id', 'nombre'] },
        { model: Brand, attributes: ['id', 'nombre'] }
      ],
      offset: parseInt(offset),
      limit: parseInt(pageSize)
    });
  }
};

export default ProductService;
