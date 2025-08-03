import { useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import type { ArtCardProps } from "../../core/_models";
import { useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials } from "../../../utils/UtilityFunction";

export function ArtCard({ art }: ArtCardProps) {
	const navigate = useNavigate();
	const [isHovered, setIsHovered] = useState(false);

	const getArtistProfileImageUrl = () => {
		if (art.artist.profilePictureFileId) {
			return `${import.meta.env.VITE_API_BASE_URL}/upload/profile/${
				art.artist.profilePictureFileId
			}`;
		}
		return null;
	};

	return (
		<motion.div
			key={"id"}
			className="group relative overflow-hidden rounded-lg cursor-pointer"
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			onClick={() => navigate(`/art/${art.id}`)}
		>
			<div className="aspect-square overflow-hidden">
				{art.imageUrl ? (
					<motion.img
						src={art.imageUrl}
						alt={art.title}
						className="w-full h-full object-cover"
						animate={{ scale: isHovered ? 1.1 : 1 }}
						transition={{ duration: 0.3 }}
					/>
				) : (
					<div className="flex items-center justify-center h-full">
						<ImageIcon className="h-4 w-4 text-muted-foreground"/>
					</div>
				)}
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
					className="absolute top-3 left-3 flex px-3 py-2 bg-black/60 backdrop-blur-sm rounded-full text-sm font-medium text-white items-center gap-x-2"
					initial={{ y: -50, opacity: 0 }}
					animate={{
						y: isHovered ? 0 : -50,
						opacity: isHovered ? 1 : 0,
					}}
					transition={{
						duration: 0.3,
						ease: "easeOut",
					}}
				>
					<Avatar className="h-5 w-5">
						<AvatarImage src={getArtistProfileImageUrl() || ""}/>
						<AvatarFallback className="text-xs">
							{getUserInitials(art.artist.name)}
						</AvatarFallback>
					</Avatar>
					{art.artist.name}
				</motion.span>

				<motion.div
					className="absolute bottom-0 left-0 right-0 p-4 text-white"
					initial={{ y: 24, opacity: 0 }}
					animate={{
						y: isHovered ? 0 : 24,
						opacity: isHovered ? 1 : 0,
					}}
					transition={{
						duration: 0.3,
						delay: isHovered ? 0.1 : 0,
						ease: "easeOut",
					}}
				>
					<h3 className="text-xl font-semibold mb-1">{art.title}</h3>
					<p className="text-sm text-white/90 mb-2">
						{art.description}
					</p>
					{art.tags && art.tags.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{art.tags.slice(0, 3).map((tag, index) => (
								<span
									key={index}
									className="text-xs text-white/80 bg-white/20 px-2 py-1 rounded-full"
								>
									{tag.name || ('tag' in tag && tag.tag?.tagName) || 'Unknown'}
								</span>
							))}
							{art.tags.length > 3 && (
								<span
									className="text-xs text-white/80 bg-white/20 px-2 py-1 rounded-full"
								>
									+{art.tags.length - 3}
								</span>
							)}
						</div>
					)}
				</motion.div>
			</motion.div>
		</motion.div>
	);
}
