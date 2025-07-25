import { Button } from "app/components/common/button";
import { Bell, Search } from "lucide-react";

interface HeaderActionsProps {
  onSearchClick?: () => void;
}

export function HeaderActions({ onSearchClick }: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* Mobile Search Icon - positioned before notifications */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden h-9 w-9"
        onClick={onSearchClick}
      >
        <Search className="h-4 w-4" />
      </Button>

      {/* Notification Bell */}
      <Button variant="ghost" size="icon" className="h-9 w-9 relative">
        <Bell className="h-5 w-5" />
        {/* Notification dot */}
        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
      </Button>
    </div>
  );
}
