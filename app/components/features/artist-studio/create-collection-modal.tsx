import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { X, Upload, Folder, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../common/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { collectionService } from "../../../services/collection-service";
import type { CreateCollectionRequest } from "../../../types/collection";

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  addCollection: (request: any) => void;
  isPending: boolean;
  isSuccess: boolean;
}

interface FormData {
  collectionName: string;
  description?: string;
  price: number;
  coverImage: FileList;
}

export function CreateCollectionModal({ isOpen, onClose, addCollection, isPending, isSuccess }: CreateCollectionModalProps) {
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
    defaultValues: {
      description: "",
    },
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

  useEffect(() => {
    if (isSuccess) {
      reset();
      setPreviewImage(null);
      onClose();
    }
  }, [isSuccess])

  useEffect(() => {
    if (isPending) {
      setIsSubmitting(true)
    }
  }, [isPending])


  const onSubmit = async (data: FormData) => {
    try {
      const request: CreateCollectionRequest = {
        collectionName: data.collectionName,
        description: data.description,
        price: data.price,
        file: data.coverImage[0],
      };

      setIsSubmitting(true);
      const response = await addCollection(request);
    } catch (error: any) {
      console.error('Collection creation error:', error);
      toast.error(error.message || "Failed to create collection");
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
                  <Folder className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Create New Collection</CardTitle>
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
              {/* Collection Name */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="collectionName">Collection Name *</Label>
                <Input
                  id="collectionName"
                  placeholder="Enter collection name"
                  {...register("collectionName", {
                    required: "Collection name is required",
                    minLength: {
                      value: 2,
                      message: "Collection name must be at least 2 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Collection name must be less than 100 characters",
                    },
                  })}
                  className={errors.collectionName ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
                {errors.collectionName && (
                  <p className="text-sm text-destructive">{errors.collectionName.message}</p>
                )}
              </div>

              {/* Price */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="price">Price ({import.meta.env.VITE_DEFAULT_CURRENCY}) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.00001"
                  min="0"
                  placeholder="Enter price (e.g., 0.1 ETH)"
                  {...register("price", {
                    min: {
                      value: 0,
                      message: "Price must be a positive number",
                    },
                    validate: (value) => {
                      if (value === undefined || value === null){
                        return "Price is required";
                      }
                      return true;
                    },
                  })}
                  className={errors.price ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <textarea
                  id="description"
                  placeholder="Enter collection description"
                  {...register("description", {
                    maxLength: {
                      value: 500,
                      message: "Description must be less than 500 characters",
                    },
                  })}
                  className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${errors.description ? "border-destructive" : ""}`}
                  disabled={isSubmitting}
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* Cover Image */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="coverImage">Cover Image *</Label>
                <div className="space-y-3">
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Cover preview"
                        className="w-full h-32 object-cover rounded-lg border border-border"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          reset({
                            collectionName: watch("collectionName"),
                            description: watch("description"),
                            price: watch("price")
                          });
                          setPreviewImage(null);
                        }}
                        className="absolute top-2 right-2 h-6 w-6 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                        disabled={isSubmitting}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                      onClick={() => document.getElementById('coverImage')?.click()}
                    >
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Click to upload cover image
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
                      required: "Cover image is required",
                      validate: (files) => {
                        if (!files) return "Please upload a cover image";
                        if (files.length === 0) return "Please upload a cover image";
                        if (files[0].size > 10 * 1024 * 1024) return "Cover image must be less than 10MB";
                        if (!files[0].type.startsWith("image/")) return "Please upload a valid image file";
                        return true
                      }
                    })}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.coverImage && (
                  <p className="text-sm text-destructive">{errors.coverImage.message}</p>
                )}
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
                  disabled={isSubmitting || !watch("collectionName") || !watch("coverImage") || !watch("price")}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Collection"
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
