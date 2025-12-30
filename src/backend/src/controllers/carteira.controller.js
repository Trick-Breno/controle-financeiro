import * as service from '../services/carteira.service.js';

export const createCarteira = async (req, res, next) => {
    try {
        const userId = req.auth.userId;

        const newCarteira = await service.createCarteira(userId, req.body);
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
        const {carteiraId} = req.params;

        const carteira = await service.getCarteiraById(carteiraId, userId);

        res.status(200).json(carteira);
        
    } catch (error) {
        next(error);
    }
};

export const updateCarteira = async(req, res, next) => {
    try { 
        const userId = req.auth.userId;
        const {carteiraId} = req.params;

        const updatedCarteira = await service.updateCarteira(carteiraId, userId, req.body);
        res.status(200).json(updatedCarteira);

    } catch (error) {
        next(error);
    }
};

export const deleteCarteira = async(req, res, next) => {
    try {
        const userId = req.auth.userId;
        const {carteiraId} = req.params;

        await service.deleteCarteira(carteiraId, userId);

        res.status(204).send();

    } catch (error) {
        next(error);
    }
};