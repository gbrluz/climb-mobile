import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '../services/api.service';

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => ApiService.cancelBooking(bookingId),
    onSuccess: () => {
      // Invalida a cache de bookings para recarregar a lista
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      console.error('Erro ao cancelar reserva:', error);
      throw error;
    }
  });
};
