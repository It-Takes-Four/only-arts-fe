import { ShinyBadge } from "@/components/magicui/shiny-badge";
import { Palette } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { GlassCard } from "../../components/common/glass-card";
import { useAuthContext } from "../../components/core/auth-context";
import { ArtCard } from "../../components/common/art-card";

export function ProfilePage() {
	const { user } = useAuthContext();


	return (
		<div className="container mx-auto px-4 py-8">

			{/* Profile Header */}

			<div
				className="bg-cover bg-center h-64 w-full rounded-lg p-4 flex flex-col justify-between"
				style={{ backgroundImage: `url(${'https://t3.ftcdn.net/jpg/08/04/92/82/360_F_804928270_ROm9Al5QgQs8NjVJolPPUaFxKwZ6cjUW.jpg'})` }}
			>

				<div>
					<ShinyBadge><Palette size='14'/>ARTIST</ShinyBadge>
				</div>

				<GlassCard className="p-4 flex justify-between">

					{/* User Data */}

					<div className="flex items-center space-x-4 shrink-0">
						<img src="https://placehold.co/150x150" alt="Artist Avatar"
								 className="rounded-full w-20 h-20 shadow-lg"/>
						<div className="h-20 py-4 rounded-lg">
							<h1 className="text-2xl font-bold text-primary-foreground">Artist Name</h1>
							<p className="text-sm text-white/75">@artist_id</p>
						</div>
					</div>

					<div className="py-4 px-8 rounded-lg flex items-center justify-center space-x-4">
						<div className="flex flex-col items-center flex-1">
							<span className="text-sm text-white/75 font-mono uppercase">Following</span>
							<span className="text-lg font-semibold text-white">XXX</span>
						</div>
						<Separator orientation="vertical" decorative className="bg-primary-foreground/50"/>
						<div className="flex flex-col items-center flex-1">
							<span className="text-sm text-white/75 font-mono uppercase">Followers</span>
							<span className="text-lg font-semibold text-white">XXX</span>
						</div>
					</div>

				</GlassCard>

			</div>

			{/*	Main Content */}

			<div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

				<ArtCard art={
					{
						id: "1",
						title: "Sample Art",
						artist: {
							userId: "artist1",
							title: "Artist Name",
						},
						description: "This is a sample description of the art piece.",
						imageUrl: "https://placehold.co/300x200"
					}
				}/>

			</div>

		</div>
	);
}