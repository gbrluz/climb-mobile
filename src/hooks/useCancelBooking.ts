import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../api/instances';

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data } = await bookingsApi.delete(`/bookings/${bookingId}`);
      return data;
    },
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
