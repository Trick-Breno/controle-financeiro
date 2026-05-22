import api from './api';

export const listarCarteiras = async (token) =>  {
    return await api.get('/carteiras', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};