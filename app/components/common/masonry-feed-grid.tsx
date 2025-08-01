import { motion } from 'framer-motion';
import { useFeed } from '../hooks/useFeed';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { FeedArtCard } from '../features/feed/feed-art-card';
import { FancyLoading } from './fancy-loading';
import { Button } from './button';
import { useEffect, useState, useRef } from 'react';

interface MasonryFeedGridProps {
  tagId?: string;
}

export function MasonryFeedGrid({ tagId }: MasonryFeedGridProps) {
  const { feeds, loading, hasMore, error, loadMore, refresh } = useFeed({ tagId });
  const [columns, setColumns] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const sentinelRef = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
    threshold: 200
  });

  // Responsive column calculation
  useEffect(() => {
    const updateColumns = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const minCardWidth = 280; // Minimum card width
      const gap = 24; // Gap between cards
      
      const newColumns = Math.max(1, Math.min(5, Math.floor((containerWidth + gap) / (minCardWidth + gap))));
      setColumns(newColumns);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

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
        <FancyLoading message="Discovering amazing artworks..." size="lg" />
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
            No artwork found
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Explore amazing visual art from talented creators!
          </p>
          <Button onClick={refresh} variant="outline">
            Refresh
          </Button>
        </div>
      </motion.div>
    );
  }

  // Filter posts to only show those with images
  const postsWithImages = feeds.filter(post => post.imageUrl);

  // Handle case where we have feeds but no images
  if (postsWithImages.length === 0 && feeds.length > 0) {
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
            <span className="text-2xl">🖼️</span>
          </motion.div>
          <p className="text-lg font-medium text-muted-foreground mb-2">
            No visual artwork
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            This page shows only posts with images. Check the home feed for text posts!
          </p>
          <Button onClick={refresh} variant="outline">
            Refresh
          </Button>
        </div>
      </motion.div>
    );
  }

  // Create column arrays for masonry layout with better distribution
  const columnArrays = Array.from({ length: columns }, () => [] as Array<{ post: typeof postsWithImages[0], height: number }>);
  const columnHeights = Array.from({ length: columns }, () => 0);
  
  // Distribute posts to the shortest column for better balance
  postsWithImages.forEach((post) => {
    // Find the shortest column
    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    
    // Estimate height based on aspect ratio (fallback to random for variety)
    const estimatedHeight = Math.random() * 200 + 300; // Random between 300-500px for variety
    
    columnArrays[shortestColumnIndex].push({ post, height: estimatedHeight });
    columnHeights[shortestColumnIndex] += estimatedHeight + 24; // Add gap
  });

  return (
    <div className="w-full" ref={containerRef}>
      {/* Masonry grid */}
      <motion.div
        className="flex gap-4 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {columnArrays.map((columnPosts, columnIndex) => (
          <motion.div
            key={columnIndex}
            className="flex-1 space-y-4 md:space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: columnIndex * 0.1 }}
          >
            {columnPosts.map(({ post }, postIndex) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: (columnIndex * 0.1) + (postIndex * 0.05),
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <FeedArtCard post={post} index={postIndex} />
              </motion.div>
            ))}
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
            <FancyLoading message="Loading more amazing art..." size="md" />
          ) : (
            <motion.div 
              className="text-sm text-muted-foreground bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              ✨ Scroll for more amazing art...
            </motion.div>
          )}
        </motion.div>
      )}

      {/* End of feed indicator */}
      {!hasMore && postsWithImages.length > 0 && (
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
              You've discovered all the amazing art! 🌟
            </div>
          </div>
        </motion.div>
      )}

      {/* Error state for infinite scroll */}
      {error && postsWithImages.length > 0 && (
        <motion.div 
          className="flex flex-col items-center py-8 space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm text-destructive">
            Failed to load more posts
          </p>
          <Button onClick={loadMore} variant="outline" size="sm">
            Try Again
          </Button>
        </motion.div>
      )}
    </div>
  );
}
