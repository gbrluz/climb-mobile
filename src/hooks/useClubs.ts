import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../api/instances';

export const useClubs = () => {
  return useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const { data } = await bookingsApi.get('/clubs');
      return data;
    },
  });
};