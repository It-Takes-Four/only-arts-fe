import { useState } from "react";
import { useAccount } from 'wagmi';
import { useAuthContext } from "../../components/core/auth-context";
import { useArtistStudio } from "../../context/artist-studio-context";
import { collectionService } from "../../services/collection-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/common/tabs";
import { Button } from "../../components/common/button";
import { GlassCard } from "../../components/common/glass-card";
import { CollectionCard } from "../../components/common/collection-card";
import { ArtCard } from "../../components/features/art/art-card";
import { CreateCollectionModal } from "../../components/features/artist-studio/create-collection-modal";
import { CreateArtworkModal } from "../../components/features/artist-studio/create-artwork-modal";
import { EditArtistProfileModal } from "../../components/features/artist-studio/edit-artist-profile-modal";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	PlusIcon,
	ChartBarIcon,
	EyeIcon,
	HeartIcon,
	ShareIcon,
	FolderIcon,
	PencilIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/16/solid";
import { ImageIcon, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTimestampToMonthYear } from "../../utils/dates/DateFormatter";
import { formatPriceDisplay } from "../../utils/currency";
import { WalletManagementModal } from "app/components/features/artist-studio/wallet-management-modal";
import type { MyCollection } from "app/types/collection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ArtistStudioPage() {
	const { user, refreshUserWithValidation } = useAuthContext();
	const { address, isConnected } = useAccount();
	const {
		collections,
		collectionsLoading,
		addCollection,
		artworks,
		artworksLoading,
		addArtwork,
		analytics,
		refreshProfile
	} = useArtistStudio();
	const [tabValue, setTabValue] = useState("collections");
	const [showCreateCollectionModal, setShowCreateCollectionModal] = useState(false);
	const [showCreateArtworkModal, setShowCreateArtworkModal] = useState(false);
	const [showEditProfileModal, setShowEditProfileModal] = useState(false);
	const [showWalletModal, setShowWalletModal] = useState(false);

	console.log("artist", user)
	// Handle collection creation success
	const handleCollectionCreated = (collection: any) => {
		console.log('Before adding:', collections.length);
		
		
		console.log('Collection created:', collection);
		// Add the new collection to the list
		addCollection(collection);
		console.log('After adding:', collections.length); // Should be +1
	};

	// Handle artwork creation success
	const handleArtworkCreated = (artwork: any) => {
		console.log('Artwork created:', artwork);
		// Add the new artwork to the list
		addArtwork(artwork);
	};

	// Handle artist profile update success
	const handleProfileUpdated = async (artist: any) => {
		console.log('Artist profile updated:', artist);
		// Use the provider's refresh method to update all data
		try {
			console.log('Triggering profile refresh from artist studio page...');
			await refreshProfile();
			console.log('Profile and related data refreshed successfully from artist studio page');
		} catch (error) {
			console.error('Failed to refresh profile data from artist studio page:', error);
		}
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
									artworkCount={collection.artsCount}
									previewImage={collection.coverImageFileId ? collectionService.getCollectionImageUrl(collection.coverImageFileId) : ""}
									createdBy={collection.artist.artistName}
									price={collection.price ? parseFloat(collection.price).toString() : null}
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
											tags: artwork.tags.map((tag: any) => ({ name: tag.tagName })),
											type: 'art',
											createdAt: artwork.datePosted
										}}
									/>
									{/* Artwork stats overlay */}
									<div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white text-xs">
										<div className="flex items-center gap-1">
											<span>♥ 0</span>
											{artwork.collections && artwork.collections.length > 0 && (
												<span className="ml-2">In Collection</span>
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
													<Badge variant="outline">{collection.artsCount} Artworks</Badge>
													<Badge variant="outline">
														{collection.isPublished ? "Published" : "Draft"}
													</Badge>
													{collection.price && (
														<Badge variant="outline">
															{formatPriceDisplay(collection.price.toString())}
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
		<div className="max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2000px] mx-auto px-4 lg:px-6 xl:px-8 py-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Artist Studio</h1>
				<p className="text-muted-foreground mt-2">
					Manage your collections, artworks, and track your engagement analytics.
				</p>
			</div>

			{/* Artist Info */}
			<GlassCard className="mb-8 py-4 px-8">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Avatar className="w-20 h-20">
							<AvatarImage
								src={user.profilePictureFileId
									? `${import.meta.env.VITE_API_BASE_URL}/upload/profile/${user.profilePictureFileId}`
									: undefined}
								alt="Artist Avatar"
							/>
							<AvatarFallback className="text-lg font-bold">
								{user.artist.artistName ? user.artist.artistName.charAt(0).toUpperCase() : "?"}
							</AvatarFallback>
						</Avatar>
						<div>
							<h2 className="text-2xl font-bold">{user.artist.artistName}</h2>
							<p className="text-sm text-muted-foreground mt-1">{user.artist.bio || "No bio available"}</p>
							<div className="flex items-center gap-2 mt-2">
								<Badge variant="outline"
									className="font-mono text-primary-foreground text-xs uppercase border-white/25">
									{user?.createdAt ? `JOINED ${formatTimestampToMonthYear(user?.createdAt)}` : 'ARTIST'}
								</Badge>
								{user.artist.isVerified && (
									<Badge variant="default" className="font-mono uppercase" >
										<CheckBadgeIcon className="mb-0.25" />
										Verified Artist
									</Badge>
								)}
								{user.artist.isNsfw && (
									<Badge variant="secondary" className="font-mono uppercase">NSFW</Badge>
								)}
							</div>
							{/* Wallet Address Display */}
							{user.artist.walletAddress && (
								<div className="mt-3">
									<p className="text-xs text-muted-foreground mb-1">Wallet Address</p>
									<div className="flex items-center gap-2">
										<code className="text-xs bg-muted px-2 py-1 rounded font-mono">
											{user.artist.walletAddress.slice(0, 6)}...{user.artist.walletAddress.slice(-4)}
										</code>
										<Wallet className="h-3 w-3 text-muted-foreground" />
										{isConnected && address?.toLowerCase() === user.artist.walletAddress.toLowerCase() && (
											<div className="flex items-center gap-1 text-green-600 dark:text-green-400">
												<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
												<span className="text-xs font-medium">Connected</span>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowWalletModal(true)}
							className="flex items-center gap-2"
						>
							<Wallet className="h-4 w-4" />
							Wallet
							{user.artist.walletAddress && isConnected && address?.toLowerCase() === user.artist.walletAddress.toLowerCase() && (
								<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1" />
							)}
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowEditProfileModal(true)}
							className="flex items-center gap-2"
						>
							<PencilIcon className="h-4 w-4" />
							Edit Profile
						</Button>
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

			<EditArtistProfileModal
				isOpen={showEditProfileModal}
				onClose={() => setShowEditProfileModal(false)}
				onSuccess={handleProfileUpdated}
			/>

			<WalletManagementModal
				isOpen={showWalletModal}
				onClose={() => setShowWalletModal(false)}
				currentWalletAddress={user?.artist?.walletAddress}
			/>
		</div>
	);
}
