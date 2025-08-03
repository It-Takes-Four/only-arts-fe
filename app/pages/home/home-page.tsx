import { motion } from "framer-motion";
import StaticGradient from "@/components/blocks/Backgrounds/StaticGradient/StaticGradient";
import { UnifiedFeedList } from "../../components/features/feed/unified-feed-list";

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
          className="max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2000px] mx-auto px-4 lg:px-6 xl:px-8 py-8"
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
