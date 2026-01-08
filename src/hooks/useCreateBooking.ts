import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../api/instances';
import type { Booking, CreateBookingDto } from '../types';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData: CreateBookingDto) => {
      const { data } = await bookingsApi.post<Booking>('/bookings', bookingData);
      return data;
    },
    onSuccess: () => {
      // Invalida a cache de bookings para recarregar a lista
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      console.error('Erro ao criar reserva:', error);
      throw error;
    }
  });
};