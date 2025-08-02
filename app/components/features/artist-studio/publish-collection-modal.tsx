import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Upload, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../common/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { collectionService } from "../../../services/collection-service";
import type { MyCollection } from "../../../types/collection";

interface PublishCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: MyCollection;
  onSuccess: () => void;
  publishCollection: (collectionId: string) => void;
  publishCollectionIsPending: boolean;
  publishCollectionIsSuccess: boolean;
}

export function PublishCollectionModal({
  isOpen,
  onClose,
  collection,
  onSuccess,
  publishCollection,
  publishCollectionIsPending,
  publishCollectionIsSuccess
}: PublishCollectionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (publishCollectionIsPending) setIsSubmitting(true);
  }, [publishCollectionIsPending])

  useEffect(() => {
    if (publishCollectionIsSuccess) {
      toast.success("Collection published successfully!");
      onSuccess();
      setIsSubmitting(false);
      onClose();
    }
  }, [publishCollectionIsSuccess])


  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      await publishCollection(collection.id);
    } catch (error: any) {
      console.error('Publish collection error:', error);
      toast.error(error.message || "Failed to publish collection");
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
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Upload className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Publish Collection</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Collection Info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">{collection.collectionName}</h4>
              {collection.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {collection.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{collection.arts?.length || 0} artworks</span>
                {collection.price && (
                  <>
                    <span>•</span>
                    <span>{parseFloat(collection.price).toFixed(3)} ETH</span>
                  </>
                )}
              </div>
            </div>

            {/* Warning */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Publishing your collection is irreversible.
                Once published, the collection will be visible to all users and you will
                <strong> no longer be able to edit</strong> the collection details, price,
                or cover image.
              </AlertDescription>
            </Alert>

            {/* Validation Checks */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Ready to publish?</h5>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${collection.collectionName ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={collection.collectionName ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    Collection name provided
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${(collection.arts?.length || 0) > 0 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className={(collection.arts?.length || 0) > 0 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}>
                    {collection.arts?.length || 0} artworks included
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${collection.coverImageFileId ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className={collection.coverImageFileId ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}>
                    Cover image {collection.coverImageFileId ? 'set' : 'not set'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isSubmitting || !collection.collectionName}
                className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Publish Collection
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
