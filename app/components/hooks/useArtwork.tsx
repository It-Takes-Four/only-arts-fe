import { useCallback, useEffect, useState } from "react";
import type { MyArtwork } from "../../types/collection";
import { artService } from "../../services/art-service";
import { useAuthContext } from "../core/auth-context";

export function useArtwork(artworkId: string | undefined) {
	const { user } = useAuthContext();
	const [artwork, setArtwork] = useState<MyArtwork | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isLiked, setIsLiked] = useState(artwork?.isLiked || false);
	const [likesCount, setLikesCount] = useState(artwork?.likesCount || 0);
	const [isLiking, setIsLiking] = useState(false);

	const fetchArtwork = useCallback(async () => {
		if (!artworkId) {
			setError("Artwork ID is required");
			setLoading(false);
			return;
		}

		try {
			const artworkData: MyArtwork = await artService.getArtworkById(
				artworkId
			);

			if (!artworkData) {
				setError("Artwork not found");
			} else {
				setArtwork(artworkData);
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch artwork"
			);
		} finally {
			setLoading(false);
		}
	}, [artworkId]);

	useEffect(() => {
		fetchArtwork();
	}, [artworkId]);

	useEffect(() => {
		if (artwork) {
			setIsLiked(artwork.isLiked);
			setLikesCount(artwork.likesCount || 0);
		}
	}, [artwork]);

	const handleLikeToggle = async () => {
		if (isLiking || !artworkId || !user?.id) return;

		setIsLiking(true);
		try {
			if (isLiked) {
				await artService.unlikeArtwork(artworkId, user?.id);
				setLikesCount((prev) => Math.max(prev - 1, 0));
			} else {
				await artService.likeArtwork(artworkId, user?.id);
				setLikesCount((prev) => prev + 1);
			}
			setIsLiked(!isLiked);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to toggle like"
			);
		} finally {
			setIsLiking(false);
		}
	};

	return {
		artwork,
		loading,
		error,
		isLiked,
		likesCount,
		handleLikeToggle,
		isLiking,
	};
}
