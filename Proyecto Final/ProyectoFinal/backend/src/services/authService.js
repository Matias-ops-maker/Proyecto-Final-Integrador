import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Cart } from "../models/index.js";

export class AuthService {
  static async register(userData) {
    try {
      const { nombre, email, password, rol = 'user' } = userData;

      if (!nombre || !email || !password) {
        return {
          error: {
            code: 'MISSING_FIELDS',
            message: 'Todos los campos son requeridos'
          }
        };
      }

      const exist = await User.findOne({ where: { email } });
      if (exist) {
        return {
          error: {
            code: 'EMAIL_EXISTS',
            message: 'Email ya registrado'
          }
        };
      }

      const hash = await bcryptjs.hash(password, 10);
      const user = await User.create({ nombre, email, password: hash, rol });

      await Cart.create({ user_id: user.id });

      return {
        data: {
          message: 'Usuario registrado exitosamente',
          user: {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol
          }
        }
      };
    } catch (error) {
      throw {
        code: 'REGISTER_ERROR',
        message: 'Error registering user',
        error
      };
    }
  }

  static async login(credentials) {
    try {
      const { email, password } = credentials;

      if (!email || !password) {
        return {
          error: {
            code: 'MISSING_CREDENTIALS',
            message: 'Email y contraseña son requeridos'
          }
        };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          error: {
            code: 'INVALID_EMAIL',
            message: 'Formato de email inválido'
          }
        };
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return {
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Credenciales inválidas'
          }
        };
      }

      const ok = await bcryptjs.compare(password, user.password);
      if (!ok) {
        return {
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Credenciales inválidas'
          }
        };
      }

      if (!process.env.JWT_SECRET) {
        throw {
          code: 'JWT_CONFIG_ERROR',
          message: 'Error de configuración del servidor'
        };
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

      return {
        data: {
          token,
          user: {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol
          }
        }
      };
    } catch (error) {
      throw {
        code: 'LOGIN_ERROR',
        message: 'Error logging in',
        error
      };
    }
  }

  static async verifyToken(token) {
    try {
      if (!process.env.JWT_SECRET) {
        return {
          error: {
            code: 'JWT_CONFIG_ERROR',
            message: 'Error de configuración del servidor'
          }
        };
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { data: decoded };
    } catch (error) {
      return {
        error: {
          code: 'INVALID_TOKEN',
          message: 'Token inválido o expirado'
        }
      };
    }
  }

  static async refreshToken(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return {
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Usuario no encontrado'
          }
        };
      }

      if (!process.env.JWT_SECRET) {
        throw {
          code: 'JWT_CONFIG_ERROR',
          message: 'Error de configuración del servidor'
        };
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

      return { data: { token } };
    } catch (error) {
      throw {
        code: 'REFRESH_TOKEN_ERROR',
        message: 'Error refreshing token',
        error
      };
    }
  }
}
