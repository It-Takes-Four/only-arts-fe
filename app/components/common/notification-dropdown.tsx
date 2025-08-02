import { AnimatePresence, motion } from "framer-motion";
import { NotificationItem } from "./notification-item";
import { NotificationItemSkeleton } from "./notification-item-skeleton";
import type { Notification } from "app/types/notifications";

interface NotificationDropdownProps {
    notifications: Notification[]
    loading: boolean
    error: Error | null
    page: number
    meta: {
        currentPage: number;
        perPage: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    } | null
    setPage: any
    removeNotification: (id: string) => void
    isOpen: boolean;
}

export function NotificationDropdown({ isOpen, error, loading, meta, notifications, page, removeNotification, setPage }: NotificationDropdownProps) {

    const handleDropdownClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    return (
        <div className="relative">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scaleY: 0, y: -10 }}
                        animate={{ opacity: 1, scaleY: 1, y: 0 }}
                        exit={{ opacity: 0, scaleY: 0, y: -10 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.4, 0.0, 0.2, 1],
                            scaleY: { duration: 0.25 },
                            opacity: { duration: 0.2 },
                        }}
                        style={{ originY: 0 }} // Transform origin at top
                        className="absolute -right-2 top-6 w-80 bg-background border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
                        onClick={handleDropdownClick}
                    >
                        {loading && (
                            <>
                                <NotificationItemSkeleton />
                                <NotificationItemSkeleton />
                                <NotificationItemSkeleton />
                            </>
                        )}

                        {!loading && error && (
                            <div className="py-4 text-destructive">Failed to load notifications.</div>
                        )}

                        {!loading && !error && notifications.length === 0 && (
                            <div className="py-4 text-muted-foreground">You have read all notifications</div>
                        )}

                        {!loading && !error && notifications.length > 0 && (
                            notifications.map((notification, index) => (
                                <NotificationItem
                                    key={notification.id}
                                    id={notification.id}
                                    message={notification.message}
                                    index={index}
                                    createdAt={notification.createdAt}
                                    removeNotification={removeNotification}
                                />
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}