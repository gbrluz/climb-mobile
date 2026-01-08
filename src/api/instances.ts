import axios from 'axios';

export const bookingsApi = axios.create({
  baseURL: 'http://localhost:3000', // Sua API NestJS
});

export const padelApi = axios.create({
  baseURL: 'https://padel-api.herokuapp.com', // API externa de Rankings
});