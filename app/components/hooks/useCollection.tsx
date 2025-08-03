import { useCallback, useEffect, useState } from "react";
import type { DetailedCollection, MyArtwork } from "../../types/collection";
import { collectionService } from "../../services/collection-service";
import { artCollectionsService } from "../../services/art-collections-service";
import { useAuthContext } from "../core/auth-context";

export function useCollection(collectionId: string | undefined) {
	const {user} = useAuthContext();
	const [collection, setCollection] = useState<DetailedCollection | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [collectionImageUrl, setCollectionImageUrl] = useState<string | null>(null);
	const [collectionArtworks, setCollectionArtworks] = useState<MyArtwork[]>([]);

	const fetchCollection = useCallback(async () => {
		if (!collectionId) {
			setError('Collection ID is required');
			setLoading(false);
			return;
		}

		try {
			const collectionData: DetailedCollection = await collectionService.getCollectionById(collectionId);

			if (collectionData.coverImageFileId) {
				const imageUrl = artCollectionsService.getCollectionImageUrl(collectionData.coverImageFileId);
				setCollectionImageUrl(imageUrl);
			} else {
				setCollectionImageUrl(null);
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

	const fetchCollectionArtworks = useCallback(async () => {
		if (!collectionId) {
			setError('Collection ID is required to fetch artworks');
			return;
		}

		if (collection?.isPurchased === false) {
			// setError('This collection is not purchased yet. Please purchase it to view artworks.');
			return;
		}

		try {
			const artworks: MyArtwork[] = await collectionService.getCollectionArtworks(collectionId);
			setCollectionArtworks(artworks);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch artworks');
		}
	}, [collectionId]);

	useEffect(() => {
		fetchCollection();
		fetchCollectionArtworks();
	}, [collectionId]);

	return { collection, collectionImageUrl, loading, error, collectionArtworks, isArtist : user?.artist?.id === collection?.artistId || false };
}