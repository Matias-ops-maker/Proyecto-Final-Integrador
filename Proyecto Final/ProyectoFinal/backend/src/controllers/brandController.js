import { Brand, Product } from "../models/index.js";
import { Op } from "sequelize";

export async function listBrands(req, res) {
    try {
        const { page = 1, pageSize = 20, q } = req.query;
        const offset = (page - 1) * pageSize;

        const filtros = {};
        if (q) {
            filtros.nombre = { [Op.like]: `%${q}%` };
        }

        const { rows, count } = await Brand.findAndCountAll({
            where: filtros,
            order: [['nombre', 'ASC']],
            offset: parseInt(offset),
            limit: parseInt(pageSize),
        });

        res.json({
            data: rows,
            pagination: {
                page: +page,
                pageSize: +pageSize,
                total: count,
                totalPages: Math.ceil(count / pageSize)
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function getBrand(req, res) {
    try {
        const brand = await Brand.findByPk(req.params.id, {
            include: [{
                model: Product,
                attributes: ['id', 'sku', 'nombre', 'precio', 'stock']
            }]
        });

        if (!brand) return res.status(404).json({ error: "Marca no encontrada" });
        res.json(brand);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function createBrand(req, res) {
    try {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ error: "El nombre de la marca es requerido" });
        }

        const existingBrand = await Brand.findOne({ where: { nombre } });
        if (existingBrand) {
            return res.status(400).json({ error: "La marca ya existe" });
        }

        const brand = await Brand.create({ nombre });
        res.status(201).json(brand);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function updateBrand(req, res) {
    try {
        const brand = await Brand.findByPk(req.params.id);
        if (!brand) return res.status(404).json({ error: "Marca no encontrada" });

        const { nombre } = req.body;

        if (nombre && nombre !== brand.nombre) {
            const existingBrand = await Brand.findOne({ where: { nombre } });
            if (existingBrand) {
                return res.status(400).json({ error: "El nombre de marca ya existe" });
            }
        }

        await brand.update(req.body);
        res.json(brand);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function deleteBrand(req, res) {
    try {
        const brand = await Brand.findByPk(req.params.id);
        if (!brand) return res.status(404).json({ error: "Marca no encontrada" });

        const productCount = await Product.count({ where: { brand_id: brand.id } });
        if (productCount > 0) {
            return res.status(400).json({ 
                error: "No se puede eliminar la marca porque tiene productos asociados" 
            });
        }

        await brand.destroy();
        res.json({ msg: "Marca eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
