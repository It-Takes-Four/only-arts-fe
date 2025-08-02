export enum NotificationType {
    arts,
    collections,
    payments
}

export interface Notification {
    id: string
    message: string
    notificationItemId?: string
    notificationType: NotificationType
    createdAt: Date
}

export interface PaginatedNotificationResponse{
    data: Notification[]
    pagination: {
        currentPage: number;
        perPage: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}