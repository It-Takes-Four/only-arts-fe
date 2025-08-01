import { ProfilePage } from "../pages/profile";

export function meta() {
	return [
		{ title: "OnlyArts - My Profile" },
		{ name: "description", content: "View and manage your OnlyArts profile." },
	];
}

export default function Profile() {
	return (
		<ProfilePage />
	);
}