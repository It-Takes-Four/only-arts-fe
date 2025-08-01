import { useQuery, useQueryClient } from '@tanstack/react-query';
import { collectionService } from '../../services/collection-service';
import type { MyCollection } from '../../types/collection';

export function useMyCollectionsQuery() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['my-collections'],
    queryFn: async () => {
      return await collectionService.getMyCollections();
    },
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

  const refreshCollections = async () => {
    await queryClient.invalidateQueries({ queryKey: ['my-collections'] });
  };

  const addCollection = (newCollection: MyCollection) => {
    queryClient.setQueryData(['my-collections'], (old: MyCollection[] | undefined) => {
      return old ? [newCollection, ...old] : [newCollection];
    });
  };

  const updateCollection = (updatedCollection: MyCollection) => {
    queryClient.setQueryData(['my-collections'], (old: MyCollection[] | undefined) => {
      return old?.map(collection => 
        collection.id === updatedCollection.id ? updatedCollection : collection
      ) || [];
    });
  };

  const removeCollection = (collectionId: string) => {
    queryClient.setQueryData(['my-collections'], (old: MyCollection[] | undefined) => {
      return old?.filter(collection => collection.id !== collectionId) || [];
    });
  };

  return {
    collections: query.data || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refresh: refreshCollections,
    addCollection,
    updateCollection,
    removeCollection,
  };
}
