import { useQuery } from '@tanstack/react-query';
import { ApiService } from '../services/api.service';
import type { Booking } from '../types';

export const useBookings = () => {
  return useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: () => ApiService.getBookings(),
  });
};

export const useBookingDetails = (bookingId: string) => {
  return useQuery<Booking>({
    queryKey: ['booking', bookingId],
    queryFn: () => ApiService.getBookingById(bookingId),
    enabled: !!bookingId,
  });
};
