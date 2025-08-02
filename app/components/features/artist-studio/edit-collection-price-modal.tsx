import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { X, DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../common/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { collectionService } from "../../../services/collection-service";
import type { MyCollection } from "../../../types/collection";

interface EditCollectionPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: MyCollection;
  onSuccess: (updatedPrice: number) => void;
}

interface FormData {
  price: number;
}

export function EditCollectionPriceModal({ 
  isOpen, 
  onClose, 
  collection, 
  onSuccess 
}: EditCollectionPriceModalProps) {
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
      price: collection.price ? parseFloat(collection.price) : 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await collectionService.updateCollectionPrice(collection.id, data.price);

      toast.success("Collection price updated successfully!");
      onSuccess(data.price);
      onClose();
    } catch (error: any) {
      console.error('Collection price update error:', error);
      toast.error(error.message || "Failed to update collection price");
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
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Edit Collection Price</CardTitle>
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
              {/* Collection Info */}
              <div className="bg-muted/50 rounded-lg p-3 mb-4">
                <h4 className="font-medium text-sm">{collection.collectionName}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {collection.arts?.length || 0} artwork{collection.arts?.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Price Input */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="price">Price (ETH) *</Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="0.000"
                    {...register("price", {
                      required: "Price is required",
                      min: {
                        value: 0,
                        message: "Price must be a positive number",
                      },
                      validate: (value) => {
                        if (value === undefined || value === null) {
                          return "Price is required";
                        }
                        if (value < 0) {
                          return "Price must be a positive number";
                        }
                        return true;
                      },
                    })}
                    className={`pl-8 ${errors.price ? "border-destructive" : ""}`}
                    disabled={isSubmitting}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-sm text-muted-foreground">Ξ</span>
                  </div>
                </div>
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Set the price for your entire collection. Users will pay this amount to purchase all artworks in the collection.
                </p>
              </div>

              {/* Current Price Display */}
              {collection.price && (
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Current Price:</span>
                    <span className="font-medium">
                      Ξ {parseFloat(collection.price).toFixed(3)} ETH
                    </span>
                  </div>
                </div>
              )}

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
                  disabled={isSubmitting || watch("price") === undefined}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Price"
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
