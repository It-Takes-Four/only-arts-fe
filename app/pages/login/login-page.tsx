import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { Button } from "app/components/common/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthContext } from "app/components/core/auth-context";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { FullLogo } from "app/components/common/logo";
import LiquidChrome from "@/components/blocks/Backgrounds/LiquidChrome/LiquidChrome";
import toast from 'react-hot-toast';

type LoginFormData = {
  username: string;
  password: string;
};

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { loginAsync, isLoggingIn, loginError } = useAuthContext();
  const navigate = useNavigate();

  // Memoize the background to prevent re-renders
  const backgroundElement = useMemo(() => (
    <div className="fixed inset-0 z-[-1]">
      <LiquidChrome
        baseColor={[0.125, 0.1, 0.3]}
        speed={0.1}
        amplitude={0.3}
        quality="medium"
        targetFPS={30}
      />
    </div>
  ), []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: "onTouched",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginAsync(data);
      toast.success('Welcome back! You have been successfully logged in.');
      navigate("/");
    } catch (error) {
      // Error is handled by the auth context, but we can also show a toast
      toast.error('Login failed. Please check your credentials and try again.');
      console.error("Login failed:", error);
    }
  };

  // Custom validation - only disable if there are actual errors after user interaction
  const hasValidationErrors = Object.keys(errors).length > 0;
  const hasRequiredFields = watch("username") && watch("password");
  const isFormDisabled = isLoggingIn || hasValidationErrors || !hasRequiredFields;

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      {backgroundElement}

      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg bg-background/80 backdrop-blur-sm border-border/50">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <FullLogo className="h-12" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-primary">
                Welcome Back
              </CardTitle>
              <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
                disabled={isLoggingIn}
                className="h-10"
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  disabled={isLoggingIn}
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoggingIn}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {loginError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {loginError.message}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full h-10"
              disabled={isFormDisabled}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}