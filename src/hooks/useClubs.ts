import { useQuery } from '@tanstack/react-query';
import { ApiService } from '../services/api.service';
import type { Club } from '../types';

export const useClubs = () => {
  return useQuery<Club[]>({
    queryKey: ['clubs'],
    queryFn: () => ApiService.getClubs(),
  });
};