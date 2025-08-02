import { useQuery, useQueryClient } from '@tanstack/react-query';
import { collectionService } from '../../services/collection-service';
import type { MyArtwork } from '../../types/collection';

export function useMyArtworksQuery(enabled = true) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['my-artworks'],
    queryFn: async () => {
      return await collectionService.getMyArtworks();
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

  const refreshArtworks = async () => {
    await queryClient.invalidateQueries({ queryKey: ['my-artworks'] });
  };

  const addArtwork = (newArtwork: MyArtwork) => {
    queryClient.setQueryData(['my-artworks'], (old: MyArtwork[] | undefined) => {
      return old ? [newArtwork, ...old] : [newArtwork];
    });
  };

  const updateArtwork = (updatedArtwork: MyArtwork) => {
    queryClient.setQueryData(['my-artworks'], (old: MyArtwork[] | undefined) => {
      return old?.map(artwork => 
        artwork.id === updatedArtwork.id ? updatedArtwork : artwork
      ) || [];
    });
  };

  const removeArtwork = (artworkId: string) => {
    queryClient.setQueryData(['my-artworks'], (old: MyArtwork[] | undefined) => {
      return old?.filter(artwork => artwork.id !== artworkId) || [];
    });
  };

  return {
    artworks: query.data || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refresh: refreshArtworks,
    addArtwork,
    updateArtwork,
    removeArtwork,
  };
}
