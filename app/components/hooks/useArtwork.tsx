import { useCallback, useEffect, useState } from "react";
import type { MyArtwork } from "../../types/collection";
import { artService } from "../../services/art-service";

export function useArtwork(artworkId: string | undefined) {
	const [artwork, setArtwork] = useState<MyArtwork | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchArtwork = useCallback(async () => {
		if (!artworkId) {
			setError('Artwork ID is required');
			setLoading(false);
			return;
		}

		try {
			const artworkData: MyArtwork = await artService.getArtworkById(artworkId);

			if (!artworkData) {
				setError('Artwork not found');
			} else {
				setArtwork(artworkData);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch artwork');
		} finally {
			setLoading(false);
		}
	}, [artworkId]);

	useEffect(() => {
		fetchArtwork();
	}, [artworkId]);

	return { artwork, loading, error };
}