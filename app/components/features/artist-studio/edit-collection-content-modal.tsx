import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { X, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../common/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { collectionService } from "../../../services/collection-service";
import type { MyCollection } from "../../../types/collection";

interface EditCollectionContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: MyCollection;
  onSuccess: (updatedData: { collectionName: string; description: string }) => void;
}

interface FormData {
  collectionName: string;
  description: string;
}

export function EditCollectionContentModal({ 
  isOpen, 
  onClose, 
  collection, 
  onSuccess 
}: EditCollectionContentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onTouched",
    defaultValues: {
      collectionName: collection.collectionName || "",
      description: collection.description || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await collectionService.updateCollectionContent(collection.id, {
        collectionName: data.collectionName,
        description: data.description,
      });

      toast.success("Collection details updated successfully!");
      onSuccess(data);
      onClose();
    } catch (error: any) {
      console.error('Collection update error:', error);
      toast.error(error.message || "Failed to update collection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
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
                  <Edit className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Edit Collection Details</CardTitle>
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

              {/* Description */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="description">Description</Label>
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
                  disabled={isSubmitting || !watch("collectionName")}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Collection"
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
