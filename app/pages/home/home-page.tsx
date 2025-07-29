import { Button } from "app/components/common/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedList } from "app/components/common/feed-list";
import StaticGradient from "@/components/blocks/Backgrounds/StaticGradient/StaticGradient";

export function HomePage() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-auto">
      {/* Content - Positioned above background with proper spacing for header */}
      <div className="relative z-10 pt-16 min-h-full">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="flex flex-col items-center justify-center mb-8">
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
                  <CardTitle className="text-2xl">Explore the Feed</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Discover amazing artworks and connect with artists
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                <Button size="lg" className="w-full">
                  Explore Gallery
                </Button>
                <Button variant="outline" size="lg" className="w-full">
                  Create Art
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Feed Section */}
          <div className="w-full">
            <FeedList />
          </div>
        </div>
      </div>
    </div>
  );
}
