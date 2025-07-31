import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "app/components/common/button";
import { FancyLoading } from "app/components/common/fancy-loading";
import { PurchasedCollectionCard } from "app/components/common/purchased-collection-card";
import { PurchasedCollectionSkeleton } from "app/components/common/purchased-collection-skeleton";
import { artCollectionsService } from "app/services/art-collections-service";
import { toast } from "sonner";
import { ShoppingBag, RefreshCw, AlertCircle } from "lucide-react";
import type { PurchasedCollection } from "app/types/purchased-collection";

export function PurchasedCollectionsPage() {
  const [collections, setCollections] = useState<PurchasedCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadCollections = async (pageNum: number = 1, isLoadMore: boolean = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const response = await artCollectionsService.getPurchasedCollections(pageNum, 12);
      
      if (isLoadMore) {
        setCollections(prev => [...prev, ...response.data]);
      } else {
        setCollections(response.data);
      }
      
      setHasMore(response.hasMore);
      setPage(pageNum);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load purchased collections';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadCollections(page + 1, true);
    }
  };

  const handleRetry = () => {
    loadCollections();
  };

  // Loading state
  if (loading && collections.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">My Purchased Collections</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                View and manage all the art collections you've purchased
              </p>
            </motion.div>
          </div>

          {/* Loading skeleton */}
          <PurchasedCollectionSkeleton count={6} />
        </div>
      </div>
    );
  }

  // Error state with no collections
  if (error && collections.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">My Purchased Collections</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                View and manage all the art collections you've purchased
              </p>
            </motion.div>
          </div>

          {/* Error state */}
          <motion.div 
            className="flex flex-col items-center justify-center min-h-[400px] space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 mx-auto"
              >
                <AlertCircle className="w-8 h-8 text-destructive" />
              </motion.div>
              <p className="text-lg font-medium text-destructive mb-2">
                Failed to load purchased collections
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {error}
              </p>
              <Button onClick={handleRetry} variant="outline" className="cursor-pointer">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Empty state
  if (collections.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">My Purchased Collections</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                View and manage all the art collections you've purchased
              </p>
            </motion.div>
          </div>

          {/* Empty state */}
          <motion.div 
            className="flex flex-col items-center justify-center min-h-[400px] space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto"
              >
                <ShoppingBag className="w-8 h-8 text-primary/60" />
              </motion.div>
              <p className="text-lg font-medium text-muted-foreground mb-2">
                No purchased collections yet
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Start exploring and purchasing amazing art collections from talented artists!
              </p>
              <Button 
                onClick={() => window.location.href = '/explore'} 
                className="cursor-pointer"
              >
                Explore Collections
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main content with collections
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">My Purchased Collections</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              You have purchased {collections.length} art collection{collections.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        </div>

        {/* Collections Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection, index) => (
              <PurchasedCollectionCard
                key={collection.id}
                collection={collection}
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {/* Load More Button */}
        {hasMore && (
          <motion.div 
            className="flex justify-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button 
              onClick={handleLoadMore}
              disabled={loadingMore}
              variant="outline"
              className="cursor-pointer"
            >
              {loadingMore ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Loading more...
                </>
              ) : (
                'Load More Collections'
              )}
            </Button>
          </motion.div>
        )}

        {/* End message */}
        {!hasMore && collections.length > 0 && (
          <motion.div 
            className="text-center pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-muted-foreground text-sm">
              🎉 You've viewed all your purchased collections!
            </p>
          </motion.div>
        )}

        {/* Load more error */}
        {error && collections.length > 0 && (
          <motion.div 
            className="flex flex-col items-center pt-8 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-destructive mb-2">
              Failed to load more collections
            </p>
            <Button onClick={handleLoadMore} variant="outline" size="sm" className="cursor-pointer">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
