import axios from 'axios';

export const bookingsApi = axios.create({
  baseURL: 'http://localhost:3000',
});

// Interceptor para adicionar token de autenticação automaticamente
bookingsApi.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage (onde o Zustand persiste)
    const authStorage = localStorage.getItem('climb-auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error('Erro ao parsear auth storage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const padelApi = axios.create({
  baseURL: 'https://padel-api.herokuapp.com',
});