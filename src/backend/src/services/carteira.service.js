import { insertCarteira, findByUserId} from '../repositories/carteira.repository.js';

export const createCarteira = async (userId, carteiraData) => {
    const {nome, saldo_inicial} = carteiraData;
    const saldo_atual = saldo_inicial;

    const dadosParaInserir = { 
        userId, 
        nome, 
        saldo_inicial, 
        saldo_atual 
    };

    return await insertCarteira(dadosParaInserir);
};

export const findUserCarteiras = async (userId) => {
    const carteiras = await findByUserId(userId);
    return carteiras;
};