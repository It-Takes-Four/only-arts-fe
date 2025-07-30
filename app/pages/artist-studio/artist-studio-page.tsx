import { useState } from "react";
import { useAuthContext } from "../../components/core/auth-context";
import { useMyCollections } from "../../components/hooks/useMyCollections";
import { useMyArtworks } from "../../components/hooks/useMyArtworks";
import { collectionService } from "../../services/collection-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/common/tabs";
import { Button } from "../../components/common/button";
import { GlassCard } from "../../components/common/glass-card";
import { CollectionCard } from "../../components/common/collection-card";
import { ArtCard } from "../../components/common/art-card";
import { CreateCollectionModal } from "../../components/artist-studio/create-collection-modal";
import { CreateArtworkModal } from "../../components/artist-studio/create-artwork-modal";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
	PlusIcon, 
	ChartBarIcon, 
	EyeIcon, 
	HeartIcon, 
	ShareIcon,
	FolderIcon
} from "@heroicons/react/24/outline";
import { ImageIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FollowButton } from "../../components/common/follow-button";
import { formatDateToMonthYear } from "../../utils/dates/DateFormatter";

export function ArtistStudioPage() {
	const { user } = useAuthContext();
	const { collections, loading: collectionsLoading, addCollection } = useMyCollections();
	const { artworks, loading: artworksLoading, addArtwork } = useMyArtworks();
	const [tabValue, setTabValue] = useState("collections");
	const [showCreateCollectionModal, setShowCreateCollectionModal] = useState(false);
	const [showCreateArtworkModal, setShowCreateArtworkModal] = useState(false);

	// Calculate analytics from real data
	const analytics = {
		totalViews: 0, // This would need a separate API call to get view counts
		totalLikes: artworks.reduce((sum, artwork) => sum + artwork.likesCount, 0),
		totalShares: 0, // This would need a separate API call to get share counts
		totalSales: 0, // Sales data not available in current API response
		revenue: 0, // Revenue data not available in current API response
		totalArtworks: artworks.length,
		publishedCollections: collections.filter(collection => collection.isPublished).length,
		totalCollections: collections.length
	};

	// Handle collection creation success
	const handleCollectionCreated = (collection: any) => {
		console.log('Collection created:', collection);
		// Add the new collection to the list
		addCollection(collection);
	};

	// Handle artwork creation success
	const handleArtworkCreated = (artwork: any) => {
		console.log('Artwork created:', artwork);
		// Add the new artwork to the list
		addArtwork(artwork);
	};

	const tabs = [
		{
			value: "collections",
			label: "Collections",
			content: (
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h2 className="text-2xl font-bold">My Collections</h2>
						<Button 
							className="flex items-center gap-2"
							onClick={() => setShowCreateCollectionModal(true)}
						>
							<PlusIcon className="h-4 w-4" />
							Create Collection
						</Button>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						<div 
							className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] hover:border-muted-foreground/50 transition-colors cursor-pointer"
							onClick={() => setShowCreateCollectionModal(true)}
						>
							<PlusIcon className="h-12 w-12 text-muted-foreground/50 mb-2" />
							<p className="text-sm text-muted-foreground">Create New Collection</p>
						</div>
						
						{collectionsLoading ? (
							// Loading skeleton
							Array.from({ length: 3 }).map((_, index) => (
								<div key={index} className="animate-pulse">
									<div className="bg-muted rounded-lg aspect-[4/3] mb-4"></div>
									<div className="h-4 bg-muted rounded mb-2"></div>
									<div className="h-3 bg-muted rounded w-3/4"></div>
								</div>
							))
						) : (
							collections.map((collection) => (
								<CollectionCard
									key={collection.id}
									id={collection.id}
									name={collection.collectionName}
									description={collection.description || "No description"}
									artworkCount={collection.arts.length}
									previewImage={collection.coverImageFileId ? collectionService.getCollectionImageUrl(collection.coverImageFileId) : "/placeholder.svg"}
									createdBy={user?.artist?.artistName || "Unknown"}
									price={collection.price ? parseFloat(collection.price.toString()) : undefined}
									totalSales={0} // We don't have sales data in this response
								/>
							))
						)}
					</div>
				</div>
			),
		},
		{
			value: "artworks",
			label: "Artworks",
			content: (
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h2 className="text-2xl font-bold">My Artworks</h2>
						<div className="flex gap-2">
							<Button 
								className="flex items-center gap-2"
								onClick={() => setShowCreateArtworkModal(true)}
							>
								<PlusIcon className="h-4 w-4" />
								Upload Artwork
							</Button>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						<div 
							className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] hover:border-muted-foreground/50 transition-colors cursor-pointer"
							onClick={() => setShowCreateArtworkModal(true)}
						>
							<PlusIcon className="h-12 w-12 text-muted-foreground/50 mb-2" />
							<p className="text-sm text-muted-foreground">Upload New Artwork</p>
						</div>
                        {artworksLoading ? (
							Array.from({ length: 4 }).map((_, index) => (
								<div key={index} className="animate-pulse">
									<div className="aspect-square bg-muted rounded-lg"></div>
								</div>
							))
						) : artworks.length > 0 ? (
							artworks.map((artwork) => (
								<div key={artwork.id} className="relative">
									<ArtCard 
										art={{
											id: artwork.id,
											title: artwork.title,
											description: artwork.description,
											imageUrl: collectionService.getArtworkImageUrl(artwork.imageFileId),
											artist: {
												id: artwork.artist.id,
												name: artwork.artist.artistName,
												profilePicture: null // Not available in this API response
											},
											tags: artwork.tags.map(tag => ({ name: tag.tag.tagName })),
											type: 'art',
											createdAt: new Date(artwork.datePosted)
										}} 
									/>
									{/* Artwork stats overlay */}
									<div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white text-xs">
										<div className="flex items-center gap-1">
											<span>♥ {artwork.likesCount}</span>
											{artwork.isInACollection && (
												<span className="ml-2">📁 In Collection</span>
											)}
										</div>
									</div>
								</div>
							))
						) : (
							<div className="col-span-full text-center py-8">
								<p className="text-muted-foreground">No artworks yet. Upload your first artwork!</p>
								<Button 
									className="mt-4"
									onClick={() => setShowCreateArtworkModal(true)}
								>
									Upload Artwork
								</Button>
							</div>
						)}
					</div>
				</div>
			),
		},
		{
			value: "analytics",
			label: "Analytics",
			content: (
				<div className="space-y-6">
					<h2 className="text-2xl font-bold">Engagement Analytics</h2>
					
					{/* Overview Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Artworks</CardTitle>
								<ImageIcon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{analytics.totalArtworks}</div>
								<p className="text-xs text-muted-foreground">Across all collections</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Collections</CardTitle>
								<FolderIcon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{analytics.totalCollections}</div>
								<p className="text-xs text-muted-foreground">{analytics.publishedCollections} published</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Views</CardTitle>
								<EyeIcon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
								<p className="text-xs text-muted-foreground">Not available yet</p>
							</CardContent>
						</Card>
						
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Likes</CardTitle>
								<HeartIcon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{analytics.totalLikes.toLocaleString()}</div>
								<p className="text-xs text-muted-foreground">Not available yet</p>
							</CardContent>
						</Card>
						
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Shares</CardTitle>
								<ShareIcon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{analytics.totalShares.toLocaleString()}</div>
								<p className="text-xs text-muted-foreground">Not available yet</p>
							</CardContent>
						</Card>
						
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Sales</CardTitle>
								<ChartBarIcon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{analytics.totalSales}</div>
								<p className="text-xs text-muted-foreground">Not available yet</p>
							</CardContent>
						</Card>
						
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Revenue</CardTitle>
								<ChartBarIcon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">${analytics.revenue}</div>
								<p className="text-xs text-muted-foreground">Not available yet</p>
							</CardContent>
						</Card>
					</div>

					{/* Collection Performance */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Collection Performance</h3>
						<div className="space-y-4">
							{collectionsLoading ? (
								Array.from({ length: 2 }).map((_, index) => (
									<div key={index} className="animate-pulse">
										<div className="h-20 bg-muted rounded-lg"></div>
									</div>
								))
							) : collections.length > 0 ? (
								collections.map((collection) => (
									<GlassCard key={collection.id} className="p-4">
										<div className="flex justify-between items-start">
											<div className="flex-1">
												<h4 className="font-medium">{collection.collectionName}</h4>
												<p className="text-sm text-muted-foreground mt-1">
													{collection.description || "No description"}
												</p>
												<div className="flex gap-4 mt-2">
													<Badge variant="outline">{collection.arts.length} Artworks</Badge>
													<Badge variant="outline">
														{collection.isPublished ? "Published" : "Draft"}
													</Badge>
													{collection.price && (
														<Badge variant="outline">
															${collection.price.toString()}
														</Badge>
													)}
												</div>
											</div>
											<Button variant="outline" size="sm">View Details</Button>
										</div>
									</GlassCard>
								))
							) : (
								<div className="text-center py-8">
									<p className="text-muted-foreground">No collections yet. Create your first collection!</p>
									<Button 
										className="mt-4"
										onClick={() => setShowCreateCollectionModal(true)}
									>
										Create Collection
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			),
		},
	];

	// Check if user is an artist
	if (!user?.artist) {
		return (
			<div className="container mx-auto px-4 py-8">
				<GlassCard className="p-8 text-center">
					<h1 className="text-2xl font-bold mb-4">Artist Studio</h1>
					<p className="text-muted-foreground mb-4">
						You need to be a verified artist to access the Artist Studio.
					</p>
					<Button asChild>
						<a href="/become-artist">Become an Artist</a>
					</Button>
				</GlassCard>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Artist Studio</h1>
				<p className="text-muted-foreground mt-2">
					Manage your collections, artworks, and track your engagement analytics.
				</p>
			</div>

			{/* Artist Info */}
			<GlassCard className="mb-8 py-4 px-8">
				<div className="flex items-center gap-4">
					<img 
						src={user.profilePicture || "https://placehold.co/80x80"} 
						alt="Artist Avatar"
						className="rounded-full w-20 h-20 shadow-lg"
					/>
					<div>
						<h2 className="text-2xl font-bold">{user.artist.artistName}</h2>
						<p className="text-sm text-muted-foreground mt-1">{user.artist.bio || "No bio available"}</p>
						<div className="flex items-center gap-2 mt-2">
							<Badge variant="outline"
										 className="font-mono text-primary-foreground text-xs uppercase border-white/25">
								{`JOINED ${formatDateToMonthYear(user.createdAt)}`}
							</Badge>
							{user.artist.isVerified && (
								<Badge variant="default">Verified Artist</Badge>
							)}
							{user.artist.isNsfw && (
								<Badge variant="secondary" className="font-mono uppercase">NSFW</Badge>
							)}
						</div>
					</div>
				</div>
			</GlassCard>

			{/* Main Content */}
			<Tabs value={tabValue} onValueChange={setTabValue}>
				<TabsList className="mb-6">
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

			{/* Modals */}
			<CreateCollectionModal
				isOpen={showCreateCollectionModal}
				onClose={() => setShowCreateCollectionModal(false)}
				onSuccess={handleCollectionCreated}
			/>
			
			<CreateArtworkModal
				isOpen={showCreateArtworkModal}
				onClose={() => setShowCreateArtworkModal(false)}
				onSuccess={handleArtworkCreated}
			/>
		</div>
	);
}
