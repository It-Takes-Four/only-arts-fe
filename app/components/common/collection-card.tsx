import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Images, ShoppingBag } from "lucide-react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router";

interface CollectionCardProps {
	id: string
	name: string
	description: string
	artworkCount: number
	previewImage: string
	totalSales?: number
	createdBy: string
	createdByAvatar?: string
	price?: number
	viewMode?: "grid" | "row" | "table"
}

export function CollectionCard({
																 id,
																 name,
																 description,
																 artworkCount,
																 previewImage,
																 totalSales,
																 createdBy,
																 createdByAvatar,
																 price,
																 viewMode = "grid",
															 }: CollectionCardProps) {
	const navigate = useNavigate();

	if (viewMode === "table") {
		return (
			<TableRow className="hover:bg-muted/50" onClick={() => navigate(`/collection/${id}`)}>
				<TableCell>
					<div className="flex items-center gap-3">
						<div className="relative w-12 h-12 overflow-hidden rounded-lg bg-muted flex-shrink-0">
							{previewImage ? (
								<img
									src={previewImage || "/placeholder.svg"}
									alt={name}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="flex items-center justify-center h-full">
									<ImageIcon className="h-4 w-4 text-muted-foreground"/>
								</div>
							)}
						</div>
						<div>
							<h3 className="font-semibold text-sm line-clamp-1">{name}</h3>
							<p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
						</div>
					</div>
				</TableCell>
				<TableCell>
					<div className="flex items-center gap-2">
						<Avatar className="h-6 w-6">
							<AvatarImage src={createdByAvatar || "/placeholder.svg"}/>
							<AvatarFallback className="text-xs">{createdBy.charAt(0).toUpperCase()}</AvatarFallback>
						</Avatar>
						<span className="text-sm">{createdBy}</span>
					</div>
				</TableCell>
				<TableCell>
					<Badge variant="secondary"
								 className="text-foreground text-sm font-semibold border-border gap-x-1.5">
						<Images/>
						{artworkCount}
					</Badge>
				</TableCell>
				<TableCell>
					{totalSales ? (
						<div className="flex items-center gap-1 text-primary">
							<ShoppingBag className="h-3 w-3"/>
							<span className="text-sm font-medium">{totalSales}</span>
						</div>
					) : (
						<span className="text-sm text-muted-foreground">-</span>
					)}
				</TableCell>
				<TableCell>
					{price ? (
						<span className="font-semibold">${price}</span>
					) : (
						<span className="text-sm text-muted-foreground">-</span>
					)}
				</TableCell>
			</TableRow>
		)
	}

	if (viewMode === "row") {
		return (
			<Card className="group overflow-hidden hover:shadow-lg transition-all duration-300"
						onClick={() => navigate(`/collection/${id}`)}>
				<div className="flex justify-center items-center">
					<div className="relative w-35 h-35 overflow-hidden bg-muted flex-shrink-0">
						{previewImage ? (
							<img
								src={previewImage || "/placeholder.svg"}
								alt={`Preview 1`}
								className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
							/>
						) : (
							<div className="flex items-center justify-center h-full">
								<ImageIcon className="h-6 w-6 text-muted-foreground"/>
							</div>
						)}
					</div>
					<CardContent className="flex-1 p-4">
						<div className="flex items-start justify-between mb-2">
							<h3 className="font-semibold text-xl line-clamp-1">{name}</h3>
							<Badge variant="secondary"
										 className="text-foreground text-sm font-semibold border-border gap-x-1.5">
								<Images/>
								{artworkCount} items
							</Badge>
						</div>
						<p className="text-sm text-muted-foreground mb-3 line-clamp-2	">{description}</p>
						<div className="flex items-center justify-between text-sm">
							<div className="flex items-center gap-4">
								<span
									className="flex px-2 py-1.5 glass rounded-full font-medium border-border text-foreground items-center gap-x-1.5"
								>

								<img src={"https://placehold.co/50x50"} alt="Artist Avatar" className="h-5 w-5 rounded-full"/>
									{createdBy}
							</span>
								{totalSales && (
									<div className="flex items-center gap-1 text-md text-primary">
										<ShoppingBag className="h-4 w-4"/>
										<span className="font-semibold">{totalSales} sales</span>
									</div>
								)}
							</div>
							{price && <span className="font-semibold text-xl">${price}</span>}
						</div>
					</CardContent>
				</div>
			</Card>
		)
	}

	// Original grid view (show only one image)
	return (
		// On click redirect to collection details page
		<Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
					onClick={() => navigate(`/collection/${id}`)}>
			<div className="relative aspect-[4/3] overflow-hidden bg-muted">
				{previewImage ? (
					<div className="grid gap-1 h-full">
						<div key={0} className="relative overflow-hidden">
							<img
								src={previewImage || "/placeholder.svg"}
								alt={`Preview 1`}
								className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
							/>
							<span
								className="absolute top-3 left-3 flex px-2 py-1.5 glass rounded-full text-sm font-medium border-border text-white items-center gap-x-1.5"
							>
								<Avatar className="h-5 w-5">
									<AvatarImage src={createdByAvatar || "/placeholder.svg"}/>
									<AvatarFallback className="text-xs text-foreground">{createdBy.charAt(0).toUpperCase()}</AvatarFallback>
								</Avatar>
								{createdBy}
							</span>
						</div>
					</div>
				) : (
					<div className="flex items-center justify-center h-full">
						<ImageIcon className="h-12 w-12 text-muted-foreground"/>
					</div>
				)}
				<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"/>
			</div>
			<CardContent className="p-4">
				<div className="flex items-start justify-between mb-1">
					<h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
					<Tooltip>
						<TooltipTrigger asChild>
							<Badge variant="secondary"
										 className="text-foreground font-semibold border-border gap-x-1.5">
								<Images/>
								{artworkCount}
							</Badge>
						</TooltipTrigger>
						<TooltipContent className="bg-popover text-popover-foreground py-2 ">
							<p className="font-mono">{artworkCount} ITEMS</p>
						</TooltipContent>
					</Tooltip>
				</div>
				<p className="text-sm text-muted-foreground mb-3 line-clamp-1">{description}</p>
				{totalSales && (
					<div className="flex items-center gap-1 text-sm mb-2 text-primary">
						<ShoppingBag className="h-4 w-4"/>
						<span className="font-semibold">{totalSales} sold</span>
					</div>
				)}
				{price && (
					<>
						<Separator className="my-3"/>
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">Price</span>
							<span className="font-semibold text-lg">${price}</span>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	)
}

