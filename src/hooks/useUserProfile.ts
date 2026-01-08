import { useQuery } from '@tanstack/react-query';
import { ApiService } from '../services/api.service';
import type { User } from '../types';

export const useUserProfile = () => {
  return useQuery<User>({
    queryKey: ['user', 'me'],
    queryFn: () => ApiService.getUserProfile(),
    // Dados do perfil não mudam com frequência
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
