import { Vehicle, Product, Fitment } from "../models/index.js";
import { Op } from "sequelize";

export class VehicleService {
  static async listVehicles(filters = {}, pagination = {}) {
    try {
      const { q, marca, modelo, año } = filters;
      const { page = 1, pageSize = 20 } = pagination;
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
        order: [['marca', 'ASC'], ['modelo', 'ASC'], ['ano_desde', 'ASC']],
        offset: parseInt(offset),
        limit: parseInt(pageSize),
      });

      return {
        data: rows,
        pagination: {
          page: +page,
          pageSize: +pageSize,
          total: count,
          totalPages: Math.ceil(count / pageSize)
        }
      };
    } catch (error) {
      throw {
        code: 'LIST_VEHICLES_ERROR',
        message: 'Error listing vehicles',
        error
      };
    }
  }

  static async getVehicleById(vehicleId) {
    try {
      const vehicle = await Vehicle.findByPk(vehicleId, {
        include: [{
          model: Product,
          through: { attributes: [] },
          attributes: ['id', 'sku', 'nombre', 'precio', 'stock']
        }]
      });

      if (!vehicle) {
        return { error: { code: 'VEHICLE_NOT_FOUND', message: 'Vehículo no encontrado' } };
      }

      return { data: vehicle };
    } catch (error) {
      throw {
        code: 'GET_VEHICLE_ERROR',
        message: 'Error retrieving vehicle',
        error
      };
    }
  }

  static async createVehicle(vehicleData) {
    try {
      const { marca, modelo, ano_desde, ano_hasta, motor } = vehicleData;

      if (!marca || !modelo || !ano_desde) {
        return {
          error: {
            code: 'INVALID_VEHICLE_DATA',
            message: 'Marca, modelo y año desde son requeridos'
          }
        };
      }

      const vehicle = await Vehicle.create({
        marca,
        modelo,
        ano_desde,
        ano_hasta,
        motor
      });

      return { data: vehicle };
    } catch (error) {
      throw {
        code: 'CREATE_VEHICLE_ERROR',
        message: 'Error creating vehicle',
        error
      };
    }
  }

  static async updateVehicle(vehicleId, updates) {
    try {
      const vehicle = await Vehicle.findByPk(vehicleId);
      if (!vehicle) {
        return { error: { code: 'VEHICLE_NOT_FOUND', message: 'Vehículo no encontrado' } };
      }

      await vehicle.update(updates);
      return { data: vehicle };
    } catch (error) {
      throw {
        code: 'UPDATE_VEHICLE_ERROR',
        message: 'Error updating vehicle',
        error
      };
    }
  }

  static async deleteVehicle(vehicleId) {
    try {
      const vehicle = await Vehicle.findByPk(vehicleId);
      if (!vehicle) {
        return { error: { code: 'VEHICLE_NOT_FOUND', message: 'Vehículo no encontrado' } };
      }

      const hasFitments = await Fitment.count({ where: { vehicle_id: vehicleId } });
      if (hasFitments > 0) {
        return {
          error: {
            code: 'VEHICLE_HAS_PRODUCTS',
            message: 'No se puede eliminar vehículo con productos asociados'
          }
        };
      }

      await vehicle.destroy();
      return { data: { message: 'Vehículo eliminado' } };
    } catch (error) {
      throw {
        code: 'DELETE_VEHICLE_ERROR',
        message: 'Error deleting vehicle',
        error
      };
    }
  }

  static async addProductToVehicle(vehicleId, productId) {
    try {
      const vehicle = await Vehicle.findByPk(vehicleId);
      if (!vehicle) {
        return { error: { code: 'VEHICLE_NOT_FOUND', message: 'Vehículo no encontrado' } };
      }

      const product = await Product.findByPk(productId);
      if (!product) {
        return { error: { code: 'PRODUCT_NOT_FOUND', message: 'Producto no encontrado' } };
      }

      await vehicle.addProduct(product);
      return { data: { message: 'Producto añadido al vehículo' } };
    } catch (error) {
      throw {
        code: 'ADD_PRODUCT_ERROR',
        message: 'Error adding product to vehicle',
        error
      };
    }
  }

  static async removeProductFromVehicle(vehicleId, productId) {
    try {
      const vehicle = await Vehicle.findByPk(vehicleId);
      if (!vehicle) {
        return { error: { code: 'VEHICLE_NOT_FOUND', message: 'Vehículo no encontrado' } };
      }

      await vehicle.removeProduct(productId);
      return { data: { message: 'Producto removido del vehículo' } };
    } catch (error) {
      throw {
        code: 'REMOVE_PRODUCT_ERROR',
        message: 'Error removing product from vehicle',
        error
      };
    }
  }
}
