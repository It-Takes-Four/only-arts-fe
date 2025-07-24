export function meta() {
	return [
		{ title: "OnlyArts - Profile" },
		{ name: "description", content: "Explore the creative works of an artist on OnlyArts." },
	];
}

export default function Profile() {
	return (
		<div className="container mx-auto px-4 py-16">
			<h1 className="text-4xl font-bold tracking-tight text-primary mb-8">Artist Profile</h1>
		</div>
	);
}