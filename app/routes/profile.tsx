import { useParams } from "react-router";
import { ProfilePage } from "../pages/profile";

export function meta() {
	return [
		{ title: "OnlyArts - Profile" },
		{ name: "description", content: "Explore the creative works of an artist on OnlyArts." },
	];
}

export default function Profile() {
	const { artistId } = useParams();
	
	return (
		<ProfilePage artistId={artistId} />
	);
}