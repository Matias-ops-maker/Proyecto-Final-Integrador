import { User, Order } from "../models/index.js";
import { Op } from "sequelize";
import bcryptjs from "bcryptjs";

export class UserService {
  static async listUsers(filters = {}, pagination = {}) {
    try {
      const { q, rol } = filters;
      const { page = 1, pageSize = 20 } = pagination;
      const offset = (page - 1) * pageSize;

      const where = {};
      if (q) {
        where[Op.or] = [
          { nombre: { [Op.like]: `%${q}%` } },
          { email: { [Op.like]: `%${q}%` } }
        ];
      }
      if (rol) where.rol = rol;

      const { rows, count } = await User.findAndCountAll({
        where,
        attributes: ['id', 'nombre', 'email', 'rol', 'creado_en'],
        order: [['creado_en', 'DESC']],
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
        code: 'LIST_USERS_ERROR',
        message: 'Error listing users',
        error
      };
    }
  }

  static async getUserById(userId, isAdmin = false) {
    try {
      const user = await User.findByPk(userId, {
        attributes: ['id', 'nombre', 'email', 'rol', 'creado_en'],
        include: isAdmin ? [
          {
            model: Order,
            attributes: ['id', 'total', 'estado', 'creado_en'],
            limit: 5,
            order: [['creado_en', 'DESC']]
          }
        ] : []
      });

      if (!user) {
        return { error: { code: 'USER_NOT_FOUND', message: 'Usuario no encontrado' } };
      }

      return { data: user };
    } catch (error) {
      throw {
        code: 'GET_USER_ERROR',
        message: 'Error retrieving user',
        error
      };
    }
  }

  static async updateUser(userId, updates) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return { error: { code: 'USER_NOT_FOUND', message: 'Usuario no encontrado' } };
      }

      const { nombre, email } = updates;
      if (email && email !== user.email) {
        const exists = await User.findOne({ where: { email } });
        if (exists) {
          return { error: { code: 'EMAIL_EXISTS', message: 'Email ya registrado' } };
        }
      }

      await user.update({ nombre, email });
      return {
        data: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol
        }
      };
    } catch (error) {
      throw {
        code: 'UPDATE_USER_ERROR',
        message: 'Error updating user',
        error
      };
    }
  }

  static async deleteUser(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return { error: { code: 'USER_NOT_FOUND', message: 'Usuario no encontrado' } };
      }

      await user.destroy();
      return { data: { message: 'Usuario eliminado' } };
    } catch (error) {
      throw {
        code: 'DELETE_USER_ERROR',
        message: 'Error deleting user',
        error
      };
    }
  }

  static async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return { error: { code: 'USER_NOT_FOUND', message: 'Usuario no encontrado' } };
      }

      const isValid = await bcryptjs.compare(currentPassword, user.password);
      if (!isValid) {
        return { error: { code: 'INVALID_PASSWORD', message: 'Contraseña actual incorrecta' } };
      }

      const hash = await bcryptjs.hash(newPassword, 10);
      await user.update({ password: hash });
      return { data: { message: 'Contraseña actualizada' } };
    } catch (error) {
      throw {
        code: 'CHANGE_PASSWORD_ERROR',
        message: 'Error changing password',
        error
      };
    }
  }

  static async getUserStats(userId) {
    try {
      const orders = await Order.findAll({
        where: { user_id: userId },
        attributes: ['id', 'total', 'estado', 'creado_en']
      });

      const stats = {
        totalOrders: orders.length,
        totalSpent: orders.reduce((sum, o) => sum + (o.total || 0), 0),
        pendingOrders: orders.filter(o => o.estado === 'pendiente').length,
        completedOrders: orders.filter(o => o.estado === 'completado').length
      };

      return { data: stats };
    } catch (error) {
      throw {
        code: 'GET_STATS_ERROR',
        message: 'Error getting user statistics',
        error
      };
    }
  }
}
