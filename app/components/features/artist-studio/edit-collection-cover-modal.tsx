import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { X, Upload, Image, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../common/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { collectionService } from "../../../services/collection-service";
import type { MyCollection } from "../../../types/collection";

interface EditCollectionCoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: MyCollection;
  onSuccess: () => void;
}

interface FormData {
  coverImage: FileList;
}

export function EditCollectionCoverModal({ 
  isOpen, 
  onClose, 
  collection, 
  onSuccess 
}: EditCollectionCoverModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onTouched",
  });

  const watchedCoverImage = watch("coverImage");

  // Handle image preview
  useEffect(() => {
    if (watchedCoverImage && watchedCoverImage.length > 0) {
      const file = watchedCoverImage[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  }, [watchedCoverImage]);

  // Set current cover image as preview when modal opens
  useEffect(() => {
    if (isOpen && collection.coverImageFileId) {
      setPreviewImage(collectionService.getCollectionImageUrl(collection.coverImageFileId));
    }
  }, [isOpen, collection.coverImageFileId]);

  const onSubmit = async (data: FormData) => {
    if (!data.coverImage || data.coverImage.length === 0) {
      toast.error("Please select an image to upload");
      return;
    }

    setIsSubmitting(true);
    try {
      await collectionService.updateCollectionCoverImage(collection.id, data.coverImage[0]);
      
      toast.success("Cover image updated successfully!");
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error('Cover image update error:', error);
      toast.error(error.message || "Failed to update cover image");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setPreviewImage(null);
    onClose();
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
        onClick={handleClose}
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
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Image className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Change Cover Image</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={isSubmitting}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Current/Preview Image */}
              <div className="flex flex-col space-y-2">
                <Label>Cover Image Preview</Label>
                <div className="space-y-3">
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Cover preview"
                        className="w-full h-48 object-cover rounded-lg border border-border"
                      />
                      {watchedCoverImage && watchedCoverImage.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            reset();
                            // Reset to original image if available
                            if (collection.coverImageFileId) {
                              setPreviewImage(collectionService.getCollectionImageUrl(collection.coverImageFileId));
                            } else {
                              setPreviewImage(null);
                            }
                          }}
                          className="absolute top-2 right-2 h-6 w-6 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                          disabled={isSubmitting}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                      onClick={() => document.getElementById('coverImage')?.click()}
                    >
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Click to upload new cover image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                  
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    {...register("coverImage", {
                      required: "Please select an image to upload"
                    })}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('coverImage')?.click()}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose New Image
                  </Button>
                  
                  {errors.coverImage && (
                    <p className="text-sm text-destructive">{errors.coverImage.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !watchedCoverImage || watchedCoverImage.length === 0}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Cover"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
