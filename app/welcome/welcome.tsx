import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Welcome() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Welcome to OnlyArts
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Your creative platform for artistic expression and community
          </p>
        </div>
        
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Explore the features and begin your artistic journey
            </CardDescription>
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
    </div>
  );
}