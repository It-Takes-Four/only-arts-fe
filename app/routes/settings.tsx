import { Button } from "app/components/common/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FancyThemeToggle } from "app/components/common/fancy-theme-toggle";

export function meta() {
  return [
    { title: "OnlyArts - Settings" },
    { name: "description", content: "Manage your OnlyArts account settings" },
  ];
}

export default function Settings() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account preferences and profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Profile Picture</label>
              <Button variant="outline">Change Picture</Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Your display name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border rounded-md"
                placeholder="your.email@example.com"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Customize your OnlyArts experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Theme</label>
              <FancyThemeToggle variant="default" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
