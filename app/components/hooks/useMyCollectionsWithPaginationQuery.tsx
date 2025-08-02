import { useQuery } from '@tanstack/react-query';
import { collectionService } from '../../services/collection-service';
import type { PaginatedCollectionsResponse } from '../../types/collection';

export function useMyCollectionsWithPaginationQuery(page: number = 1, limit: number = 10, enabled = true) {
  return useQuery<PaginatedCollectionsResponse>({
    queryKey: ['my-collections-paginated', page, limit],
    queryFn: async () => {
      console.log('🔄 Fetching my collections...', 'page:', page, 'limit:', limit);
      const result = await collectionService.getMyCollections(page, limit);
      console.log('✅ Fetched collections:', result);
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
