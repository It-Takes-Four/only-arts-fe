import { motion } from "framer-motion";
import { SingleColumnFeed } from "app/components/common/single-column-feed";
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
          {/* Page Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Your Feed
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Stay updated with the latest artworks from artists you follow
            </motion.p>
          </motion.div>

          {/* Single Column Feed */}
          <motion.div 
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <SingleColumnFeed />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Floating Action Button - Hidden for now */}
      {/* <FloatingActionButton /> */}
    </div>
  );
}
