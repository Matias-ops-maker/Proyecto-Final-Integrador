import { UserService } from "../services/userService.js";
import { ApiResponse } from "../helpers/apiHelpers.js";
import bcryptjs from "bcryptjs";
import { User } from "../models/index.js";

export async function listUsers(req, res) {
    try {
        if (req.user.rol !== "admin") {
            return ApiResponse.error(res, 403, "No autorizado");
        }

        const { page = 1, pageSize = 20, q, rol } = req.query;
        const result = await UserService.listUsers({ q, rol }, { page, pageSize });

        if (result.error) {
            return ApiResponse.error(res, 400, result.error.message);
        }

        return ApiResponse.paginated(res, result.data, result.pagination);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error listando usuarios");
    }
}


export async function getUser(req, res) {
    try {
        const { id } = req.params;

        if (req.user.rol !== "admin" && req.user.id != id) {
            return ApiResponse.error(res, 403, "No autorizado");
        }

        const result = await UserService.getUserById(id, req.user.rol === "admin");
        
        if (result.error) {
            return ApiResponse.error(res, 404, result.error.message);
        }

        return ApiResponse.success(res, result.data);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error obteniendo usuario");
    }
}

export async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { nombre, email, rol } = req.body;

        if (req.user.rol !== "admin" && req.user.id != id) {
            return ApiResponse.error(res, 403, "No autorizado");
        }

        const updateData = { nombre, email };
        if (req.user.rol === "admin" && rol) {
            updateData.rol = rol;
        }

        const result = await UserService.updateUser(id, updateData);
        
        if (result.error) {
            const statusCode = result.error.code === 'EMAIL_EXISTS' ? 400 : 404;
            return ApiResponse.error(res, statusCode, result.error.message);
        }

        return ApiResponse.success(res, result.data);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error actualizando usuario");
    }
}

export async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        if (req.user.rol !== "admin") {
            return ApiResponse.error(res, 403, "No autorizado");
        }

        if (req.user.id == id) {
            return ApiResponse.error(res, 400, "No puedes eliminar tu propio usuario");
        }

        const result = await UserService.deleteUser(id);
        
        if (result.error) {
            return ApiResponse.error(res, 404, result.error.message);
        }

        return ApiResponse.success(res, result.data);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error eliminando usuario");
    }
}

export async function changePassword(req, res) {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        if (req.user.id != id) {
            return ApiResponse.error(res, 403, "No autorizado");
        }

        if (!currentPassword || !newPassword) {
            return ApiResponse.error(res, 400, "Contraseña actual y nueva son requeridas");
        }

        const result = await UserService.changePassword(id, currentPassword, newPassword);
        
        if (result.error) {
            return ApiResponse.error(res, 400, result.error.message);
        }

        return ApiResponse.success(res, result.data);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error cambiando contraseña");
    }
}

export async function getUserStats(req, res) {
    try {
        const { id } = req.params;

        if (req.user.rol !== "admin" && req.user.id != id) {
            return ApiResponse.error(res, 403, "No autorizado");
        }

        const result = await UserService.getUserStats(id);
        
        return ApiResponse.success(res, result.data);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error obteniendo estadísticas");
    }
}

export async function createUser(req, res) {
    try {
        const { nombre, email, password, rol = 'user' } = req.body;

        if (!nombre || !email || !password) {
            return ApiResponse.error(res, 400, "Todos los campos son requeridos");
        }

        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return ApiResponse.error(res, 400, "Email ya registrado");
        }

        const hash = await bcryptjs.hash(password, 10);
        const user = await User.create({
            nombre,
            email,
            password: hash,
            rol
        });

        return ApiResponse.success(res, {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol
        }, 201);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error creando usuario");
    }
}

export async function resetUserPassword(req, res) {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return ApiResponse.error(res, 400, "Nueva contraseña es requerida");
        }

        const user = await User.findByPk(id);
        if (!user) {
            return ApiResponse.error(res, 404, "Usuario no encontrado");
        }

        const hash = await bcryptjs.hash(newPassword, 10);
        await user.update({ password: hash });

        return ApiResponse.success(res, { message: "Contraseña restablecida exitosamente" });
    } catch (error) {
        return ApiResponse.error(res, 500, "Error restableciendo contraseña");
    }
}
