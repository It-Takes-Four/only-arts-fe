import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Images } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function CollectionCard() {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<motion.div
			className="relative flex flex-col p-2 rounded-lg bg-gradient-to-br from-card/50 to-primary/10 border border-border cursor-pointer"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>

			<div className="h-64 relative overflow-hidden rounded-md">
				<div className="w-full h-full object-cover rounded-md p-2 flex justify-end items-start" style={{
					backgroundImage: `url('/profile-background.jpg')`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat'
				}}>
					<Tooltip>
						<TooltipTrigger asChild>
							<Badge variant="outline"
										 className="glass text-primary-foreground font-semibold border-border py-1 gap-x-1.5">
								<Images/>
								10
							</Badge>
						</TooltipTrigger>
						<TooltipContent className="bg-popover text-popover-foreground py-2 ">
							<p className="font-mono">10 ARTWORKS</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>

			<div className="flex space-x-2 mt-3">
				<img src="/profile-background.jpg" alt="Artist Avatar" className="rounded-full h-10 w-10"/>
				<div className="flex flex-col">
					<h3 className="text-md font-semibold text-foreground ">Collection Name</h3>
					<span className="text-xs text-muted-foreground/70">By Artist Name</span>
				</div>
			</div>

			<Badge variant="secondary" className="mt-3 mb-2 font-mono border border-border py-1 gap-x-1.5">
				<Calendar/>
				MON XXXX
			</Badge>

			<motion.div
				className="absolute h-3/4 bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent rounded-b-lg flex items-end justify-end p-4 text-white"
				initial={{ opacity: 0 }}
				animate={{ opacity: isHovered ? 1 : 0 }}
			>
				<motion.div className="flex text-sm items-center gap-2 overflow-hidden"
										initial={{ height: 0 }}
										animate={{ height: isHovered ? "auto" : 0 }}
				>
					View
					<ArrowRight className="h-5"/>
				</motion.div>
			</motion.div>
		</motion.div>
	);
}