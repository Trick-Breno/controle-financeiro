import * as service from '../services/movimentacao.service.js';

export const createMovimentacao = async(req, res, next) => {
    try{
        const userId = req.auth.userId;

        const newMovimentacao = await service.createMovimentacao(userId, req.body);
        res.status(201).json(newMovimentacao);

    } catch (error) {
        next(error);
    } 
};