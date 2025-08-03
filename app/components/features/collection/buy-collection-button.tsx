import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BuyCollectionModal } from "./buy-collection-modal";
import { toast } from "sonner";
import { formatPriceDisplay } from "../../../utils/currency";
import type { ArtistCollection } from "../../../types/collection";

interface BuyCollectionButtonProps {
  collection: ArtistCollection;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  className?: string;
  showPurchasedBadge?: boolean;
  onPurchaseSuccess?: () => void;
}

export function BuyCollectionButton({
  collection,
  size = "sm",
  variant = "default",
  className = "bg-primary/90 hover:bg-primary shadow-lg",
  showPurchasedBadge = true,
  onPurchaseSuccess
}: BuyCollectionButtonProps) {
  const [showBuyModal, setShowBuyModal] = useState(false);

  const handleBuySuccess = () => {
    toast.success('Purchase successful');
    onPurchaseSuccess?.();
    setShowBuyModal(false);
  };

  // Don't show anything if collection is not published or has no price
  if (!collection.isPublished || !collection.price || parseFloat(collection.price) <= 0) {
    return null;
  }

  // Show purchased badge if already purchased
  if (collection.isPurchased && showPurchasedBadge) {
    return (
      <Badge variant="secondary" className="bg-green-500/90 text-white shadow-lg">
        Purchased
      </Badge>
    );
  }

  // Don't show buy button if already purchased and not showing badge
  if (collection.isPurchased) {
    return null;
  }

  return (
    <>
      <Button
        size={size}
        variant={variant}
        onClick={() => setShowBuyModal(true)}
        className={`cursor-pointer hover:scale-105 transition-all duration-200 ${className}`}
      >
        Buy Collection
      </Button>

      <BuyCollectionModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        collection={collection}
        onSuccess={handleBuySuccess}
      />
    </>
  );
}

// Wrapper component for absolute positioning (commonly used pattern)
interface AbsoluteBuyCollectionButtonProps extends BuyCollectionButtonProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export function AbsoluteBuyCollectionButton({
  position = "top-right",
  ...props
}: AbsoluteBuyCollectionButtonProps) {
  const positionClasses = {
    "top-right": "absolute top-4 right-4",
    "top-left": "absolute top-4 left-4",
    "bottom-right": "absolute bottom-4 right-4",
    "bottom-left": "absolute bottom-4 left-4"
  };

  return (
    <div className={positionClasses[position]}>
      <BuyCollectionButton {...props} />
    </div>
  );
}
