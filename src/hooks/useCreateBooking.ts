import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '../services/api.service';
import type { Booking, CreateBookingDto } from '../types';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingData: CreateBookingDto) => ApiService.createBooking(bookingData),
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