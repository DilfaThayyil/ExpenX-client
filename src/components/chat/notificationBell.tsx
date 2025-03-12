import { useState } from "react";
import { useNotifications } from "@/context/notificationContext";

const NotificationBell = () => {
  const { notifications, markNotificationsAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  const toggleDropdown = async() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      await markNotificationsAsRead();
    }
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="relative p-2 rounded-full">
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute bg-white shadow-lg mt-2 p-3 w-72 right-0 rounded-lg border z-[50]">
          <h3 className="text-emerald-600 font-semibold text-center mb-3">Notifications</h3>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`p-3 rounded-lg shadow-sm ${notif.isRead ? "bg-gray-100" : "bg-emerald-50 font-semibold"
                    }`}
                >
                  📩 You have a new message.
                </div>
              ))
            ) : (
              <p className="text-center p-2 text-gray-500">No notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
