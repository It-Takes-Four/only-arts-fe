import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Eye, Image, Images, Lock, MoreHorizontal, Upload } from "lucide-react";
import { Button } from "../../common/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { collectionService } from "../../../services/collection-service";
import type { MyCollection } from "../../../types/collection";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router";

interface CollectionManagementCardProps {
	collection: MyCollection;
	onCollectionUpdated: (updatedCollection: MyCollection) => void;
	onEditContent?: (collection: MyCollection) => void;
	onEditCover?: (collection: MyCollection) => void;
	onPublish?: (collection: MyCollection) => void;
	onManageArts?: (collection: MyCollection) => void;
	publishCollection: (collectionId: string) => void;
}

export function CollectionManagementCard({
	collection,
	onCollectionUpdated,
	onEditContent,
	onEditCover,
	onPublish,
	onManageArts,
	publishCollection
}: CollectionManagementCardProps) {
	const [showEditContentModal, setShowEditContentModal] = useState(false);
	const [showEditCoverModal, setShowEditCoverModal] = useState(false);
	const [showPublishModal, setShowPublishModal] = useState(false);
	const navigate = useNavigate();

	const handleContentEdit = () => {
		if (onEditContent) {
			onEditContent(collection);
		}
	};

	const handleCoverEdit = () => {
		if (onEditCover) {
			onEditCover(collection);
		}
	};

	const handlePublishClick = async () => {
		if (onPublish) {
			onPublish(collection);
		}
	};

	const handleManageArts = () => {
		if (onManageArts) {
			onManageArts(collection);
		}
	};

	const handleNavigateToCollectionPage = () => {
		navigate(`/collection/${collection.id}`);
	}

	const coverImageUrl = collection.coverImageFileId
		? collectionService.getCollectionImageUrl(collection.coverImageFileId)
		: null;

	return (
		<>
			<motion.div
				className="group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow duration-200"
				whileHover={{ y: -5 }}
				layout
			>
				{/* Cover Image */}
				<div className="aspect-[4/3] bg-muted relative overflow-hidden rounded-t-lg">
					{coverImageUrl ? (
						<img
							src={coverImageUrl}
							alt={`${collection.collectionName} cover`}
							className="w-full h-full object-cover transition-opacity duration-200"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center">
							<Image className="h-12 w-12 text-muted-foreground" />
						</div>
					)}

					{/* Action Menu - Always visible */}
					<div className="absolute top-2 right-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90"
								>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem onClick={() => handleNavigateToCollectionPage()}>
									<Eye className="h-4 w-4 mr-2" />
									View Collection
								</DropdownMenuItem>
								<DropdownMenuItem onClick={handleManageArts}>
									<Images className="h-4 w-4 mr-2" />
									Manage Arts
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								{!collection.isPublished ? (
									<>
										<DropdownMenuItem onClick={handleContentEdit}>
											<Edit className="h-4 w-4 mr-2" />
											Edit Details & Price
										</DropdownMenuItem>
										<DropdownMenuItem onClick={handleCoverEdit}>
											<Image className="h-4 w-4 mr-2" />
											Change Cover
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={handlePublishClick}
											className="text-green-600 dark:text-green-400"
										>
											<Upload className="h-4 w-4 mr-2" />
											Publish Collection
										</DropdownMenuItem>
									</>
								) : (
									<DropdownMenuItem className="text-muted-foreground cursor-not-allowed">
										<Lock className="h-4 w-4 mr-2" />
										Collection is Published
									</DropdownMenuItem>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Status Badge */}
					<div className="absolute top-2 left-2 flex gap-1">
						<Badge
							variant={collection.isPublished ? "default" : "secondary"}
							className="text-xs font-mono uppercase"
						>
							{collection.isPublished ? "Published" : "Draft"}
						</Badge>
					</div>
				</div>

				{/* Content */}
				<div className="p-4">
					<div className="flex items-start justify-between mb-2">
						<h3 className="font-semibold text-lg line-clamp-1">{collection.collectionName}</h3>
						<Tooltip>
							<TooltipTrigger asChild>
								<Badge variant="secondary"
									className="text-foreground font-semibold border-border gap-x-1.5">
									<Images />
									{collection.artsCount || 0}
								</Badge>
							</TooltipTrigger>
							<TooltipContent className="bg-popover text-popover-foreground py-2 ">
								<p
									className="font-mono uppercase"> {collection.artsCount || 0} artwork{collection.artsCount !== 1 ? 's' : ''}</p>
							</TooltipContent>
						</Tooltip>
					</div>

					<div className="flex items-center justify-between mb-2">
						<div className="flex-1">
							<p className="text-sm text-muted-foreground mb-3 line-clamp-2">
								{collection.description || "No description provided"}
							</p>
						</div>
					</div>


					{collection.price && (
						<>
							<Separator className="my-3" />
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Price</span>
								<span className="font-semibold text-lg">{parseFloat(collection.price).toFixed(4)} ETH</span>
							</div>
						</>
					)}
				</div>
			</motion.div>
		</>
	)
		;
}
