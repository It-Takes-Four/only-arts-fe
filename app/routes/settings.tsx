import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "app/components/common/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FancyThemeToggle } from "app/components/common/fancy-theme-toggle";
import { useAuthContext } from "app/components/core/auth-context";
import { userService } from "app/services/user-service";
import { authService } from "app/services/auth-service";
import { Camera, Upload, User, Mail, Palette, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function meta() {
  return [
    { title: "OnlyArts - Settings" },
    { name: "description", content: "Manage your OnlyArts account settings" },
  ];
}

export default function Settings() {
  const { user, refreshUser } = useAuthContext();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getProfileImageUrl = () => {
    if (profileImage) return profileImage;
    if (user?.profilePictureFileId) {
      return `${import.meta.env.VITE_API_BASE_URL}/upload/profile/${user.profilePictureFileId}`;
    }
    return null;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      // Upload to API
      await userService.uploadProfilePicture(file);
      
      // Refresh user data from /auth/me to get updated profile picture
      await refreshUser();
      
      // Clear local preview since we now have the real image
      setProfileImage(null);
      
      toast.success('Profile picture updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setHasChanges(value !== user?.email);
  };

  const handleSaveChanges = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      await userService.updateProfile({
        email: email.trim()
      });
      
      // Refresh user data from /auth/me to get updated information
      await refreshUser();
      setHasChanges(false);
      
      toast.success('Email updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update email');
    } finally {
      setIsSaving(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account preferences and profile
            </p>
          </motion.div>
          
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="mb-6 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your profile picture and email address
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                      <AvatarImage 
                        src={getProfileImageUrl() || undefined} 
                        alt="Profile picture"
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary text-xl font-semibold">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Upload Overlay */}
                    <motion.button
                      onClick={triggerFileUpload}
                      disabled={isUploading}
                      className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                      ) : (
                        <Camera className="h-6 w-6 text-white" />
                      )}
                    </motion.button>
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      onClick={triggerFileUpload}
                      disabled={isUploading}
                      variant="outline"
                      className="bg-background/50 hover:bg-background/80 backdrop-blur-sm"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? 'Uploading...' : 'Change Picture'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                
                {/* Email */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email Address
                  </Label>
                  <Input 
                    id="email"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                {/* Save Button */}
                <motion.div className="pt-4">
                  <Button 
                    onClick={handleSaveChanges}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    disabled={!hasChanges || isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Theme Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Palette className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize your OnlyArts experience
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Theme</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Choose your preferred color scheme
                    </p>
                  </div>
                  <FancyThemeToggle variant="default" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
