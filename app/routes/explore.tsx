import { ExplorePage } from "../pages/explore";

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