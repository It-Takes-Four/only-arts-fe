import { motion } from 'framer-motion';

interface FancyLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FancyLoading({ message = "Loading amazing art...", size = 'md' }: FancyLoadingProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center space-y-6 py-12"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Animated circles */}
      <div className="relative">
        <motion.div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-primary to-secondary opacity-20`}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gradient-to-l from-secondary to-primary opacity-40`}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        <motion.div
          className={`absolute inset-2 ${sizeClasses[size]} rounded-full bg-gradient-to-r from-primary to-secondary`}
          animate={{
            scale: [0.8, 1, 0.8],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Animated dots */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{
              y: [-4, 4, -4],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
          />
        ))}
      </div>

      {/* Loading text */}
      <motion.p 
        className={`${textSizes[size]} text-muted-foreground text-center font-medium`}
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {message}
      </motion.p>

      {/* Shimmer effect */}
      <motion.div
        className="w-24 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full"
        animate={{
          x: [-100, 100],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}
