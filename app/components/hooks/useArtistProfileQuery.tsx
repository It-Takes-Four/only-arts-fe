import { useQuery, useQueryClient } from '@tanstack/react-query';
import { artistService } from '../../services/artist-service';
import type { ArtistProfile } from '../../types/artist';

export function useArtistProfileQuery(artistId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['artist-profile', artistId || 'me'],
    queryFn: async () => {
      if (artistId) {
        return await artistService.getArtistProfile(artistId);
      } else {
        return await artistService.getMyArtistProfile();
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (not found) or 403 (forbidden)
      if (error?.response?.status === 404 || error?.response?.status === 403) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const refreshProfile = async () => {
    await queryClient.invalidateQueries({ queryKey: ['artist-profile', artistId || 'me'] });
  };

  const updateProfileCache = (updatedProfile: ArtistProfile) => {
    queryClient.setQueryData(['artist-profile', artistId || 'me'], updatedProfile);
  };

  return {
    artist: query.data,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refresh: refreshProfile,
    updateCache: updateProfileCache,
  };
}
