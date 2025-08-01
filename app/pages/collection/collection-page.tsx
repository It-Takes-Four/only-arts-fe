import { ArtCard } from "../../components/features/art/art-card";
import { GlassCard } from "../../components/common/glass-card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Heart, Share2, Eye, User, Bookmark } from "lucide-react";
import { useParams } from "react-router";
import { collectionService } from "../../services/collection-service";
import { useEffect } from "react";
import { useCollection } from "../../components/hooks/useCollection";
import { formatDateToMonthYear } from "../../utils/dates/DateFormatter";
import { motion } from "framer-motion";
import { FancyLoading } from "../../components/common/fancy-loading";
import { getUserInitials } from "../../utils/UtilityFunction";

export function CollectionPage() {
	const { collectionId } = useParams<{ collectionId: string }>();
	const { collection, coverImageUrl, error } = useCollection(collectionId);

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
			{/* Collection Header */}
			<div
				className="relative bg-cover bg-center h-[50vh] w-full rounded-lg p-4 flex flex-col justify-end mb-8"
				style={{ backgroundImage: `url(${coverImageUrl || '/profile-background.jpg'})` }}
			>
				{/* Subtle gradient overlay for better text readability */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-lg" />
				
				{/* Collection Info Glass Card */}
				<GlassCard className="relative z-10 py-6 px-8">
					<div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
						<div className="flex items-start lg:items-end space-x-4 flex-1">
							<Avatar className="h-20 w-20 ring-4 ring-white/20">
								<AvatarImage src={collection.artist.user.profilePictureFileId || ""} />
								<AvatarFallback className="text-xl font-bold bg-white/20 text-white">
									{getUserInitials(collection.artist.artistName)}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col flex-1">
								<h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
									{collection.collectionName}
								</h1>
								<div className="flex items-center text-white/80 mb-3">
									<User className="w-4 h-4 mr-2" />
									<span className="text-lg">{collection.artist.artistName}</span>
									{collection.artist.isVerified && (
										<Badge variant="secondary" className="ml-2 bg-blue-500/20 text-blue-100">
											Verified
										</Badge>
									)}
								</div>
								{collection.description && (
									<p className="text-sm text-white/75 mb-3 max-w-2xl">
										{collection.description}
									</p>
								)}
								<div className="flex flex-wrap items-center gap-3">
									<Badge
										variant="outline"
										className="font-mono text-xs uppercase border-white/25 text-white"
									>
										CREATED {formatDateToMonthYear(collection.createdAt)}
									</Badge>
									{collection.isPublished && (
										<Badge variant="secondary" className="bg-green-500/20 text-green-100">
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
									Total Likes
								</span>
								<span className="text-2xl font-semibold text-white">
									{collection.arts?.reduce((sum, art) => sum + (art.art.likesCount || 0), 0) || 0}
								</span>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<Separator className="bg-white/15 my-6" />
					<div className="flex flex-wrap gap-3">
						<Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/25">
							<Heart className="w-5 h-5 mr-2" />
							Follow Collection
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="bg-transparent border-white/25 text-white hover:bg-white/10"
						>
							<Share2 className="w-5 h-5 mr-2" />
							Share
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="bg-transparent border-white/25 text-white hover:bg-white/10"
						>
							<Bookmark className="w-5 h-5 mr-2" />
							Save
						</Button>
					</div>
				</GlassCard>
			</div>

			{/* Collection Stats Summary */}
			<GlassCard className="p-6 mb-8">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					<div className="text-center">
						<div className="text-2xl font-bold mb-1">{collection.arts?.length || 0}</div>
						<div className="text-sm text-muted-foreground">Artworks</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold mb-1">
							{collection.arts?.reduce((sum, art) => sum + (art.art.likesCount || 0), 0) || 0}
						</div>
						<div className="text-sm text-muted-foreground">Total Likes</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold mb-1">
							{collection.arts?.filter(art => art.art.isInACollection).length || 0}
						</div>
						<div className="text-sm text-muted-foreground">In Collections</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold mb-1">
							{collection.price ? `$${collection.price}` : 'Free'}
						</div>
						<div className="text-sm text-muted-foreground">Collection Price</div>
					</div>
				</div>
			</GlassCard>

			{/* Artworks Section */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold">Collection Artworks</h2>
					<Badge variant="outline" className="text-sm">
						{collection.arts?.length || 0} {collection.arts?.length === 1 ? 'artwork' : 'artworks'}
					</Badge>
				</div>

				{collection.arts && collection.arts.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{collection.arts.map((art) => (
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
