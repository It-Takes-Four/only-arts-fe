import { useQuery } from '@tanstack/react-query';
import { artistService } from '../../services/artist-service';
import type { ArtistCollectionsResponse } from '../../types/collection';

export function useArtistCollectionsQuery(artistId: string, page: number = 1, limit: number = 10) {
	return useQuery<ArtistCollectionsResponse>({
		queryKey: ['artist-collections', artistId, page, limit],
		queryFn: async () => {
			console.log('Fetching artist collections for:', artistId, 'page:', page);
			const result = await artistService.getArtistCollections(artistId, page, limit);
			console.log('Artist collections result:', result);
			return result;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled: !!artistId, // Only run if artistId is provided
	});
}
