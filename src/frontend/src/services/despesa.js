import api from './api';

export const listarDespesas = async (token) => {
    return await api.get('/movimentacoes', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};