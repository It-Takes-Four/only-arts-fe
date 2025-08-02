import { motion } from "framer-motion";
import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Image, DollarSign, CheckCircle } from "lucide-react";
import { artCollectionsService } from "app/services/art-collections-service";
import { formatPriceDisplay } from "../../utils/currency";
import type { PurchasedCollection } from "app/types/purchased-collection";
import { getUserInitials } from "../../utils/UtilityFunction";

interface PurchasedCollectionCardProps {
	collection: PurchasedCollection;
	index: number;
}

export function PurchasedCollectionCard({
	collection,
	index,
}: PurchasedCollectionCardProps) {
	const formatDate = (dateString: string) => {
		try {
			return formatDistanceToNow(new Date(dateString), {
				addSuffix: true,
			});
		} catch {
			return "Unknown time";
		}
	};

	const getImageUrl = () => {
		return artCollectionsService.getCollectionImageUrl(
			collection.coverImageFileId
		);
	};

	const getProfileImageUrl = () => {
		if (collection.artist.user.profilePictureFileId) {
			return artCollectionsService.getUserProfileImageUrl(
				collection.artist.user.profilePictureFileId
			);
		}
		return null;
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: index * 0.1 }}
			whileHover={{ y: -4 }}
		>
			<Link
				to={`/collection/${collection.id}`}
				className="block cursor-pointer"
			>
				<Card className="group overflow-hidden bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 transition-all duration-300 hover:shadow-lg hover:border-primary/20">
					{/* Collection Image */}
					<div className="aspect-[4/3] overflow-hidden bg-muted">
						<motion.img
							src={getImageUrl()}
							alt={collection.collectionName}
							className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
							loading="lazy"
							onError={(e) => {
								(e.target as HTMLImageElement).style.display =
									"none";
								const parent = (e.target as HTMLImageElement)
									.parentElement;
								if (parent) {
									parent.innerHTML = `
                    <div class="w-full h-full bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 flex items-center justify-center">
                      <svg class="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  `;
								}
							}}
						/>
					</div>

					<CardContent className="p-6">
						<div className="space-y-4">
							{/* Collection Title and Status */}
							<div className="space-y-2">
								<div className="flex items-start justify-between">
									<h3 className="text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-200">
										{collection.collectionName}
									</h3>
									<Badge
										variant={
											collection.isPublished
												? "default"
												: "secondary"
										}
										className="ml-2 shrink-0"
									>
										{collection.isPublished ? (
											<>
												<CheckCircle className="w-3 h-3 mr-1" />
												Published
											</>
										) : (
											"Draft"
										)}
									</Badge>
								</div>

								{collection.description && (
									<p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
										{collection.description}
									</p>
								)}
							</div>

							{/* Artist Info */}
							<div className="flex items-center space-x-3">
								<Link
									to={`/artist/${collection.artist.id}`}
									className="shrink-0"
								>
									<Avatar className="w-8 h-8 hover:ring-2 hover:ring-primary/20 transition-all duration-200">
										<AvatarImage
											src={
												getProfileImageUrl() ||
												undefined
											}
											alt={collection.artist.artistName}
										/>
										<AvatarFallback className="text-xs">
											{getUserInitials(
												collection.artist.artistName
											)}
										</AvatarFallback>
									</Avatar>
								</Link>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<Link
											to={`/artist/${collection.artist.id}`}
											className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors duration-200"
										>
											{collection.artist.artistName}
										</Link>
										{collection.artist.isVerified && (
											<CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
										)}
									</div>
									<p className="text-xs text-muted-foreground truncate">
										@{collection.artist.user.username}
									</p>
								</div>
							</div>

							{/* Collection Stats */}
							<div className="flex justify-between items-center pt-2 border-t border-border/50">
								<div className="flex items-center gap-1 text-sm text-muted-foreground">
									<DollarSign className="w-4 h-4" />
									<span className="font-medium">
										{formatPriceDisplay(collection.price)}
									</span>
								</div>
								<div className="flex items-center gap-1 text-sm text-muted-foreground">
									<Image className="w-4 h-4" />
									<span>{collection.artsCount} artworks</span>
								</div>
							</div>

							{/* Purchase Date */}
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<Calendar className="w-3 h-3" />
								<span>
									Created {formatDate(collection.createdAt)}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</Link>
		</motion.div>
	);
}
