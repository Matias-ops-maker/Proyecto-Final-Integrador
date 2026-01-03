// Helper para respuestas estándar
export const ApiResponse = {
  // Dual-mode success: if first arg is an Express `res`, send response;
  // otherwise return the response object.
  success: (resOrData, dataOrMessage = null, status = 200) => {
    // res provided: ApiResponse.success(res, data, status)
    if (resOrData && typeof resOrData.status === 'function') {
      const res = resOrData;
      const data = dataOrMessage;
      return res.status(status).json({ success: true, data });
    }

    // object form: ApiResponse.success(data, message?)
    const data = resOrData;
    const message = dataOrMessage;
    return {
      success: true,
      data,
      ...(message && { message })
    };
  },

  // Dual-mode error: ApiResponse.error(res, status, message) or ApiResponse.error(message, code, statusCode)
  error: (resOrMessage, maybeCodeOrStatus = null, maybeStatus = 500) => {
    // res provided: ApiResponse.error(res, status, message)
    if (resOrMessage && typeof resOrMessage.status === 'function') {
      const res = resOrMessage;
      const status = maybeCodeOrStatus || 500;
      const message = maybeStatus || 'Error interno del servidor';
      return res.status(status).json({ success: false, error: message, statusCode: status });
    }

    // object form: ApiResponse.error(message, code, statusCode)
    const message = resOrMessage;
    const code = maybeCodeOrStatus;
    const statusCode = maybeStatus || 500;
    return {
      success: false,
      error: message,
      ...(code && { code }),
      statusCode
    };
  },

  // Dual-mode paginated: ApiResponse.paginated(res, rows, pagination) or ApiResponse.paginated(rows, count, page, pageSize)
  paginated: (resOrRows, rowsOrCount, pageOrPageSize = 1, pageSizeMaybe = 20) => {
    // res form: ApiResponse.paginated(res, rows, pagination)
    if (resOrRows && typeof resOrRows.status === 'function') {
      const res = resOrRows;
      const rows = rowsOrCount || [];
      const pagination = pageOrPageSize || { page: 1, pageSize: 20, total: 0 };
      return res.status(200).json({ data: rows, pagination });
    }

    // object form: ApiResponse.paginated(rows, count, page, pageSize)
    const rows = resOrRows || [];
    const count = rowsOrCount || 0;
    const page = pageOrPageSize || 1;
    const pageSize = pageSizeMaybe || 20;
    return {
      data: rows,
      pagination: {
        page: +page,
        pageSize: +pageSize,
        total: count,
        totalPages: Math.ceil(count / pageSize)
      }
    };
  }
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
