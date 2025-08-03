import { CalendarDays, Heart, ImageIcon, Share2, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../../components/common/glass-card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useArtwork } from "../../components/hooks/useArtwork";
import { useNavigate, useParams } from "react-router";
import { collectionService } from "../../services/collection-service";
import { formatDateToMonthYear } from "../../utils/dates/DateFormatter";
import { motion, AnimatePresence } from "framer-motion";
import { getUserInitials } from "../../utils/UtilityFunction";
import { cn } from "@/lib/utils";
import { AnimatedHeart } from "../../components/common/animated-heart";
import { ArtworkShareButton } from "../../components/common/animated-share-button";
import { useState } from "react";

export function ArtPage() {
	const { artworkId } = useParams<{ artworkId: string }>();
	const { artwork, error, handleLikeToggle, isLiking, isLiked, likesCount } =
		useArtwork(artworkId);
	const navigate = useNavigate();
	const [isLikeAnimating, setIsLikeAnimating] = useState(false);

	const handleAnimatedLikeToggle = async () => {
		if (isLiking) return;

		setIsLikeAnimating(true);
		await handleLikeToggle();

		// Reset animation state after animation completes
		setTimeout(() => {
			setIsLikeAnimating(false);
		}, 800);
	};

	// Handle error state
	if (error || !artwork) {
		return (
			<motion.div
				className="flex flex-col items-center justify-center min-h-[400px] space-y-4"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="text-center">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.3, delay: 0.2 }}
						className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 mx-auto"
					>
						<span className="text-2xl">😵</span>
					</motion.div>
					<p className="text-lg font-medium text-destructive mb-2">
						Failed to load artwork
					</p>
					<p className="text-sm text-muted-foreground mb-4">
						{error}
					</p>
				</div>
			</motion.div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Artwork Display */}
			<div className="flex items-center justify-center mb-8">
				{artwork.imageFileId ? (
					<img
						src={collectionService.getArtworkImageUrl(
							artwork.imageFileId
						)}
						alt={artwork.title}
						className="w-fit h-auto max-h-[70vh] object-contain rounded-lg shadow-2xl"
					/>
				) : (
					<div className="flex items-center justify-center h-96 bg-gray-200/10 rounded-lg">
						<ImageIcon className="h-12 w-12 text-muted-foreground" />
					</div>
				)}
			</div>

			{/* Artwork Info Glass Card */}
			<GlassCard className="py-6 px-8 mb-6">
				<div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
					<div className="flex items-start space-x-4 flex-1">
						<Avatar className="h-16 w-16 ring-4 ring-primary/20">
							<AvatarImage
								src={
									artwork.artist.user.profilePictureFileId
										? `/api/files/${artwork.artist.user.profilePictureFileId}`
										: undefined
								}
							/>
							<AvatarFallback className="text-xl font-bold">
								{getUserInitials(artwork.artist.artistName)}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col flex-1">
							<h1 className="text-3xl lg:text-4xl font-bold mb-2">
								{artwork.title}
							</h1>
							<div className="flex items-center mb-3">
								<span className="text-lg text-muted-foreground">
									by&nbsp;
								</span>
								<span
									className="text-lg text-foreground font-semibold hover:text-primary cursor-pointer animate-in duration-300"
									onClick={() =>
										navigate(`/artist/${artwork.artist.id}`)
									}
								>
									{artwork.artist.artistName}
								</span>
							</div>
							<div className="flex flex-wrap items-center gap-3">
								<Badge
									variant="outline"
									className="font-mono text-xs uppercase"
								>
									POSTED{" "}
									{formatDateToMonthYear(artwork.datePosted)}
								</Badge>
								{artwork.collections &&
									artwork.collections.length > 0 && (
										<Badge variant="secondary">
											In Collection
										</Badge>
									)}
								{artwork.tokenId && (
									<Badge
										variant="outline"
										className="font-mono text-xs uppercase"
									>
										Token #{artwork.tokenId.toString()}
									</Badge>
								)}
							</div>
						</div>
					</div>

					<Separator className="lg:hidden" />

					{/* Stats Section */}
					<div className="flex items-center justify-center w-full lg:w-fit space-x-6">
						<div className="flex flex-col items-center lg:items-end">
							<span className="text-xs text-muted-foreground font-mono uppercase">
								Likes
							</span>
							<AnimatePresence mode="wait">
								<motion.span
									key={likesCount}
									className="text-2xl font-semibold"
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									exit={{ scale: 1.2, opacity: 0 }}
									transition={{ duration: 0.3, ease: "easeOut" }}
								>
									{likesCount}
								</motion.span>
							</AnimatePresence>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<Separator className="my-6" />
				<div className="flex flex-wrap justify-between gap-3">
					<motion.div
						whileTap={{ scale: 0.95 }}
						transition={{ duration: 0.1 }}
					>
						<Button
							size="lg"
							variant={isLiked ? "default" : "outline"}
							onClick={handleAnimatedLikeToggle}
							disabled={isLiking}
							className={cn(
								"transition-all duration-300 overflow-hidden",
								isLiked && "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25"
							)}
						>
							<AnimatedHeart
								isLiked={isLiked}
								isAnimating={isLikeAnimating}
								className="mr-2"
							/>
							<motion.span
								animate={{
									x: isLikeAnimating ? [0, -2, 2, 0] : 0
								}}
								transition={{ duration: 0.3 }}
							>
								{isLiking ? "..." : isLiked ? "Liked" : "Like Art"}
							</motion.span>
						</Button>
					</motion.div>

					<ArtworkShareButton
						artwork={artwork}
						size="lg"
						showSocialOptions={true}
						onShare={(method) => {
							//console.log(`Shared artwork via ${method}`);
						}}
					/>
				</div>
			</GlassCard>

			{/* Tags Section */}
			<GlassCard className="p-6 mb-6">
				{artwork.description && (
					<>
						<h2 className="text-lg font-bold mb-1">Description</h2>
						<p className="text-md text-muted-foreground mb-4">
							{artwork.description}
						</p>
					</>
				)}


				{artwork.tags.length > 0 && (
					<>
						<h3 className="text-lg font-semibold mb-2">Tags</h3>
						<div className="flex flex-wrap gap-2">
							{artwork.tags.map((tag, index) => (
								<Badge
									key={index}
									variant="outline"
									className="text-sm"
								>
									<Tag className="w-3 h-3 mr-1" />
									{tag.tagName}
								</Badge>
							))}
						</div>
					</>
				)}
			</GlassCard>

		</div>
	)
		;
}
