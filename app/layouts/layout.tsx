import { Link, Outlet } from "react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthContext } from "app/components/core/auth-context";
import { NavLinkItem } from "app/components/common/nav-link-item";
import { ThemeSwitcher } from "app/components/common/theme-switcher";
import { ThemeLogo } from "app/components/common/theme-logo";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LogOut, Menu, X } from "lucide-react";
import { Cog6ToothIcon, HomeIcon, MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/outline";
import LiquidChrome from "@/components/blocks/Backgrounds/LiquidChrome/LiquidChrome";

interface NavItem {
	path: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavItem[] = [
	{ path: "/", label: "Home", icon: HomeIcon },
	{ path: "/explore", label: "Explore", icon: MagnifyingGlassIcon },
	{ path: "/profile", label: "Profile", icon: UserIcon },
	{ path: "/settings", label: "Settings", icon: Cog6ToothIcon }
];

export default function Layout() {
	const [isOpen, setIsOpen] = useState(false);
	const { user, logout } = useAuthContext();

	const menuVariants = {
		open: { opacity: 1, x: 0 },
		closed: { opacity: 0, x: "-100%" },
	};

	const handleLogout = () => {
		logout();
	};

	return (
		<TooltipProvider>
			<header
				className="fixed top-0 z-50 w-full border-b border-border/75 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto px-4">
					<div className="flex h-16 items-center justify-between">
						{/* Mobile menu button and Logo */}
						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="icon"
								className="lg:hidden"
								onClick={() => setIsOpen(!isOpen)}
							>
								{isOpen ? (
									<X className="h-5 w-5"/>
								) : (
									<Menu className="h-5 w-5"/>
								)}
							</Button>

							<Link to="/" className="flex items-center space-x-2">
								<ThemeLogo />
							</Link>
						</div>

						{/* Desktop Navigation */}
						<nav className="hidden lg:flex items-center space-x-1">
							{navigationItems.map((item) => (
								<NavLinkItem
									key={item.path}
									to={item.path}
									icon={item.icon}
									className="transition-colors"
								>
									{item.label}
								</NavLinkItem>
							))}
						</nav>

						{/* Right side - Theme switcher and User menu */}
						<div className="flex items-center gap-2">
							<ThemeSwitcher/>

							{/* User Profile */}
							<div className="relative">
								<div className="flex items-center gap-3">
									<div className="hidden sm:flex flex-col items-end">
										<span className="text-sm font-medium">{user?.Name}</span>
										<span className="text-xs text-muted-foreground">@{user?.Username}</span>
									</div>

									<div
										className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-border">
										{user?.PictureId ? (
											<img
												src={`${import.meta.env.VITE_API_BASE_URL}/Account/GetThumbnail?id=${user?.PictureId}`}
												alt={user?.Name}
												className="w-full h-full rounded-full object-cover"
												onError={(e) => (e.currentTarget.src = "/placeholder-avatar.png")}
											/>
										) : (
											<span className="text-sm font-semibold">
                        {user?.Name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
										)}
									</div>

									<Button
										variant="ghost"
										size="icon"
										onClick={handleLogout}
										className="text-muted-foreground hover:text-destructive"
									>
										<LogOut className="h-4 w-4"/>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Mobile Navigation */}
				<motion.div
					initial="closed"
					animate={isOpen ? "open" : "closed"}
					variants={menuVariants}
					className="lg:hidden fixed top-16 left-0 right-0 bg-background border-b border-border shadow-lg"
				>
					<nav className="container mx-auto px-4 py-4">
						<div className="flex flex-col space-y-2">
							{navigationItems.map((item) => (
								<NavLinkItem
									key={item.path}
									to={item.path}
									className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors justify-start"
									onClick={() => setIsOpen(false)}
								>
									<div className="flex items-center gap-3">
										<item.icon className="h-5 w-5"/>
										{item.label}
									</div>
								</NavLinkItem>
							))}
						</div>
					</nav>
				</motion.div>
			</header>

			{/* <ProtectedRoute> */}
			<main className="min-h-[calc(100vh-4rem)]">
				<div className="fixed inset-0 z-[-1]">
					<div className="fixed inset-0 bg-background/50"/>
					<LiquidChrome
						baseColor={[0.125, 0.1, 0.3]}
						speed={0.1}
						amplitude={0.3}
					/>
				</div>
				<Outlet/>
			</main>
			{/* </ProtectedRoute> */}
		</TooltipProvider>
	);
}