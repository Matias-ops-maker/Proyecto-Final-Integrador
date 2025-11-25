import { Product, Category, Brand, Vehicle, Fitment } from '../models/index.js';
import { Op } from 'sequelize';

export async function listProducts(req, res) {
  console.log('📍 Iniciando listProducts');
  try {
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
    } = req.query;
    console.log('📍 Parámetros:', { page, pageSize, q, category_id, brand_id });

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

    console.log('📍 Filtros construidos:', JSON.stringify(filtros, null, 2));
    console.log('📍 Ejecutando query...');
    const { rows, count } = await Product.findAndCountAll({
      where: filtros,
      include: [
        { model: Category, attributes: ['id', 'nombre'] },
        { model: Brand, attributes: ['id', 'nombre'] }
      ],
      order: [[orderBy, orderDir]],
      offset: parseInt(offset),
      limit: parseInt(pageSize),
    });

    console.log('📍 Query completada. Productos encontrados:', count);
    console.log('📍 Enviando respuesta JSON...');
    res.json({
      data: rows,
      pagination: {
        page: +page,
        pageSize: +pageSize,
        total: count,
        totalPages: Math.ceil(count / pageSize)
      }
    });
    console.log('📍 Respuesta enviada exitosamente');
  } catch (error) {
    console.error('❌ Error en listProducts:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function getProduct(req, res) {
  try {
    console.log('📍 Iniciando getProduct para ID:', req.params.id);

    const prod = await Product.findByPk(req.params.id, {
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

    console.log('📍 Producto encontrado:', prod ? 'Sí' : 'No');

    if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });

    console.log('📍 Enviando respuesta JSON');
    res.json(prod);
  } catch (error) {
    console.error('❌ Error en getProduct:', error.message);
    console.error(error.stack);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
}

export async function createProduct(req, res) {
  try {
    const {
      sku,
      nombre,
      descripcion,
      precio,
      costo,
      imagen_url,
      stock,
      estado = 'activo',
      brand_id,
      category_id,
      vehicles = []
    } = req.body;

    if (!sku || !nombre || !precio || !category_id) {
      return res.status(400).json({ error: 'SKU, nombre, precio y categoría son requeridos' });
    }

    const existingSku = await Product.findOne({ where: { sku } });
    if (existingSku) {
      return res.status(400).json({ error: 'El SKU ya existe' });
    }

    const prod = await Product.create({
      sku,
      nombre,
      descripcion,
      precio,
      costo,
      imagen_url,
      stock: stock || 0,
      estado,
      brand_id,
      category_id
    });

    if (vehicles.length > 0) {
      const fitments = vehicles.map(vehicle_id => ({
        product_id: prod.id,
        vehicle_id
      }));
      await Fitment.bulkCreate(fitments);
    }

    const newProduct = await Product.findByPk(prod.id, {
      include: [
        { model: Category, attributes: ['id', 'nombre'] },
        { model: Brand, attributes: ['id', 'nombre'] }
      ]
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function updateProduct(req, res) {
  try {
    const prod = await Product.findByPk(req.params.id);
    if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });

    const { vehicles, ...updateData } = req.body;

    if (updateData.sku && updateData.sku !== prod.sku) {
      const existingSku = await Product.findOne({ where: { sku: updateData.sku } });
      if (existingSku) {
        return res.status(400).json({ error: 'El SKU ya existe' });
      }
    }

    await prod.update(updateData);

    if (vehicles) {
      await Fitment.destroy({ where: { product_id: prod.id } });

      if (vehicles.length > 0) {
        const fitments = vehicles.map(vehicle_id => ({
          product_id: prod.id,
          vehicle_id
        }));
        await Fitment.bulkCreate(fitments);
      }
    }

    const updatedProduct = await Product.findByPk(prod.id, {
      include: [
        { model: Category, attributes: ['id', 'nombre'] },
        { model: Brand, attributes: ['id', 'nombre'] }
      ]
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const prod = await Product.findByPk(req.params.id);
    if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });

    await Fitment.destroy({ where: { product_id: prod.id } });

    await prod.destroy();
    res.json({ msg: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function getProductsByVehicle(req, res) {
  try {
    const { vehicle_id } = req.params;
    const { page = 1, pageSize = 12 } = req.query;
    const offset = (page - 1) * pageSize;

    const products = await Product.findAndCountAll({
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
      limit: parseInt(pageSize),
    });

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
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


