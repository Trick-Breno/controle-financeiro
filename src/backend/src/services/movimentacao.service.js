import * as repository from '../repositories/movimentacao.repository.js';
import * as carteiraRepository from '../repositories/carteira.repository.js'
import { NotFoundError } from '../utils/AppError.js';

export const createMovimentacao = async (userId, {carteiraId, descricao, valor, tipo, dataReferencia, status}) => {

    const carteira = await carteiraRepository.findById(carteiraId, userId)

    if (!carteira) {
        throw new NotFoundError('Carteira não encontrada ou nao pertence ao usuário')
    }
    const movimentacao = {
        userId,
        carteiraId,
        descricao,
        valor,
        tipo,
        dataReferencia,
        status
    };

    return repository.createAtomica(movimentacao);
};