import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { X, Image, Loader2, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../common/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "../../common/image-upload";
import { artService, type CreateArtworkRequest } from "../../../services/art-service";
import { useTags } from "../../hooks/useTags";

interface CreateArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (artwork: any) => void;
}

interface FormData {
  title: string;
  description: string;
  image: FileList;
}

export function CreateArtworkModal({ isOpen, onClose, onSuccess }: CreateArtworkModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  // Handle tag search
  useEffect(() => {
    if (tagSearch.trim()) {
      searchTags(tagSearch);
    }
  }, [tagSearch, searchTags]);

  const handleTagSelect = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    }
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

  const onSubmit = async (data: FormData) => {
    if (!selectedFile) return;

    setIsSubmitting(true);
    try {
      const request: CreateArtworkRequest = {
        title: data.title,
        description: data.description,
        file: selectedFile,
        tagIds: selectedTags.length > 0 ? selectedTags : undefined,
      };

      const response = await artService.createArtwork(request);
      
      toast.success("Artwork uploaded successfully!");
      onSuccess(response);
      reset();
      setSelectedFile(null);
      setSelectedTags([]);
      setTagSearch("");
      onClose();
    } catch (error: any) {
      console.error('Artwork creation error:', error);
      toast.error(error.message || "Failed to upload artwork");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedFile(null);
    setSelectedTags([]);
    setTagSearch("");
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
                  <Image className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Upload New Artwork</CardTitle>
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
              <ImageUpload
                id="image"
                label="Artwork Image"
                required={true}
                accept="image/*"
                maxSize={10}
                disabled={isSubmitting}
                error={errors.image?.message}
                placeholder={{
                  title: "Click to upload your artwork",
                  subtitle: "PNG, JPG, GIF up to 10MB"
                }}
                onFileSelect={setSelectedFile}
                onFileChange={(files) => {
                  setValue("image", files as FileList);
                }}
                register={register}
              />

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter artwork title"
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
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your artwork, inspiration, or technique..."
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Description must be at least 10 characters",
                    },
                    maxLength: {
                      value: 1000,
                      message: "Description must be less than 1000 characters",
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
              <div className="space-y-3">
                <Label>Tags (Optional)</Label>
                
                {/* Selected Tags */}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tagId) => (
                      <Badge
                        key={tagId}
                        variant="secondary"
                        className="flex items-center gap-1 bg-primary/10 text-primary"
                      >
                        {getTagName(tagId)}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tagId)}
                          className="ml-1 hover:text-destructive"
                          disabled={isSubmitting}
                        >
                          <X className="h-3 w-3" />
                        </button>
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
                  
                  {/* Available Tags */}
                  {filteredTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-border rounded-lg">
                      {filteredTags.slice(0, 20).map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                          onClick={() => handleTagSelect(tag.id)}
                        >
                          <Tag className="h-3 w-3 mr-1" />
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
                  disabled={isSubmitting || !watch("title") || !watch("description") || !selectedFile}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Artwork"
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
