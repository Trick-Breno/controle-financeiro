import * as repository from '../repositories/carteira.repository.js'

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
    return repository.findById(id, userId);

}

export const updateCarteira = async(id,userId, carteiraData) => {
    return repository.update(id, userId, carteiraData);
}

export const deleteCarteira = async(id, userId) => {
    return repository.remove(id, userId);
}