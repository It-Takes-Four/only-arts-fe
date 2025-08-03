import { Button } from "../common/button";
import { Bell, Search } from "lucide-react";
import { NotificationDropdown } from "../common/notification-dropdown";
import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";

interface HeaderActionsProps {
  onSearchClick?: () => void;
}

export function HeaderActions({ onSearchClick }: HeaderActionsProps) {
  const {
    notifications,
    loading,
    error,
    page,
    meta,
    setPage,
    removeNotification,
  } = useNotifications();

  const [notificationIsOpen, setNotificationIsOpen] = useState<boolean>(false)

  const toggleNotificationDropdown = () => {
    setNotificationIsOpen(!notificationIsOpen)
  }

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* Mobile Search Icon - positioned before notifications */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden h-9 w-9"
        onClick={onSearchClick}
      >
        <Search className="h-4 w-4" />
      </Button>

      {/* Notification Bell */}
      <Button variant="ghost" size="icon" className="h-9 w-9 relative gap-0" onClick={() => { toggleNotificationDropdown() }} >
        <Bell className="h-5 w-5" />
        {/* Notification dot */}
        {!loading && notifications.length > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 ml-2 bg-red-500 rounded-full"></span>
        )}

        {/* Notification dropdown */}
        <NotificationDropdown isOpen={notificationIsOpen} notifications={notifications}
          loading={loading}
          error={error}
          page={page}
          meta={meta}
          setPage={setPage}
          removeNotification={removeNotification} />
      </Button>
    </div>
  );
}
