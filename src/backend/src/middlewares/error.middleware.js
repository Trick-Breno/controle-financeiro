import { AppError } from '../utils/AppError.js';

export const globalErrorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.status).json({
            error: err.message,
            code: err.code,
            details: err.details
        });
    }

    console.error('ERRO INESPERADO:', err);
    
    res.status(500).json({
        error: 'Erro interno no servidor',
        code: 'INTERNAL_ERROR'
    });
};
