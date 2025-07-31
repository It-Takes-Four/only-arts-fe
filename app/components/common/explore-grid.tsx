import { motion } from 'framer-motion';
import { useExplore } from '../hooks/useExplore';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { ExploreArtCard } from './explore-art-card';
import { FancyLoading } from './fancy-loading';
import { Button } from './button';
import { useEffect, useState, useRef } from 'react';

interface ExploreGridProps {
  tagId?: string;
}

export function ExploreGrid({ tagId }: ExploreGridProps) {
  const { artworks, loading, hasMore, error, loadMore, refresh } = useExplore({ tagId });
  const [columns, setColumns] = useState(1); // Start with 1 column to prevent layout issues
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
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
      const currentScreenWidth = window.innerWidth;
      const containerWidth = containerRef.current?.offsetWidth || currentScreenWidth;
      
      // Update screen width state
      setScreenWidth(currentScreenWidth);
      
      // Use screen width for initial calculation if container isn't ready
      const baseWidth = Math.min(containerWidth, currentScreenWidth);
      
      // More aggressive responsive breakpoints based on actual screen size
      let newColumns;
      if (currentScreenWidth < 400) {
        // Very narrow mobile: 1 column
        newColumns = 1;
      } else if (currentScreenWidth < 640) {
        // Mobile: 2 columns
        newColumns = 2;
      } else if (currentScreenWidth < 768) {
        // Large mobile: 2-3 columns
        newColumns = baseWidth < 600 ? 2 : 3;
      } else if (currentScreenWidth < 1024) {
        // Tablet: 3-4 columns
        newColumns = baseWidth < 800 ? 3 : 4;
      } else if (currentScreenWidth < 1280) {
        // Small desktop: 4 columns
        newColumns = 4;
      } else {
        // Large desktop: 5 columns
        newColumns = 5;
      }
      
      if (newColumns !== columns) {
        setColumns(newColumns);
      }
    };

    // Run immediately
    updateColumns();
    
    // Add resize listener
    window.addEventListener('resize', updateColumns);
    
    // Also run when container ref is available
    const observer = new ResizeObserver(updateColumns);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', updateColumns);
      observer.disconnect();
    };
  }, [columns]); // Include columns in dependency array

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

  // Handle error state with no artworks
  if (error && artworks.length === 0) {
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
            Failed to load artworks
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

  // Handle loading state with no artworks
  if (loading && artworks.length === 0) {
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
  if (artworks.length === 0) {
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
            {tagId ? 'Try selecting a different tag or ' : ''}Explore amazing visual art from talented creators!
          </p>
          <Button onClick={refresh} variant="outline">
            Refresh
          </Button>
        </div>
      </motion.div>
    );
  }

  // Create columns for masonry layout
  const createColumns = () => {
    const cols: typeof artworks[] = Array.from({ length: columns }, () => []);
    artworks.forEach((artwork, index) => {
      cols[index % columns].push(artwork);
    });
    return cols;
  };

  const columnGroups = createColumns();

  return (
    <motion.div
      ref={containerRef}
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Masonry Grid */}
      <div 
        className="grid gap-3 sm:gap-4 lg:gap-6 w-full"
        style={{ 
          gridTemplateColumns: 
            screenWidth < 400 ? '1fr' :
            screenWidth < 640 ? 'repeat(2, minmax(0, 1fr))' :
            `repeat(${columns}, minmax(min(180px, 100%/${columns}), 1fr))`,
        }}
      >
        {columnGroups.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-3 sm:gap-4 lg:gap-6 min-w-0">
            {column.map((artwork, artworkIndex) => {
              const globalIndex = columnIndex * Math.ceil(artworks.length / columns) + artworkIndex;
              return (
                <ExploreArtCard
                  key={artwork.id}
                  artwork={artwork}
                  index={globalIndex}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Loading indicator for pagination */}
      {loading && artworks.length > 0 && (
        <motion.div 
          className="flex justify-center mt-8 sm:mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FancyLoading message="Loading more artworks..." size="sm" />
        </motion.div>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-4" />

      {/* Load more button (fallback) */}
      {hasMore && !loading && (
        <motion.div 
          className="flex justify-center mt-6 sm:mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            onClick={loadMore}
            variant="outline"
            className="px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
          >
            Load More Artworks
          </Button>
        </motion.div>
      )}

      {/* End message */}
      {!hasMore && artworks.length > 0 && (
        <motion.div 
          className="text-center mt-8 sm:mt-12 pb-6 sm:pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-muted-foreground text-sm sm:text-base">
            🎉 You've seen all the amazing artworks!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
