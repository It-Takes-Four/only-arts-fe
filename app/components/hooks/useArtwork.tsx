import { useEffect, useState } from "react";
import type { MyArtwork } from "../../types/collection";
import { artService } from "../../services/art-service";

export function useArtwork(artworkId: string | undefined) {
	const [artwork, setArtwork] = useState<MyArtwork | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!artworkId) {
			setError('Artwork ID is required');
			setLoading(false);
			return;
		}

		const fetchArtwork = async () => {
			try {
				setLoading(true);
				setError(null);

				const artworkData = await artService.getArtworkById(artworkId);

				console.log("this is artwork data", artworkData);

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
		};

		fetchArtwork();
	}, [artworkId]);

	return { artwork, loading, error };
}