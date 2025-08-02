import type { PaginatedNotificationResponse } from "app/types/notifications";
import BaseService from "./base-service";

const SERVICE_PREFIX = "notifications"

export class NotificationService extends BaseService {

    async getMyNotifications(page = 1, limit = 10): Promise<PaginatedNotificationResponse> {
        try {
            const { data } = await this._axios.get<PaginatedNotificationResponse>(`/${SERVICE_PREFIX}/my?page=${page}&limit=${limit}`)

            return data
        } catch (error) {
            console.error('Error fetching active user notifications:', error);
            throw error;
        }
    }

    async removeNotification(notificationId: string) {
        try {
            const response = this._axios.delete(`${SERVICE_PREFIX}/${notificationId}`)
            return response
        } catch (error) {
            console.error('Error removing notification:', error);
            throw error;
        }
    }
}