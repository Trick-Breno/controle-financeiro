import * as repository from '../repositories/carteira.repository.js'
import { NotFoundError } from '../utils/AppError.js';

export const createCarteira = async (userId, { nome, saldo_inicial }) => {

    const carteira = {
        userId, 
        nome,
        saldo_inicial, 
        saldo_atual: saldo_inicial,
    };

    return repository.insert(carteira);
};

export const getAllCarteiras = async (userId) => {
    return repository.findAll(userId);
};

export const getCarteiraById = async(id, userId) => {
    const carteira = await repository.findById(id, userId);
    
    if (!carteira) {
        throw new NotFoundError('Carteira não encontrada')
    }
    
    return carteira;

};

export const updateCarteira = async(id,userId, carteiraData) => {
    const updatedCarteira = await repository.update(id, userId, carteiraData);
    
    if(!updatedCarteira) {
        throw new NotFoundError('Carteira nao encontrada para atualização');
    }

    return updatedCarteira
};

export const deleteCarteira = async(id, userId) => {
    const deletedCarteira = await repository.remove(id, userId);

    if (!deletedCarteira) {
        throw new NotFoundError('Carteira não encontrada para excluir')
    }
    return deletedCarteira;
};