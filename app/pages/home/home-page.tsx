import { motion } from "framer-motion";
import { UnifiedFeedList } from "app/components/common/unified-feed-list";
import { FloatingActionButton } from "app/components/common/floating-action-button";
import StaticGradient from "@/components/blocks/Backgrounds/StaticGradient/StaticGradient";

export function HomePage() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-auto">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <StaticGradient />
      </div>
      
      {/* Content - Positioned above background with proper spacing for header */}
      <div className="relative z-10 pt-16 min-h-full">
        <motion.div 
          className="container mx-auto px-4 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Unified Feed */}
          <motion.div 
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <UnifiedFeedList />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Floating Action Button - Hidden for now */}
      {/* <FloatingActionButton /> */}
    </div>
  );
}
