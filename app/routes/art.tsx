import { ArtPage } from "../pages/art/art-page";

export function meta() {
	return [
		{ title: "OnlyArts - Art" },
		{ name: "description", content: "Explore detailed information about artworks, including artist profiles, collection context, and engagement metrics." },
	];
}

export default function Art() {
	return (
		<ArtPage />
	);
}
