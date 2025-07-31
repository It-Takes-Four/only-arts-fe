import { ArtCard } from "../../components/common/art-card";
import { GlassCard } from "../../components/common/glass-card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router";
import { collectionService } from "../../services/collection-service";
import { useEffect } from "react";
import { useCollection } from "../../components/hooks/useCollection";
import { formatDateToMonthYear } from "../../utils/dates/DateFormatter";

export function CollectionPage() {
	const { collectionId } = useParams<{ collectionId: string }>();
	const { collection, coverImageUrl, loading, error } = useCollection(collectionId);

	if (loading) {
		return <div className="text-center">Loading collection...</div>;
	}

	if (error) {
		return <div className="text-center text-red-500">{error}</div>;
	}

	if (!collection) {
		return <div className="text-center text-red-500">Collection not found</div>;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Profile Header */}

			<div
				className="bg-cover bg-center h-80 w-full rounded-lg p-4 flex flex-col justify-between mb-6"
				style={{ backgroundImage: `url(${coverImageUrl})` }}
			>
				{/* Collection Data */}
				<GlassCard className="py-4 px-8 flex flex-col lg:flex-row justify-between">
					<div className="flex items-start lg:items-end space-x-4">
						<img
							src="https://placehold.co/150x150"
							alt="Artist Avatar"
							className="rounded-full w-2- h-20 shadow-lg"
						/>
						<div className="flex flex-col rounded-lg">
							<span className="flex items-center text-white">
								<h1 className="text-2xl font-bold text-white">
									{collection.collectionName}
								</h1>
							</span>
							{
								collection.description && (
									<span className="text-sm text-white/75 mt-1">
										{collection.description}
									</span>
								)
							}
							<Badge
								variant="outline"
								className="mt-2 font-mono text-primary-foreground text-xs uppercase border-white/25"
							>
								CREATED {formatDateToMonthYear(collection.createdAt)}
							</Badge>
						</div>
					</div>
					<Separator className="bg-white/15 my-4 lg:hidden" />

					<div className="rounded-lg flex items-end space-x-6">
						<div className="flex flex-col items-center lg:items-end flex-1">
							<span className="text-xs text-white/75 font-mono uppercase">
								Artworks
							</span>
							<span className="text-lg font-semibold text-white">
								{collection.arts.length}
							</span>
						</div>
						<div className="flex flex-col items-center lg:items-end flex-1">
							<span className="text-xs text-white/75 font-mono uppercase">
								Owners
							</span>
							<span className="text-lg font-semibold text-white">
								XXX
							</span>
						</div>
					</div>
				</GlassCard>
			</div>

			{/*	Main Content */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
				{
					collection.arts.length > 0 && collection.arts.map(art => (
						<ArtCard
							key={art.id}
							art={{
								id: art.artId,
								title: art.art.title,
								description: art.art.description,
								artist: {
									id: art.art.artistId,
									name: art.art.artist.artistName,
									profilePicture: art.art.artist.user?.profilePictureFileId || null,
								},
								createdAt: art.addedAt,
								imageUrl: collectionService.getArtworkImageUrl(art.art.imageFileId),
							}}
						/>
					))
				}
			</div>
		</div>
	);
}
