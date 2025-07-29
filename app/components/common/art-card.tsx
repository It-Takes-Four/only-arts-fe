import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";

interface ArtCardProps {
	art: {
		id: string;
		title: string;
		artist: {
			name: string;
			image: string;
		};
		image: string;
	};
}

export function ArtCard({ art }: ArtCardProps) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<motion.div
			key={"id"}
			className="group relative overflow-hidden rounded-lg cursor-pointer"
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
		>
			<div className="aspect-[1/1] overflow-hidden">
				<motion.img
					src={"/profile-background.jpg"}
					alt={"Portfolio Item"}
					className="w-full h-full object-cover"
					animate={{ scale: isHovered ? 1.1 : 1 }}
					transition={{ duration: 0.3 }}
				/>
			</div>

			{/* Overlay */}
			<motion.div
				className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
				initial={{ opacity: 0 }}
				animate={{ opacity: isHovered ? 1 : 0 }}
				transition={{ duration: 0.3 }}
			>
				{/* Artist Badge */}
				<motion.span
					className="absolute top-3 left-3 flex px-2 py-1.5 glass rounded-full text-sm font-medium border-border text-white items-center gap-x-1.5"
					initial={{ y: -50, opacity: 0 }}
					animate={{
						y: isHovered ? 0 : -50,
						opacity: isHovered ? 1 : 0
					}}
					transition={{
						duration: 0.3,
						ease: "easeOut"
					}}
				>
					<img src={"https://placehold.co/50x50"} alt="Artist Avatar" className="h-5 rounded-full"/>
					{"Artist Name"}
				</motion.span>

				{/* Content at bottom */}
				<motion.div
					className="absolute bottom-0 left-0 right-0 p-4 text-white"
					initial={{ y: 24, opacity: 0 }}
					animate={{
						y: isHovered ? 0 : 24,
						opacity: isHovered ? 1 : 0
					}}
					transition={{
						duration: 0.3,
						delay: isHovered ? 0.1 : 0,
						ease: "easeOut"
					}}
				>
					<h3 className="text-xl font-semibold mb-1">{"DSDSD"}</h3>
					<p className="text-sm text-white/90 mb-2">{"DESC"}</p>
					<div className="flex space-x-2">
						<Badge variant="outline" className="glass text-primary-foreground font-semibold border-border py-1 gap-x-1.5">
							TAG
						</Badge><Badge variant="outline" className="glass text-primary-foreground font-semibold border-border py-1 gap-x-1.5">
						TAG
					</Badge><Badge variant="outline" className="glass text-primary-foreground font-semibold border-border py-1 gap-x-1.5">
						TAG
					</Badge>
					</div>
				</motion.div>
			</motion.div>
		</motion.div>
	);
}