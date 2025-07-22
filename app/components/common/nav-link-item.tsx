import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function NavLinkItem({
  to,
  children,
  icon: Icon,
  className,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  onClick?: () => void;
}) {
  const location = useLocation();
  const isActive = location.pathname === to;

  const linkContent = (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "text-foreground bg-accent"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
        Icon ? "w-10 h-10" : "px-4 py-2", // Make square if icon, regular padding if text
        className
      )}
      onClick={onClick}
    >
      {Icon ? (
        <Icon className="h-5 w-5" />
      ) : (
        children
      )}
    </Link>
  );

  // If there's an icon, wrap in tooltip with children as tooltip text
  if (Icon) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {linkContent}
        </TooltipTrigger>
        <TooltipContent>
          <p>{children}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // If no icon, just return the link with text
  return linkContent;
}
