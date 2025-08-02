import { useQuery } from '@tanstack/react-query';
import { artService } from '../../services/art-service';
import type { MyArtworksResponse } from '../../types/artwork';

export function useMyArtworksWithPaginationQuery(page: number = 1, limit: number = 10, enabled = true) {
  return useQuery<MyArtworksResponse>({
    queryKey: ['my-artworks-paginated', page, limit],
    queryFn: async () => {
      console.log('🔄 Fetching my artworks...', 'page:', page, 'limit:', limit);
      const result = await artService.getMyArtworks(page, limit);
      console.log('✅ Fetched artworks:', result);
      return result;
    },
    enabled,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}
