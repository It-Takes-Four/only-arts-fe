import { motion } from "framer-motion";
import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { Calendar, Image, DollarSign } from "lucide-react";
import type { PurchasedCollection } from "app/types/purchased-collection";

interface PurchasedCollectionCardProps {
  collection: PurchasedCollection;
  index: number;
}

export function PurchasedCollectionCard({ collection, index }: PurchasedCollectionCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getUserInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/collection/${collection.id}`} className="block cursor-pointer">
        <Card className="group overflow-hidden bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 transition-all duration-300 hover:shadow-lg hover:border-primary/20">
          {/* Collection Image */}
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            {collection.imageUrl ? (
              <motion.img
                src={collection.imageUrl}
                alt={collection.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 flex items-center justify-center">
                <Image className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>

          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Collection Title and Status */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-200">
                    {collection.name}
                  </h3>
                  <Badge 
                    variant={collection.isCompleted ? "default" : "secondary"}
                    className="ml-2 shrink-0"
                  >
                    {collection.isCompleted ? "Complete" : "Incomplete"}
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
                <Avatar className="w-8 h-8">
                  <AvatarImage src={collection.artistProfilePicture || undefined} alt={collection.artistName} />
                  <AvatarFallback className="text-xs">
                    {getUserInitials(collection.artistName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {collection.artistName}
                  </p>
                </div>
              </div>

              {/* Collection Stats */}
              <div className="flex justify-between items-center pt-2 border-t border-border/50">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium">
                    {formatPrice(collection.price, collection.currency)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Image className="w-4 h-4" />
                  <span>{collection.artworkCount} artworks</span>
                </div>
              </div>

              {/* Purchase Date */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>Purchased {formatDate(collection.purchaseDate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
