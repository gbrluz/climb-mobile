import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../api/instances';
import type { Club } from '../types';

export const useClubs = () => {
  return useQuery<Club[]>({
    queryKey: ['clubs'],
    queryFn: async () => {
      const { data } = await bookingsApi.get<Club[]>('/clubs');
      return data;
    },
  });
};