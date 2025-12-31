import * as repository from '../repositories/movimentacao.repository.js';
import * as carteiraRepository from '../repositories/carteira.repository.js'
import { NotFoundError } from '../utils/AppError.js';

export const createMovimentacao = async (userId, {id_carteira, descricao, valor, tipo, data_referencia, status}) => {

    const carteira = await carteiraRepository.findById(id_carteira, userId)

    if (!carteira) {
        throw new NotFoundError('Carteira não encontrada ou nao pertence ao usuário')
    }
    const movimentacao = {
        userId,
        id_carteira,
        descricao,
        valor,
        tipo,
        data_referencia,
        status
    };

    return repository.createAtomica(movimentacao);
};

export const getAllMovimentacoes = async(userId) => {
    return repository.findAll(userId);

};

export const getMovimentacaoById = async (id, userId) => {
    const movimentacao =  await repository.findById(id, userId);

    if(!movimentacao) {
        throw new NotFoundError('Movimentação não encontrada ou nao pertence ao usuário');
    }

    return movimentacao;
};