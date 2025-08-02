import { useQuery, useQueryClient } from '@tanstack/react-query';
import { collectionService } from '../../services/collection-service';
import type { MyCollection, PaginatedCollectionsResponse } from '../../types/collection';

export function useMyCollectionsQuery(enabled = true) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['my-collections'],
    queryFn: async (): Promise<PaginatedCollectionsResponse> => {
      return await collectionService.getMyCollections();
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

  const refreshCollections = async () => {
    await queryClient.invalidateQueries({ queryKey: ['my-collections'] });
  };

  const addCollection = (newCollection: MyCollection) => {
    queryClient.setQueryData(['my-collections'], (old: PaginatedCollectionsResponse | undefined) => {
      if (!old) {
        return {
          data: [newCollection],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          }
        };
      }
      
      return {
        ...old,
        data: [newCollection, ...old.data],
        pagination: {
          ...old.pagination,
          total: old.pagination.total + 1,
          totalPages: Math.ceil((old.pagination.total + 1) / old.pagination.limit),
        }
      };
    });
  };

  const updateCollection = (updatedCollection: MyCollection) => {
    queryClient.setQueryData(['my-collections'], (old: PaginatedCollectionsResponse | undefined) => {
      if (!old) return old;
      
      return {
        ...old,
        data: old.data.map(collection => 
          collection.id === updatedCollection.id ? updatedCollection : collection
        )
      };
    });
  };

  const removeCollection = (collectionId: string) => {
    queryClient.setQueryData(['my-collections'], (old: PaginatedCollectionsResponse | undefined) => {
      if (!old) return old;
      
      const filteredData = old.data.filter(collection => collection.id !== collectionId);
      
      return {
        ...old,
        data: filteredData,
        pagination: {
          ...old.pagination,
          total: old.pagination.total - 1,
          totalPages: Math.ceil(Math.max(0, old.pagination.total - 1) / old.pagination.limit),
        }
      };
    });
  };

  return {
    collections: query.data?.data || [], // Fixed: Extract data from paginated response
    pagination: query.data?.pagination || null,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refresh: refreshCollections,
    addCollection,
    updateCollection,
    removeCollection,
  };
}
