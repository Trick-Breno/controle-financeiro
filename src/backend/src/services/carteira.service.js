import { 
    createCarteira as createCarteiraRepository, 
    findUserCarteiras as findUserCarteirasRepository  , 
    updateCarteiraById as updateCarteiraRepository} 
from '../repositories/carteira.repository.js';

export const createCarteira = async (userId, carteiraData) => {
    const {nome, saldo_inicial} = carteiraData;
    const saldo_atual = saldo_inicial;

    const dadosParaInserir = { 
        userId, 
        nome, 
        saldo_inicial, 
        saldo_atual 
    };

    return await createCarteiraRepository(dadosParaInserir);
};

export const findUserCarteiras = async (userId) => {
    const carteiras = await findUserCarteirasRepository(userId);
    return carteiras;
};

export const updateCarteiraById = async (id, userId, carteiraData) => {

    return await updateCarteiraRepository(id, userId, carteiraData);
}
