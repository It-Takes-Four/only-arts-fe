import { ShinyBadge } from "@/components/magicui/shiny-badge";

export function meta() {
	return [
		{ title: "OnlyArts - Profile" },
		{ name: "description", content: "Explore the creative works of an artist on OnlyArts." },
	];
}

export default function Profile() {
	return (
		<div className="container mx-auto px-4 pt-24">

			{/* Profile Section */}

			<div
				className="bg-cover bg-center h-64 w-full rounded-lg p-4 flex flex-col justify-between"
				style={{ backgroundImage: `url(${'https://t3.ftcdn.net/jpg/08/04/92/82/360_F_804928270_ROm9Al5QgQs8NjVJolPPUaFxKwZ6cjUW.jpg'})` }}
			>

				<div>
					<ShinyBadge>ARTIST</ShinyBadge>
				</div>


					<div className="glass p-4 rounded-lg">
						<img src="https://placehold.co/150x150" alt="Artist Avatar" className="rounded-full w-20 h-20 shadow-lg"/>
						<div>

						</div>
					</div>

			</div>

			{/*	Main Content */}

			<div>


			</div>

		</div>
	);
}