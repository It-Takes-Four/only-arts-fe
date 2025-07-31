import { CalendarDays, Heart, ImageIcon, Tag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockArt = {
	id: "clx0m0000000000000000000",
	// imageUrl: "https://www.vets4pets.com/siteassets/species/cat/cat-close-up-of-side-profile.jpg",
	imageUrl: "https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
	title: "Whispers of the Cosmos",
	description:
		"An ethereal abstract painting capturing the silent dance of celestial bodies and the profound mysteries of the universe. Created with vibrant acrylics and intricate brushwork, it invites contemplation and wonder. This piece explores themes of infinity, solitude, and the interconnectedness of all things, rendered in a palette of deep blues, purples, and shimmering golds.",
	datePosted: new Date("2024-07-20T10:00:00Z"),
	updatedAt: new Date("2024-07-21T14:30:00Z"),
	artistId: "clx0m0000000000000000001",
	tokenId: 9876543210987654321n, // Example BigInt
	likesCount: 152,
	isInACollection: true,
	artist: {
		name: "Anya Petrova", // Assuming artist has a name
	},
	tags: ["abstract", "cosmic", "acrylic", "modern", "celestial", "spiritual"],
}

export function ArtPage() {
	const art = mockArt
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
				{/* Left Column: Image */}
				<div className="overflow-hidden shadow-lg">
					{
						art.imageUrl ? (
							<img
								src={art.imageUrl}
								alt={art.title}
								className="object-cover rounded-lg w-full h-auto"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							/>
						) : (
							<div className="flex items-center justify-center h-full bg-gray-200/10 rounded-lg">
								<ImageIcon className="h-6 w-6 text-muted-foreground"/>
							</div>
						)
					}
				</div>

				{/* Right Column: Details */}
				<div className="grid gap-6">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{art.title}</h1>

					<div className="flex items-center gap-4 text-lg text-muted-foreground">
						<div className="flex items-center gap-2">
							<User className="w-5 h-5" />
							<span>{art.artist.name}</span>
						</div>
						<div className="flex items-center gap-2">
							<Heart className="w-5 h-5 fill-red-500 text-red-500" />
							<span>{art.likesCount} Likes</span>
						</div>
					</div>

					<p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">{art.description}</p>

					<div className="grid gap-2 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<CalendarDays className="w-4 h-4" />
							<span>Posted: {new Date(art.datePosted).toLocaleDateString()}</span>
						</div>
						<div className="flex items-center gap-2">
							<Tag className="w-4 h-4" />
							<span>Token ID: {art.tokenId.toString()}</span>
						</div>
						{art.isInACollection && (
							<Badge variant="secondary" className="w-fit">
								In a Collection
							</Badge>
						)}
					</div>

					{art.tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{art.tags.map((tag, index) => (
								<Badge key={index} variant="outline">
									{tag}
								</Badge>
							))}
						</div>
					)}

					<div className="flex gap-4 mt-4">
						<Button size="lg" className="flex-1">
							<Heart className="w-5 h-5 mr-2" />
							Like Art
						</Button>
						<Button size="lg" variant="outline" className="flex-1 bg-transparent">
							Add to Collection
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}