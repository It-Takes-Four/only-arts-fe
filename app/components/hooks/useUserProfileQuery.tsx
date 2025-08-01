import { useQuery, useQueryClient } from '@tanstack/react-query';
import { validateToken } from '../../services/auth-service';
import type { User } from '../core/_models';

export function useUserProfileQuery() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['user-profile', 'me'],
    queryFn: async () => {
      return await validateToken();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized) or 403 (forbidden)
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const refreshUserProfile = async () => {
    await queryClient.invalidateQueries({ queryKey: ['user-profile', 'me'] });
    // Also refresh the auth user query since they're related
    await queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
  };

  const updateUserProfileCache = (updatedUser: User) => {
    queryClient.setQueryData(['user-profile', 'me'], updatedUser);
    // Also update the auth user cache
    queryClient.setQueryData(['auth', 'user'], updatedUser);
  };

  return {
    user: query.data,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refresh: refreshUserProfile,
    updateCache: updateUserProfileCache,
  };
}
