import { Bell } from "lucide-react";
import { useNotifications } from "../features/notifications/context/NotificationContext.jsx";

const NotificationBell = ({ onClick }) => {
  const { unreadCount } = useNotifications();

  return (
    <button
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
      aria-label="Notifications"
    >
      <Bell size={20} />

      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;