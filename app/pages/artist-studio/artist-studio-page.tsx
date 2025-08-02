import { useState } from "react";
import { useAccount } from 'wagmi';
import { useAuthContext } from "../../components/core/auth-context";
import { useArtistStudio } from "../../context/artist-studio-context";
import { useMyCollectionsWithPaginationQuery } from "../../components/hooks/useMyCollectionsWithPaginationQuery";
import { useMyArtworksWithPaginationQuery } from "../../components/hooks/useMyArtworksWithPaginationQuery";
import { collectionService } from "../../services/collection-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/common/tabs";
import { Button } from "../../components/common/button";
import { GlassCard } from "../../components/common/glass-card";
import { CreateCollectionModal } from "../../components/features/artist-studio/create-collection-modal";
import { CreateArtworkModal } from "../../components/features/artist-studio/create-artwork-modal";
import { EditArtistProfileModal } from "../../components/features/artist-studio/edit-artist-profile-modal";
import { CollectionsGrid } from "../../components/features/artist-studio/collections-grid";
import { ArtworksGrid } from "../../components/features/artist-studio/artworks-grid";
import { Badge } from "@/components/ui/badge";
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
		analytics,
		refreshProfile,
		createArtworkAsync,
		isCreatingCollection,
		isDoneCreatingCollection
	} = useArtistStudio();

	// Pagination states
	const [collectionsPage, setCollectionsPage] = useState(1);
	const [artworksPage, setArtworksPage] = useState(1);
	const collectionsLimit = 12; // 12 collections per page (3x4 grid)
	const artworksLimit = 15; // 15 artworks per page (3x5 grid)

	// Paginated queries
	const {
		collectionsLoading,
		collectionsData,
		addCollection,
		addCollectionStatus:{
			addCollectionIsPending,
			addCollectionIsSuccess
		},
		publishCollection,
		publishCollectionStatus:{
			publishCollectionIsPending,
			publishCollectionIsSuccess
		},
	} = useMyCollectionsWithPaginationQuery(collectionsPage, collectionsLimit);

	const {

	} = useMyArtworksWithPaginationQuery(artworksPage, artworksLimit);

	const [tabValue, setTabValue] = useState("collections");
	const [showCreateCollectionModal, setShowCreateCollectionModal] = useState(false);
	const [showCreateArtworkModal, setShowCreateArtworkModal] = useState(false);
	const [showEditProfileModal, setShowEditProfileModal] = useState(false);
	const [showWalletModal, setShowWalletModal] = useState(false);

	const handleCollectionCreated = async (collection: any) => {
		await addCollection(collection);
		console.log('Collection created:', collection);
		// If we're not on the first page, go to first page to see the new collection
		if (collectionsPage !== 1) {
			setCollectionsPage(1);
		}
	};

	// Handle collection update
	const handleCollectionUpdated = async (updatedCollection: any) => {
		console.log('Collection updated:', updatedCollection);
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
				<CollectionsGrid
					collections={collectionsData?.data || []}
					collectionsLoading={collectionsLoading}
					pagination={collectionsData?.pagination}
					onCreateCollection={() => setShowCreateCollectionModal(true)}
					onCollectionUpdated={handleCollectionUpdated}
					onPageChange={setCollectionsPage}
					publishCollection={publishCollection}
					publishCollectionIsPending={publishCollectionIsPending}
					publishCollectionIsSuccess={publishCollectionIsSuccess}
				/>
			),
		},
		{
			value: "artworks",
			label: "Artworks",
			content: (
				<ArtworksGrid
					artworks={artworksData?.data || []}
					artworksLoading={artworksLoading}
					pagination={artworksData?.pagination}
					onCreateArtwork={() => setShowCreateArtworkModal(true)}
					onPageChange={setArtworksPage}
				/>
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
							) : (collectionsData?.data || []).length > 0 ? (
								(collectionsData?.data || []).map((collection) => (
									<GlassCard key={collection.id} className="p-4">
										<div className="flex justify-between items-start">
											<div className="flex-1">
												<h4 className="font-medium">{collection.collectionName}</h4>
												<p className="text-sm text-muted-foreground mt-1">
													{collection.description || "No description"}
												</p>
												<div className="flex gap-4 mt-2">
													<Badge variant="outline">{collection.arts?.length || 0} Artworks</Badge>
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
				<div className="flex justify-between">
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
									className="font-mono text-primary text-xs uppercase border-primary/25">
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
				addCollection={handleCollectionCreated}
				isPending={isCreatingCollection}
				isSuccess={isDoneCreatingCollection}
			/>

			<CreateArtworkModal
				isOpen={showCreateArtworkModal}
				onClose={() => setShowCreateArtworkModal(false)}
				createArtworkAsync={createArtworkAsync}
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
