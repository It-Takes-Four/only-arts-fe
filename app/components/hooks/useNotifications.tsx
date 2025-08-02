import { useState, useEffect, useCallback } from "react";
import type { Notification, PaginatedNotificationResponse } from "app/types/notifications";
import { NotificationService } from "app/services/notification-service";

const notificationService = new NotificationService();

export function useNotifications(initialPage = 1, initialLimit = 10) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [meta, setMeta] = useState<PaginatedNotificationResponse["pagination"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationService.getMyNotifications(page, limit);
      setNotifications(res.data);
      setMeta(res.pagination);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const removeNotification = useCallback(
    async (id: string) => {
      try {
        await notificationService.removeNotification(id);
        // Re-fetch after deletion
        await fetchNotifications();
      } catch (err) {
        setError(err as Error);
      }
    },
    [fetchNotifications]
  );

  return {
    notifications,
    loading,
    error,
    page,
    limit,
    meta,
    setPage,
    setLimit,
    refetch: fetchNotifications,
    removeNotification,
  };
}
