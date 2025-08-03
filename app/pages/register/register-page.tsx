import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "app/components/common/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { FullLogo } from "app/components/common/logo";
import LiquidChrome from "@/components/blocks/Backgrounds/LiquidChrome/LiquidChrome";
import { useAuthContext } from "app/components/core/auth-context";
import { toast } from 'sonner';

type RegisterFormData = {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export function RegisterPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { registerAsync, isRegistering, registerError, isAuthenticated, user, isLoading } = useAuthContext();
	const navigate = useNavigate();
	const location = useLocation();

	// Redirect authenticated users away from register page
	useEffect(() => {
		if (!isLoading && isAuthenticated && user) {
			const intendedDestination = location.state?.from || '/';
			//console.log('RegisterPage: User already authenticated, redirecting to', intendedDestination);
			navigate(intendedDestination, { replace: true });
		}
	}, [isLoading, isAuthenticated, user, navigate, location]);

	// Show loading while checking authentication
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div>Loading...</div>
			</div>
		);
	}

	// Don't render register form if user is already authenticated
	if (isAuthenticated && user) {
		return null;
	}

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
		formState: { errors, touchedFields, dirtyFields },
	} = useForm<RegisterFormData>({
		mode: "onTouched",
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const password = watch("password");

	// Custom validation - only disable if there are actual errors after user interaction
	const hasValidationErrors = Object.keys(errors).length > 0;
	const hasRequiredFields = watch("username") && watch("email") && watch("password") && watch("confirmPassword");
	const isFormDisabled = isRegistering || hasValidationErrors || !hasRequiredFields;

	const onSubmit = async (data: RegisterFormData) => {
		try {
			await registerAsync({
				username: data.username,
				email: data.email,
				password: data.password,
				confirm_password: data.confirmPassword,
			});

			toast.success('Account created successfully! Welcome to OnlyArts!');
			// Redirect to the original page they were trying to access, or home
			const from = location.state?.from || '/';
			navigate(from, { replace: true });
		} catch (error) {
			toast.error('Registration failed. Please try again.');
			console.error("Registration failed:", error);
		}
	};

	return (
		<div className="relative min-h-screen">
			{/* Background */}
			{backgroundElement}

			<Card
				className="h-screen w-[50vw] min-w-lg shadow-lg border-border/50 bg-background flex flex-col items-center justify-center rounded-none">
				<CardHeader className="space-y-4 text-center">
					<div className="flex justify-center">
						<FullLogo className="h-12"/>
					</div>
					<div>
						<CardTitle className="text-2xl font-bold text-primary">
							Create Account
						</CardTitle>
						<CardDescription>
							Join OnlyArts and start your creative journey
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-md">
						<div className="flex flex-col space-y-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								type="text"
								placeholder="Choose a username"
								{...register("username", {
									required: "Username is required",
									minLength: {
										value: 3,
										message: "Username must be at least 3 characters",
									},
									pattern: {
										value: /^[a-zA-Z0-9_]+$/,
										message: "Username can only contain letters, numbers, and underscores",
									},
								})}
								disabled={isRegistering}
								className="h-10"
							/>
							{errors.username && (
								<p className="text-sm text-destructive">{errors.username.message}</p>
							)}
						</div>

						<div className="flex flex-col space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="Enter your email"
								{...register("email", {
									required: "Email is required",
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: "Please enter a valid email address",
									},
								})}
								disabled={isRegistering}
								className="h-10"
							/>
							{errors.email && (
								<p className="text-sm text-destructive">{errors.email.message}</p>
							)}
						</div>

						<div className="flex flex-col space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="Create a password"
									{...register("password", {
										required: "Password is required",
										minLength: {
											value: 8,
											message: "Password must be at least 8 characters",
										},
										pattern: {
											value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
											message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
										},
									})}
									disabled={isRegistering}
									className="h-10 pr-10"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
									disabled={isRegistering}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4"/>
									) : (
										<Eye className="h-4 w-4"/>
									)}
								</button>
							</div>
							{errors.password && (
								<p className="text-sm text-destructive">{errors.password.message}</p>
							)}
						</div>

						<div className="flex flex-col space-y-2">
							<Label htmlFor="confirmPassword">Confirm Password</Label>
							<div className="relative">
								<Input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									placeholder="Confirm your password"
									{...register("confirmPassword", {
										required: "Please confirm your password",
										validate: (value) =>
											value === password || "Passwords do not match",
									})}
									disabled={isRegistering}
									className="h-10 pr-10"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
									disabled={isRegistering}
								>
									{showConfirmPassword ? (
										<EyeOff className="h-4 w-4"/>
									) : (
										<Eye className="h-4 w-4"/>
									)}
								</button>
							</div>
							{errors.confirmPassword && (
								<p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
							)}
						</div>

						{registerError && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4"/>
								<AlertDescription>
									{registerError.message}
								</AlertDescription>
							</Alert>
						)}

						<Button
							type="submit"
							className="w-full h-10"
							disabled={isFormDisabled}
						>
							{isRegistering ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin"/>
									Creating Account...
								</>
							) : (
								"Create Account"
							)}
						</Button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-sm text-muted-foreground">
							Already have an account?{" "}
							<Link
								to="/login"
								className="font-medium text-primary hover:underline"
							>
								Sign in
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
