import { useCallback, useEffect, useState } from "react";
import type { DetailedCollection } from "../../types/collection";
import { collectionService } from "../../services/collection-service";

export function useCollection(collectionId: string | undefined) {
	const [collection, setCollection] = useState<DetailedCollection | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

	const fetchCollection = useCallback(async () => {
		if (!collectionId) {
			setError('Collection ID is required');
			setLoading(false);
			return;
		}

		try {
			const collectionData: DetailedCollection = await collectionService.getCollectionById(collectionId);

			if (collectionData.coverImageFileId) {
				const imageUrl = collectionService.getCollectionImageUrl(collectionData.coverImageFileId);
				setCoverImageUrl(imageUrl);
			} else {
				setCoverImageUrl(null);
			}

			if (!collectionData) {
				setError('Collection not found');
			} else {
				setCollection(collectionData);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch collection');
		} finally {
			setLoading(false);
		}
	}, [collectionId]);

	useEffect(() => {
		fetchCollection();
	}, [collectionId]);

	return { collection, coverImageUrl, loading, error };
}