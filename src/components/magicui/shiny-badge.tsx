"use client";

import { cn } from "@/lib/utils";
import { motion, type MotionProps, type Transition } from "framer-motion";
import React from "react";

const animationProps = {
	initial: { "--x": "100%", scale: 0.8 },
	animate: { "--x": "-100%", scale: 1 },
	whileTap: { scale: 0.95 },
	transition: {
		repeat: Infinity,
		repeatType: "loop",
		repeatDelay: 1,
		type: "spring",
		stiffness: 20,
		damping: 15,
		mass: 2,
		scale: {
			type: "spring",
			stiffness: 200,
			damping: 5,
			mass: 0.5,
		},
	} as Transition,
};

interface ShinyBadgeProps extends MotionProps {
	children: React.ReactNode;
	className?: string;
}

export const ShinyBadge = React.forwardRef<
	HTMLSpanElement,
	ShinyBadgeProps
>(({ children, className, ...props }, ref) => {
	return (
		<motion.span
			ref={ref}
			className={cn(
				"relative inline-block rounded-lg px-4 py-1 font-medium text-sm uppercase glass",
				className,
			)}
			{...animationProps}
			{...props}
		>
      <span
				className="relative block text-primary-foreground dark:font-light font-mono"
				style={{
					maskImage:
						"linear-gradient(-75deg,var(--primary) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),var(--primary) calc(var(--x) + 100%))",
				}}
			>
        {children}
      </span>
			<span
				style={{
					mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
					WebkitMask:
						"linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
					backgroundImage:
						"linear-gradient(-75deg,var(--primary)/10% calc(var(--x)+20%),var(--primary)/50% calc(var(--x)+25%),var(--primary)/10% calc(var(--x)+100%))",
				}}
				className="absolute inset-0 z-10 block rounded-full p-px"
			/>
		</motion.span>
	);
});

ShinyBadge.displayName = "ShinyBadge";
