import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface PurchasedCollectionSkeletonProps {
  count?: number;
}

export function PurchasedCollectionSkeleton({ count = 6 }: PurchasedCollectionSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden bg-background/80 backdrop-blur-sm border-border/50">
            <div className="aspect-[4/3] bg-muted animate-pulse" />
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Title skeleton */}
                <div className="h-6 bg-muted animate-pulse rounded" />
                
                {/* Description skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-full" />
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                </div>
                
                {/* Artist info skeleton */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
                </div>
                
                {/* Price and artwork count skeleton */}
                <div className="flex justify-between items-center pt-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
                </div>
                
                {/* Purchase date skeleton */}
                <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
