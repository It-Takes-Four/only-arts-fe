import { useQuery, useQueryClient } from '@tanstack/react-query';
import { artistService } from '../../services/artist-service';
import type { ArtistArtworksResponse } from '../../types/artwork';

export function useArtistArtworksQuery(artistId: string, page: number = 1, limit: number = 10) {
	const queryClient = useQueryClient();

	const query = useQuery<ArtistArtworksResponse>({
		queryKey: ['artist-artworks', artistId, page, limit],
		queryFn: async () => {
			//console.log('Fetching artist artworks for:', artistId);
			const result = await artistService.getArtistArtworks(artistId);
			//console.log('Artist artworks result:', result);
			return result;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled: !!artistId, // Only run if artistId is provided
	});

	const refreshArtworks = async () => {
		await queryClient.invalidateQueries({ queryKey: ['artist-artworks', artistId, page, limit] });
		await query.refetch();
	};

	return {
		artworksData: query.data,
		artworksLoading: query.isLoading,
		artworksError: query.error,
	};
}
