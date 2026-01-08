import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../api/instances';

export const useClubDetails = (clubId: string) => {
  return useQuery({
    queryKey: ['club-details', clubId],
    queryFn: async () => {
      // 1. Busca os dados do clube
      const clubRes = await bookingsApi.get(`/clubs/${clubId}`);
      // 2. Busca as quadras vinculadas (conforme o log da image_916b95)
      const courtsRes = await bookingsApi.get(`/clubs/${clubId}/courts`);
      
      // Retorna um objeto unificado
      return {
        ...clubRes.data,
        courts: courtsRes.data
      };
    },
    enabled: !!clubId,
  });
};