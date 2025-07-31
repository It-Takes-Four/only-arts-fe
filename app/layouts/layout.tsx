import { Link, Outlet } from "react-router";
import { type ComponentType, useEffect, useState } from "react";
import { useAuthContext } from "app/components/core/auth-context";
import { ProtectedRoute } from "app/components/core/protected-route";
import { NavLinkItem } from "app/components/common/nav-link-item";
import { ThemeSwitcher } from "app/components/common/theme-switcher";
import { ThemeLogo } from "app/components/common/theme-logo";
import { IconLogo } from "app/components/common/logo";
import { Button } from "app/components/common/button";
import { MobileSearchOverlay } from "app/components/common/mobile-search-overlay";
import { HeaderActions } from "app/components/common/header-actions";
import { HeaderSearch } from "app/components/common/header-search";
import { UserDropdown } from "app/components/common/user-dropdown";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Menu, X } from "lucide-react";
import { HomeIcon } from "@heroicons/react/24/outline";
import { Compass, Paintbrush, ShoppingBag } from "lucide-react";
import { BackgroundBeams } from "@/components/blocks/Backgrounds/BackgroundBeams";
import { artService } from "../services/art-service";
import { useSearchContext } from "app/context/search-context";
import type { ExploreArtwork } from "app/pages/explore/core";

interface NavItem {
	path: string;
	label: string;
	icon: ComponentType<{ className?: string }>;
	artistOnly?: boolean;
}

const navigationItems: NavItem[] = [
	{ path: "/", label: "Home", icon: HomeIcon },
	{ path: "/explore", label: "Explore", icon: Compass },
	{ path: "/purchased-collections", label: "My Collections", icon: ShoppingBag },
	{
		path: "/artist-studio",
		label: "Artist Studio",
		icon: Paintbrush,
		artistOnly: true,
	},
];

export default function Layout() {
  const { user, logout } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  
  const { setSearchArtResults, setSearchCollectionResults } = useSearchContext();

	const handleLogout = () => {
		logout();
	};

  const handleSearch = async (value: string) => {
    const res = await artService.searchArtworks(value);

    const processedResults = res.arts.data.map((art: any): ExploreArtwork => ({
      id: art.id,
      title: art.title,
      description: art.description ?? '',
      imageFileId: art.imageFile?.id,
      datePosted: art.datePosted ?? new Date().toISOString(), 
      likesCount: art.likesCount ?? 0,
      isInACollection: art.isInACollection ?? false,
      artistId: art.artist?.id ?? 'unknown',
      artistName: art.artist?.artistName ?? 'Unknown Artist',
      artistProfileFileId: art.artist?.profileFileId ?? null,
      tags: art.tags ?? [],
    }));

    setSearchArtResults(processedResults);
    setSearchCollectionResults(res.collections.data); 
};

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const closeSidebar = () => {
		setSidebarOpen(false);
	};

  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
  };
  
  return (
    <ProtectedRoute>
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
					<aside
						className={`fixed left-0 top-0 z-50 h-screen w-[20rem] border-r bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out ${
							sidebarOpen ? "translate-x-0" : "-translate-x-full"
						}`}
					>
						<div className="flex h-full flex-col">
							{/* Sidebar Header */}
							<div className="flex items-center justify-between p-4 border-b min-h-[4rem]">
								<Link
									to="/"
									className="flex items-center space-x-2"
									onClick={closeSidebar}
								>
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
									{navigationItems
										.filter(
											(item) =>
												!item.artistOnly || user?.artist
										)
										.map((item) => (
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
						{/* Mobile Search Overlay */}
						<MobileSearchOverlay
							isOpen={mobileSearchOpen}
							onClose={toggleMobileSearch}
							onSearch={handleSearch}
						/>

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

								{/* Logo - Icon on mobile, Full logo on desktop */}
								<Link to="/" className="flex items-center">
									<IconLogo className="h-6 md:hidden" />
									<ThemeLogo className="hidden md:block h-8" />
								</Link>
							</div>

              {/* Center: Search Bar */}
              <HeaderSearch onSearch={handleSearch} />

							{/* Right side - Actions and User menu */}
							<div className="flex items-center gap-2">
								<HeaderActions
									onSearchClick={toggleMobileSearch}
								/>

								{/* User Profile Dropdown */}
								<UserDropdown
									user={user}
									onLogout={handleLogout}
								/>
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
		</ProtectedRoute>
	);
}
