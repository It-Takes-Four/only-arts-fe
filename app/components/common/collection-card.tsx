import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Images } from "lucide-react";
import { useState } from "react";

export function CollectionCard() {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<motion.div
			className="relative flex flex-col p-2 rounded-lg bg-gradient-to-br from-card/50 to-primary/5 border border-border cursor-pointer"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<img src="https://placehold.co/300x200" alt="Collection Thumbnail"
					 className="w-full h-48  rounded-md"/>



			<div className="p-2 flex justify-between">
				<h3 className="text-lg font-semibold text-foreground text-left">Collection Name</h3>
				<Tooltip>
					<TooltipTrigger asChild>
						<Badge variant="secondary" className="font-semibold border border-border py-1 gap-x-1.5">
							<Images/>
							10
						</Badge>
					</TooltipTrigger>
					<TooltipContent className="bg-popover text-popover-foreground py-2 ">
						<p className="font-mono">10 ARTWORKS</p>
					</TooltipContent>
				</Tooltip>
			</div>
			<div className="flex items-center px-2 space-x-2">
				<img src="https://placehold.co/50x50" alt="Artist Avatar" className="rounded-full h-6"/>
				<span className="text-sm text-muted-foreground/70">Artist Name</span>
			</div>
			<Badge variant="secondary" className="m-2 font-mono border border-border py-1 gap-x-1.5">
				<Calendar/>
				MON XXXX
			</Badge>

			<motion.div
				className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg flex items-end justify-end p-4 text-white"
				initial={{ opacity: 0 }}
				animate={{ opacity: isHovered ? 1 : 0 }}
			>
				<motion.div className="flex items-center gap-2 overflow-hidden"
										initial={{ height: 0 }}
										animate={{ height: isHovered ? "auto" : 0 }}
				>
					View
					<ArrowRight className="h-5 w-5"/>
				</motion.div>
			</motion.div>
		</motion.div>
	);
}