import { useParams } from "react-router";
import { ProfilePage } from "../pages/profile";

export function meta() {
	return [
		{ title: "OnlyArts - Artist Profile" },
		{ name: "description", content: "Explore the creative works of an artist on OnlyArts." },
	];
}

export default function Artist() {
	const { artistId } = useParams();
	
	return (
		<ProfilePage artistId={artistId} />
	);
}
