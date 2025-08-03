import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { artService } from '../../services/art-service';

export function useMyArtworksWithPaginationQuery(page: number = 1, limit: number = 10, enabled = true) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['my-artworks-paginated', page, limit],
    queryFn: async () => {
      //console.log('🔄 Fetching my artworks...', 'page:', page, 'limit:', limit);
      const result = await artService.getMyArtworks(page, limit);
      //console.log('✅ Fetched artworks:', result);
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

  const refreshArtworks = async () => {
    await queryClient.invalidateQueries({ queryKey: ['my-artworks-paginated', page, limit] });
    await query.refetch()
  };

  const createArtworkMutation = useMutation({
    mutationFn: async (request: any) => {
      return await artService.createArtwork(request)
    },
    onSuccess: async () => {
      await refreshArtworks()
    },
    onError: (error) => {
      console.error('Failed to create artwork:', error);
      // Optionally invalidate to refetch and get correct state
      queryClient.invalidateQueries({ queryKey: ['my-artworks-paginated', page, limit] });
    }
  })

  return {
    artworksData: query.data,
    artworksLoading: query.isLoading,
    artworksError: query.isError,
    createArtwork: createArtworkMutation.mutate,
    createArtworkIsPending: createArtworkMutation.isPending,
    createArtworkIsSuccess: createArtworkMutation.isSuccess,
  }
}
