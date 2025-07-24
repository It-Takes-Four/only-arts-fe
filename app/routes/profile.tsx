import { GlassCard } from "../components/common/glass-card";

export function meta() {
	return [
		{ title: "OnlyArts - Profile" },
		{ name: "description", content: "Explore the creative works of an artist on OnlyArts." },
	];
}

export default function Profile() {
	return (
		<div className="container mx-auto px-4 py-20">
			<GlassCard>
				<img src="https://placehold.co/600x400" alt="Artist Profile Banner"
						 className="w-full h-64 object-cover rounded-t-lg"/>
			</GlassCard>
			<GlassCard>
				<img src="https://placehold.co/600x400" alt="Artist Profile Banner"
						 className="w-full h-64 object-cover rounded-t-lg"/>
			</GlassCard>
			<GlassCard>
				<img src="https://placehold.co/600x400" alt="Artist Profile Banner"
						 className="w-full h-64 object-cover rounded-t-lg"/>
			</GlassCard><GlassCard>
			<img src="https://placehold.co/600x400" alt="Artist Profile Banner"
					 className="w-full h-64 object-cover rounded-t-lg"/>
		</GlassCard>
			<GlassCard>
				<img src="https://placehold.co/600x400" alt="Artist Profile Banner"
						 className="w-full h-64 object-cover rounded-t-lg"/>
			</GlassCard>
			<GlassCard>
				<img src="https://placehold.co/600x400" alt="Artist Profile Banner"
						 className="w-full h-64 object-cover rounded-t-lg"/>
			</GlassCard>


		</div>
	);
}