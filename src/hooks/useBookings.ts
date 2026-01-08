import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../api/instances';
import { Booking } from '../types';

export const useBookings = () => {
  return useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data } = await bookingsApi.get<Booking[]>('/bookings');
      return data;
    },
  });
};

export const useBookingDetails = (bookingId: string) => {
  return useQuery<Booking>({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const { data } = await bookingsApi.get<Booking>(`/bookings/${bookingId}`);
      return data;
    },
    enabled: !!bookingId,
  });
};
