import { ExplorePage } from "app/pages/explore/explore-page";

export function meta() {
	return [
		{ title: "OnlyArts - Explore" },
		{ name: "description", content: "Discover and explore creative works on OnlyArts" },
	];
}

export default function Explore() {
	return (
		<ExplorePage />
	);
}