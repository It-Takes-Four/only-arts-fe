import { useState } from "react";
import { toast } from "sonner";
import { shareContent, shareToSocialMedia } from "../../utils/share";
import type { ShareData, ShareOptions } from "../../utils/share";

interface UseAnimatedShareReturn {
  isSharing: boolean;
  justCopied: boolean;
  share: (data: ShareData, options?: ShareOptions) => Promise<void>;
  shareToSocial: (platform: string, data: ShareData) => void;
  reset: () => void;
}

export function useAnimatedShare(): UseAnimatedShareReturn {
  const [isSharing, setIsSharing] = useState(false);
  const [justCopied, setJustCopied] = useState(false);

  const share = async (data: ShareData, options?: ShareOptions) => {
    if (isSharing) return;
    
    setIsSharing(true);
    
    try {
      const result = await shareContent(data, options);
      
      if (result.success) {
        if (result.method === 'clipboard') {
          setJustCopied(true);
          toast.success("Link copied to clipboard!");
          setTimeout(() => setJustCopied(false), 2000);
        } else {
          toast.success("Shared successfully!");
        }
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

  const shareToSocial = (platform: string, data: ShareData) => {
    try {
      shareToSocialMedia[platform as keyof typeof shareToSocialMedia]?.(data);
      toast.success(`Shared to ${platform}!`);
    } catch (error) {
      console.error(`Failed to share to ${platform}:`, error);
      toast.error(`Failed to share to ${platform}`);
    }
  };

  const reset = () => {
    setIsSharing(false);
    setJustCopied(false);
  };

  return {
    isSharing,
    justCopied,
    share,
    shareToSocial,
    reset,
  };
}
