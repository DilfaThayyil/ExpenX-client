import { createContext, useContext, useEffect, useState } from "react";
import { getNotification, markAllNotificationsAsRead } from "@/services/chat/chatServices";
import { socket,initializeSocket } from "@/socket/socket";
import Store from "@/store/store";

interface Notification {
    _id: string;
    senderId: string;
    receiverId: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

interface NotificationContextProps {
    notifications: Notification[];
    markNotificationsAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextProps>({
    notifications: [],
    markNotificationsAsRead: () => {},
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const loggedInUserId = Store((state) => state.user?._id)
    useEffect(() => {
        if (!loggedInUserId) return;
        initializeSocket()
        const fetchNotifications = async () => {
            try {
                const res = await getNotification(loggedInUserId);
                setNotifications(res);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, [loggedInUserId]);

    useEffect(() => {
        if (!socket || !loggedInUserId) {
            console.error("Socket is undefined or user is not logged in");
            return;
        }

        const notificationListener = (notification: Notification) => {
            setNotifications((prev) => {
                if (!prev.some((n) => n._id === notification._id)) {
                    return [...prev, notification];
                }
                return prev;
            });
        };

        socket.on("new_notification", notificationListener);

        return () => {
            socket.off("new_notification", notificationListener);
        };
    }, [loggedInUserId]); 

    const markNotificationsAsRead = async () => {
        if (!loggedInUserId) return;

        try {
            await markAllNotificationsAsRead(loggedInUserId);
            setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications
        , markNotificationsAsRead 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
