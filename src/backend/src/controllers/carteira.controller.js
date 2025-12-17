import * as service from '../services/carteira.service.js';

export const createCarteira = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const {nome, saldo_inicial} = req.body;

        const newCarteira = await service.createCarteira(userId, {nome, saldo_inicial});
        res.status(201).json(newCarteira);

    } catch (error) {
        next(error);
    }
};

export const getAllCarteiras = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const carteiras = await service.getAllCarteiras(userId);
        res.status(200).json(carteiras);

    } catch (error) {
        next(error);
    }
};

export const getCarteiraById = async(req, res, next) => {
    try {
        const userId = req.auth.userId;
        const {id} = req.params;

        const carteira = await service.getCarteiraById(id, userId);

        res.status(200).json(carteira);
        
    } catch (error) {
        next(error);
    }
};

export const updateCarteira = async(req, res, next) => {
    try { 
        const userId = req.auth.userId;
        const {id} = req.params;
        const updateData = req.body;

        const updatedCarteira = await service.updateCarteira(id, userId, updateData);
        res.status(200).json(updatedCarteira);

    } catch (error) {
        next(error);
    }
};

export const deleteCarteira = async(req, res, next) => {
    try {
        const userId = req.auth.userId;
        const {id} = req.params;

        await service.deleteCarteira(id, userId);

        res.status(204).send();

    } catch (error) {
        next(error);
    }
};