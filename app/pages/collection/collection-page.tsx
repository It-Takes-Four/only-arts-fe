import { ArtCard } from "../../components/features/art/art-card";
import { GlassCard } from "../../components/common/glass-card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, User, Bookmark } from "lucide-react";
import { useParams, Link } from "react-router";
import { collectionService } from "../../services/collection-service";
import { artCollectionsService } from "../../services/art-collections-service";
import { useCollection } from "../../components/hooks/useCollection";
import { motion } from "framer-motion";
import { getUserInitials } from "../../utils/UtilityFunction";
import { formatPriceDisplay } from "../../utils/currency";
import { BuyCollectionButton } from "../../components/common/buy-collection-button";

export function CollectionPage() {
	const { collectionId } = useParams<{ collectionId: string }>();
	const { collection, collectionImageUrl, error } = useCollection(collectionId);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 1) return "Yesterday";
		if (diffDays < 7) return `${diffDays} days ago`;
		if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
		return date.toLocaleDateString();
	};

	// Handle error state
	if (error || !collection) {
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
						Failed to load collection
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
			{/* Collection Header with Main Image */}
			<div
				className="relative bg-cover bg-center h-[50vh] w-full rounded-lg p-4 flex flex-col justify-end mb-8"
				style={{ backgroundImage: `url(${collectionImageUrl || '/profile-background.jpg'})` }}
			>
				{/* Subtle gradient overlay for better text readability */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-lg" />

				{/* Collection Info Glass Card */}
				<GlassCard className="relative z-10 py-6 px-8">
					<div className="absolute top-2 right-2">
						<BuyCollectionButton 
							collection={collection as any}
							onPurchaseSuccess={() => {
								// Handle successful purchase - maybe refetch collection data
								console.log('Collection purchased successfully');
							}}
						/>
					</div>
					<div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-2">
						<div className="flex items-start lg:items-end space-x-4 flex-1">
							<div className="flex flex-col flex-1">
								<h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">
									{collection.collectionName}
								</h1>
								{collection.description && (
									<p className="text-sm text-white/75 mb-3 max-w-2xl">
										{collection.description}
									</p>
								)}
								<div className="flex flex-wrap items-center gap-2">
									<Badge
										variant="outline"
										className="font-mono text-xs uppercase border-white/25 text-white"
									>
										CREATED {formatDate(collection.createdAt)}
									</Badge>
									{collection.isPublished && (
										<Badge variant="secondary" className="bg-green-500/20 text-green-100 font-mono uppercase">
											Published
										</Badge>
									)}
									{collection.tokenId && (
										<Badge variant="outline" className="border-white/25 text-white">
											Token #{collection.tokenId}
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
									Artworks
								</span>
								<span className="text-2xl font-semibold text-white">
									{collection.arts?.length || 0}
								</span>
							</div>
							<div className="flex flex-col items-center lg:items-end">
								<span className="text-xs text-white/75 font-mono uppercase">
									Price
								</span>
								<span className="text-2xl font-semibold text-white">
									{collection.price ? formatPriceDisplay(collection.price) : 'Free'}
								</span>
							</div>
						</div>
					</div>
				</GlassCard>
			</div>

			{/* Artist Information Card */}
			<GlassCard className="p-6 mb-8">
				<div className="flex items-center space-x-4">
					<Link to={`/artist/${collection.artist.id}`}>
						<Avatar className="h-20 w-20 hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer">
							<AvatarImage
								src={collection.artist.user.profilePictureFileId
									? artCollectionsService.getUserProfileImageUrl(collection.artist.user.profilePictureFileId)
									: ""
								}
							/>
							<AvatarFallback className="text-lg font-bold">
								{getUserInitials(collection.artist.artistName)}
							</AvatarFallback>
						</Avatar>
					</Link>
					<div className="flex-1">
						<div className="flex items-center space-x-2 mb-2">
							<Link
								to={`/artist/${collection.artist.id}`}
								className="text-xl font-bold hover:text-primary transition-colors cursor-pointer"
							>
								{collection.artist.artistName}
							</Link>
							{collection.artist.isVerified && (
								<Badge variant="secondary" className="bg-blue-500/20 text-blue-500">
									Verified Artist
								</Badge>
							)}
						</div>
						{collection.artist.bio && (
							<p className="text-muted-foreground text-sm mb-2">
								{collection.artist.bio}
							</p>
						)}
						<div className="flex items-center justify-start gap-6 text-sm text-foreground">

							<div className="flex items-center space-x-1">
								<User className="h-4 w-4 text-muted-foreground" />
								<span className="font-semibold">{collection.artist.totalFollowers}</span>
								<span className="text-muted-foreground">Followers</span>
							</div>

							<div className="flex items-center space-x-1">
								<Heart className="h-4 w-4 text-muted-foreground" />
								<span className="font-semibold">{collection.artist.totalArts}</span>
								<span className="text-muted-foreground">Artworks</span>
							</div>

							<div className="flex items-center space-x-1">
								<Bookmark className="h-4 w-4 text-muted-foreground" />
								<span className="font-semibold">{collection.artist.totalCollections}</span>
								<span className="text-muted-foreground">Collections</span>
							</div>
						</div>

					</div>
				</div>
			</GlassCard>
			{/* Artworks Section */}
			<div className="mb-6">
				<div className="flex items-center gap-2 mb-6">
					<h2 className="text-2xl font-bold">Collection Artworks</h2>
					<Badge variant="outline" className="text-md uppercase font-mono px-2.5 rounded-full">
						{collection.arts?.length || 0}
						{/*{collection.arts?.length === 1 ? ' Artwork' : ' Artworks'}*/}
					</Badge>
				</div>

				{collection.arts && collection.arts.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{collection.arts.map((art: any) => (
							<ArtCard
								key={art.id || art.artId}
								art={{
									id: art.artId || art.id,
									title: art.art?.title || art.title || 'Untitled',
									description: art.art?.description || art.description || '',
									artist: {
										id: art.art?.artistId || collection.artist.id,
										name: art.art?.artist?.artistName || collection.artist.artistName,
										profilePicture: art.art?.artist?.user?.profilePictureFileId || collection.artist.user.profilePictureFileId,
									},
									createdAt: art.addedAt || art.createdAt,
									imageUrl: art.art?.imageFileId
										? collectionService.getArtworkImageUrl(art.art.imageFileId)
										: art.imageFileId
											? collectionService.getArtworkImageUrl(art.imageFileId)
											: '/placeholder.svg',
									tags: art.art?.tags || art.tags || [],
								}}
							/>
						))}
					</div>
				) : (
					<GlassCard className="p-12 text-center">
						<Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
						<h3 className="text-xl font-semibold mb-2">No Artworks Yet</h3>
						<p className="text-muted-foreground">
							This collection is empty. Check back later for amazing artworks!
						</p>
					</GlassCard>
				)}
			</div>
		</div>
	);
}
