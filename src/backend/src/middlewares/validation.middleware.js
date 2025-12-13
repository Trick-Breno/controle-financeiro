import { ZodError } from 'zod';
import { ValidationError } from '../utils/AppError.js';

export const validate = (schema) => async (req, res, next) => {
  try {
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    req.body = parsed.body || req.body;
    
    if (parsed.query) {
      Object.assign(req.query, parsed.query);
    }
    
    if (parsed.params) {
      Object.assign(req.params, parsed.params);
    }
    
    return next();

  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues || error.errors || [];
      const errorDetails = issues.map(err => ({
        field: err.path.slice(1).join('.') || err.path.join('.'),
        message: err.message,
      }));
      
      return next(new ValidationError('Dados inválidos', errorDetails));
    }
    return next(error);
  }
};