// Helper para respuestas estándar
export const ApiResponse = {
  success: (data, message = null) => ({
    success: true,
    data,
    ...(message && { message })
  }),
  
  error: (message, code = null, statusCode = 500) => ({
    success: false,
    error: message,
    ...(code && { code }),
    statusCode
  }),

  paginated: (rows, count, page, pageSize) => ({
    data: rows,
    pagination: {
      page: +page,
      pageSize: +pageSize,
      total: count,
      totalPages: Math.ceil(count / pageSize)
    }
  })
};

// Helper para manejo de errores
export const ErrorHandler = {
  handle: (error, res, defaultMessage = 'Error interno del servidor') => {
    if (error.code) {
      const codes = {
        'SKU_EXISTS': { msg: 'El SKU ya existe', status: 400 },
        'PRODUCT_NOT_FOUND': { msg: 'Producto no encontrado', status: 404 },
        'INSUFFICIENT_STOCK': { msg: 'Stock insuficiente', status: 400 },
        'NO_ITEMS': { msg: 'No hay items en el carrito', status: 400 }
      };
      if (codes[error.code]) {
        const { msg, status } = codes[error.code];
        return res.status(status).json(ApiResponse.error(msg, error.code, status));
      }
    }
    console.error('❌ Error:', error);
    return res.status(500).json(ApiResponse.error(defaultMessage));
  }
};

// Helper para validación
export const ValidationHelper = {
  validateRequired: (obj, fields) => {
    const errors = [];
    fields.forEach(field => {
      if (!obj[field]) errors.push(`${field} es requerido`);
    });
    return { valid: errors.length === 0, errors };
  }
};
