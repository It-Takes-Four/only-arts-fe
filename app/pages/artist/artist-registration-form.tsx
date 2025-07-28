import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "app/components/common/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Palette } from "lucide-react";
import { toast } from 'sonner';
import { artistService, type ArtistRegistrationRequest } from "app/services/artist-service";
import { useAuthContext } from "app/components/core/auth-context";

interface ArtistRegistrationFormProps {
  onSuccess: (artist: any) => void;
  onCancel: () => void;
}

type FormData = {
  artistName: string;
  bio: string;
  isNsfw: boolean;
};

export function ArtistRegistrationForm({ onSuccess, onCancel }: ArtistRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthContext();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onTouched",
    defaultValues: {
      artistName: "",
      bio: "",
      isNsfw: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user?.id) {
      toast.error("User ID not found. Please try logging in again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const registrationData: ArtistRegistrationRequest = {
        artistName: data.artistName,
        bio: data.bio,
        isNsfw: data.isNsfw
      };

      const response = await artistService.registerAsArtist(registrationData);
      
      toast.success("Congratulations! You're now an OnlyArts artist!");
      onSuccess(response.artist);
    } catch (error: any) {
      console.error('Artist registration error:', error);
      toast.error(error.message || 'Failed to register as artist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const artistName = watch("artistName");
  const isNsfw = watch("isNsfw");
  const hasRequiredFields = artistName && artistName.trim().length > 0;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Palette className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Create Your Artist Profile</h1>
          <p className="text-muted-foreground">
            Tell us about yourself and your artistic journey
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Artist Information
            </CardTitle>
            <CardDescription>
              This information will be displayed on your artist profile
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  Optional: Share your artistic background and inspiration
                </p>
              </div>

              {/* Submission */}
              <div className="space-y-4">
                {!hasRequiredFields && (
                  <Alert>
                    <AlertDescription>
                      Please fill in all required fields to continue.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    size="lg" 
                    onClick={onCancel}
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
                        Creating Profile...
                      </>
                    ) : (
                      "Become an Artist"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
