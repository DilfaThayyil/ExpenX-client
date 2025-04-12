export interface Notification {
    _id: string;
    senderId: string;
    receiverId: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationContextProps {
    notifications: Notification[];
    markNotificationsAsRead: () => void;
}