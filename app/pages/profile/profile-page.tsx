import { ShinyBadge } from "@/components/magicui/shiny-badge";
import { GlassCard } from "../../components/common/glass-card";
import { useAuthContext } from "../../components/core/auth-context";
import { ArtCard } from "../../components/common/art-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/common/tabs";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckBadgeIcon } from "@heroicons/react/16/solid";
import { Separator } from "@/components/ui/separator";
import { FollowButton } from "../../components/common/follow-button";
import { CollectionCard } from "../../components/common/collection-card";
import { useArtistProfile } from "../../components/hooks/useArtistProfile";
import { artistService } from "../../services/artist-service";
import { formatDistanceToNow } from 'date-fns';
import { FancyLoading } from "../../components/common/fancy-loading";

interface ProfilePageProps {
	artistId?: string;
}

export function ProfilePage({ artistId }: ProfilePageProps) {
	const { user } = useAuthContext();
	const { artist, loading, error } = useArtistProfile(artistId);
	const [tabValue, setTabValue] = useState("explore");

	const isOwnProfile = !artistId; // If no artistId, it's the current user's profile

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
			content:
				// <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
					<div className="">

			</div>,
		},
		{
			value: "collections",
			label: "Collections",
			content: <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
				<CollectionCard id='1' name="Feet collection" description="Irvin's collection of feet pics >:D" artworkCount={100} previewImage="/profile-background.jpg" createdBy="piipipipi" price={1.99} totalSales={2} />

			</div>,
		},
		{
			value: "artworks",
			label: "Artworks",
			content: <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
				<ArtCard art={
					{
						id: "1",
						title: "Sample Artwork",
						description: "This is a sample artwork description.",
						artist: {
							id: "artist1",
							name: "Artist Name",
							profilePicture: "https://placehold.co/150x150"
						},
						createdAt: "2025-08-01T00:00:00.000Z",
						imageUrl: "https://placehold.co/300x300"
					}
				}/>
				<ArtCard art={
					{
						id: "1",
						title: "Sample Artwork",
						description: "This is a sample artwork description.",
						artist: {
							id: "artist1",
							name: "Artist Name",
							profilePicture: "https://placehold.co/150x150"
						},
						createdAt: "2025-08-01T00:00:00.000Z",
						imageUrl: "https://placehold.co/300x300"
					}
				}/>
				<ArtCard art={
					{
						id: "1",
						title: "Sample Artwork",
						description: "This is a sample artwork description.",
						artist: {
							id: "artist1",
							name: "Artist Name",
							profilePicture: "https://placehold.co/150x150"
						},
						createdAt: "2025-08-01T00:00:00.000Z",
						imageUrl: "https://placehold.co/300x300"
					}
				}/>
				<ArtCard art={
					{
						id: "1",
						title: "Sample Artwork",
						description: "This is a sample artwork description.",
						artist: {
							id: "artist1",
							name: "Artist Name",
							profilePicture: "https://placehold.co/150x150"
						},
						createdAt: "2025-08-01T00:00:00.000Z",
						imageUrl: "https://placehold.co/300x300"
					}
				}/>
			</div>,
		},
	];

	// Loading state
	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
				<FancyLoading />
			</div>
		);
	}

	// Error state
	if (error || !artist) {
		return (
			<div className="container mx-auto px-4 py-8">
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
		<div className="container mx-auto px-4 py-8">

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
					<div className="flex items-start lg:items-end space-x-4">
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
								<Separator orientation="vertical" className="bg-white/25 h-5 mr-1 ml-4"/>
								{!isOwnProfile && <FollowButton/>}
							</span>
							<p className="text-sm text-white/75 mt-1">@{artist.user.username}</p>
							{artist.bio && (
								<p className="text-sm text-white/90 mt-2 max-w-md">{artist.bio}</p>
							)}
							<Badge variant="outline"
										 className="mt-2 font-mono text-primary-foreground text-xs uppercase border-white/25">
								JOINED {formatDate(artist.createdAt).toUpperCase()}</Badge>
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

		</div>
	);
}