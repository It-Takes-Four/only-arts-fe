import { motion } from 'framer-motion';

interface GridSkeletonProps {
  count?: number;
}

export function GridSkeleton({ count = 12 }: GridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="overflow-hidden rounded-xl bg-background/80 backdrop-blur-sm border border-border/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
        >
          {/* Image skeleton */}
          <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
          
          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Avatar and name */}
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-muted/70 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.2
                  }}
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-muted/70 rounded w-20 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 0.3
                    }}
                  />
                </div>
                <div className="h-2 bg-muted/50 rounded w-16 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 0.4
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-muted/70 rounded w-3/4 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.5
                  }}
                />
              </div>
              <div className="h-3 bg-muted/50 rounded w-1/2 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.6
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
