import {
	CalendarDays,
	Heart,
	ImageIcon,
	Tag,
	User,
	Share2,
	Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../../components/common/glass-card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useArtwork } from "../../components/hooks/useArtwork";
import { useParams } from "react-router";
import { collectionService } from "../../services/collection-service";
import { formatDateToMonthYear } from "../../utils/dates/DateFormatter";

export function ArtPage() {
	const { artworkId } = useParams<{ artworkId: string }>();
	const { artwork, loading, error } = useArtwork(artworkId!);

	if (loading) {
		return <div className="text-center">Loading artwork...</div>;
	}

	if (error) {
		return <div className="text-center text-red-500">{error}</div>;
	}

	if (!artwork) {
		return (
			<div className="text-center text-red-500">Artwork not found</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Hero Section with Artwork and Glass Card Overlay */}
			<div
				className="relative bg-cover bg-center h-[70vh] w-full rounded-lg p-4 flex flex-col justify-end mb-6"
				style={{
					backgroundImage: artwork.imageFileId
						? `url(${collectionService.getArtworkImageUrl(
								artwork.imageFileId
						  )})`
						: "url(/profile-background.jpg)",
				}}
			>
				{/* Dark overlay for better text readability */}
				<div className="absolute inset-0 bg-black/40 rounded-lg" />

				{/* Artwork Info Glass Card */}
				<GlassCard className="relative z-10 py-6 px-8">
					<div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
						<div className="flex items-start lg:items-end space-x-4 flex-1">
							<Avatar className="h-20 w-20 ring-4 ring-white/20">
								<AvatarImage src={""} />
								<AvatarFallback className="text-xl font-bold bg-white/20 text-white">
									{artwork.artist.artistName
										.charAt(0)
										.toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col flex-1">
								<h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
									{artwork.title}
								</h1>
								<div className="flex items-center text-white/80 mb-3">
									<User className="w-4 h-4 mr-2" />
									<span className="text-lg">
										{artwork.artist.artistName}
									</span>
								</div>
								{artwork.description && (
									<p className="text-sm text-white/75 mb-3 max-w-2xl">
										{artwork.description}
									</p>
								)}
								<div className="flex flex-wrap items-center gap-3">
									<Badge
										variant="outline"
										className="font-mono text-xs uppercase border-white/25 text-white"
									>
										POSTED{" "}
										{formatDateToMonthYear(
											artwork.datePosted
										)}
									</Badge>
									{artwork.isInACollection && (
										<Badge
											variant="secondary"
											className="bg-white/20 text-white border-white/25"
										>
											In Collection
										</Badge>
									)}
									{artwork.tokenId && (
										<Badge
											variant="outline"
											className="border-white/25 text-white"
										>
											Token #{artwork.tokenId.toString()}
										</Badge>
									)}
								</div>
							</div>
						</div>

						<Separator className="bg-white/15 my-4 lg:hidden" />

						{/* Stats Section */}
						<div className="flex items-end space-x-6">
							<div className="flex flex-col items-center lg:items-end">
								<span className="text-xs text-white/75 font-mono uppercase">
									Likes
								</span>
								<span className="text-2xl font-semibold text-white">
									{artwork.likesCount}
								</span>
							</div>
							<div className="flex flex-col items-center lg:items-end">
								<span className="text-xs text-white/75 font-mono uppercase">
									Collections
								</span>
								<span className="text-2xl font-semibold text-white">
									{artwork.isInACollection ? 1 : 0}
								</span>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<Separator className="bg-white/15 my-6" />
					<div className="flex flex-wrap gap-3">
						<Button
							size="lg"
							className="bg-white/20 hover:bg-white/30 text-white border-white/25"
						>
							<Heart className="w-5 h-5 mr-2" />
							Like Art
						</Button>

						<Button
							size="lg"
							variant="outline"
							className="bg-transparent border-white/25 text-white hover:bg-white/10"
						>
							<Share2 className="w-5 h-5 mr-2" />
							Share
						</Button>
					</div>
				</GlassCard>
			</div>

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
								<Tag className="w-3 h-3 mr-1" />
								{tag.tag.tagName}
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
							<CalendarDays className="w-5 h-5" />
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
								<Tag className="w-5 h-5" />
								<span>
									Token ID: {artwork.tokenId.toString()}
								</span>
							</div>
						)}
						<div className="flex items-center gap-3 text-muted-foreground">
							<ImageIcon className="w-5 h-5" />
							<span>
								Collections: {artwork.isInACollection ? 1 : 0}
							</span>
						</div>
					</div>
					<div className="space-y-3">
						<div className="flex items-center gap-3 text-muted-foreground">
							<Heart className="w-5 h-5" />
							<span>{artwork.likesCount} Likes</span>
						</div>
						{artwork.isInACollection && (
							<div className="flex items-center gap-3 text-muted-foreground">
								<ImageIcon className="w-5 h-5" />
								<span>Part of a Collection</span>
							</div>
						)}
					</div>
				</div>
			</GlassCard>
		</div>
	);
}
