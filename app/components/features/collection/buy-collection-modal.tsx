import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
	Dialog, 
	DialogContent, 
	DialogDescription, 
	DialogFooter,
	DialogHeader, 
	DialogTitle 
} from "@/components/ui/dialog";
import { Loader2, AlertTriangle, Wallet, Image, User, Calendar, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { collectionService } from "../../../services/collection-service";
import { formatPriceDisplay } from "../../../utils/currency";
import type { ArtistCollection } from "../../../types/collection";
import { usePayment } from "../../hooks/usePayment";

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
		
		const toastId = toast.loading("Purchasing collection...");

		try {
			setIsPurchasing(true);

			// Use the payment hook with the artist's wallet address
			// Fall back to a test wallet address if not available
			const artistWalletAddress = collection.artist.walletAddress || "0xe39a19f4339A808B0Cd4e60CB98aC565698467FB";
			await purchaseCollection(collection.id, artistWalletAddress);
			
			toast.success(`Successfully purchased "${collection.collectionName}"!`, {
				id: toastId,
			});

			onSuccess?.();
			onClose();
		} catch (error: any) {
			console.error("Purchase failed:", error);
			toast.error(error.message || "Failed to purchase collection", {
				id: toastId,
			});
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

	if (!collection) return null;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !isPurchasing && !open && onClose()}>
			<DialogContent className="max-w-lg w-[95vw] sm:w-full mx-auto max-h-[95vh] overflow-hidden p-3 sm:p-4" showCloseButton={!isPurchasing}>
				<DialogHeader className="text-left space-y-1 pb-1">
					<DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
						<div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 flex-shrink-0">
							<Wallet className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
						</div>
						<span className="truncate">Purchase Collection</span>
					</DialogTitle>
					<DialogDescription className="text-xs sm:text-sm leading-snug">
						Review details and confirm purchase for instant access.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-2 sm:space-y-3 overflow-y-auto max-h-[calc(95vh-200px)]">
					{/* Collection Preview Card */}
					<div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-background to-muted/30 shadow-sm">
						<div className="relative aspect-[16/9] overflow-hidden">
							<img
								src={getCollectionImageUrl()}
								alt={collection.collectionName}
								className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.src = "/placeholder.svg";
								}}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
							
							{/* Collection stats overlay */}
							<div className="absolute bottom-2 left-2 right-2">
								<div className="flex items-end justify-between gap-2">
									<div className="flex-1 min-w-0">
										<h3 className="font-bold text-white text-sm sm:text-base leading-tight truncate">{collection.collectionName}</h3>
										{collection.description && (
											<p className="text-white/80 text-xs mt-0.5 line-clamp-1">{collection.description}</p>
										)}
									</div>
									{collection.artsCount > 0 && (
										<div className="bg-black/70 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-xs flex items-center gap-1 flex-shrink-0">
											<Image className="h-2.5 w-2.5" />
											<span>{collection.artsCount}</span>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Artist Info Card */}
					<div className="flex items-center gap-2 p-2 sm:p-3 bg-muted/50 rounded-lg border shadow-sm">
						<div className="relative flex-shrink-0">
							<img
								src={getArtistAvatarUrl()}
								alt={collection.artist.artistName}
								className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-background"
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.src = "/placeholder-avatar.png";
								}}
							/>
							{collection.artist.isVerified && (
								<div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center">
									<Sparkles className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-white" />
								</div>
							)}
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2">
								<p className="font-semibold text-xs sm:text-sm truncate">{collection.artist.artistName}</p>
								{collection.artist.isVerified && (
									<Badge variant="secondary" className="text-xs px-0 py-0 bg-blue-500/10 text-blue-600 flex-shrink-0">
										<CheckBadgeIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
									</Badge>
								)}
							</div>
						</div>
					</div>

					{/* Collection Details Grid */}
					<div className="grid grid-cols-2 gap-2">
						<div className="p-2 bg-muted/30 rounded border">
							<div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
								<Calendar className="h-2.5 w-2.5 flex-shrink-0" />
								<span className="truncate">Created</span>
							</div>
							<p className="font-medium text-xs">
								{formatDistanceToNow(new Date(collection.createdAt), { addSuffix: true })}
							</p>
						</div>
						
						<div className="p-2 bg-muted/30 rounded border">
							<div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
								<Image className="h-2.5 w-2.5 flex-shrink-0" />
								<span className="truncate">Artworks</span>
							</div>
							<p className="font-medium text-xs">{collection.artsCount} pieces</p>
						</div>
					</div>

					{/* Price Section */}
					<div className="p-2 sm:p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20 shadow-sm">
						<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
							<div className="flex-1">
								<p className="text-xs text-muted-foreground mb-0.5">Total Price</p>
								<p className="text-xl sm:text-2xl font-bold text-primary">
									{formatPriceDisplay(collection.price)}
								</p>
							</div>
							<div className="text-left sm:text-right">
								<Badge 
									variant={collection.isPublished ? "default" : "secondary"} 
									className="mb-1 text-xs"
								>
									{collection.isPublished ? "Published" : "Draft"}
								</Badge>
								<p className="text-xs text-muted-foreground">One-time purchase</p>
							</div>
						</div>
					</div>
				</div>

				{/* Enhanced Footer */}
				<DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-2 border-t mt-2">
					<Button
						variant="outline"
						onClick={onClose}
						disabled={isPurchasing}
						className="flex-1 sm:flex-none cursor-pointer hover:bg-muted/80 transition-colors duration-200 h-8 sm:h-9 text-xs sm:text-sm"
					>
						Cancel
					</Button>
					<Button
						onClick={handlePurchase}
						disabled={isPurchasing}
						className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer disabled:cursor-not-allowed h-8 sm:h-9 text-xs sm:text-sm"
					>
						{isPurchasing ? (
							<>
								<Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin mr-1.5" />
								<span className="truncate">{paymentStatus || "Processing..."}</span>
							</>
						) : (
							<>
								<Wallet className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 flex-shrink-0" />
								<span className="truncate">Purchase for {formatPriceDisplay(collection.price)}</span>
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
