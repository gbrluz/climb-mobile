// src/hooks/useCreateBooking.ts
import { useMutation } from '@tanstack/react-query';
import { bookingsApi } from '../api/instances';

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (bookingData: { court_id: string; start_time: string }) => {
      // Envia para o endpoint de bookings que você criou no NestJS
      const { data } = await bookingsApi.post('/bookings', bookingData);
      return data;
    },
    onSuccess: () => {
      alert('Reserva realizada com sucesso!');
    },
    onError: (error: any) => {
      alert(`Erro ao reservar: ${error.response?.data?.message || 'Tente novamente'}`);
    }
  });
};