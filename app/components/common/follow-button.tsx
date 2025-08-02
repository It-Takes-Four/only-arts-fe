import React, { useState } from 'react';
import { UserPlus, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFollow } from '../hooks/useFollow';

interface FollowButtonProps {
	artistId: string;
	size?: number;
	className?: string;
}

export const FollowButton = ({
	artistId,
	size = 16,
	className = ""
}: FollowButtonProps) => {
	// const [isFollowing, setIsFollowing] = useState(initialFollowing);
	const { isFollowing, loading, follow, unfollow } = useFollow(artistId);
	const [isHovered, setIsHovered] = useState(false);

	// const handleClick = () => {
	// const newState = !isFollowing;
	// setIsFollowing(newState);
	// onFollowChange(newState);
	// };

	const handleClick = async () => {
		if (loading) return;
		if (isFollowing) {
			await unfollow();
		} else {
			await follow();
		}
	};

	return (
		<motion.button
			className={`relative overflow-hidden hover:bg-primary-foreground/10 transition-colors rounded-lg py-1 px-3 hover:cursor-pointer ${className}`}
			onClick={handleClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			whileTap={{ scale: 0.95 }}
			transition={{ type: "spring", stiffness: 400, damping: 25 }}
		>
			<div className="flex items-center">
				<motion.div
					key={isFollowing ? 'following' : 'follow'}
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.2 }}
				>
					{isFollowing ? (
						<UserCheck size={size} className="text-primary-foreground" />
					) : (
						<UserPlus size={size} className="text-primary-foreground" />
					)}
				</motion.div>

				<motion.div
					animate={{
						width: isHovered ? 'auto' : 0,
						marginLeft: isHovered ? 8 : 0
					}}
					transition={{ duration: 0.3, ease: "easeOut" }}
					className="overflow-hidden"
				>
					<motion.span
						className="text-sm font-medium text-primary-foreground whitespace-nowrap"
						initial={{ x: -20, opacity: 0 }}
						animate={{
							x: isHovered ? 0 : -20,
							opacity: isHovered ? 1 : 0
						}}
						transition={{ duration: 0.3, ease: "easeOut" }}
					>
						{isFollowing ? 'Following' : 'Follow'}
					</motion.span>
				</motion.div>
			</div>
		</motion.button>
	);
};