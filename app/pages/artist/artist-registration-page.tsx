import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "app/components/core/auth-context";
import { ArtistAgreementPage } from "./artist-agreement-page";
import { ArtistRegistrationForm } from "./artist-registration-form";
import { Button } from "app/components/common/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

type RegistrationStep = 'agreement' | 'form' | 'success';

export function ArtistRegistrationPage() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('agreement');
  const [artistData, setArtistData] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const { user, refreshUserWithValidation } = useAuthContext();

  const handleRefreshUser = async () => {
    setIsRefreshing(true);
    try {
      console.log('Refreshing user state...');
      const result = await refreshUserWithValidation();
      
      if (result) {
        toast.success('User state refreshed successfully!');
        console.log('User state refreshed:', result);
      } else {
        toast.info('No authentication found, redirecting to login...');
      }
    } catch (error) {
      console.error('Failed to refresh user state:', error);
      toast.error('Failed to refresh user state. Redirecting to login...');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Check if user is already an artist
  if (user?.artist) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">You're Already an Artist!</h1>
          <p className="text-muted-foreground">
            You're already registered as an artist on OnlyArts.
          </p>
          <p className="text-sm text-muted-foreground">
            Artist Name: {user.artist.artistName || 'Not set'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button 
              onClick={() => navigate('/profile')}
              variant="default"
            >
              Go to your profile
            </Button>
            <Button 
              onClick={handleRefreshUser}
              variant="outline"
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh User State'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAgreementAccept = () => {
    setCurrentStep('form');
  };

  const handleAgreementDecline = () => {
    navigate('/');
  };

  const handleRegistrationSuccess = (artist: any) => {
    setArtistData(artist);
    setCurrentStep('success');
    
    // Redirect to profile after a short delay
    setTimeout(() => {
      navigate('/profile');
    }, 2000);
  };

  const handleRegistrationCancel = () => {
    setCurrentStep('agreement');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'agreement':
        return (
          <ArtistAgreementPage 
            onAccept={handleAgreementAccept}
            onDecline={handleAgreementDecline}
          />
        );
      
      case 'form':
        return (
          <ArtistRegistrationForm 
            onSuccess={handleRegistrationSuccess}
            onCancel={handleRegistrationCancel}
          />
        );
      
      case 'success':
        return (
          <div className="container mx-auto p-4 max-w-2xl">
            <div className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h1 className="text-3xl font-bold text-primary">Welcome, Artist!</h1>
              <p className="text-muted-foreground">
                Your artist profile has been created successfully. 
                You'll be redirected to your profile shortly.
              </p>
              {artistData && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium">Artist Name: {artistData.artistName}</p>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderStep()}
    </div>
  );
}
