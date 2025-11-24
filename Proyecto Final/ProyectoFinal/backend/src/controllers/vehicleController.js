import { Vehicle, Product, Fitment } from "../models/index.js";
import { Op } from "sequelize";

export async function listVehicles(req, res) {
    try {
        const { page = 1, pageSize = 20, q, marca, modelo, año } = req.query;
        const offset = (page - 1) * pageSize;

        const filtros = {};
        if (q) {
            filtros[Op.or] = [
                { marca: { [Op.like]: `%${q}%` } },
                { modelo: { [Op.like]: `%${q}%` } }
            ];
        }
        if (marca) filtros.marca = { [Op.like]: `%${marca}%` };
        if (modelo) filtros.modelo = { [Op.like]: `%${modelo}%` };
        if (año) {
            const añoNum = parseInt(año);
            filtros[Op.and] = [
                { ano_desde: { [Op.lte]: añoNum } },
                {
                    [Op.or]: [
                        { año_hasta: { [Op.gte]: añoNum } },
                        { año_hasta: null }
                    ]
                }
            ];
        }

        const { rows, count } = await Vehicle.findAndCountAll({
            where: filtros,
            order: [['marca', 'ASC'], ['modelo', 'ASC'], ['año_desde', 'ASC']],
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

export async function getVehicle(req, res) {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id, {
            include: [{
                model: Product,
                through: { attributes: [] },
                attributes: ['id', 'sku', 'nombre', 'precio', 'stock']
            }]
        });

        if (!vehicle) return res.status(404).json({ error: "Vehículo no encontrado" });
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function createVehicle(req, res) {
    try {
        const { marca, modelo, año_desde, año_hasta, motor } = req.body;

        if (!marca || !modelo || !año_desde) {
            return res.status(400).json({ 
                error: "Marca, modelo y año desde son requeridos" 
            });
        }

        const vehicle = await Vehicle.create({ 
            marca, 
            modelo, 
            año_desde, 
            año_hasta, 
            motor 
        });
        
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function updateVehicle(req, res) {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) return res.status(404).json({ error: "Vehículo no encontrado" });

        await vehicle.update(req.body);
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function deleteVehicle(req, res) {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) return res.status(404).json({ error: "Vehículo no encontrado" });

        await Fitment.destroy({ where: { vehicle_id: vehicle.id } });
        
        await vehicle.destroy();
        res.json({ msg: "Vehículo eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function getVehicleBrands(req, res) {
    try {
        const brands = await Vehicle.findAll({
            attributes: ['marca'],
            group: ['marca'],
            order: [['marca', 'ASC']]
        });

        const brandList = brands.map(v => v.marca);
        res.json(brandList);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function getVehicleModelsByBrand(req, res) {
    try {
        const { marca } = req.params;
        
        const models = await Vehicle.findAll({
            where: { marca },
            attributes: ['modelo'],
            group: ['modelo'],
            order: [['modelo', 'ASC']]
        });

        const modelList = models.map(v => v.modelo);
        res.json(modelList);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
