import { Link, Outlet } from "react-router";
import { motion } from "framer-motion";
import { type ComponentType, useState } from "react";
import { useAuthContext } from "app/components/core/auth-context";
import { NavLinkItem } from "app/components/common/nav-link-item";
import { ThemeSwitcher } from "app/components/common/theme-switcher";
import { ThemeLogo } from "app/components/common/theme-logo";
import { IconLogo } from "app/components/common/logo";
import { SearchInput } from "app/components/common/search-input";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Menu, X, Settings, Bell, Compass } from "lucide-react";
import { Cog6ToothIcon, HomeIcon, MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/outline";
import { BackgroundBeams } from "@/components/blocks/Backgrounds/BackgroundBeams";

interface NavItem {
	path: string;
	label: string;
	icon: ComponentType<{ className?: string }>;
}

const navigationItems: NavItem[] = [
	{ path: "/", label: "Home", icon: HomeIcon },
	{ path: "/explore", label: "Explore", icon: Compass },
	{ path: "/profile", label: "Profile", icon: UserIcon },
];

export default function Layout() {
	const { user, logout } = useAuthContext();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const handleLogout = () => {
		logout();
	};

	const handleSearch = (value: string) => {
		// Handle search functionality
		console.log("Search:", value);
	};

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const closeSidebar = () => {
		setSidebarOpen(false);
	};

	return (
		<TooltipProvider>
			<div className="flex min-h-screen w-full">
				{/* Sidebar Overlay - Shows on both mobile and desktop */}
				{sidebarOpen && (
					<div 
						className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
						onClick={closeSidebar}
					/>
				)}

				{/* Sidebar - Overlay style for both mobile and desktop */}
				<aside className={`fixed left-0 top-0 z-50 h-screen w-[20rem] border-r bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out ${
					sidebarOpen ? 'translate-x-0' : '-translate-x-full'
				}`}>
					<div className="flex h-full flex-col">
						{/* Sidebar Header */}
						<div className="flex items-center justify-between p-4 border-b min-h-[4rem]">
							<Link to="/" className="flex items-center space-x-2" onClick={closeSidebar}>
								<ThemeLogo className="h-8" />
							</Link>
							{/* Close button */}
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={closeSidebar}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
						
						{/* Sidebar Content */}
						<div className="flex-1 overflow-y-auto p-3">
							<nav className="space-y-1">
								{navigationItems.map((item) => (
									<NavLinkItem
										key={item.path}
										to={item.path}
										icon={item.icon}
										variant="sidebar"
										onClick={closeSidebar}
									>
										{item.label}
									</NavLinkItem>
								))}
							</nav>
						</div>
					</div>
				</aside>

				{/* Main Content Area - Full width */}
				<div className="flex-1 flex flex-col w-full">
					{/* Top Navigation */}
					<header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
						{/* Left side - Hamburger and Logo */}
						<div className="flex items-center gap-4">
							<Button 
								variant="ghost" 
								size="icon" 
								className="h-9 w-9"
								onClick={toggleSidebar}
							>
								<Menu className="h-4 w-4" />
							</Button>
							
							{/* Logo - Always visible */}
							<Link to="/" className="flex items-center">
								<IconLogo className="h-6" />
							</Link>
						</div>

						{/* Center: Search Bar */}
						<div className="flex-1 flex justify-center max-w-3xl mx-auto">
							<SearchInput onSearch={handleSearch} className="w-full max-w-lg" />
						</div>

						{/* Right side - Notifications, Theme switcher and User menu */}
						<div className="flex items-center gap-2 md:gap-3">
							{/* Notification Bell */}
							<Button variant="ghost" size="icon" className="h-9 w-9 relative">
								<Bell className="h-5 w-5" />
								{/* Notification dot */}
								<span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
							</Button>
							
							<ThemeSwitcher />

							{/* User Profile Dropdown */}
							<DropdownMenu>
								<DropdownMenuTrigger>
									<Button variant="ghost" className="cursor-pointer relative h-10 w-10 rounded-full bg-primary border-2 border-border text-primary-foreground ">
										{user?.PictureId ? (
											<img
												src={`${import.meta.env.VITE_API_BASE_URL}/Account/GetThumbnail?id=${user?.PictureId}`}
												alt={user?.Name}
												className="w-full h-full rounded-full object-cover"
												onError={(e) => (e.currentTarget.src = "/placeholder-avatar.png")}
											/>
										) : (
											<div className="w-full h-full rounded-full flex items-center justify-center ">
												<span className="text-sm font-semibold">
													{user?.Name?.charAt(0)?.toUpperCase() || '?'}
												</span>
											</div>
										)}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuLabel>
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium leading-none">{user?.Name}</p>
											<p className="text-xs leading-none text-muted-foreground">{user?.Name}</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<Link to="/settings" className="flex items-center gap-2 w-full">
											<Settings className="h-4 w-4" />
											<span>Settings</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<button
											onClick={handleLogout}
											className="flex items-center gap-2 w-full text-destructive focus:text-destructive cursor-pointer border-none bg-transparent p-0 text-left"
										>
											<LogOut className="h-4 w-4" />
											<span>Log out</span>
										</button>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</header>

					{/* Main Content */}
					<main className="flex-1 overflow-hidden">
						<div className="h-full">
							<div className="fixed inset-0 z-[-1]">
								<BackgroundBeams />
							</div>
							<Outlet />
						</div>
					</main>
				</div>
			</div>
		</TooltipProvider>
	);
}