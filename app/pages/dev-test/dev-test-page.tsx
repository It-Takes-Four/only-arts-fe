import { Button } from "app/components/common/button";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from "lucide-react";
import { useAuthContext } from "app/components/core/auth-context";
import { userService } from "app/services/user-service";
import { authService } from "app/services/auth-service";
import { debugCookies, getCookie } from "app/utils/cookie";

export default function DevTestPage() {
  const { user, isAuthenticated, login, loginAsync, logout, isLoggingIn } = useAuthContext();

  const testToasts = () => {
    // Test different toast types
    toast.success("Success! This is a success message.");
    
    setTimeout(() => {
      toast.error("Error! Something went wrong.");
    }, 500);
    
    setTimeout(() => {
      toast.warning("Warning! Please check this out.");
    }, 1000);
    
    setTimeout(() => {
      toast.loading("Loading... Please wait.");
    }, 1500);
    
    setTimeout(() => {
      toast.info("Info: Here's some information for you.");
    }, 2000);
  };

  const testIndividualToasts = {
    success: () => toast.success("Success toast test!"),
    error: () => toast.error("Error toast test!"),
    warning: () => toast.warning("Warning toast test!"),
    loading: () => {
      const loadingToast = toast.loading("Loading test...");
      setTimeout(() => {
        toast.success("Loading complete!", { id: loadingToast });
      }, 2000);
    },
    info: () => toast.info("Info toast test!")
  };

  const testLogin = async () => {
    try {
      console.log('Starting login test...');
      debugCookies(); // Check before login
      
      await loginAsync({
        email: "user@example.com",
        password: "securePass1"
      });
      
      toast.success("Login successful! (No redirect in dev test)");
      
      // Check cookies after login
      setTimeout(() => {
        console.log('Checking cookies after login...');
        debugCookies();
        const token = getCookie('auth_token');
        toast.info(`Token saved: ${token ? 'Yes' : 'No'}`);
      }, 500);
    } catch (error) {
      toast.error("Login failed in dev test");
      console.error("Login error:", error);
    }
  };

  const debugAuth = () => {
    console.log('=== AUTH DEBUG ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);
    console.log('isLoading:', isLoggingIn);
    debugCookies();
    const token = getCookie('auth_token');
    toast.info(`Debug: Token ${token ? 'exists' : 'missing'}`);
  };

  const testLogout = () => {
    logout();
    toast.info("Logged out successfully");
  };

  const testDirectUserService = async () => {
    try {
      toast.loading("Testing direct user service call...");
      const userData = await userService.getCurrentUser();
      toast.success("Direct user service call successful!");
      console.log("User data from direct service call:", userData);
    } catch (error) {
      toast.error("Direct user service call failed");
      console.error("Direct user service error:", error);
    }
  };

  const testDirectAuthService = async () => {
    try {
      toast.loading("Testing direct auth service call...");
      const userData = await authService.getCurrentUser();
      toast.success("Direct auth service call successful!");
      console.log("User data from direct auth service call:", userData);
    } catch (error) {
      toast.error("Direct auth service call failed");
      console.error("Direct auth service error:", error);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Dev Test Page</h1>
        <p className="text-muted-foreground">Test various components and functionality</p>
      </div>

      {/* Auth Testing Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Authentication Testing</h2>
        
        <div className="p-4 border rounded-lg bg-card">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Authentication Status:</p>
              <p className="text-sm text-muted-foreground">
                {isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}
              </p>
            </div>
            
            {user && (
              <div>
                <p className="text-sm font-medium">Current User:</p>
                <pre className="text-xs bg-muted p-2 rounded mt-1">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={testLogin} 
                disabled={isLoggingIn || isAuthenticated}
                variant="default"
              >
                {isLoggingIn ? "Logging in..." : "Test Login (admin@admin.com)"}
              </Button>
              
              <Button 
                onClick={testLogout} 
                disabled={!isAuthenticated}
                variant="outline"
              >
                Test Logout
              </Button>
            </div>

            <div className="flex gap-2 mt-2">
              <Button 
                onClick={testDirectUserService} 
                disabled={!isAuthenticated}
                variant="secondary"
                size="sm"
              >
                Test User Service Direct
              </Button>
              
              <Button 
                onClick={testDirectAuthService} 
                disabled={!isAuthenticated}
                variant="secondary"
                size="sm"
              >
                Test Auth Service Direct
              </Button>

              <Button 
                onClick={debugAuth} 
                variant="outline"
                size="sm"
              >
                Debug Auth State
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Testing Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Toast Testing</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button onClick={testToasts} className="w-full">
            Test All Toasts (Sequence)
          </Button>
          
          <Button onClick={testIndividualToasts.success} variant="default" className="w-full">
            Success Toast
          </Button>
          
          <Button onClick={testIndividualToasts.error} variant="destructive" className="w-full">
            Error Toast
          </Button>
          
          <Button onClick={testIndividualToasts.warning} variant="secondary" className="w-full">
            Warning Toast
          </Button>
          
          <Button onClick={testIndividualToasts.loading} variant="outline" className="w-full">
            Loading Toast
          </Button>
          
          <Button onClick={testIndividualToasts.info} variant="ghost" className="w-full">
            Info Toast
          </Button>
        </div>
      </div>

      {/* Color Palette Preview */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Color Palette (CSS Variables)</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-16 bg-primary rounded-lg border"></div>
            <p className="text-sm text-center">Primary</p>
          </div>
          
          <div className="space-y-2">
            <div className="h-16 bg-destructive rounded-lg border"></div>
            <p className="text-sm text-center">Destructive</p>
          </div>
          
          <div className="space-y-2">
            <div className="h-16 bg-secondary rounded-lg border"></div>
            <p className="text-sm text-center">Secondary</p>
          </div>
          
          <div className="space-y-2">
            <div className="h-16 bg-muted rounded-lg border"></div>
            <p className="text-sm text-center">Muted</p>
          </div>
        </div>
      </div>

      {/* Glass Effect Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Glass Effect Examples</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Glass Card 1</h3>
            <p className="text-muted-foreground">This card uses bg-card/50 with backdrop-blur-md</p>
          </div>
          
          <div className="bg-background/80 backdrop-blur-sm border border-border/30 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Glass Card 2</h3>
            <p className="text-muted-foreground">This card uses bg-background/80 with backdrop-blur-sm</p>
          </div>
        </div>
      </div>
    </div>
  );
}
