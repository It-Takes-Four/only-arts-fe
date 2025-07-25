import { Button } from "app/components/common/button";
import { SearchInput } from "app/components/common/search-input";
import { X } from "lucide-react";

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (value: string) => void;
}

export function MobileSearchOverlay({ isOpen, onClose, onSearch }: MobileSearchOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4 p-4 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <SearchInput 
            onSearch={onSearch} 
            className="w-full" 
            placeholder="Search..." 
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
