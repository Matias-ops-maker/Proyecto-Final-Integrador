export function checkApiKey(req, res, next) {

    // Permitir health check sin API Key
    if (req.path === '/health') {
        return next();
    }

    const key = req.header("x-api-key") || req.header("X-API-Key");

    if (!key) {
        return res.status(401).json({ 
            error: "API Key requerida", 
            message: "Incluya el header 'x-api-key' con una clave válida" 
        });
    }

    if (key !== process.env.API_KEY) {
        return res.status(401).json({ 
            error: "API Key inválida",
            message: "La clave proporcionada no es válida"
        });
    }

    next();
}
