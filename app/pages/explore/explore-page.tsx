import { useState } from "react";
import { motion } from "framer-motion";
import { ExploreGrid } from "app/components/common/explore-grid";
import { TagSelector } from "app/components/common/tag-selector";
import { FloatingActionButton } from "app/components/common/floating-action-button";
import StaticGradient from "@/components/blocks/Backgrounds/StaticGradient/StaticGradient";
import { useSearchContext } from "app/context/search-context";

interface ExplorePageProps {
  searchArtResults?: any[];
}

export function ExplorePage() {
  const { searchArtResults, searchCollectionResults } = useSearchContext();
  const [selectedTagId, setSelectedTagId] = useState<string | undefined>(undefined);

  const handleTagSelect = (tagId: string | undefined) => {
    setSelectedTagId(tagId);
  };

  const isSearchActive = searchArtResults && searchArtResults.length > 0;

  return (
    <div className="fixed inset-0 w-full h-full overflow-auto">
      <div className="fixed inset-0 z-0">
        <StaticGradient />
      </div>

      <div className="relative z-10 pt-14 sm:pt-16 min-h-full">
        {!isSearchActive && (
          <TagSelector 
            selectedTagId={selectedTagId} 
            onTagSelect={handleTagSelect} 
          />
        )}

        <motion.div 
          className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div 
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <ExploreGrid
              tagId={!isSearchActive ? selectedTagId : undefined}
              artworks={isSearchActive ? searchArtResults : undefined}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
