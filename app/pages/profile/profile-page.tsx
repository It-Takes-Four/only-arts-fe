import { ShinyBadge } from "@/components/magicui/shiny-badge";
import { GlassCard } from "../../components/common/glass-card";
import { useAuthContext } from "../../components/core/auth-context";
import { ArtCard } from "../../components/features/art/art-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/common/tabs";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckBadgeIcon } from "@heroicons/react/16/solid";
import { Separator } from "@/components/ui/separator";
import { FollowButton } from "../../components/common/follow-button";
import { CollectionCard } from "../../components/common/collection-card";
import { BuyCollectionModal } from "../../components/common/buy-collection-modal";
import { useArtistProfileQuery } from "../../components/hooks/useArtistProfileQuery";
import { useUserProfileQuery } from "../../components/hooks/useUserProfileQuery";
import { useArtistCollectionsQuery } from "../../components/hooks/useArtistCollectionsQuery";
import { useArtistArtworksQuery } from "../../components/hooks/useArtistArtworksQuery";
import { useMyCollectionsQuery } from "../../components/hooks/useMyCollectionsQuery";
import { useMyArtworksQuery } from "../../components/hooks/useMyArtworksQuery";
import { artistService } from "../../services/artist-service";
import { collectionService } from "../../services/collection-service";
import { formatDistanceToNow } from 'date-fns';
import { FancyLoading } from "../../components/common/fancy-loading";
import { Button } from "../../components/common/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPriceDisplay, parsePrice } from "../../utils/currency";
import type { ArtistCollection } from "../../types/collection";
import type { ArtistProfile } from "../../types/artist";
import type { ArtistArtwork } from "../../types/artwork";

interface ProfilePageProps {
	artistId?: string;
}

