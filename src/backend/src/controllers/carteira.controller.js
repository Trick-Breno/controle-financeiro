import {createCarteira, findUserCarteiras, updateCarteiraById} from '../services/carteira.service.js';

export const handleCreateCarteira = async (req, res) => {
    try {
        const userId = req.auth.userId;

        const {nome, saldo_inicial} = req.body;

        if (!nome || saldo_inicial === undefined) {
            return res.status(400).json({error: 'Nome e saldo inicial são obrigatórios.'});
        }

        const novaCarteira = await createCarteira(userId, {nome, saldo_inicial});
        res.status(201).json(novaCarteira);
    } catch (error) {
        console.error('Erro no controlador ao criar carteira:', error);
        res.status(500).json({error: 'Erro interno no servidor'});
    }
};

export const handleGetCarteira = async (req, res) => {
    try {
        const userId = req.auth.userId;

        const carteiras = await findUserCarteiras(userId);
        res.status(200).json(carteiras);
    } catch (error) {
        console.error('Erro no controlador ao buscar carteiras:', error);
        res.status(500).json({error: 'Erro interno no servidor'});
    }
};

export const handleUpdateCarteira = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const {id} = req.params;
        const {nome} = req.body;

        if(!nome) {
            return res.status(400).json({error: 'Os campos sao obrigattórios'});
        }

        const carteiraAtualizada = await updateCarteiraById(id, userId, {nome});

        if(!carteiraAtualizada) {
            return res.status(404).json({error: 'Carteira não encontrada ou não pertence ao usuário'})
        }
        res.status(200).json(carteiraAtualizada);
    } catch (error) {
        console.error('Erro no controlador ao atualizar carteira:', error);
        res.status(500).json({error: 'Erro interno no servidor'});
    }
};