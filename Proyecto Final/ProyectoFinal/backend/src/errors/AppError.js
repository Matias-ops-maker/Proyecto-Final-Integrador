export class AppError extends Error {
  constructor({ code, statusCode = 500, message, details = null }) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}
