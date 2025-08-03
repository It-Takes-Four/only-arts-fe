import { Button } from "app/components/common/button";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from "lucide-react";
import { useAuthContext } from "app/components/core/auth-context";
import { userService } from "app/services/user-service";
import { authService } from "app/services/auth-service";
import { artistService } from "app/services/artist-service";
import { debugCookies, getCookie } from "app/utils/cookie";
import { FancyThemeToggle } from "app/components/common/fancy-theme-toggle";
import { useNavigate } from "react-router";
import { PaymentButton } from "app/components/common/payment-button";
import { useState } from "react";
import { BuyCollectionModal } from "../../components/features/collection/buy-collection-modal";

export default function DevTestPage() {
  const { user, isAuthenticated, login, loginAsync, logout, isLoggingIn } = useAuthContext();
  const navigate = useNavigate();

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
      //console.log('Starting login test...');
      debugCookies(); // Check before login
      
      await loginAsync({
        email: "user@example.com",
        password: "securePass1"
      });
      
      toast.success("Login successful! (No redirect in dev test)");
      
      // Check cookies after login
      setTimeout(() => {
        //console.log('Checking cookies after login...');
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
    //console.log('=== AUTH DEBUG ===');
    //console.log('isAuthenticated:', isAuthenticated);
    //console.log('user:', user);
    //console.log('isLoading:', isLoggingIn);
    debugCookies();
    const token = getCookie('auth_token');
    toast.info(`Debug: Token ${token ? 'exists' : 'missing'}`);
  };

  const testLogout = () => {
    //console.log('testLogout called from dev-test');
    //console.log('Current user before logout:', user);
    //console.log('Current isAuthenticated before logout:', isAuthenticated);
    
    logout();
    
    toast.info("Logged out successfully");
    
    // Check state after logout
    setTimeout(() => {
      //console.log('User after logout:', user);
      //console.log('isAuthenticated after logout:', isAuthenticated);
      debugCookies();
    }, 500);
  };

  const testDirectUserService = async () => {
    try {
      toast.loading("Testing direct user service call...");
      const userData = await userService.getCurrentUser();
      toast.success("Direct user service call successful!");
      //console.log("User data from direct service call:", userData);
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
      //console.log("User data from direct auth service call:", userData);
    } catch (error) {
      toast.error("Direct auth service call failed");
      console.error("Direct auth service error:", error);
    }
  };

  // Artist Testing Functions
  const testArtistRegistration = async () => {
    try {
      toast.loading("Testing artist registration...");
      const artistData = {
        artistName: "Test Artist " + Math.random().toString(36).substring(7),
        bio: "This is a test artist bio for development testing.",
        isNsfw: false
      };
      
      const response = await artistService.registerAsArtist(artistData);
      toast.success("Artist registration successful!");
      //console.log("Artist registration response:", response);
    } catch (error: any) {
      toast.error(error.message || "Artist registration failed");
      console.error("Artist registration error:", error);
    }
  };

  const testGetArtistProfile = async () => {
    try {
      toast.loading("Testing get artist profile...");
      const profile = await artistService.getMyArtistProfile();
      toast.success("Get artist profile successful!");
      //console.log("Artist profile:", profile);
    } catch (error: any) {
      toast.error(error.message || "Get artist profile failed");
      console.error("Get artist profile error:", error);
    }
  };

  const checkArtistStatus = () => {
    //console.log('=== ARTIST STATUS DEBUG ===');
    //console.log('User:', user);
    //console.log('User artist:', user?.artist);
    //console.log('Can become artist:', isAuthenticated && user && !user.artist);
    //console.log('Is already artist:', user?.artist !== null);
    
    if (user?.artist) {
      toast.info(`Already an artist: ${user.artist.artistName || 'No name set'}`);
    } else if (isAuthenticated && user) {
      toast.info("Can become an artist!");
    } else {
      toast.info("Not authenticated - cannot check artist status");
    }
  };

  const navigateToBecomeArtist = () => {
    if (!isAuthenticated) {
      toast.warning("Please login first");
      navigate('/login?returnTo=/become-artist');
    } else if (user?.artist) {
      toast.info("You're already an artist!");
      navigate('/profile');
    } else {
      navigate('/become-artist');
    }
  };

  const debugWalletConnection = () => {
    //console.log('=== WALLET DEBUG (Local Mode) ===');
    //console.log('Note: Wallet connection works via wagmi/RainbowKit but no backend persistence');
    try {
      toast.info("Check console for wallet debug info (local mode active)");
      //console.log("Wallet debugging - backend disabled, using local session storage");
    } catch (error) {
      console.error("Wallet debug error:", error);
      toast.error("Wallet debugging failed - check console");
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
                {isLoggingIn ? "Logging in..." : "Test Login"}
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

      {/* Artist Testing Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Artist Testing</h2>
        
        <div className="p-4 border rounded-lg bg-card">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Artist Status:</p>
              <p className="text-sm text-muted-foreground">
                {user?.artist ? `✅ Artist: ${user.artist.artistName || 'No name set'}` : 
                 isAuthenticated ? "❌ Not an Artist" : "🔒 Not Authenticated"}
              </p>
            </div>
            
            {user?.artist && (
              <div>
                <p className="text-sm font-medium">Artist Data:</p>
                <pre className="text-xs bg-muted p-2 rounded mt-1">
                  {JSON.stringify(user.artist, null, 2)}
                </pre>
              </div>
            )}
            
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={checkArtistStatus} 
                variant="outline"
                size="sm"
              >
                Check Artist Status
              </Button>
              
              <Button 
                onClick={navigateToBecomeArtist}
                disabled={!isAuthenticated}
                variant={user?.artist ? "secondary" : "default"}
                size="sm"
              >
                {user?.artist ? "Go to Profile" : "Become an Artist"}
              </Button>
            </div>

            <div className="flex gap-2 flex-wrap mt-2">
              <Button 
                onClick={testArtistRegistration} 
                disabled={!isAuthenticated || !!user?.artist}
                variant="secondary"
                size="sm"
              >
                Test Artist Registration
              </Button>
              
              <Button 
                onClick={testGetArtistProfile} 
                disabled={!isAuthenticated || !user?.artist}
                variant="secondary"
                size="sm"
              >
                Test Get Artist Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Testing Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Theme Testing</h2>
        
        <div className="p-4 border rounded-lg bg-card">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-4">Theme Toggle Variants:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Default</p>
                  <FancyThemeToggle variant="default" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Minimal</p>
                  <FancyThemeToggle variant="minimal" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Gradient</p>
                  <FancyThemeToggle variant="gradient" />
                </div>
              </div>
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

        <PaymentButton collectionId="3c94d7cd-8f8f-4973-a331-5f3a10dee4a9" artistWalletAddress="0xe39a19f4339A808B0Cd4e60CB98aC565698467FB"/>
        
        {/* Test Buy Collection Button */}
        <div className="mt-4 p-4 border rounded-lg bg-card">
          <h4 className="font-medium mb-2">Collection Purchase Test</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Test the buy collection modal with sample data
          </p>
          <TestBuyCollectionButton />
        </div>

        {/* Test Artist Artworks Button */}
        <div className="mt-4 p-4 border rounded-lg bg-card">
          <h4 className="font-medium mb-2">Artist Artworks Test</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Test the artist artworks API endpoint
          </p>
          <TestArtistArtworksButton />
        </div>
      </div>
    </div>
  );
}

// Test component for artist artworks functionality
function TestArtistArtworksButton() {
  const testArtistId = "19fa5cf6-e344-474a-8eaa-98b5f1d85b1a"; // Sample artist ID

  const testArtistArtworks = async () => {
    try {
      toast.loading("Testing artist artworks API...");
      const { artistService } = await import("app/services/artist-service");
      const artworks = await artistService.getArtistArtworks(testArtistId);
      toast.success(`Successfully loaded ${artworks.length} artworks!`);
      //console.log("Artist artworks:", artworks);
    } catch (error: any) {
      toast.error(error.message || "Failed to load artist artworks");
      console.error("Artist artworks error:", error);
    }
  };

  return (
    <div className="space-y-2">
      <Button onClick={testArtistArtworks} className="w-full">
        Test Load Artist Artworks
      </Button>
      <p className="text-xs text-muted-foreground">
        Testing with artist ID: {testArtistId}
      </p>
    </div>
  );
}

// Test component for buy collection functionality
function TestBuyCollectionButton() {
  const [showModal, setShowModal] = useState(false);
  
  const sampleCollection = {
    id: "test-collection-id",
    collectionName: "Test Collection",
    description: "This is a sample collection for testing the purchase functionality.",
    coverImageFileId: "sample-image-id",
    price: "5.99",
    tokenId: "123456",
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    artistId: "test-artist-id",
    artist: {
      id: "test-artist-id",
      artistName: "Test Artist",
      isVerified: true,
      walletAddress: "0xe39a19f4339A808B0Cd4e60CB98aC565698467FB",
      user: {
        username: "testartist",
        profilePictureFileId: null
      }
    },
    artsCount: 5
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)} className="w-full">
        Test Buy Collection Modal
      </Button>
      
      {/* Import and use the modal */}
      <BuyCollectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        collection={sampleCollection}
        onSuccess={() => {
          //console.log('Test purchase successful');
          toast.success('Test purchase completed!');
        }}
      />
    </>
  );
}
