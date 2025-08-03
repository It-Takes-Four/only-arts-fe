import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "app/components/common/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from 'sonner';

interface ArtistAgreementPageProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function ArtistAgreementPage({ onAccept, onDecline }: ArtistAgreementPageProps) {
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToGuidelines, setAgreeToGuidelines] = useState(false);
  const navigate = useNavigate();

  const canProceed = hasReadTerms && agreeToTerms && agreeToGuidelines;

  const handleAccept = () => {
    if (!canProceed) {
      toast.error("Please read and agree to all terms before proceeding");
      return;
    }
    onAccept();
  };

  const handleDecline = () => {
    toast.info("Artist registration cancelled");
    onDecline();
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl h-screen items-center">
      <div className="space-y-6  flex flex-col items-center justify-center">
        {/* Header */}
        <div className="text-center space-y-4 mt-12">
          <h1 className="text-3xl font-bold">Become an OnlyArts Artist</h1>
          <p className="text-muted-foreground">
            Join our community of creators and start sharing your artistic vision
          </p>
        </div>

        {/* Terms and Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Artist Terms and Conditions
            </CardTitle>
            <CardDescription>
              Please read and understand the following terms before proceeding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-64 w-full border rounded-md p-4 overflow-y-auto bg-muted/50">
              <div className="space-y-4 text-sm">
                <h3 className="font-semibold">1. Artist Responsibilities</h3>
                <p>
                  As an OnlyArts artist, you agree to upload only original content or content you have 
                  proper rights to use. You are responsible for ensuring your artwork does not infringe 
                  on any copyright, trademark, or other intellectual property rights.
                </p>

                <h3 className="font-semibold">2. Content Guidelines</h3>
                <p>
                  All artwork must comply with our community guidelines. Content should be appropriate 
                  and not contain explicit, harmful, or offensive material unless properly tagged and 
                  categorized.
                </p>

                <h3 className="font-semibold">3. Revenue Sharing</h3>
                <p>
                  OnlyArts operates on a revenue-sharing model. Artists retain ownership of their work 
                  while the platform takes a commission on sales and tips. Detailed terms will be 
                  provided in your artist dashboard.
                </p>

                <h3 className="font-semibold">4. Account Verification</h3>
                <p>
                  Your artist account may require verification through various means including identity 
                  verification, portfolio review, or community endorsement.
                </p>

                <h3 className="font-semibold">5. Platform Rights</h3>
                <p>
                  OnlyArts reserves the right to moderate content, suspend accounts for violations, 
                  and update these terms as needed. We are committed to supporting artists while 
                  maintaining a safe and creative environment.
                </p>

                <h3 className="font-semibold">6. Intellectual Property</h3>
                <p>
                  You retain full ownership of your original artwork. By uploading content, you grant 
                  OnlyArts a license to display, promote, and distribute your work through our platform.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  id="read-terms" 
                  checked={hasReadTerms}
                  onChange={(e) => setHasReadTerms(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="read-terms" className="text-sm font-medium">
                  I have read and understood the terms and conditions
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  id="agree-terms" 
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  disabled={!hasReadTerms}
                  className="h-4 w-4"
                />
                <label htmlFor="agree-terms" className="text-sm font-medium">
                  I agree to the Artist Terms and Conditions
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  id="agree-guidelines" 
                  checked={agreeToGuidelines}
                  onChange={(e) => setAgreeToGuidelines(e.target.checked)}
                  disabled={!hasReadTerms}
                  className="h-4 w-4"
                />
                <label htmlFor="agree-guidelines" className="text-sm font-medium">
                  I agree to follow the Community Guidelines
                </label>
              </div>
            </div>

            {!canProceed && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Please read the terms and check all required boxes to continue.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleDecline}
            className="min-w-32"
          >
            Cancel
          </Button>
          <Button 
            size="lg" 
            onClick={handleAccept}
            disabled={!canProceed}
            className="min-w-32"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Accept & Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
