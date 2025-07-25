import type { Art } from "../core/_models";
import { GlassCard } from "./glass-card";

interface ArtCardProps {
	art: Art;
}

export function ArtCard({ art }: ArtCardProps) {
	return (
		<GlassCard className="p-4 bg-gradient-to-br from-card/30 to-primary/5">
			<img
				src={art.imageUrl}
				alt="Art Thumbnail"
				className="w-full h-40 object-cover rounded-lg"
			/>
			<div className="mt-4">
				<h2 className="text-xl font-semibold">{art.title}</h2>
				<p className="text-gray-600 mt-2">{art.artist.name}</p>
				<p className="text-gray-500 mt-1">{art.description}</p>
			</div>
		</GlassCard>
	);
}