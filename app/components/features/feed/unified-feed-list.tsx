import { motion } from 'framer-motion';
import { UnifiedFeedItemComponent } from './unified-feed-item';
import { useUnifiedFeed } from "../../hooks/useUnifiedFeed";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { FancyLoading } from "../../common/fancy-loading";
import { Button } from "../../common/button";

interface UnifiedFeedListProps {
  tagId?: string;
}

export function UnifiedFeedList({ tagId }: UnifiedFeedListProps) {
  const { feeds, loading, hasMore, error, loadMore, refresh } = useUnifiedFeed({ tagId });
  const sentinelRef = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
    threshold: 200
  });

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Handle error state with no feeds
  if (error && feeds.length === 0) {
    return (
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
            <span className="text-2xl">😵</span>
          </motion.div>
          <p className="text-lg font-medium text-destructive mb-2">
            Failed to load feed
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {error}
          </p>
          <Button onClick={refresh} variant="outline">
            Try Again
          </Button>
        </div>
      </motion.div>
    );
  }

  // Handle loading state with no feeds
  if (loading && feeds.length === 0) {
    return (
      <motion.div 
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <FancyLoading message="Loading your personalized feed..." size="lg" />
      </motion.div>
    );
  }

  // Handle empty state
  if (feeds.length === 0) {
    return (
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
            <span className="text-2xl">🎨</span>
          </motion.div>
          <p className="text-lg font-medium text-muted-foreground mb-2">
            No posts yet
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Follow artists to see their amazing work in your feed!
          </p>
          <Button onClick={refresh} variant="outline">
            Refresh
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Feed Items */}
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {feeds.map((item, index) => (
          <motion.div
            key={`${item.type}-${item.createdDate}-${index}`}
            variants={{
              hidden: { opacity: 0, y: 40, scale: 0.95 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1]
                }
              }
            }}
          >
            <UnifiedFeedItemComponent item={item} index={index} />
          </motion.div>
        ))}
      </motion.div>

      {/* Loading indicator for infinite scroll */}
      {hasMore && (
        <motion.div 
          ref={sentinelRef} 
          className="flex justify-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? (
            <FancyLoading message="Loading more content..." size="md" />
          ) : (
            <motion.div 
              className="text-sm text-muted-foreground bg-background/50 backdrop-blur-sm px-6 py-3 rounded-full border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              ✨ Scroll for more content...
            </motion.div>
          )}
        </motion.div>
      )}

      {/* End of feed indicator */}
      {!hasMore && feeds.length > 0 && (
        <motion.div 
          className="flex justify-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 mx-auto"
            >
              <span className="text-lg">🎉</span>
            </motion.div>
            <div className="text-sm text-muted-foreground bg-background/50 backdrop-blur-sm px-6 py-3 rounded-full border border-border/50">
              You're all caught up! 🌟
            </div>
          </div>
        </motion.div>
      )}

      {/* Error state for infinite scroll */}
      {error && feeds.length > 0 && (
        <motion.div 
          className="flex flex-col items-center py-8 space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm text-destructive">
            Failed to load more content
          </p>
          <Button onClick={loadMore} variant="outline" size="sm">
            Try Again
          </Button>
        </motion.div>
      )}
    </div>
  );
}
