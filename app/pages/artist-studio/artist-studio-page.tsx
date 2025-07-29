import { useState } from "react";
import { useAuthContext } from "../../components/core/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/common/tabs";
import { Button } from "../../components/common/button";
import { GlassCard } from "../../components/common/glass-card";
import { CollectionCard } from "../../components/common/collection-card";
import { ArtCard } from "../../components/common/art-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
	PlusIcon, 
	ChartBarIcon, 
	EyeIcon, 
	HeartIcon, 
	ShareIcon 
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ArtistStudioPage() {
	const { user } = useAuthContext();
	const [tabValue, setTabValue] = useState("collections");

	// Mock data for demonstration
	const mockCollections = [
		{
			id: '1',
			name: "Digital Dreams",
			description: "A collection of surreal digital artworks exploring the subconscious mind",
			artworkCount: 25,
			previewImage: "/profile-background.jpg",
			createdBy: user?.username || "Artist",
			price: 2.99,
			totalSales: 15
		},
		{
			id: '2',
			name: "Nature's Palette",
			description: "Vibrant landscapes and natural scenes captured in digital art",
			artworkCount: 18,
			previewImage: "/profile-background.jpg",
			createdBy: user?.username || "Artist",
			price: 1.99,
			totalSales: 8
		}
	];

	const mockArtworks = [
		{
			id: "1",
			title: "Ethereal Sunrise",
			description: "A mystical sunrise over ancient mountains",
			artist: {
				id: user?.id || "artist1",
				name: user?.username || "Artist Name",
				profilePicture: user?.profilePicture || "https://placehold.co/150x150"
			},
			createdAt: new Date(),
			imageUrl: "https://placehold.co/300x300",
			views: 1250,
			likes: 89,
			shares: 23
		},
		{
			id: "2",
			title: "Urban Symphony",
			description: "The rhythm of city life captured in abstract form",
			artist: {
				id: user?.id || "artist1",
				name: user?.username || "Artist Name",
				profilePicture: user?.profilePicture || "https://placehold.co/150x150"
			},
			createdAt: new Date(),
			imageUrl: "https://placehold.co/300x300",
			views: 980,
			likes: 64,
			shares: 18
		}
	];

	const mockAnalytics = {
		totalViews: 12450,
		totalLikes: 789,
		totalShares: 156,
		totalSales: 23,
		revenue: 89.77
	};

	const tabs = [
		{
			value: "collections",
			label: "Collections",
			content: (
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h2 className="text-2xl font-bold">My Collections</h2>
						<Button className="flex items-center gap-2">
							<PlusIcon className="h-4 w-4" />
							Create Collection
						</Button>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] hover:border-muted-foreground/50 transition-colors cursor-pointer">
							<PlusIcon className="h-12 w-12 text-muted-foreground/50 mb-2" />
							<p className="text-sm text-muted-foreground">Create New Collection</p>
						</div>
                        {mockCollections.map((collection) => (
							<CollectionCard
								key={collection.id}
								id={collection.id}
								name={collection.name}
								description={collection.description}
								artworkCount={collection.artworkCount}
								previewImage={collection.previewImage}
								createdBy={collection.createdBy}
								price={collection.price}
								totalSales={collection.totalSales}
							/>
						))}
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
							<Button variant="outline" className="flex items-center gap-2">
								<PlusIcon className="h-4 w-4" />
								Add to Collection
							</Button>
							<Button className="flex items-center gap-2">
								<PlusIcon className="h-4 w-4" />
								Upload Artwork
							</Button>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] hover:border-muted-foreground/50 transition-colors cursor-pointer">
							<PlusIcon className="h-12 w-12 text-muted-foreground/50 mb-2" />
							<p className="text-sm text-muted-foreground">Upload New Artwork</p>
						</div>
                        {mockArtworks.map((artwork) => (
							<div key={artwork.id} className="relative">
								<ArtCard art={artwork} />
								{/* Engagement overlay */}
								<div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white text-xs space-y-1">
									<div className="flex items-center gap-1">
										<EyeIcon className="h-3 w-3" />
										<span>{artwork.views}</span>
									</div>
									<div className="flex items-center gap-1">
										<HeartIcon className="h-3 w-3" />
										<span>{artwork.likes}</span>
									</div>
									<div className="flex items-center gap-1">
										<ShareIcon className="h-3 w-3" />
										<span>{artwork.shares}</span>
									</div>
								</div>
							</div>
						))}
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
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Views</CardTitle>
								<EyeIcon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{mockAnalytics.totalViews.toLocaleString()}</div>
								<p className="text-xs text-muted-foreground">+20.1% from last month</p>
							</CardContent>
						</Card>
						
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Likes</CardTitle>
								<HeartIcon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{mockAnalytics.totalLikes.toLocaleString()}</div>
								<p className="text-xs text-muted-foreground">+15.3% from last month</p>
							</CardContent>
						</Card>
						
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Shares</CardTitle>
								<ShareIcon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{mockAnalytics.totalShares.toLocaleString()}</div>
								<p className="text-xs text-muted-foreground">+8.2% from last month</p>
							</CardContent>
						</Card>
						
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Sales</CardTitle>
								<ChartBarIcon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{mockAnalytics.totalSales}</div>
								<p className="text-xs text-muted-foreground">+12.5% from last month</p>
							</CardContent>
						</Card>
						
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Revenue</CardTitle>
								<ChartBarIcon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">${mockAnalytics.revenue}</div>
								<p className="text-xs text-muted-foreground">+18.7% from last month</p>
							</CardContent>
						</Card>
					</div>

					{/* Collection Performance */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Collection Performance</h3>
						<div className="space-y-4">
							{mockCollections.map((collection) => (
								<GlassCard key={collection.id} className="p-4">
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<h4 className="font-medium">{collection.name}</h4>
											<p className="text-sm text-muted-foreground mt-1">{collection.description}</p>
											<div className="flex gap-4 mt-2">
												<Badge variant="outline">{collection.artworkCount} Artworks</Badge>
												<Badge variant="outline">{collection.totalSales} Sales</Badge>
												<Badge variant="outline">${(collection.price * collection.totalSales).toFixed(2)} Revenue</Badge>
											</div>
										</div>
										<Button variant="outline" size="sm">View Details</Button>
									</div>
								</GlassCard>
							))}
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
			<GlassCard className="mb-8 p-6">
				<div className="flex items-center gap-4">
					<img 
						src={user.profilePicture || "https://placehold.co/80x80"} 
						alt="Artist Avatar"
						className="rounded-full w-16 h-16 shadow-lg"
					/>
					<div>
						<h2 className="text-xl font-semibold">{user.artist.artistName}</h2>
						<p className="text-muted-foreground">{user.artist.bio || "No bio available"}</p>
						<div className="flex items-center gap-2 mt-2">
							{user.artist.isVerified && (
								<Badge variant="default">Verified Artist</Badge>
							)}
							{user.artist.isNsfw && (
								<Badge variant="secondary">NSFW Content</Badge>
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
		</div>
	);
}
