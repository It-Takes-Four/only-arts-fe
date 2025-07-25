import { ShinyBadge } from "@/components/magicui/shiny-badge";
import { Separator } from "@/components/ui/separator";

export function meta() {
	return [
		{ title: "OnlyArts - Profile" },
		{ name: "description", content: "Explore the creative works of an artist on OnlyArts." },
	];
}

export default function Profile() {
	return (
		<div className="container mx-auto px-4 py-8">

			{/* Profile Header */}

			<div
				className="bg-cover bg-center h-64 w-full rounded-lg p-4 flex flex-col justify-between"
				style={{ backgroundImage: `url(${'https://t4.ftcdn.net/jpg/03/86/82/73/360_F_386827376_uWOOhKGk6A4UVL5imUBt20Bh8cmODqzx.jpg'})` }}
			>

				<div>
					<ShinyBadge>ARTIST</ShinyBadge>
				</div>


				<div className="glass p-4 rounded-lg flex justify-between">

					{/* User Data */}
					<div className="flex items-center">
						<img src="https://placehold.co/150x150" alt="Artist Avatar"
								 className="relative rounded-full w-20 h-20 shadow-lg z-10"/>
						<div className="h-20 ml-[-3rem] py-4 pr-8 pl-16 bg-white/20 dark:bg-white/10 rounded-lg">
							<h1 className="text-xl font-bold text-primary-foreground">Artist Name</h1>
							<p className="text-sm text-white/75">@artist_id</p>
						</div>
					</div>

					<div className="w-100 py-4 px-8 bg-white/20 dark:bg-white/10 rounded-lg flex items-center justify-center space-x-4">
						<div className="flex flex-col items-center flex-1">
							<span className="text-sm text-white/75 font-mono uppercase">Arts</span>
							<span className="text-lg font-semibold text-white">XXX</span>
						</div>
						<Separator orientation="vertical" decorative className="bg-primary-foreground/50"/>
						<div className="flex flex-col items-center flex-1">
							<span className="text-sm text-white/75 font-mono uppercase">Followers</span>
							<span className="text-lg font-semibold text-white">XXX</span>
						</div>
						<Separator orientation="vertical" decorative className="bg-primary-foreground/50"/>
						<div className="flex flex-col items-center flex-1">
							<span className="text-sm text-white/75 font-mono uppercase">Collections</span>
							<span className="text-lg font-semibold text-white">XXX</span>
						</div>
					</div>


				</div>

			</div>

			{/*	Main Content */}

			<div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

				{/* Example Art Card */}
				<div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
					<img src="https://placehold.co/300x200" alt="Art Piece" className="w-full h-48 object-cover"/>
					<div className="p-4">
						<h2 className="text-lg font-semibold">Art Title</h2>
						<p className="text-sm text-gray-600 dark:text-gray-400">Description of the art piece.</p>
					</div>
				</div>

				{/* Repeat for more art pieces */}
				{/* ... */}

			<div>
			</div>


			</div>

		</div>
	);
}