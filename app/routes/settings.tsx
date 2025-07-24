import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Theme</span>
              <select className="px-3 py-2 border rounded-md">
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email Notifications</span>
              <input type="checkbox" className="rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
