import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { collectionService } from '../../services/collection-service';
import type { PaginatedCollectionsResponse } from '../../types/collection';

export function useMyCollectionsWithPaginationQuery(page: number = 1, limit: number = 10, enabled = true) {
  const queryClient = useQueryClient();

  const query = useQuery({
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
  })

  const refreshCollections = async () => {
    await queryClient.invalidateQueries({ queryKey: ['my-collections-paginated', page, limit] });
    await query.refetch()
  };

  const addCollectionMutation = useMutation({
    mutationFn: async (request: any) => {
      return await collectionService.createCollection(request)
    },
    onSuccess: async () => {
      await refreshCollections()
    },
    onError: (error) => {
      console.error('Failed to create collection:', error);
      // Optionally invalidate to refetch and get correct state
      queryClient.invalidateQueries({ queryKey: ['my-collections'] });
    }
  })

  const publishCollectionMutation = useMutation({
    mutationFn: async (collectionId: string) => {
      return await collectionService.publishCollection(collectionId)
    },
    onSuccess: async () => {
      await refreshCollections()
    },
    onError: (error) => {
      console.error('Failed to create collection:', error);
      queryClient.invalidateQueries({ queryKey: ['my-collections'] });
    }
  })

  const removeCollection = (collectionId: string) => {

  };

  return {
    collectionsData: query.data,
    collectionsLoading: query.isLoading,
    collectionsError: query.error,
    addCollection: addCollectionMutation.mutate,
    addCollectionStatus: {
      addCollectionIsPending: addCollectionMutation.isPending,
      addCollectionIsSuccess: addCollectionMutation.isSuccess,
    },
    publishCollection: publishCollectionMutation.mutate,
    publishCollectionStatus: {
      publishCollectionIsPending: publishCollectionMutation.isPending,
      publishCollectionIsSuccess: publishCollectionMutation.isSuccess,
    }
  }
}
