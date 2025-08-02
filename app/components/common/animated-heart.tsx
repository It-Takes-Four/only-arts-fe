import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedHeartProps {
  isLiked: boolean;
  isAnimating?: boolean;
  className?: string;
}

export function AnimatedHeart({ isLiked, isAnimating = false, className }: AnimatedHeartProps) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={{
        scale: isAnimating ? [1, 1.3, 1] : 1,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <motion.div
        animate={{
          scale: isLiked ? 1 : 0.9,
          rotate: isLiked ? [0, -10, 10, 0] : 0,
        }}
        transition={{
          duration: 0.4,
          ease: "backOut",
        }}
      >
        <Heart
          className={cn(
            "w-5 h-5 transition-all duration-300",
            isLiked
              ? "fill-white text-white drop-shadow-sm"
              : "text-current",
            className
          )}
        />
      </motion.div>
      
      {/* Pulse effect when liked */}
      {isLiked && (
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{
            scale: [0.8, 1.4, 1.8],
            opacity: [0.8, 0.3, 0],
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          key={`pulse-${isLiked}`}
        >
          <div className="w-full h-full bg-red-500/30 rounded-full" />
        </motion.div>
      )}
      
      {/* Sparkle particles effect */}
      {isLiked && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}-${isLiked}`}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              initial={{
                scale: 0,
                x: 0,
                y: 0,
                opacity: 1,
              }}
              animate={{
                scale: [0, 1, 0],
                x: [0, Math.cos((i * Math.PI) / 3) * 20],
                y: [0, Math.sin((i * Math.PI) / 3) * 20],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}
