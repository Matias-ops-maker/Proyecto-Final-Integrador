import { VehicleService } from "../services/vehicleService.js";
import { ApiResponse } from "../helpers/apiHelpers.js";

export async function listVehicles(req, res) {
    try {
        const { page = 1, pageSize = 20, q, marca, modelo, año } = req.query;
        const result = await VehicleService.listVehicles({ q, marca, modelo, año }, { page, pageSize });

        if (result.error) {
            return ApiResponse.error(res, 400, result.error.message);
        }

        return ApiResponse.paginated(res, result.data, result.pagination);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error listando vehículos");
    }
}

export async function getVehicle(req, res) {
    try {
        const result = await VehicleService.getVehicleById(req.params.id);

        if (result.error) {
            return ApiResponse.error(res, 404, result.error.message);
        }

        return ApiResponse.success(res, result.data);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error obteniendo vehículo");
    }
}

export async function createVehicle(req, res) {
    try {
        const result = await VehicleService.createVehicle(req.body);

        if (result.error) {
            return ApiResponse.error(res, 400, result.error.message);
        }

        return ApiResponse.success(res, result.data, 201);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error creando vehículo");
    }
}

export async function updateVehicle(req, res) {
    try {
        const result = await VehicleService.updateVehicle(req.params.id, req.body);

        if (result.error) {
            return ApiResponse.error(res, 404, result.error.message);
        }

        return ApiResponse.success(res, result.data);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error actualizando vehículo");
    }
}

export async function deleteVehicle(req, res) {
    try {
        const result = await VehicleService.deleteVehicle(req.params.id);

        if (result.error) {
            const statusCode = result.error.code === 'VEHICLE_HAS_PRODUCTS' ? 400 : 404;
            return ApiResponse.error(res, statusCode, result.error.message);
        }

        return ApiResponse.success(res, result.data);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error eliminando vehículo");
    }
}

export async function addProductToVehicle(req, res) {
    try {
        const { vehicleId, productId } = req.body;
        const result = await VehicleService.addProductToVehicle(vehicleId, productId);

        if (result.error) {
            const statusCode = result.error.code === 'VEHICLE_NOT_FOUND' || result.error.code === 'PRODUCT_NOT_FOUND' ? 404 : 400;
            return ApiResponse.error(res, statusCode, result.error.message);
        }

        return ApiResponse.success(res, result.data);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error añadiendo producto");
    }
}

export async function removeProductFromVehicle(req, res) {
    try {
        const { vehicleId, productId } = req.body;
        const result = await VehicleService.removeProductFromVehicle(vehicleId, productId);

        if (result.error) {
            return ApiResponse.error(res, 404, result.error.message);
        }

        return ApiResponse.success(res, result.data);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error removiendo producto");
    }
}

export async function getVehicleBrands(req, res) {
    try {
        const { Vehicle } = await import("../models/index.js");
        
        const brands = await Vehicle.findAll({
            attributes: ['marca'],
            group: ['marca'],
            order: [['marca', 'ASC']]
        });

        const brandList = brands.map(v => v.marca);
        return ApiResponse.success(res, brandList);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error obteniendo marcas");
    }
}

export async function getVehicleModelsByBrand(req, res) {
    try {
        const { marca } = req.params;
        const { Vehicle } = await import("../models/index.js");
        
        const models = await Vehicle.findAll({
            where: { marca },
            attributes: ['modelo'],
            group: ['modelo'],
            order: [['modelo', 'ASC']]
        });

        const modelList = models.map(v => v.modelo);
        return ApiResponse.success(res, modelList);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error obteniendo modelos");
    }
}
