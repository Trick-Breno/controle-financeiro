export class AppError extends Error {
  constructor(message, status = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Dados inválidos', details) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}
export class NotFoundError extends AppError {
  constructor(message = 'Não encontrado', details) {
    super(message, 404, 'NOT_FOUND', details);
  }
}
export class ConflictError extends AppError {
  constructor(message = 'Conflito', details) {
    super(message, 409, 'CONFLICT', details);
  }
}
