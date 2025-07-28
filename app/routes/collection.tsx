import { CollectionPage } from "../pages/collection";

export function meta() {
	return [
		{ title: "OnlyArts - Collection" },
		{ name: "description", content: "Explore and manage your collection of creative works on OnlyArts" },
	];
}


export default function Collection() {
	return <CollectionPage />;
}