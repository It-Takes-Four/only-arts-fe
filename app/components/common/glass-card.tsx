import { type HTMLAttributes, type ReactNode } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	className?: string;
}

export function GlassCard({ children, className = "", ...props }: GlassCardProps) {
	return (
		<div
			className={`bg-card/60 backdrop-blur border border-border/75 rounded-lg p-4 ${className}`}
			{...props}
		>
			{children}
		</div>
	);
}