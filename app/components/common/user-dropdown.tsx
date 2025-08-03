import { Link } from "react-router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "app/components/common/button";
import { FancyThemeToggle } from "app/components/common/fancy-theme-toggle";
import { LogOut, Settings, Palette, User } from "lucide-react";
import { useState } from "react";
import { getUserInitials } from "../../utils/UtilityFunction";

interface User {
  id: string;
  email: string;
  username: string;
  profilePicture: string | null;
  profilePictureFileId: string | null;
  artist: any | null;
}

interface UserDropdownProps {
  user: User | null | undefined;
  onLogout: () => void;
}

export function UserDropdown({ user, onLogout }: UserDropdownProps) {
  const [imageError, setImageError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getProfileImageUrl = () => {
    if (user?.profilePictureFileId) {
      return `${import.meta.env.VITE_API_BASE_URL}/upload/profile/${user.profilePictureFileId}`;
    }
    return null;
  };

  const handleLogout = () => {
    //console.log('UserDropdown logout clicked');
    setIsOpen(false); // Close dropdown immediately
    onLogout();
  };

  //console.log("This is user's artist", user?.artist)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="cursor-pointer relative h-10 w-10 rounded-full bg-primary border-2 border-border text-primary-foreground overflow-hidden p-0">
          {getProfileImageUrl() && !imageError ? (
            <img
              src={getProfileImageUrl()!}
              alt={user?.username}
              className="w-full h-full rounded-full object-cover absolute inset-0"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">
                {getUserInitials(user?.username || '')}
              </span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.username}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Fancy Theme Toggle - Always visible */}
        <DropdownMenuItem className="px-2 py-1">
          <FancyThemeToggle variant="minimal" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {/* Profile Link */}
        {
          user?.artist && (
            <DropdownMenuItem>
              <Link to="/profile" className="flex items-center gap-2 w-full">
                <User className="h-4 w-4"/>
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
          )
        }
        
        {/* Artist Registration */}
        {!user?.artist && (
          <>
            <DropdownMenuItem>
              <Link to="/become-artist" className="flex items-center gap-2 w-full">
                <Palette className="h-4 w-4" />
                <span>Become an Artist</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
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
  );
}
