import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Art } from "../core/_models";
import { GlassCard } from "./glass-card";

interface ArtCardProps {
	art: Art;
}

export function ArtCard({ art }: ArtCardProps) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<motion.div
			className="relative overflow-hidden rounded-xl cursor-pointer"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			whileHover={{ scale: 1.02 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
		>
			<GlassCard className="relative h-80 w-full shadow-lg hover:shadow-2xl transition-shadow duration-300">
				{/* Art Image */}
				<div className="relative h-full w-full overflow-hidden rounded-xl">
					<motion.img
						src={art.imageUrl}
						alt={art.title}
						className="h-full w-full object-cover"
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
					/>

					{/* Gradient overlay for text readability */}
					<motion.div
						className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
						initial={{ opacity: 0 }}
						animate={{ opacity: isHovered ? 1 : 0 }}
						transition={{ duration: 0.3 }}
					/>

					{/* Title sliding from bottom */}
					<motion.div
						className="absolute bottom-0 left-0 right-0 p-6"
						initial={{ y: "100%" }}
						animate={{ y: isHovered ? "0%" : "100%" }}
						transition={{
							duration: 0.4,
							ease: [0.25, 0.1, 0.25, 1]
						}}
					>
						<motion.h3
							className="text-white text-lg font-bold drop-shadow-lg"
							initial={{ opacity: 0, y: 20 }}
							animate={{
								opacity: isHovered ? 1 : 0,
								y: isHovered ? 0 : 20
							}}
							transition={{
								duration: 0.3,
								delay: isHovered ? 0.1 : 0
							}}
						>
							{art.title}
						</motion.h3>
						<motion.p
							className="text-white text-sm mt-2 drop-shadow-lg"
							initial={{ opacity: 0, y: 20 }}
							animate={{
								opacity: isHovered ? 1 : 0,
								y: isHovered ? 0 : 20
							}}
							transition={{
								duration: 0.3,
								delay: isHovered ? 0.2 : 0
							}}
						>
							{/*artist picture*/}
							<img
								src={art.artist.profilePicture || "https://placehold.co/150x150"}
								alt={art.artist.name}
								className="inline-block h-6 w-6 rounded-full mr-2"
							/>
							{art.artist.name}
						</motion.p>
					</motion.div>
				</div>
			</GlassCard>
		</motion.div>
	);
}