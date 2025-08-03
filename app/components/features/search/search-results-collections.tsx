import { motion } from "framer-motion";
import type { SearchCollection } from "../../../types/search";
import { Button } from "../../common/button";
import { collectionService } from "../../../services/collection-service";
import { formatPriceDisplay } from "../../../utils/currency";
import { CollectionCard } from "../collection/collection-card";

interface SearchResultsCollectionsProps {
  collections: SearchCollection[];
  loading?: boolean;
}

export function SearchResultsCollections({ collections, loading }: SearchResultsCollectionsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-4 animate-pulse">
            <div className="w-full aspect-square bg-muted rounded-lg mb-4" />
            <div className="h-4 bg-muted rounded mb-2" />
            <div className="h-3 bg-muted rounded w-2/3 mb-2" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No collections found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {collections.map((collection, index) => (
        <motion.div
          key={collection.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative"
        >
          <CollectionCard
            id={collection.id}
            name={collection.collectionName}
            description={collection.description || "No description"}
            artworkCount={collection.artsCount}
            previewImage={collection.coverImageFileId 
              ? collectionService.getCollectionImageUrl(collection.coverImageFileId) 
              : "/placeholder.svg"
            }
            createdBy={collection.artist.artistName}
            price={collection.price || '0'}
          />
          {collection.isPublished && parseFloat(collection.price || '0') > 0 && (
            <div className="absolute top-2 right-2">
              <Button
                size="sm"
                className="bg-primary/90 hover:bg-primary shadow-lg"
                onClick={() => {
                  // Handle collection purchase
                  console.log('Buy collection:', collection.id);
                }}
              >
                Buy {formatPriceDisplay(collection.price || '0')}
              </Button>
            </div>
          )}
          {collection.isPurchased && (
            <div className="absolute top-2 left-2">
              <div className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                Purchased
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
