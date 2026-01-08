import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../api/instances';
import { Club, Court, ClubWithCourts } from '../types';

export const useClubDetails = (clubId: string) => {
  return useQuery<ClubWithCourts>({
    queryKey: ['club-details', clubId],
    queryFn: async () => {
      // 1. Busca os dados do clube
      const clubRes = await bookingsApi.get<Club>(`/clubs/${clubId}`);
      // 2. Busca as quadras vinculadas
      const courtsRes = await bookingsApi.get<Court[]>(`/clubs/${clubId}/courts`);

      // Retorna um objeto unificado
      return {
        ...clubRes.data,
        courts: courtsRes.data
      };
    },
    enabled: !!clubId,
  });
};