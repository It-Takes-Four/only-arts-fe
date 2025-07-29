import { useState } from "react";
import { CollectionCard } from "../../components/common/collection-card";
import { ArtCard } from "../../components/common/art-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/common/tabs";
import { SearchInput } from "../../components/common/search-input";

export function OldExplorePage() {
	const [tabValue, setTabValue] = useState("artworks");

	// State for search queries in each tab
	const [searchQueryArt, setSearchQueryArt] = useState("");
	const [searchQueryCollection, setSearchQueryCollection] = useState("");
	const [searchQueryProfiles, setSearchQueryProfiles] = useState("");

	// Dummy data for Art and Collections
	const artData = [
		{
			id: "1",
			title: "Artwork 1",
			description: "description description description description.",
			artist: {
				id: "artist1",
				name: "Artist 1",
				profilePicture: "https://placehold.co/150x150"
			},
			tags: [
				{ id: "tag1", name: "Tag1" },
				{ id: "tag2", name: "Tag2" }
			],
			createdAt: new Date(),
			imageUrl: "https://placehold.co/300x300"
		},
		{
			id: "2",
			title: "Artwork 2",
			description: "description description description description.",
			artist: {
				id: "artist2",
				name: "Artist 2",
				profilePicture: "https://placehold.co/150x150"
			},
			createdAt: new Date(),
			imageUrl: "https://placehold.co/300x300"
		},
		// More artworks...
	];

	const collectionsData = [
		{
			id: '1',
			name: "Feet collection",
			description: "Irvin's collection of feet pics >:D",
			artworkCount: 100,
			previewImage: "/profile-background.jpg",
			createdBy: "piipipipi",
			price: 1.99,
			totalSales: 2
		},
		// More collections...
	];

	const profilesData = [
		{
			id: "artist1",
			name: "Artist Name",
			bio: "Artist bio",
			profilePicture: "https://placehold.co/150x150"
		},
		// More profiles...
	];

	// Filter based on search query
	const filteredArt = artData.filter((art) =>
		art.title.toLowerCase().includes(searchQueryArt.toLowerCase()) ||
		art.description.toLowerCase().includes(searchQueryArt.toLowerCase())
	);

	const filteredCollections = collectionsData.filter((collection) =>
		collection.name.toLowerCase().includes(searchQueryCollection.toLowerCase()) ||
		collection.description.toLowerCase().includes(searchQueryCollection.toLowerCase())
	);

	const filteredProfiles = profilesData.filter((profile) =>
		profile.name.toLowerCase().includes(searchQueryProfiles.toLowerCase()) ||
		profile.bio.toLowerCase().includes(searchQueryProfiles.toLowerCase())
	);

	const tabs = [
		{
			value: "artworks",
			label: "Artworks",
			content: (
				<>
					<SearchInput
						type="text"
						placeholder="Search artworks..."
						className="my-4 bg-input rounded-lg"
						value={searchQueryArt}
						onSearch={setSearchQueryArt}
					/>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
						{filteredArt.map((art) => (
							<ArtCard key={art.id} art={art} />
						))}
					</div>
				</>
			)
		},
		{
			value: "collections",
			label: "Collections",
			content: (
				<>
					<SearchInput
						type="text"
						placeholder="Search collections..."
						className="my-4 bg-input rounded-lg"
						value={searchQueryCollection}
						onSearch={setSearchQueryCollection}
					/>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
						{filteredCollections.map((collection) => (
							<CollectionCard key={collection.id} {...collection} />
						))}
					</div>
				</>
			)
		},
		{
			value: "profiles",
			label: "Profiles",
			content: (
				<>
					<SearchInput
						type="text"
						placeholder="Search profiles..."
						className="my-4 bg-input rounded-lg"
						value={searchQueryProfiles}
						onSearch={setSearchQueryProfiles}
					/>
					<div>
						{filteredProfiles.map((profile) => (
							<div key={profile.id} className="p-4 border-b">
								<h3>{profile.name}</h3>
								<p>{profile.bio}</p>
							</div>
						))}
					</div>
				</>
			)
		}
	];

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold">Explore</h1>
			<p className="text-muted-foreground mt-2">
				Discover and explore creative works on OnlyArts
			</p>

			<Tabs value={tabValue} onValueChange={setTabValue}>
				<TabsList className="mt-4">
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
