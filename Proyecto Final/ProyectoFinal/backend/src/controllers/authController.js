import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Cart } from "../models/index.js";

export async function register(req, res) {
    try {
        const { nombre, email, password, rol = 'user' } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ error: "Todos los campos son requeridos" });
        }

        const exist = await User.findOne({ where: { email } });
        if (exist) return res.status(400).json({ error: "Email ya registrado" });

        const hash = await bcryptjs.hash(password, 10);

        const user = await User.create({ nombre, email, password: hash, rol });

        await Cart.create({ user_id: user.id });
        
        res.status(201).json({ 
            msg: "Usuario registrado exitosamente", 
            user: { 
                id: user.id, 
                nombre: user.nombre, 
                email: user.email, 
                rol: user.rol 
            } 
        });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email y contraseña son requeridos" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Formato de email inválido" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const ok = await bcryptjs.compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: "Error de configuración del servidor" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, rol: user.rol }, 
            process.env.JWT_SECRET, 
            { expiresIn: "8h" }
        );
        
        res.json({ 
            token, 
            user: { 
                id: user.id, 
                nombre: user.nombre, 
                email: user.email, 
                rol: user.rol 
            } 
        });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function getProfile(req, res) {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'nombre', 'email', 'telefono', 'rol', 'creado_en']
        });
        
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function updateProfile(req, res) {
    try {
        const { nombre, email, telefono } = req.body;
        const userId = req.user.id;
        
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ where: { email } });
            if (emailExists) {
                return res.status(400).json({ error: "El email ya está en uso" });
            }
        }

        if (nombre) user.nombre = nombre;
        if (email) user.email = email;
        if (telefono !== undefined) user.telefono = telefono;
        
        await user.save();
        
        res.json({ 
            msg: "Perfil actualizado exitosamente",
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                telefono: user.telefono,
                rol: user.rol
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function changePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Contraseña actual y nueva son requeridas" });
        }
        
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const isValidPassword = await bcryptjs.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: "Contraseña actual incorrecta" });
        }

        const hash = await bcryptjs.hash(newPassword, 10);
        user.password = hash;
        await user.save();
        
        res.json({ msg: "Contraseña actualizada exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function deleteAccount(req, res) {
    try {
        const { password } = req.body;
        const userId = req.user.id;
        
        if (!password) {
            return res.status(400).json({ error: "Contraseña es requerida para eliminar la cuenta" });
        }
        
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const isValidPassword = await bcryptjs.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        await user.destroy();
        
        res.json({ msg: "Cuenta eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
