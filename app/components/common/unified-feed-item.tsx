import { motion } from "framer-motion";
import { Link } from "react-router";
import { Heart, MessageCircle, Share2, Eye, Calendar } from "lucide-react";
import { Button } from "./button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AuthenticatedImage } from "./authenticated-image";
import { useNavigate } from "react-router";
import type { UnifiedFeedItem } from "../../types/feed";
import { getUserInitials } from "../../utils/UtilityFunction";

interface UnifiedFeedItemProps {
	item: UnifiedFeedItem;
	index: number;
}

export function UnifiedFeedItemComponent({
	item,
	index,
}: UnifiedFeedItemProps) {
	const navigate = useNavigate();

	const getDisplayData = () => {
		switch (item.type) {
			case "post":
				const postContent = item.post?.content || "";
				const postTitle =
					item.post?.title ||
					`${item.post?.artistName || "Unknown Artist"
					} shared a post`;

				return {
					title: postTitle,
					content: postContent,
					artistName: item.post?.artistName || "",
					artistId: item.post?.artistId || "",
					artistProfileFileId: item.post?.artistProfileFileId || null,
					createdDate: item.post?.createdDate || item.createdDate,
					imageFileId: null,
					tags: [],
					type: "post" as const,
					url: `/post/${item.feedItemId}`,
				};
			case "art":
				return {
					title: item.art?.artTitle || "Untitled Artwork",
					content: item.art?.artDescription || "",
					artistName: item.art?.artistName || "",
					artistId: item.art?.artistId || "",
					artistProfileFileId: item.art?.artistProfileFileId || null,
					createdDate: item.art?.createdDate || item.createdDate,
					imageFileId: item.art?.imageFileId || null,
					tags: item.art?.tags || [],
					type: "art" as const,
					url: `/art/${item.feedItemId}`,
				};
			case "collection":
				return {
					title:
						item.collection?.collectionTitle ||
						"Untitled Collection",
					content: item.collection?.collectionDescription || "",
					artistName: item.collection?.artistName || "",
					artistId: item.collection?.artistId || "",
					artistProfileFileId:
						item.collection?.artistProfileFileId || null,
					createdDate:
						item.collection?.createdDate || item.createdDate,
					imageFileId: item.collection?.coverImageFileId || null,
					tags: [],
					type: "collection" as const,
					url: `/collection/${item.feedItemId}`,
				};
			default:
				return {
					title: "Unknown Content",
					content: "",
					artistName: "",
					artistId: "",
					artistProfileFileId: null,
					createdDate: item.createdDate,
					imageFileId: null,
					tags: [],
					type: "unknown" as const,
					url: "/",
				};
		}
	};

	const displayData = getDisplayData();
	const hasImage = !!displayData.imageFileId;

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 1) return "Yesterday";
		if (diffDays < 7) return `${diffDays} days ago`;
		if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
		return date.toLocaleDateString();
	};

	const getTypeIcon = () => {
		switch (displayData.type) {
			case "art":
				return "🎨";
			case "collection":
				return "📁";
			case "post":
				return "💭";
			default:
				return "📄";
		}
	};

	const getTypeColor = () => {
		switch (displayData.type) {
			case "art":
				return "from-purple-500/20 to-pink-500/20 border-purple-200 text-purple-700";
			case "collection":
				return "from-blue-500/20 to-cyan-500/20 border-blue-200 text-blue-700";
			case "post":
				return "from-green-500/20 to-emerald-500/20 border-green-200 text-green-700";
			default:
				return "from-gray-500/20 to-slate-500/20 border-gray-200 text-gray-700";
		}
	};

	return (
		<motion.article
			className={cn(
				"bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300",
				displayData.type === "art" &&
				"border-purple-200/50 hover:border-purple-300/50",
				displayData.type === "collection" &&
				"border-blue-200/50 hover:border-blue-300/50",
				displayData.type === "post" &&
				"border-green-200/50 hover:border-green-300/50"
			)}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			whileHover={{ y: -2 }}
		>
			{/* Header */}
			<div
				className={cn(
					"p-4 pb-3",
					displayData.type === "art" &&
					"bg-gradient-to-r from-purple-50/30 to-pink-50/30 dark:from-purple-900/10 dark:to-pink-900/10",
					displayData.type === "collection" &&
					"bg-gradient-to-r from-blue-50/30 to-cyan-50/30 dark:from-blue-900/10 dark:to-cyan-900/10",
					displayData.type === "post" &&
					"bg-gradient-to-r from-green-50/30 to-emerald-50/30 dark:from-green-900/10 dark:to-emerald-900/10"
				)}
			>
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center space-x-3">
						{/* Artist Avatar */}
						<Link
							to={`/artist/${displayData.artistId}`}
							className="shrink-0"
						>
							<div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center hover:ring-2 hover:ring-primary/20 transition-all duration-200">
								{displayData.artistProfileFileId ? (
									<AuthenticatedImage
										imageFileId={
											displayData.artistProfileFileId
										}
										alt={`${displayData.artistName}'s avatar`}
										className="w-full h-full object-cover"
										loadingComponent={
											<div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
												<span className="text-sm font-medium text-primary">
													{displayData.artistName
														.charAt(0)
														.toUpperCase()}
												</span>
											</div>
										}
										errorComponent={
											<span className="text-sm font-medium text-primary">
												{getUserInitials(
													displayData.artistName
												)}
											</span>
										}
									/>
								) : (
									<span className="text-sm font-medium text-primary">
										{getUserInitials(
											displayData.artistName
										)}
									</span>
								)}
							</div>
						</Link>

						{/* Artist Info */}
						<div>
							<div className="flex items-center space-x-2">
								<Link
									to={`/artist/${displayData.artistId}`}
									className="font-medium text-foreground hover:text-primary transition-colors duration-200"
								>
									{displayData.artistName}
								</Link>
							</div>
							<div className="flex items-center space-x-1 text-xs text-muted-foreground">
								<Calendar className="w-3 h-3" />
								<span>
									{formatDate(displayData.createdDate)}
								</span>
							</div>
						</div>
					</div>

					{/* Content type decorative element */}
					<div
						className={cn(
							"w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center opacity-75",
							displayData.type === "art" &&
							"from-purple-400 to-pink-400",
							displayData.type === "collection" &&
							"from-blue-400 to-cyan-400",
							displayData.type === "post" &&
							"from-green-400 to-emerald-400"
						)}
					>
						<span className="text-sm">{getTypeIcon()}</span>
					</div>
				</div>

				{/* Title */}
				{displayData.title && (
					<h2
						className={cn(
							"font-semibold text-foreground mb-2",
							displayData.type === "post"
								? "text-base line-clamp-4"
								: "text-lg line-clamp-2"
						)}
					>
						{displayData.title}
					</h2>
				)}

				{/* Content - Only show for art and collection descriptions */}
				{displayData.content && (
					<p className="text-muted-foreground text-sm line-clamp-3 mb-3">
						{displayData.content}
					</p>
				)}

				{/* Tags - Only show for art items with tags */}
				{displayData.type === "art" &&
					displayData.tags &&
					displayData.tags.length > 0 && (
						<div className="flex flex-wrap gap-2 mb-3">
							{displayData.tags.slice(0, 5).map((tag) => (
								<Badge
									key={tag.id}
									variant="secondary"
									className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
								>
									{tag.tagName}
								</Badge>
							))}
							{displayData.tags.length > 5 && (
								<Badge
									variant="outline"
									className="text-xs font-medium px-2 py-1 text-muted-foreground"
								>
									+{displayData.tags.length - 5} more
								</Badge>
							)}
						</div>
					)}
			</div>

			{/* Image */}
			{hasImage && displayData.imageFileId && (
				<div
					className={cn(
						"relative overflow-hidden cursor-pointer",
						displayData.type === "art" && "aspect-[4/3]",
						displayData.type === "collection" && "aspect-[16/9]"
					)}
					onClick={() => navigate(displayData.url)}
				>
					<motion.div
						initial={{ scale: 1.1, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
						whileHover={{ scale: 1.05 }}
						className="w-full h-full"
					>
						<AuthenticatedImage
							imageFileId={displayData.imageFileId}
							alt={displayData.title || "Content image"}
							className="w-full h-full object-cover"
							loadingComponent={
								<div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
									<div className="text-xs text-muted-foreground">
										Loading image...
									</div>
								</div>
							}
							errorComponent={
								<div className="w-full h-full bg-muted flex flex-col items-center justify-center p-4">
									<div className="text-xs text-muted-foreground mb-2">
										Failed to load image
									</div>
									<div className="text-xs text-primary cursor-pointer hover:underline">
										Tap to retry
									</div>
								</div>
							}
						/>
					</motion.div>

					{/* Overlay gradient with content type specific colors */}
					<div
						className={cn(
							"absolute inset-0 bg-gradient-to-t from-black/20 to-transparent",
							displayData.type === "art" &&
							"from-purple-900/30 to-transparent",
							displayData.type === "collection" &&
							"from-blue-900/30 to-transparent"
						)}
					/>
				</div>
			)}

			{/* Actions */}
			<div className="p-4 pt-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4 w-full">
						{displayData.type === "art" && (
							<Button
								variant="ghost"
								size="sm"
								className="h-8 px-2 text-muted-foreground hover:text-red-500 transition-colors"
							>
								<Heart className="w-4 h-4 mr-1" />
								<span className="text-xs">0</span>
							</Button>
						)}
						{/* <Button
							variant="ghost"
							size="sm"
							className="h-8 px-2 text-muted-foreground hover:text-blue-500 transition-colors"
						>
							<MessageCircle className="w-4 h-4 mr-1" />
							<span className="text-xs">0</span>
						</Button> */}

						<Button
							variant="ghost"
							size="sm"
							className="ml-auto h-8 px-2 text-muted-foreground hover:text-green-500 transition-colors"
						>
							<Share2 className="w-4 h-4" />
						</Button>
					</div>

					{/* <div className="flex items-center space-x-2">
						<Button
							variant="ghost"
							size="sm"
							className="h-8 px-2 text-muted-foreground"
						>
							<Eye className="w-4 h-4 mr-1" />
							<span className="text-xs">0</span>
						</Button>
					</div> */}
				</div>
			</div>
		</motion.article>
	);
}
