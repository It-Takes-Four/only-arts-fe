export function ExplorePage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold">Explore</h1>
			<p className="text-muted-foreground mt-2">
				Discover and explore creative works on OnlyArts
			</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
				{/* Placeholder for ArtCard components */}
				{/* Replace with actual ArtCard components when available */}
				<div className="bg-gray-200 h-64 flex items-center justify-center">
					<p className="text-gray-500">ArtCard Placeholder</p>
				</div>
				<div className="bg-gray-200 h-64 flex items-center justify-center">
					<p className="text-gray-500">ArtCard Placeholder</p>
				</div>
				<div className="bg-gray-200 h-64 flex items-center justify-center">
					<p className="text-gray-500">ArtCard Placeholder</p>
				</div>
				<div className="bg-gray-200 h-64 flex items-center justify-center">
					<p className="text-gray-500">ArtCard Placeholder</p>
				</div>
				<div className="bg-gray-200 h-64 flex items-center justify-center">
					<p className="text-gray-500">ArtCard Placeholder</p>
				</div>
		</div>
		</div>
	);
}