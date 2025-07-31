import { CalendarDays, Heart, ImageIcon, Tag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useArtwork } from "../../components/hooks/useArtwork";
import { useParams } from "react-router";
import { collectionService } from "../../services/collection-service";

export function ArtPage() {
	const { artworkId } = useParams<{ artworkId: string }>();
	const { artwork, loading, error } = useArtwork(artworkId!);

	if (loading) {
		return <div className="text-center">Loading collection...</div>;
	}

	if (error) {
		return <div className="text-center text-red-500">{error}</div>;
	}

	if (!artwork) {
		return (
			<div className="text-center text-red-500">Collection not found</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
				{/* Left Column: Image */}
				<div className="overflow-hidden shadow-lg">
					{artwork.imageFileId ? (
						<img
							src={collectionService.getArtworkImageUrl(
								artwork.imageFileId
							)}
							alt={artwork.title}
							className="object-cover rounded-lg w-full h-auto"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
					) : (
						<div className="flex items-center justify-center h-full bg-gray-200/10 rounded-lg">
							<ImageIcon className="h-6 w-6 text-muted-foreground" />
						</div>
					)}
				</div>

				{/* Right Column: Details */}
				<div className="grid gap-6">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
						{artwork.title}
					</h1>

					<div className="flex items-center gap-4 text-lg text-muted-foreground">
						<div className="flex items-center gap-2">
							<User className="w-5 h-5" />
							<span>{artwork.artist.artistName}</span>
						</div>
						<div className="flex items-center gap-2">
							<Heart className="w-5 h-5 fill-red-500 text-red-500" />
							<span>{artwork.likesCount} Likes</span>
						</div>
					</div>

					<p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
						{artwork.description}
					</p>

					<div className="grid gap-2 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<CalendarDays className="w-4 h-4" />
							<span>
								Posted:{" "}
								{new Date(
									artwork.datePosted
								).toLocaleDateString()}
							</span>
						</div>
						{artwork.tokenId && (
							<div className="flex items-center gap-2">
								<Tag className="w-4 h-4" />
								<span>
									Token ID: {artwork.tokenId.toString()}
								</span>
							</div>
						)}
						{artwork.isInACollection && (
							<Badge variant="secondary" className="w-fit">
								In a Collection
							</Badge>
						)}
					</div>

					{artwork.tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{artwork.tags.map((tag, index) => (
								<Badge key={index} variant="outline">
									{tag.tag.tagName}
								</Badge>
							))}
						</div>
					)}

					<div className="flex gap-4 mt-4">
						<Button size="lg" className="flex-1">
							<Heart className="w-5 h-5 mr-2" />
							Like Art
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="flex-1 bg-transparent"
						>
							Add to Collection
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
