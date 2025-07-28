import { type HTMLAttributes, type ReactNode } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	className?: string;
}

export function GlassCard({ children, className = "", ...props }: GlassCardProps) {
	return (
		<div
			className={`glass rounded-lg border ${className}`}
			{...props}
		>
			{children}
		</div>
	);
}