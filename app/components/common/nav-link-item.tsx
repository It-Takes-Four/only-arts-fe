import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface NavLinkItemProps {
  to: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  onClick?: () => void;
  variant?: "sidebar" | "nav" | "icon";
  showTooltip?: boolean;
}

export function NavLinkItem({
  to,
  children,
  icon: Icon,
  className,
  onClick,
  variant = "nav",
  showTooltip = true,
}: NavLinkItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  const baseClasses = cn(
    "inline-flex items-center gap-3 rounded-lg transition-all duration-200",
    "hover:bg-accent hover:text-accent-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    isActive && "bg-accent text-accent-foreground shadow-sm"
  );

  const variantClasses = {
    sidebar: "w-full justify-start px-4 py-3 text-base font-medium",
    nav: "px-3 py-2 text-sm font-medium",
    icon: "h-10 w-10 justify-center p-0",
  };

  const linkContent = (
    <Button
      asChild
      variant="ghost"
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
    >
      <Link to={to} onClick={onClick}>
        {Icon && <Icon className={cn(
          "shrink-0",
          variant === "icon" ? "h-5 w-5" : "h-4 w-4"
        )} />}
        {variant !== "icon" && (
          <span className={cn(
            variant === "sidebar" && "group-data-[collapsible=icon]:sr-only"
          )}>
            {children}
          </span>
        )}
      </Link>
    </Button>
  );

  // Show tooltip for icon variant or when explicitly requested
  if ((variant === "icon" || showTooltip) && Icon) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {linkContent}
        </TooltipTrigger>
        <TooltipContent side={variant === "sidebar" ? "right" : "bottom"}>
          <p>{children}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}
