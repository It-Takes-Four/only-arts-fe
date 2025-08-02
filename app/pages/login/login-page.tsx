import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "app/components/common/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthContext } from "app/components/core/auth-context";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { FullLogo } from "app/components/common/logo";
import LiquidChrome from "@/components/blocks/Backgrounds/LiquidChrome/LiquidChrome";
import { toast } from 'sonner';

type LoginFormData = {
	email: string;
	password: string;
};

export function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const { loginAsync, isLoggingIn, loginError } = useAuthContext();
	const navigate = useNavigate();
	const location = useLocation();

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
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginFormData) => {
		try {
			await loginAsync(data);
			toast.success('Welcome back! You have been successfully logged in.');

			// Redirect to the original page they were trying to access, or home
			const from = location.state?.from || '/';
			navigate(from, { replace: true });
		} catch (error) {
			// Error is handled by the auth context, but we can also show a toast
			toast.error('Login failed. Please check your credentials and try again.');
		}
	};

	// Custom validation - only disable if there are actual errors after user interaction
	const hasValidationErrors = Object.keys(errors).length > 0;
	const hasRequiredFields = watch("email") && watch("password");
	const isFormDisabled = isLoggingIn || hasValidationErrors || !hasRequiredFields;

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
							Welcome Back
						</CardTitle>
						<CardDescription>
							Sign in to your account to continue
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 min-w-md">
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
								disabled={isLoggingIn}
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

						{loginError && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4"/>
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
									<Loader2 className="mr-2 h-4 w-4 animate-spin"/>
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
	);
}