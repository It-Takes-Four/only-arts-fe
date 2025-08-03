import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ImagePlus, X, Loader2, Image } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../common/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { collectionService } from "../../../services/collection-service";
import { useTags } from "../../hooks/useTags";
import type { MyCollection } from "../../../types/collection";
import type { Tag } from "../../../types/tag";

interface AddArtToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: MyCollection;
  onSuccess: (art: any) => void;
}

interface FormData {
  title: string;
  description: string;
  image: FileList;
}

export function AddArtToCollectionModal({ 
  isOpen, 
  onClose, 
  collection, 
  onSuccess 
}: AddArtToCollectionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState("");

  const { popularTags, searchTags, tags } = useTags();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onTouched",
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const watchedImage = watch("image");

  useEffect(() => {
    if (watchedImage && watchedImage.length > 0) {
      const file = watchedImage[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  }, [watchedImage]);

  // Handle tag search
  useEffect(() => {
    if (tagSearch.trim()) {
      searchTags(tagSearch);
    }
  }, [tagSearch, searchTags]);

  const onSubmit = async (data: FormData) => {
    if (!watchedImage || watchedImage.length === 0) {
      toast.error("Please select an image file");
      return;
    }

    setIsSubmitting(true);
    try {
      const artData = {
        title: data.title,
        description: data.description,
        tagIds: selectedTags,
        file: data.image[0],
      };

      const response = await collectionService.addArtToCollection(collection.id, artData);
      
      toast.success("Art added to collection successfully!");
      onSuccess(response);
      reset();
      setPreviewImage(null);
      setSelectedTags([]);
      setTagSearch("");
      onClose();
    } catch (error: any) {
      console.error('Add art error:', error);
      toast.error(error.message || "Failed to add art to collection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setPreviewImage(null);
    setSelectedTags([]);
    setTagSearch("");
    onClose();
  };

  const handleTagSelect = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    }
    setTagSearch("");
  };

  const handleTagRemove = (tagId: string) => {
    setSelectedTags(selectedTags.filter(id => id !== tagId));
  };

  const getTagName = (tagId: string) => {
    const tag = [...popularTags, ...tags].find(t => t.id === tagId);
    return tag?.tagName || tagId;
  };

  const availableTags = tagSearch.trim() ? tags : popularTags;
  const filteredTags = availableTags.filter(tag => !selectedTags.includes(tag.id));

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
        className="relative z-10 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
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
                  <ImagePlus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Add Art to Collection</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {collection.collectionName}
                  </p>
                </div>
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Image Upload */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="image">Artwork Image *</Label>
                <div className="space-y-3">
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Artwork preview"
                        className="w-full h-64 object-cover rounded-lg border border-border"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          reset({ ...watch(), image: undefined });
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
                      onClick={() => document.getElementById("image")?.click()}
                    >
                      <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Click to upload artwork image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    {...register("image", {
                      required: "Artwork image is required",
                    })}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  {errors.image && (
                    <p className="text-sm text-destructive">{errors.image.message}</p>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter art title"
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 2,
                      message: "Title must be at least 2 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Title must be less than 100 characters",
                    },
                  })}
                  className={errors.title ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Enter art description"
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Description must be at least 10 characters",
                    },
                    maxLength: {
                      value: 500,
                      message: "Description must be less than 500 characters",
                    },
                  })}
                  className={errors.description ? "border-destructive" : ""}
                  rows={4}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-col space-y-2">
                <Label>Tags (Optional)</Label>

                {/* Selected Tags */}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tagId) => (
                      <Badge
                        key={tagId}
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                        onClick={() => handleTagRemove(tagId)}
                      >
                        {getTagName(tagId)}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Tag Search */}
                <div className="space-y-2">
                  <Input
                    placeholder="Search tags..."
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full"
                  />

                  {/* Tag Options */}
                  {filteredTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {filteredTags.slice(0, 20).map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => handleTagSelect(tag.id)}
                        >
                          {tag.tagName}
                        </Badge>
                      ))}
                    </div>
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
                  disabled={
                    isSubmitting ||
                    !watch("title") ||
                    !watch("description") ||
                    !watchedImage ||
                    watchedImage.length === 0
                  }
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Art"
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
