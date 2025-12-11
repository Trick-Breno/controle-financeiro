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

export const getAllCarteiras = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const carteiras = await service.getAllCarteiras(userId);
        res.status(200).json(carteiras);

    } catch (error) {
        console.error('Erro no controlador ao buscar carteiras:', error);
        res.status(500).json({error: 'Erro interno no servidor'});
    }
};

export const getCarteiraById = async(req, res) => {
    try {
        const userId = req.auth.userId;
        const {id} = req.params;

        const carteira = await service.getCarteiraById(id, userId);
        
        if (!carteira) {
            return res.status(404).json({ error: 'Carteira não encontrada ou não pertence ao usuário.' });
        }

        res.status(200).json(carteira);
        
    } catch (error) {
        console.error('Erro no controlador ao buscar carteira por ID:', error);
        res.status(500).json({error: 'Erro interno no servidor'});
    }
}

export const updateCarteira = async(req, res) => {
    try { 
        const userId = req.auth.userId;
        const {id} = req.params;
        const updateData = req.body;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({error: 'Nenhum dado fornecido para atualização.'});
        }

        const updatedCarteira = await service.updateCarteira(id, userId, updateData);

        if (!updatedCarteira) {
            return res.status(404).json({ error: 'Carteira não encontrada ou não pertence ao usuário.' });
        }
        res.status(200).json(updatedCarteira);

    } catch (error) {
        if (error.message === 'Nenhum campo fornecido para atualização.') {
            return res.status(400).json({ error: error.message });
        }
        console.error('Erro no controlador ao atualizar parcialmente carteira:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const deleteCarteira = async(req, res) => {
    try {
        const userId = req.auth.userId;
        const {id} = req.params;

        const deletedCarteira = await service.deleteCarteira(id, userId);

        if(!deletedCarteira) {
            return res.status(404).json({ error: 'Carteira não encontrada ou não pertence ao usuário.' });
        }

        res.status(204).send();

    } catch (error) {
        console.error('Erro no controlador ao deletar carteira:', error);
        res.status(500).json({error: 'Erro interno no servidor'});
    }
}