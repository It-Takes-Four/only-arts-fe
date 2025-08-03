import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { collectionService } from '../../services/collection-service';
import type { MyArtworksResponse, MyArtwork } from '../../types/collection';
import { artService } from 'app/services/art-service';

export function useMyArtworksQuery(enabled = true) {
  const queryClient = useQueryClient();

  const query = useQuery<MyArtworksResponse>({
    queryKey: ['my-artworks'],
    queryFn: async () => {
      //console.log('🔄 Fetching my artworks...'); // Add this to see if refetch happens
      const result = await artService.getMyArtworks();
      //console.log('✅ Fetched artworks:', result); // Log the result
      return result;
    },
    enabled,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  // Create artwork mutation
  const createArtworkMutation = useMutation({
    mutationFn: async (artworkData: any) => {
      // Pass the artwork data to your service
      //console.log("createArtworkMutation called");

      return await artService.createArtwork(artworkData);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['my-artworks'] })
      await query.refetch();
    },
    onError: (error) => {
      console.error('Failed to create artwork:', error);
      // Optionally invalidate to refetch and get correct state
      queryClient.invalidateQueries({ queryKey: ['my-artworks'] });
    }
  });

  // Update artwork mutation
  const updateArtworkMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await artService.updateArtwork(id, data);
    },
    onSuccess: (updatedArtwork) => {
      queryClient.setQueryData(['my-artworks'], (old: MyArtworksResponse | undefined) => {
        if (!old) return undefined;
        return {
          ...old,
          data: old.data.map(artwork =>
            artwork.id === updatedArtwork.id ? updatedArtwork : artwork
          )
        };
      });
    }
  });

  // Delete artwork mutation
  const deleteArtworkMutation = useMutation({
    mutationFn: async (artworkId: string) => {
      return await artService.deleteArtwork(artworkId);
    },
    onMutate: async (artworkId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['my-artworks'] });

      // Snapshot the previous value
      const previousArtworks = queryClient.getQueryData(['my-artworks']);

      // Optimistically remove the artwork
      queryClient.setQueryData(['my-artworks'], (old: MyArtworksResponse | undefined) => {
        if (!old) return undefined;
        return {
          ...old,
          data: old.data.filter(artwork => artwork.id !== artworkId),
          pagination: {
            ...old.pagination,
            total: Math.max(0, old.pagination.total - 1)
          }
        };
      });

      // Return a context object with the snapshotted value
      return { previousArtworks };
    },
    onError: (err, artworkId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousArtworks) {
        queryClient.setQueryData(['my-artworks'], context.previousArtworks);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['my-artworks'] });
    }
  });

  const refreshArtworks = async () => {
    await queryClient.invalidateQueries({ queryKey: ['my-artworks'] });
  };

  // Legacy functions for backward compatibility
  const addArtwork = (newArtwork: MyArtwork) => {
    queryClient.setQueryData(['my-artworks'], (old: MyArtworksResponse | undefined) => {
      if (!old) return { data: [newArtwork], pagination: { currentPage: 1, perPage: 10, total: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false } };
      return { ...old, data: [newArtwork, ...old.data] };
    });
  };

  const updateArtwork = (updatedArtwork: MyArtwork) => {
    queryClient.setQueryData(['my-artworks'], (old: MyArtworksResponse | undefined) => {
      if (!old) return undefined;
      return {
        ...old,
        data: old.data.map(artwork =>
          artwork.id === updatedArtwork.id ? updatedArtwork : artwork
        )
      };
    });
  };

  const removeArtwork = (artworkId: string) => {
    queryClient.setQueryData(['my-artworks'], (old: MyArtworksResponse | undefined) => {
      if (!old) return undefined;
      return {
        ...old,
        data: old.data.filter(artwork => artwork.id !== artworkId)
      };
    });
  };

  return {
    artworks: query.data?.data || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refresh: refreshArtworks,

    // Mutations
    createArtwork: createArtworkMutation.mutate,
    createArtworkAsync: createArtworkMutation.mutateAsync,
    isCreatingArtwork: createArtworkMutation.isPending,
    createArtworkError: createArtworkMutation.error,

    updateArtwork: updateArtworkMutation.mutate,
    updateArtworkAsync: updateArtworkMutation.mutateAsync,
    isUpdatingArtwork: updateArtworkMutation.isPending,

    deleteArtwork: deleteArtworkMutation.mutate,
    deleteArtworkAsync: deleteArtworkMutation.mutateAsync,
    isDeletingArtwork: deleteArtworkMutation.isPending,

    // Legacy functions for backward compatibility
    addArtwork,
    // updateArtwork: updateArtwork,
    // removeArtwork,
  };
}