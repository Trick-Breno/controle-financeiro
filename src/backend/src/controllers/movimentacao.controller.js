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

export const getAllMovimentacoes = async(req, res, next) => {
    try {
        const userId = req.auth.userId;

        const movimentacoes = await service.getAllMovimentacoes(userId);
        res.status(200).json(movimentacoes);

    } catch (error) {
        next(error);
    }
};

export const getMovimentacaoById = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const {id} = req.params;

        const movimentacao = await service.getMovimentacaoById(id, userId);
        res.status(200).json(movimentacao);

    } catch (error) {
        next(error);
    }
};

export const updateMovimentacao = async (req, res, next) => {    
    try{
        const userId = req.auth.userId;
        const {id} = req.params

        const updated = await service.updateMovimentacao(id, userId, req.body);
        res.status(200).json(updated);
        
    } catch (error) {
        next(error);
    }
};

export const deleteMovimentacao = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const {id} = req.params

        await service.deleteMovimentacao(id, userId);
        res.status(204).send();

    } catch (error) {
        next(error);
    }
};