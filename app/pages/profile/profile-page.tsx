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

export function ProfilePage() {
	const { user } = useAuthContext();
	const [tabValue, setTabValue] = useState("explore");

	const tabs = [
		{
			value: "explore",
			label: "Explore",
			content: <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">

			<CollectionCard id='1' name="Feet collection" description="Irvin's collection of feet pics >:D" artworkCount={100} previewImage="/profile-background.jpg" createdBy="piipipipi" price={1.99} totalSales={2} />
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
						createdAt: new Date(),
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
						createdAt: new Date(),
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
						createdAt: new Date(),
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
						createdAt: new Date(),
						imageUrl: "https://placehold.co/300x300"
					}
				}/>
			</div>,
		},
	];

	return (
		<div className="container mx-auto px-4 py-8">

			{/* Profile Header */}

			<div
				className="bg-cover bg-center h-80 w-full rounded-lg p-4 flex flex-col justify-between mb-6"
				style={{ backgroundImage: 'url(/profile-background.jpg)' }}
			>

				<ShinyBadge className="self-start">
					<CheckBadgeIcon className="size-4 mr-1"/>
					ARTIST
				</ShinyBadge>

				{/* User Data */}

				<GlassCard className="py-4 px-8 flex flex-col lg:flex-row justify-between">
					<div className="flex items-start lg:items-end space-x-4">
						<img src="https://placehold.co/150x150" alt="Artist Avatar"
								 className="rounded-full w-2- h-20 shadow-lg"/>
						<div className="flex flex-col rounded-lg">
							<span className="flex items-center text-white">
								<h1 className="text-2xl font-bold text-white">{user?.username}</h1>
								<Separator orientation="vertical" className="bg-white/25 h-5 mr-1 ml-4"/>
								<FollowButton/>
							</span>
							<p className="text-sm text-white/75 mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
							<Badge variant="outline"
										 className="mt-2 font-mono text-primary-foreground text-xs uppercase border-white/25">
								JOINED JUN 2025</Badge>
						</div>
					</div>
					<Separator className="bg-white/15 my-4 lg:hidden"/>

					<div className="rounded-lg flex items-end space-x-6">
						<div className="flex flex-col items-center lg:items-end flex-1">
							<span className="text-xs text-white/75 font-mono uppercase">Collections</span>
							<span className="text-lg font-semibold text-white">XXX</span>
						</div>
						<div className="flex flex-col items-center lg:items-end flex-1">
							<span className="text-xs text-white/75 font-mono uppercase">Artworks</span>
							<span className="text-lg font-semibold text-white">XXX</span>
						</div>
						<div className="flex flex-col items-center lg:items-end flex-1">
							<span className="text-xs text-white/75 font-mono uppercase">Following</span>
							<span className="text-lg font-semibold text-white">XXX</span>
						</div>
						<div className="flex flex-col items-center lg:items-end flex-1">
							<span className="text-xs text-white/75 font-mono uppercase">Followers</span>
							<span className="text-lg font-semibold text-white">{user?.followers?.length}</span>
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