import axios from 'axios';

const BASE_URL = import.meta.env.DEV 
  ? "http://localhost:3000/api" 
  : import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    if (response.status === 204) {
      return null;
    }
    return response.data; 
  },
  (error) => {
    const customMessage = error.response?.data?.message || 'Erro inesperado na comunicação com a API.';
    console.error('Erro na API:', customMessage);
    return Promise.reject(error);  
  }
);

export default api;