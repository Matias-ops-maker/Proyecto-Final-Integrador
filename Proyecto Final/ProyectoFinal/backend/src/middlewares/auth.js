import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export async function verifyToken(req, res, next) {
    const header = req.header("authorization");
    if (!header) return res.status(401).json({ error: "Token no proporcionado" });

    const token = header.replace("Bearer ", "");

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(payload.id);

        if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido" });
    }
}

export async function verifyAdmin(req, res, next) {
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ error: "Acceso denegado. Se requieren permisos de administrador." });
    }
    next();
}

export const authMiddleware = verifyToken;
