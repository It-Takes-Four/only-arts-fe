import { useQuery } from '@tanstack/react-query';
import { artistService } from '../../services/artist-service';
import type { ArtistArtworksResponse } from '../../types/artwork';

export function useArtistArtworksQuery(artistId: string) {
	return useQuery<ArtistArtworksResponse>({
		queryKey: ['artist-artworks', artistId],
		queryFn: async () => {
			console.log('Fetching artist artworks for:', artistId);
			const result = await artistService.getArtistArtworks(artistId);
			console.log('Artist artworks result:', result);
			return result;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled: !!artistId, // Only run if artistId is provided
	});
}
