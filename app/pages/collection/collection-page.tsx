import { ArtCard } from "../../components/common/art-card";
import { GlassCard } from "../../components/common/glass-card";
import { Separator } from "@/components/ui/separator";
import { FollowButton } from "../../components/common/follow-button";
import { Badge } from "@/components/ui/badge";

export function CollectionPage() {
	return (
		<div className="container mx-auto px-4 py-8">

				{/* Profile Header */}

				<div
					className="bg-cover bg-center h-80 w-full rounded-lg p-4 flex flex-col justify-between mb-6"
					style={{ backgroundImage: 'url(/profile-background.jpg)' }}
				>

					{/* Collection Data */}

					<GlassCard className="py-4 px-8 flex flex-col lg:flex-row justify-between">
						<div className="flex items-start lg:items-end space-x-4">
							<img src="https://placehold.co/150x150" alt="Artist Avatar"
									 className="rounded-full w-2- h-20 shadow-lg"/>
							<div className="flex flex-col rounded-lg">
							<span className="flex items-center text-white">
								<h1 className="text-2xl font-bold text-white">{"Collection Name"}</h1>
							</span>
								<p className="text-sm text-white/75 mt-1">Collection Description</p>
								<Badge variant="outline"
											 className="mt-2 font-mono text-primary-foreground text-xs uppercase border-white/25">
									CREATED JUN 2025</Badge>
							</div>
						</div>
						<Separator className="bg-white/15 my-4 lg:hidden"/>

						<div className="rounded-lg flex items-end space-x-6">
							<div className="flex flex-col items-center lg:items-end flex-1">
								<span className="text-xs text-white/75 font-mono uppercase">Artworks</span>
								<span className="text-lg font-semibold text-white">XXX</span>
							</div>
							<div className="flex flex-col items-center lg:items-end flex-1">
								<span className="text-xs text-white/75 font-mono uppercase">Owners</span>
								<span className="text-lg font-semibold text-white">XXX</span>
							</div>
						</div>

					</GlassCard>

				</div>

				{/*	Main Content */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
					{/* Placeholder for ArtCard components */}
					{/* Replace with actual ArtCard components when available */}
					<ArtCard art={{
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
					}} />
					<ArtCard art={{
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
					}} />
					<ArtCard art={{
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
					}} />
					<ArtCard art={{
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
					}} />

				</div>

		</div>
	);
}

