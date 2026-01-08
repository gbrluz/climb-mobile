import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../api/instances';
import type { User } from '../types';

export const useUserProfile = () => {
  return useQuery<User>({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const { data } = await bookingsApi.get<User>('/users/me');
      return data;
    },
    // Dados do perfil não mudam com frequência
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
