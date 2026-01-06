import { AuthService } from '../services/authService.js';
import { UserService } from '../services/userService.js';
import { ApiResponse } from '../helpers/apiHelpers.js';

export async function register(req, res) {
  try {
    const result = await AuthService.register(req.body);

    if (result.error) {
      const statusCode = result.error.code === 'EMAIL_EXISTS' ? 400 : 400;
      return ApiResponse.error(res, statusCode, result.error.message);
    }

    // Legacy response shape expected by tests: { msg, user }
    const { message, user } = result.data || {};
    return res.status(201).json({ msg: message, user });
  } catch (error) {
    return ApiResponse.error(res, 500, 'Error registrando usuario');
  }
}

export async function login(req, res) {
  try {
    const result = await AuthService.login(req.body);

    if (result.error) {
      return ApiResponse.error(res, 401, result.error.message);
    }

    // Legacy response shape expected by tests: { token, user }
    const { token, user } = result.data || {};
    return res.json({ token, user });
  } catch (error) {
    return ApiResponse.error(res, 500, 'Error iniciando sesión');
  }
}

export async function verifyToken(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return ApiResponse.error(res, 400, 'Token no proporcionado');
    }

    const result = await AuthService.verifyToken(token);

    if (result.error) {
      return ApiResponse.error(res, 401, result.error.message);
    }

    return ApiResponse.success(res, result.data);
  } catch (error) {
    return ApiResponse.error(res, 500, 'Error verificando token');
  }
}

export async function refreshToken(req, res) {
  try {
    const result = await AuthService.refreshToken(req.user.id);

    if (result.error) {
      return ApiResponse.error(res, 404, result.error.message);
    }

    return ApiResponse.success(res, result.data);
  } catch (error) {
    return ApiResponse.error(res, 500, 'Error refrescando token');
  }
}

export async function getProfile(req, res) {
  try {
    const result = await UserService.getUserById(req.user.id, false);

    if (result.error) {
      return ApiResponse.error(res, 404, result.error.message);
    }

    return ApiResponse.success(res, result.data);
  } catch (error) {
    return ApiResponse.error(res, 500, 'Error obteniendo perfil');
  }
}

export async function updateProfile(req, res) {
  try {
    const { nombre, email } = req.body;
    const result = await UserService.updateUser(req.user.id, { nombre, email });

    if (result.error) {
      return ApiResponse.error(res, 400, result.error.message);
    }

    return ApiResponse.success(res, result.data);
  } catch (error) {
    return ApiResponse.error(res, 500, 'Error actualizando perfil');
  }
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await UserService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    if (result.error) {
      return ApiResponse.error(res, 400, result.error.message);
    }

    return ApiResponse.success(res, result.data);
  } catch (error) {
    return ApiResponse.error(res, 500, 'Error cambiando contraseña');
  }
}

export async function deleteAccount(req, res) {
  try {
    const result = await UserService.deleteUser(req.user.id);

    if (result.error) {
      return ApiResponse.error(res, 404, result.error.message);
    }

    return ApiResponse.success(res, {
      message: 'Cuenta eliminada exitosamente'
    });
  } catch (error) {
    return ApiResponse.error(res, 500, 'Error eliminando cuenta');
  }
}
