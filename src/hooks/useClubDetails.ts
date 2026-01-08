import { useQuery } from '@tanstack/react-query';
import { ApiService } from '../services/api.service';
import type { ClubWithCourts } from '../types';

export const useClubDetails = (clubId: string) => {
  return useQuery<ClubWithCourts>({
    queryKey: ['club-details', clubId],
    queryFn: async () => {
      // 1. Busca os dados do clube
      const club = await ApiService.getClubById(clubId);
      // 2. Busca as quadras vinculadas
      const courts = await ApiService.getClubCourts(clubId);

      // Retorna um objeto unificado
      return {
        ...club,
        courts
      };
    },
    enabled: !!clubId,
  });
};