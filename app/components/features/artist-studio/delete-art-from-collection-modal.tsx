import { useState } from "react";
import { motion } from "framer-motion";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../common/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { collectionService } from "../../../services/collection-service";
import type { MyCollection } from "../../../types/collection";

interface DeleteArtFromCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: MyCollection;
  art: {
    id: string;
    title: string;
    imageUrl?: string;
  };
  onSuccess: (artId: string) => void;
}

export function DeleteArtFromCollectionModal({ 
  isOpen, 
  onClose, 
  collection, 
  art, 
  onSuccess 
}: DeleteArtFromCollectionModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await collectionService.deleteArtFromCollection(collection.id, art.id);
      
      toast.success("Art removed from collection successfully!");
      onSuccess(art.id);
      onClose();
    } catch (error: any) {
      console.error('Delete art error:', error);
      toast.error(error.message || "Failed to remove art from collection");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <Card className="bg-background/95 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <CardTitle className="text-destructive">Remove Art from Collection</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                disabled={isDeleting}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Art Preview */}
            <div className="space-y-3">
              {art.imageUrl && (
                <div className="w-full h-32 rounded-lg overflow-hidden border border-border">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="text-center">
                <h3 className="font-medium text-foreground">{art.title}</h3>
                <p className="text-sm text-muted-foreground">
                  from "{collection.collectionName}"
                </p>
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">
                    Confirm Removal
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This will permanently remove this artwork from the collection. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Art
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
