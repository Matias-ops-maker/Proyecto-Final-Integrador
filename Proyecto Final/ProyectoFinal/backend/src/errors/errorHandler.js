import { AppError } from './AppError.js';

export function errorHandler(err, req, res, _next) {
    console.error('❌ Error capturado:', err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                details: err.details
            }
        });
    }

    return res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'Error interno del servidor'
        }
    });
}
