import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from '@tanstack/react-query';
import { Button } from "../../common/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Palette, Edit, X } from "lucide-react";
import { toast } from 'sonner';
import { useAuthContext } from "app/components/core/auth-context";
import { useArtistStudio } from "app/context/artist-studio-context";
import type { ArtistRegistrationRequest } from "app/types/artist";
import { artistService } from "app/services/artist-service";

interface EditArtistProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (artist: any) => void;
}

type FormData = {
  artistName: string;
  bio: string;
  isNsfw: boolean;
};

export function EditArtistProfileModal({ isOpen, onClose, onSuccess }: EditArtistProfileModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, refreshUserWithValidation } = useAuthContext();
  const { refreshProfile } = useArtistStudio();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onTouched",
    defaultValues: {
      artistName: user?.artist?.artistName || "",
      bio: user?.artist?.bio || "",
      isNsfw: user?.artist?.isNsfw || false,
    },
  });

  // Reset form when user data changes or modal opens
  useEffect(() => {
    if (isOpen && user?.artist) {
      reset({
        artistName: user.artist.artistName || "",
        bio: user.artist.bio || "",
        isNsfw: user.artist.isNsfw || false,
      });
    }
  }, [isOpen, user?.artist, reset]);

  const onSubmit = async (data: FormData) => {
    if (!user?.artist?.id) {
      toast.error("Artist ID not found. Please try refreshing the page.");
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData: Partial<ArtistRegistrationRequest> = {
        artistName: data.artistName,
        bio: data.bio,
        isNsfw: data.isNsfw
      };

      const updatedArtist = await artistService.updateArtistProfile(updateData);
      //console.log('Artist profile updated successfully:', updatedArtist);
      
      // Use the studio context to refresh all data
      try {
        await refreshProfile();
        //console.log('All artist studio data refreshed successfully');
      } catch (refreshError) {
        console.warn('Background refresh failed:', refreshError);
        
        // Fallback: manual cache update
        const currentUser = queryClient.getQueryData(['auth', 'user']);
        if (currentUser && typeof currentUser === 'object' && 'artist' in currentUser) {
          const updatedUser = {
            ...currentUser,
            artist: {
              ...(currentUser as any).artist,
              artistName: updatedArtist.artistName,
              bio: updatedArtist.bio,
              isNsfw: updatedArtist.isNsfw,
              updatedAt: new Date().toISOString()
            }
          };
          
          queryClient.setQueryData(['auth', 'user'], updatedUser);
          queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
        }
      }
      
      toast.success("Artist profile updated successfully!");
      onSuccess(updatedArtist);
      onClose();
    } catch (error: any) {
      console.error('Artist profile update error:', error);
      toast.error(error.message || 'Failed to update artist profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const artistName = watch("artistName");
  const isNsfw = watch("isNsfw");
  const hasRequiredFields = artistName && artistName.trim().length > 0;

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-lg border m-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Edit Artist Profile
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Update your artist information and preferences
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Artist Name */}
                <div className="space-y-2">
                  <Label htmlFor="artistName">Artist Name *</Label>
                  <Input
                    id="artistName"
                    placeholder="Enter your artist name or handle"
                    {...register("artistName", {
                      required: "Artist name is required",
                      minLength: {
                        value: 2,
                        message: "Artist name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Artist name must be less than 50 characters",
                      },
                    })}
                    className={errors.artistName ? "border-destructive" : ""}
                  />
                  {errors.artistName && (
                    <p className="text-sm text-destructive">{errors.artistName.message}</p>
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Artist Bio</Label>
                  <textarea
                    id="bio"
                    placeholder="Tell us about your artistic journey, style, and inspiration..."
                    {...register("bio", {
                      maxLength: {
                        value: 500,
                        message: "Bio must be less than 500 characters",
                      },
                    })}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    rows={4}
                  />
                  {errors.bio && (
                    <p className="text-sm text-destructive">{errors.bio.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Share your artistic background and inspiration
                  </p>
                </div>

                {/* NSFW Content Switch */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="isNsfw">NSFW Content</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable if your artwork contains mature or explicit content
                      </p>
                    </div>
                    <Switch
                      id="isNsfw"
                      checked={isNsfw}
                      onCheckedChange={(checked) => setValue("isNsfw", checked)}
                    />
                  </div>
                  {isNsfw && (
                    <Alert>
                      <AlertDescription>
                        Your NSFW content will be properly marked and filtered for users who prefer not to see such content.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Form Validation Alert */}
                {!hasRequiredFields && (
                  <Alert>
                    <AlertDescription>
                      Please fill in all required fields to continue.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    size="lg" 
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    size="lg" 
                    disabled={isSubmitting || !hasRequiredFields}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating Profile...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
