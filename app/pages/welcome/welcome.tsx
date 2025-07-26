import { Button } from "app/components/common/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StaticGradient from "@/components/blocks/Backgrounds/StaticGradient/StaticGradient";
import { useAuthContext } from "app/components/core/auth-context";
import { useNavigate } from "react-router";

export function Welcome() {
  const { user, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const handleBecomeArtist = () => {
    if (!isAuthenticated) {
      navigate('/login?returnTo=/become-artist');
    } else {
      navigate('/become-artist');
    }
  };

  const handleExploreGallery = () => {
    navigate('/gallery');
  };

  // Check if user can become an artist (logged in but not an artist yet)
  const canBecomeArtist = isAuthenticated && user && !user.artist;

  return (
    <div className="fixed inset-0 w-full h-full overflow-auto">
      {/* Background - Covers entire viewport */}
      <div className="absolute inset-0 w-full h-full">
        <StaticGradient
          baseColor={[0.125, 0.1, 0.3]}
          variant="subtle"
        />
      </div>

      {/* Content - Positioned above background with proper spacing for header */}
      <div className="relative z-10 pt-16 min-h-full">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-2xl bg-background/80 backdrop-blur-sm border-border/50">
              <CardHeader className="text-center space-y-4 pb-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight text-primary">
                    Welcome to OnlyArts
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Your creative platform for artistic expression and community
                  </p>
                </div>
                <div className="pt-2">
                  <CardTitle className="text-2xl">Get Started</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Explore the features and begin your artistic journey
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                <Button size="lg" className="w-full" onClick={handleExploreGallery}>
                  Explore Gallery
                </Button>
                {canBecomeArtist ? (
                  <Button variant="outline" size="lg" className="w-full" onClick={handleBecomeArtist}>
                    Become an Artist
                  </Button>
                ) : user?.artist ? (
                  <Button variant="outline" size="lg" className="w-full" onClick={() => navigate('/create-art')}>
                    Create Art
                  </Button>
                ) : (
                  <Button variant="outline" size="lg" className="w-full" onClick={() => navigate('/login')}>
                    Sign In to Create
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}