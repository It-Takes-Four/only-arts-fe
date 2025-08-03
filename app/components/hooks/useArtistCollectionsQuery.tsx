import { useQuery, useQueryClient } from '@tanstack/react-query';
import { artistService } from '../../services/artist-service';

export function useArtistCollectionsQuery(artistId: string, page: number = 1, limit: number = 10) {
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: ['artist-collections', artistId, page, limit],
		queryFn: async () => {
			console.log('Fetching artist collections for:', artistId, 'page:', page);
			const result = await artistService.getArtistPublishedCollections(artistId, page, limit);
			console.log('Artist collections result:', result);
			return result;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled: !!artistId, // Only run if artistId is provided
	})

	const refreshCollections = async () => {
		await queryClient.invalidateQueries({ queryKey: ['artist-collections', artistId, page, limit] });
		await query.refetch();
	};

	
	return {
		collectionsData: query.data,
		collectionsLoading: query.isLoading,
		collectionsError: query.error,
	}
}
