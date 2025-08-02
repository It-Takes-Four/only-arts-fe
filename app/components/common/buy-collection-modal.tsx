import { useState } from "react";
import { Button } from "../common/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, Wallet, Image, User, Calendar, X } from "lucide-react";
import { toast } from "sonner";
import { collectionService } from "../../services/collection-service";
import { usePayment } from "../hooks/usePayment";
import { formatPriceDisplay } from "../../utils/currency";
import type { ArtistCollection } from "../../types/collection";
import { formatDistanceToNow } from "date-fns";

interface BuyCollectionModalProps {
	isOpen: boolean;
	onClose: () => void;
	collection: ArtistCollection;
	onSuccess?: () => void;
}

export function BuyCollectionModal({ isOpen, onClose, collection, onSuccess }: BuyCollectionModalProps) {
	const [isPurchasing, setIsPurchasing] = useState(false);
	const { paymentStatus, purchaseCollection } = usePayment();

	const handlePurchase = async () => {
		if (!collection) return;

		try {
			setIsPurchasing(true);
			toast.loading("Purchasing collection...");

			// Use the payment hook with the artist's wallet address
			// Fall back to a test wallet address if not available
			const artistWalletAddress = collection.artist.walletAddress || "0xe39a19f4339A808B0Cd4e60CB98aC565698467FB";
			await purchaseCollection(collection.id, artistWalletAddress);
			
			toast.success(`Successfully purchased "${collection.collectionName}"!`);
			onSuccess?.();
			onClose();
		} catch (error: any) {
			console.error("Purchase failed:", error);
			toast.error(error.message || "Failed to purchase collection");
		} finally {
			setIsPurchasing(false);
		}
	};

	const getCollectionImageUrl = () => {
		if (collection?.coverImageFileId) {
			return collectionService.getCollectionImageUrl(collection.coverImageFileId);
		}
		return "/placeholder.svg";
	};

	const getArtistAvatarUrl = () => {
		if (collection?.artist.user.profilePictureFileId) {
			return `${import.meta.env.VITE_API_BASE_URL}/upload/profile/${collection.artist.user.profilePictureFileId}`;
		}
		return "/placeholder-avatar.png";
	};

	if (!isOpen || !collection) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div 
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={() => !isPurchasing && onClose()}
			/>
			
			{/* Modal */}
			<div className="relative bg-background border rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b">
					<div>
						<h2 className="text-lg font-semibold flex items-center gap-2">
							<Wallet className="h-5 w-5" />
							Purchase Collection
						</h2>
						<p className="text-sm text-muted-foreground mt-1">
							Review the details and confirm your purchase
						</p>
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={onClose}
						disabled={isPurchasing}
						className="h-8 w-8 p-0"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>

				{/* Content */}
				<div className="p-6 space-y-6">
					{/* Collection Preview */}
					<div className="space-y-4">
						<div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
							<img
								src={getCollectionImageUrl()}
								alt={collection.collectionName}
								className="w-full h-full object-cover"
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.src = "/placeholder.svg";
								}}
							/>
							{collection.artsCount > 0 && (
								<div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
									<Image className="h-3 w-3" />
									{collection.artsCount}
								</div>
							)}
						</div>

						<div>
							<h3 className="font-semibold text-lg">{collection.collectionName}</h3>
							{collection.description && (
								<p className="text-sm text-muted-foreground mt-1">{collection.description}</p>
							)}
						</div>
					</div>

					{/* Artist Info */}
					<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
						<img
							src={getArtistAvatarUrl()}
							alt={collection.artist.artistName}
							className="w-10 h-10 rounded-full object-cover"
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								target.src = "/placeholder-avatar.png";
							}}
						/>
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<p className="font-medium text-sm">{collection.artist.artistName}</p>
								{collection.artist.isVerified && (
									<Badge variant="secondary" className="text-xs px-1 py-0">
										✓ Verified
									</Badge>
								)}
							</div>
							<p className="text-xs text-muted-foreground">@{collection.artist.user.username}</p>
						</div>
					</div>

					{/* Collection Details */}
					<div className="space-y-3">
						<div className="flex justify-between items-center text-sm">
							<span className="text-muted-foreground">Created</span>
							<span className="flex items-center gap-1">
								<Calendar className="h-3 w-3" />
								{formatDistanceToNow(new Date(collection.createdAt), { addSuffix: true })}
							</span>
						</div>
						
						<div className="flex justify-between items-center text-sm">
							<span className="text-muted-foreground">Artworks</span>
							<span className="flex items-center gap-1">
								<Image className="h-3 w-3" />
								{collection.artsCount} pieces
							</span>
						</div>

						<div className="flex justify-between items-center text-sm">
							<span className="text-muted-foreground">Status</span>
							<Badge variant={collection.isPublished ? "default" : "secondary"}>
								{collection.isPublished ? "Published" : "Draft"}
							</Badge>
						</div>
					</div>

					{/* Price Section */}
					<div className="border-t pt-4">
						<div className="flex justify-between items-center">
							<span className="text-lg font-semibold">Total Price</span>
							<span className="text-2xl font-bold text-primary">
								{formatPriceDisplay(collection.price)}
							</span>
						</div>
					</div>

					{/* Warning */}
					<div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
						<AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
						<div className="text-xs text-yellow-800 dark:text-yellow-300">
							<p className="font-medium mb-1">Purchase Confirmation</p>
							<p>This purchase cannot be undone. You will get access to all artworks in this collection.</p>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-3">
						<Button
							variant="outline"
							onClick={onClose}
							disabled={isPurchasing}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button
							onClick={handlePurchase}
							disabled={isPurchasing}
							className="flex-1"
						>
							{isPurchasing ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin mr-2" />
									{paymentStatus || "Processing..."}
								</>
							) : (
								<>
									<Wallet className="h-4 w-4 mr-2" />
									Purchase {formatPriceDisplay(collection.price)}
								</>
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
