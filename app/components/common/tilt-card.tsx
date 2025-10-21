import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode, useState } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glowColor?: string;
  enableGlow?: boolean;
  enableShimmer?: boolean;
}

export function TiltCard({ 
  children, 
  className = "", 
  intensity = 12,
  glowColor = "primary",
  enableGlow = true,
  enableShimmer = true
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, {
    stiffness: 150,
    damping: 25,
    mass: 0.3
  });

  const mouseYSpring = useSpring(y, {
    stiffness: 150,
    damping: 25,
    mass: 0.3
  });

  const rotateX = useTransform(mouseYSpring, [0.5, -0.5], [`${intensity}deg`, `-${intensity}deg`]);
  const rotateY = useTransform(mouseXSpring, [0.5, -0.5], [`${intensity}deg`, `-${intensity}deg`]);
  
  // Enhanced transforms for more dynamic effects
  const scale = useTransform(mouseXSpring, [0.5, -0.5], [1.02, 0.98]);
  const translateZ = useTransform(mouseXSpring, [0.5, -0.5], [5, -5]);
  
  // Glow effect based on mouse position
  const glowIntensity = useTransform(
    mouseXSpring,
    (mx) => {
      const distance = Math.abs(mx);
      return Math.min(distance * 0.3, 0.8);
    }
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate center point
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center with enhanced sensitivity
    const distanceX = (e.clientX - centerX) / (rect.width / 2);
    const distanceY = (e.clientY - centerY) / (rect.height / 2);
    
    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
        rotateX,
        rotateY,
        scale,
        translateZ,
      }}
      className={`
        relative rounded-xl overflow-hidden
        backdrop-blur-xl bg-background/80
        before:absolute before:inset-0
        before:bg-gradient-to-br before:from-primary/10 before:to-transparent
        before:pointer-events-none before:opacity-50
        after:absolute after:inset-0
        after:bg-gradient-to-tr after:from-background/20 after:to-primary/5
        after:pointer-events-none
        border border-border/50
        shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
        hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.15)]
        transition-all duration-300
        group
        ${className}
      `}
    >
      {/* Enhanced glow effect */}
      {enableGlow && (
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, hsl(var(--${glowColor})) 0%, transparent 70%)`,
            filter: "blur(20px)",
          }}
          animate={{
            opacity: isHovered ? 0.3 : 0,
          }}
        />
      )}
      
      {/* Shimmer effect */}
      {enableShimmer && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{
            background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
            transform: "translateX(-100%)",
          }}
          animate={{
            x: isHovered ? "100%" : "-100%",
            opacity: isHovered ? 1 : 0,
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
        />
      )}
      
      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `linear-gradient(45deg, 
            hsl(var(--${glowColor})), 
            transparent, 
            hsl(var(--${glowColor})), 
            transparent
          )`,
          backgroundSize: "200% 200%",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "xor",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
        animate={{
          backgroundPosition: isHovered ? "200% 200%" : "0% 0%",
        }}
        transition={{
          duration: 2,
          ease: "linear",
          repeat: isHovered ? Infinity : 0,
        }}
      />

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}