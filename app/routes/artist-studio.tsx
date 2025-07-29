import { ArtistStudioPage } from "../pages/artist-studio";

export function meta() {
	return [
		{ title: "OnlyArts - Artist Studio" },
		{ name: "description", content: "Manage your collections, artworks, and view engagement analytics." },
	];
}

export default function ArtistStudio() {
	return (
		<ArtistStudioPage />
	);
}
