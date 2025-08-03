import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Share2, 
  Copy, 
  Check, 
  Twitter, 
  Facebook, 
  Linkedin, 
  MessageCircle,
  Send,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { 
  shareContent, 
  shareToSocialMedia, 
  generateArtworkShareData,
  isWebShareSupported 
} from "../../utils/share";
import type { ShareData } from "../../utils/share";

interface AnimatedShareButtonProps {
  shareData: ShareData;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  showSocialOptions?: boolean;
  onShare?: (method: string) => void;
}

export function AnimatedShareButton({ 
  shareData, 
  variant = "outline",
  size = "default",
  className,
  showSocialOptions = true,
  onShare 
}: AnimatedShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position when opened
  useEffect(() => {
    if (dropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      setDropdownPosition({
        top: rect.bottom + scrollY + 8,
        right: window.innerWidth - rect.right - scrollX
      });
    }
  }, [dropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [dropdownOpen]);

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    //console.log('Toggle dropdown, current state:', dropdownOpen);
    setDropdownOpen(!dropdownOpen);
  };

  const handleQuickShare = async () => {
    if (isSharing) return;
    
    setIsSharing(true);
    
    try {
      const result = await shareContent(shareData);
      
      if (result.success) {
        if (result.method === 'clipboard') {
          setJustCopied(true);
          toast.success("Link copied to clipboard!");
          setTimeout(() => setJustCopied(false), 2000);
        } else {
          toast.success("Shared successfully!");
        }
        onShare?.(result.method);
      } else {
        toast.error("Failed to share. Please try again.");
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error("Failed to share. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleSocialShare = (platform: string) => {
    try {
      shareToSocialMedia[platform as keyof typeof shareToSocialMedia]?.(shareData);
      onShare?.(platform);
      setDropdownOpen(false);
      toast.success(`Shared to ${platform}!`);
    } catch (error) {
      console.error(`Failed to share to ${platform}:`, error);
      toast.error(`Failed to share to ${platform}`);
    }
  };

  const getButtonContent = () => {
    if (isSharing) {
      return (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Share2 className="w-4 h-4" />
          </motion.div>
          <span>Sharing...</span>
        </>
      );
    }

    if (justCopied) {
      return (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Check className="w-4 h-4 text-green-500" />
          </motion.div>
          <span>Copied!</span>
        </>
      );
    }

    return (
      <>
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </>
    );
  };

  if (!showSocialOptions || !isWebShareSupported()) {
    return (
      <motion.div
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
      >
        <Button
          variant={variant}
          size={size}
          onClick={handleQuickShare}
          disabled={isSharing}
          className={cn(
            "transition-all duration-300 gap-2",
            justCopied && "text-green-600 border-green-300 bg-green-50 hover:bg-green-100",
            className
          )}
        >
          {getButtonContent()}
        </Button>
      </motion.div>
    );
  }

  return (
    <div ref={containerRef} className="flex items-center gap-1 relative z-50">
      {/* Quick share button */}
      <motion.div
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
      >
        <Button
          variant={variant}
          size={size}
          onClick={handleQuickShare}
          disabled={isSharing}
          className={cn(
            "transition-all duration-300 gap-2 rounded-r-none",
            justCopied && "text-green-600 border-green-300 bg-green-50 hover:bg-green-100",
            className
          )}
        >
          {getButtonContent()}
        </Button>
      </motion.div>

      {/* Dropdown for social options */}
      <div className="relative z-50">
        <motion.div
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
          className="relative z-50"
        >
          <Button
            ref={buttonRef}
            variant={variant}
            size={size}
            onClick={handleDropdownToggle}
            className={cn(
              "px-2 rounded-l-none border-l transition-all duration-300",
              className
            )}
          >
            <motion.div
              animate={{ rotate: dropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </motion.div>
          </Button>
        </motion.div>
        
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed w-48 bg-background border rounded-md shadow-xl z-[99999] overflow-hidden"
              style={{ 
                position: 'fixed',
                zIndex: 99999,
                top: `${dropdownPosition.top}px`,
                right: `${dropdownPosition.right}px`
              }}
            >
              <div className="py-1">
                <button
                  onClick={() => handleSocialShare('twitter')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                >
                  <Twitter className="w-4 h-4 text-blue-500" />
                  <span>Twitter</span>
                </button>
                
                <button
                  onClick={() => handleSocialShare('facebook')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                >
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span>Facebook</span>
                </button>
                
                <button
                  onClick={() => handleSocialShare('linkedin')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                >
                  <Linkedin className="w-4 h-4 text-blue-700" />
                  <span>LinkedIn</span>
                </button>
                
                <div className="h-px bg-border my-1" />
                
                <button
                  onClick={() => handleSocialShare('whatsapp')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span>WhatsApp</span>
                </button>
                
                <button
                  onClick={() => handleSocialShare('telegram')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4 text-blue-500" />
                  <span>Telegram</span>
                </button>
                
                <div className="h-px bg-border my-1" />
                
                <button
                  onClick={() => handleSocialShare('reddit')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-orange-600" />
                  <span>Reddit</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Convenience component specifically for artwork sharing
interface ArtworkShareButtonProps {
  artwork: {
    id: string;
    title: string;
    description?: string;
    artist: {
      artistName: string;
    };
    imageFileId?: string;
  };
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  showSocialOptions?: boolean;
  onShare?: (method: string) => void;
}

export function ArtworkShareButton({ 
  artwork, 
  ...props 
}: ArtworkShareButtonProps) {
  const shareData = generateArtworkShareData(artwork);
  
  return (
    <AnimatedShareButton 
      shareData={shareData} 
      {...props}
    />
  );
}