export function ProfilePage({ artistId }: ProfilePageProps) {
	const { user: authUser } = useAuthContext();
	const { artist, isLoading, error } = useArtistProfileQuery(artistId);
	const { user: currentUser } = useUserProfileQuery();
	const [tabValue, setTabValue] = useState("explore");
	const [collectionsPage, setCollectionsPage] = useState(1);
	const [selectedCollection, setSelectedCollection] = useState<ArtistCollection | null>(null);
	const [showBuyModal, setShowBuyModal] = useState(false);

	const isOwnProfile = !artistId; // If no artistId, it's the current user's profile

	// Fetch data based on whether it's own profile or another artist's profile
	const { 
		data: collectionsData, 
		isLoading: collectionsLoading,
		error: collectionsError
	} = useArtistCollectionsQuery(artistId || '', collectionsPage, 10);

	const { 
		data: artworksData, 
		isLoading: artworksLoading,
		error: artworksError
	} = useArtistArtworksQuery(artistId || '');

	// Fetch own collections and artworks when viewing own profile
	const { 
		collections: myCollectionsData, 
		isLoading: myCollectionsLoading,
		error: myCollectionsError 
	} = useMyCollectionsQuery();

	const { 
		artworks: myArtworksData, 
		isLoading: myArtworksLoading,
		error: myArtworksError 
	} = useMyArtworksQuery();

	// Use currentUser for joined date if it's own profile, otherwise use artist data
	const userForJoinedDate = isOwnProfile ? currentUser : artist?.user;

	const handleBuyCollection = (collection: ArtistCollection) => {
		setSelectedCollection(collection);
		setShowBuyModal(true);
	};

	const handleBuySuccess = () => {
		// Optionally refresh collections data or show success message
		console.log('Purchase successful');
	};

	const formatDate = (timestamp: number) => {
		try {
			return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
		} catch {
			return 'Unknown time';
		}
	};

	const getProfilePictureUrl = () => {
		if (artist?.user.profilePictureFileId) {
			return artistService.getProfilePictureUrl(artist.user.profilePictureFileId);
		}
		return "/placeholder-avatar.png";
	};

	const tabs = [
		{
			value: "explore",
			label: "Explore",
			content: (
				<div className="space-y-8">
					{/* Collections Preview */}
					<div>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-semibold">Collections</h3>
							{/* Show View All button based on data availability */}
							{(isOwnProfile ? 
								(myCollectionsData && myCollectionsData.length > 4) : 
								(collectionsData?.data && collectionsData.data.length > 4)
							) && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => setTabValue("collections")}
								>
									View All ({isOwnProfile ? myCollectionsData?.length || 0 : collectionsData?.pagination?.total || 0})
								</Button>
							)}
						</div>
						{/* Loading state */}
						{(isOwnProfile ? myCollectionsLoading : collectionsLoading) ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								{Array.from({ length: 4 }).map((_, index) => (
									<div key={index} className="animate-pulse">
										<div className="bg-muted rounded-lg aspect-[4/3] mb-4"></div>
										<div className="h-4 bg-muted rounded mb-2"></div>
										<div className="h-3 bg-muted rounded w-3/4"></div>
									</div>
								))}
							</div>
						) : /* Error state */ (isOwnProfile ? myCollectionsError : collectionsError) ? (
							<div className="text-center py-4">
								<p className="text-muted-foreground text-sm">Failed to load collections</p>
							</div>
						) : /* Success state with data */ (isOwnProfile ? 
							(myCollectionsData && myCollectionsData.length > 0) : 
							(collectionsData?.data && Array.isArray(collectionsData.data) && collectionsData.data.length > 0)
						) ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								{(isOwnProfile ? myCollectionsData : collectionsData?.data)?.slice(0, 4).map((collection) => (
									<div key={collection.id} className="relative">
										<CollectionCard
											id={collection.id}
											name={collection.collectionName}
											description={collection.description || "No description"}
											artworkCount={isOwnProfile ? 
												(collection as any).arts?.length || 0 : 
												(collection as any).artsCount || 0
											}
											previewImage={collection.coverImageFileId ? collectionService.getCollectionImageUrl(collection.coverImageFileId) : "/placeholder.svg"}
											createdBy={collection.artist.artistName}
											price={collection.price || '0'}
										/>
										{/* Only show buy button for other artists' collections */}
										{!isOwnProfile && collection.isPublished && parseFloat(collection.price || '0') > 0 && (
											<div className="absolute top-2 right-2">
												<Button
													size="sm"
													onClick={() => handleBuyCollection(collection as ArtistCollection)}
													className="bg-primary/90 hover:bg-primary shadow-lg"
												>
													Buy {formatPriceDisplay(collection.price || '0')}
												</Button>
											</div>
										)}
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-4">
								<p className="text-muted-foreground text-sm">No collections found</p>
							</div>
						)}
					</div>

					{/* Artworks Preview */}
					<div>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-semibold">Artworks</h3>
							{(isOwnProfile ? 
								(myArtworksData && myArtworksData.length > 8) : 
								(artworksData && artworksData.length > 8)
							) && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => setTabValue("artworks")}
								>
									View All ({isOwnProfile ? myArtworksData?.length || 0 : artworksData?.length || 0})
								</Button>
							)}
						</div>
						{/* Loading state */}
						{(isOwnProfile ? myArtworksLoading : artworksLoading) ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
								{Array.from({ length: 8 }).map((_, index) => (
									<div key={index} className="animate-pulse">
										<div className="bg-muted rounded-lg aspect-square mb-2"></div>
										<div className="h-3 bg-muted rounded mb-1"></div>
										<div className="h-2 bg-muted rounded w-2/3"></div>
									</div>
								))}
							</div>
						) : /* Error state */ (isOwnProfile ? myArtworksError : artworksError) ? (
							<div className="text-center py-4">
								<p className="text-muted-foreground text-sm">Failed to load artworks</p>
							</div>
						) : /* Success state with data */ (isOwnProfile ? 
							(myArtworksData && myArtworksData.length > 0) : 
							(artworksData && Array.isArray(artworksData) && artworksData.length > 0)
						) ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
								{(isOwnProfile ? myArtworksData : artworksData)?.slice(0, 8).map((artwork) => (
									<div key={artwork.id} className="relative">
										<ArtCard
											art={{
												id: artwork.id,
												title: artwork.title,
												description: artwork.description,
												imageUrl: collectionService.getArtworkImageUrl(artwork.imageFileId),
												artist: {
													id: artwork.artistId,
													name: isOwnProfile ? 
														(currentUser?.artist?.artistName || "Unknown Artist") : 
														(artist?.artistName || "Unknown Artist"),
													profilePicture: isOwnProfile ?
														(currentUser?.profilePictureFileId ? artistService.getProfilePictureUrl(currentUser.profilePictureFileId) : null) :
														(artist?.user.profilePictureFileId ? artistService.getProfilePictureUrl(artist.user.profilePictureFileId) : null)
												},
												tags: artwork.tags.map(tag => ({ name: tag.tag.tagName })),
												type: 'art',
												createdAt: artwork.datePosted
											}}
										/>
										<div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs flex items-center gap-2">
											<span className="flex items-center gap-1">
												♥ {artwork.likesCount}
											</span>
											{artwork.isInACollection && (
												<span className="flex items-center gap-1">
													📁
												</span>
											)}
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-4">
								<p className="text-muted-foreground text-sm">No artworks found</p>
							</div>
						)}
					</div>
				</div>
			),
		},
		{
			value: "collections",
			label: "Collections",
			content: (
				<div className="space-y-6">
					{/* Loading state */}
					{(isOwnProfile ? myCollectionsLoading : collectionsLoading) ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{Array.from({ length: 8 }).map((_, index) => (
								<div key={index} className="animate-pulse">
									<div className="bg-muted rounded-lg aspect-[4/3] mb-4"></div>
									<div className="h-4 bg-muted rounded mb-2"></div>
									<div className="h-3 bg-muted rounded w-3/4"></div>
								</div>
							))}
						</div>
					) : /* Error state */ (isOwnProfile ? myCollectionsError : collectionsError) ? (
						<div className="text-center py-8">
							<p className="text-muted-foreground">Failed to load collections</p>
						</div>
					) : /* Success state with data */ (isOwnProfile ? 
						(myCollectionsData && myCollectionsData.length > 0) : 
						(collectionsData?.data && Array.isArray(collectionsData.data) && collectionsData.data.length > 0)
					) ? (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
								{(isOwnProfile ? myCollectionsData : collectionsData?.data)?.map((collection) => (
									<div key={collection.id} className="relative">
										<CollectionCard
											id={collection.id}
											name={collection.collectionName}
											description={collection.description || "No description"}
											artworkCount={isOwnProfile ? 
												(collection as any).arts?.length || 0 : 
												(collection as any).artsCount || 0
											}
											previewImage={collection.coverImageFileId ? collectionService.getCollectionImageUrl(collection.coverImageFileId) : "/placeholder.svg"}
											createdBy={collection.artist.artistName}
											price={collection.price || '0'}
										/>
										{/* Only show buy button for other artists' collections */}
										{!isOwnProfile && collection.isPublished && parseFloat(collection.price || '0') > 0 && (
											<div className="absolute top-2 right-2">
												<Button
													size="sm"
													onClick={() => handleBuyCollection(collection as ArtistCollection)}
													className="bg-primary/90 hover:bg-primary shadow-lg"
												>
													Buy {formatPriceDisplay(collection.price || '0')}
												</Button>
											</div>
										)}
									</div>
								))}
							</div>

							{/* Pagination - only for other artists' profiles */}
							{!isOwnProfile && collectionsData?.pagination && collectionsData.pagination.totalPages > 1 && (
								<div className="flex justify-center items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setCollectionsPage(p => Math.max(1, p - 1))}
										disabled={!collectionsData.pagination.hasPrevPage}
									>
										<ChevronLeft className="h-4 w-4" />
										Previous
									</Button>
									<span className="text-sm text-muted-foreground px-2">
										Page {collectionsData.pagination.currentPage} of {collectionsData.pagination.totalPages}
									</span>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setCollectionsPage(p => p + 1)}
										disabled={!collectionsData.pagination.hasNextPage}
									>
										Next
										<ChevronRight className="h-4 w-4" />
									</Button>
								</div>
							)}
						</>
					) : (
						<div className="text-center py-8">
							<p className="text-muted-foreground">No collections found</p>
						</div>
					)}
				</div>
			),
		},
		{
			value: "artworks",
			label: "Artworks",
			content: (
				<div className="space-y-6">
					{/* Loading state */}
					{(isOwnProfile ? myArtworksLoading : artworksLoading) ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{Array.from({ length: 8 }).map((_, index) => (
								<div key={index} className="animate-pulse">
									<div className="bg-muted rounded-lg aspect-square mb-4"></div>
									<div className="h-4 bg-muted rounded mb-2"></div>
									<div className="h-3 bg-muted rounded w-1/2"></div>
								</div>
							))}
						</div>
					) : /* Error state */ (isOwnProfile ? myArtworksError : artworksError) ? (
						<div className="text-center py-8">
							<p className="text-muted-foreground">Failed to load artworks</p>
						</div>
					) : /* Success state with data */ (isOwnProfile ? 
						(myArtworksData && myArtworksData.length > 0) : 
						(artworksData && Array.isArray(artworksData) && artworksData.length > 0)
					) ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{(isOwnProfile ? myArtworksData : artworksData)?.map((artwork) => (
								<div key={artwork.id} className="relative group">
									<div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
										{/* Artwork Image */}
										<div className="aspect-square relative">
											<img
												src={artwork.imageFileId ? collectionService.getArtworkImageUrl(artwork.imageFileId) : "/placeholder.svg"}
												alt={artwork.title}
												className="w-full h-full object-cover"
											/>
											{/* Overlay with stats */}
											<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
												<div className="text-white text-center">
													<div className="flex items-center gap-4 justify-center">
														<span className="flex items-center gap-1">
															♥ {(artwork as any).likesCount || 0}
														</span>
														{(artwork as any).isInACollection && (
															<span className="flex items-center gap-1">
																📁 Collection
															</span>
														)}
													</div>
												</div>
											</div>
										</div>

										{/* Artwork Info */}
										<div className="p-4">
											<h3 className="font-semibold text-lg mb-1 truncate">{artwork.title}</h3>
											<p className="text-sm text-muted-foreground mb-2 line-clamp-2">
												{artwork.description || "No description"}
											</p>
											
											{/* Tags */}
											{artwork.tags && artwork.tags.length > 0 && (
												<div className="flex flex-wrap gap-1 mb-3">
													{artwork.tags.slice(0, 3).map((tag, index) => (
														<Badge key={index} variant="secondary" className="text-xs">
															{(tag as any).tag?.tagName || (tag as any).tagName || 'Tag'}
														</Badge>
													))}
													{artwork.tags.length > 3 && (
														<Badge variant="outline" className="text-xs">
															+{artwork.tags.length - 3}
														</Badge>
													)}
												</div>
											)}

											{/* Artist Info */}
											<div className="flex items-center gap-2">
												<img
													src="/placeholder-avatar.png"
													alt="Artist"
													className="w-6 h-6 rounded-full"
												/>
												<span className="text-sm text-muted-foreground">
													{isOwnProfile ? 
														(artist?.artistName || 'Unknown Artist') : 
														'Artist'
													}
												</span>
											</div>
										</div>
									</div>

									{/* Only show buy button for other artists' artworks */}
									{!isOwnProfile && (
										<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
											<Button
												size="sm"
												onClick={() => {
													// Handle individual artwork purchase
													console.log('Buy artwork:', artwork.id);
												}}
												className="bg-primary/90 hover:bg-primary shadow-lg"
											>
												Buy
											</Button>
										</div>
									)}
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-8">
							<p className="text-muted-foreground">No artworks found</p>
						</div>
					)}
				</div>
			),
		},
	];

	// Loading state
	if (isLoading) {
		return (
			<div className="max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2000px] mx-auto px-4 lg:px-6 xl:px-8 py-8 flex items-center justify-center min-h-[400px]">
				<FancyLoading />
			</div>
		);
	}

	// Error state
	if (error || !artist) {
		return (
			<div className="max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2000px] mx-auto px-4 lg:px-6 xl:px-8 py-8">
				<div className="text-center">
					<p className="text-lg font-medium text-destructive mb-2">
						Failed to load profile
					</p>
					<p className="text-sm text-muted-foreground">
						{error || 'Profile not found'}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2000px] mx-auto px-4 lg:px-6 xl:px-8 py-8">

			{/* Profile Header */}

			<div
				className="bg-cover bg-center h-80 w-full rounded-lg p-4 flex flex-col justify-between mb-6"
				style={{ backgroundImage: 'url(/profile-background.jpg)' }}
			>

				<ShinyBadge className="self-start">
					<CheckBadgeIcon className="size-4 mr-1"/>
					{artist.isVerified ? 'VERIFIED ARTIST' : 'ARTIST'}
				</ShinyBadge>

				{/* User Data */}

				<GlassCard className="py-4 px-8 flex flex-col lg:flex-row justify-between">
					<div className="flex items-start space-x-4">
						<img 
							src={getProfilePictureUrl()} 
							alt="Artist Avatar"
							className="rounded-full w-20 h-20 shadow-lg object-cover"
							onError={(e) => {
								(e.target as HTMLImageElement).src = "/placeholder-avatar.png";
							}}
						/>
						<div className="flex flex-col rounded-lg">
							<span className="flex items-center text-white">
								<h1 className="text-2xl font-bold text-white">{artist.artistName}</h1>
								{!isOwnProfile &&
									<>
                    <Separator orientation="vertical" className="bg-white/25 h-5 mr-1 ml-4"/>
                    <FollowButton/>
									</>
								}
							</span>
							<p className="text-sm text-white/75 mt-1">@{artist.user.username}</p>
							{artist.bio && (
								<p className="text-sm text-white/90 mt-2 max-w-md">{artist.bio}</p>
							)}
							<Badge variant="outline"
										 className="mt-2 font-mono text-primary-foreground text-xs uppercase border-white/25">
								JOINED {userForJoinedDate?.createdAt ? formatDate(userForJoinedDate.createdAt).toUpperCase() : 'UNKNOWN TIME'}
							</Badge>
						</div>
					</div>
					<Separator className="bg-white/15 my-4 lg:hidden"/>

					<div className="rounded-lg flex items-end space-x-6">
						<div className="flex flex-col items-center lg:items-end flex-1">
							<span className="text-xs text-white/75 font-mono uppercase">Collections</span>
							<span className="text-lg font-semibold text-white">{artist.totalCollections}</span>
						</div>
						<div className="flex flex-col items-center lg:items-end flex-1">
							<span className="text-xs text-white/75 font-mono uppercase">Artworks</span>
							<span className="text-lg font-semibold text-white">{artist.totalArts}</span>
						</div>
						<div className="flex flex-col items-center lg:items-end flex-1">
							<span className="text-xs text-white/75 font-mono uppercase">Following</span>
							<span className="text-lg font-semibold text-white">-</span>
						</div>
						<div className="flex flex-col items-center lg:items-end flex-1">
							<span className="text-xs text-white/75 font-mono uppercase">Followers</span>
							<span className="text-lg font-semibold text-white">{artist.totalFollowers}</span>
						</div>
					</div>

				</GlassCard>

			</div>

			{/*	Main Content */}

			<Tabs value={tabValue} onValueChange={setTabValue}>
				<TabsList>
					{tabs.map((tab) => (
						<TabsTrigger key={tab.value} value={tab.value}>
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>

				{tabs.map((tab) => (
					<TabsContent key={tab.value} value={tab.value}>
						{tab.content}
					</TabsContent>
				))}
			</Tabs>

			<div className="">


			</div>

			{/* Buy Collection Modal */}
			{selectedCollection && (
				<BuyCollectionModal
					isOpen={showBuyModal}
					onClose={() => {
						setShowBuyModal(false);
						setSelectedCollection(null);
					}}
					collection={selectedCollection}
					onSuccess={handleBuySuccess}
				/>
			)}

		</div>
	);
}