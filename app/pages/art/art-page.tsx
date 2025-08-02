import { CalendarDays, Heart, ImageIcon, Share2, Tag, } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../../components/common/glass-card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useArtwork } from "../../components/hooks/useArtwork";
import { useNavigate, useParams } from "react-router";
import { collectionService } from "../../services/collection-service";
import { formatDateToMonthYear } from "../../utils/dates/DateFormatter";
import { motion } from "framer-motion";
import { getUserInitials } from "../../utils/UtilityFunction";

export function ArtPage() {
	const { artworkId } = useParams<{ artworkId: string }>();
	const { artwork, error } = useArtwork(artworkId);
	const navigate = useNavigate();

	console.log("artwork", artwork);
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
						<ImageIcon className="h-12 w-12 text-muted-foreground"/>
					</div>
				)}
			</div>

			{/* Artwork Info Glass Card */}
			<GlassCard className="py-6 px-8 mb-6">
				<div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
					<div className="flex items-start space-x-4 flex-1">
						<Avatar className="h-16 w-16 ring-4 ring-primary/20">
							<AvatarImage src={artwork.artist.userId}/>
							<AvatarFallback className="text-xl font-bold">
								{getUserInitials(artwork.artist.artistName)}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col flex-1">
							<h1 className="text-3xl lg:text-4xl font-bold mb-2">
								{artwork.title}
							</h1>
							<div className="flex items-center mb-3">
								<span className="text-lg text-muted-foreground">by&nbsp;</span>
								<span
									className="text-lg text-foreground font-semibold hover:text-primary cursor-pointer animate-in duration-300"
									onClick={() => navigate(`/artist/${artwork.artist.userId}`)}>
									{artwork.artist.artistName}
								</span>
							</div>
							{artwork.description && (
								<p className="text-sm text-muted-foreground mb-3 max-w-2xl">
									{artwork.description}
								</p>
							)}
							<div className="flex flex-wrap items-center gap-3">
								<Badge
									variant="outline"
									className="font-mono text-xs uppercase"
								>
									POSTED{" "}
									{formatDateToMonthYear(artwork.datePosted)}
								</Badge>
								{artwork.isInACollection && (
									<Badge variant="secondary">
										In Collection
									</Badge>
								)}
								{artwork.tokenId && (
									<Badge variant="outline" className="font-mono text-xs uppercase">
										Token #{artwork.tokenId.toString()}
									</Badge>
								)}
							</div>
						</div>
					</div>

					<Separator className="lg:hidden"/>

					{/* Stats Section */}
					<div className="flex items-center justify-center w-full lg:w-fit space-x-6">
						<div className="flex flex-col items-center lg:items-end">
							<span className="text-xs text-muted-foreground font-mono uppercase">
								Likes
							</span>
							<span className="text-2xl font-semibold">
								{artwork.likesCount ?? "0"}
							</span>
						</div>
						<div className="flex flex-col items-center lg:items-end">
							<span className="text-xs text-muted-foreground font-mono uppercase">
								Status
							</span>
							<span className="text-2xl font-semibold">
								{artwork.isInACollection
									? "Collected"
									: "Available"}
							</span>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<Separator className="my-6"/>
				<div className="flex flex-wrap gap-3">
					<Button size="lg">
						<Heart className="w-5 h-5 mr-2"/>
						Like Art
					</Button>
					<Button size="lg" variant="outline">
						Add to Collection
					</Button>
					<Button size="lg" variant="outline">
						<Share2 className="w-5 h-5 mr-2"/>
						Share
					</Button>
				</div>
			</GlassCard>

			{/* Tags Section */}
			{artwork.tags.length > 0 && (
				<GlassCard className="p-6 mb-6">
					<h3 className="text-lg font-semibold mb-4">Tags</h3>
					<div className="flex flex-wrap gap-2">
						{artwork.tags.map((tag, index) => (
							<Badge
								key={index}
								variant="outline"
								className="text-sm"
							>
								<Tag className="w-3 h-3 mr-1"/>
								{tag.tagName}
							</Badge>
						))}
					</div>
				</GlassCard>
			)}

			{/* Additional Details */}
			<GlassCard className="p-6">
				<h3 className="text-lg font-semibold mb-4">Artwork Details</h3>
				<div className="grid md:grid-cols-2 gap-6">
					<div className="space-y-3">
						<div className="flex items-center gap-3 text-muted-foreground">
							<CalendarDays className="w-5 h-5"/>
							<span>
								Posted on{" "}
								{new Date(
									artwork.datePosted
								).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</span>
						</div>
						{artwork.tokenId && (
							<div className="flex items-center gap-3 text-muted-foreground">
								<Tag className="w-5 h-5"/>
								<span>
									Token ID: {artwork.tokenId.toString()}
								</span>
							</div>
						)}
						<div className="flex items-center gap-3 text-muted-foreground">
							<ImageIcon className="w-5 h-5"/>
							<span>
								Status:{" "}
								{artwork.isInACollection
									? "In Collection"
									: "Available"}
							</span>
						</div>
					</div>
					<div className="space-y-3">
						<div className="flex items-center gap-3 text-muted-foreground">
							<Heart className="w-5 h-5"/>
							<span>{artwork.likesCount} Likes</span>
						</div>
						{artwork.isInACollection && (
							<div className="flex items-center gap-3 text-muted-foreground">
								<ImageIcon className="w-5 h-5"/>
								<span>Part of a Collection</span>
							</div>
						)}
					</div>
				</div>
			</GlassCard>
		</div>
	);
}
