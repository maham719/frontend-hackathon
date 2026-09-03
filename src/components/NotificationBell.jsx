import { Bell, CheckCheck, MessageSquareText } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../features/notifications/context/NotificationContext.jsx";
import { useAuth } from "../features/auth/context/authContext.jsx";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const openNotification = async (notification) => {
    await markAsRead(notification._id);
    setOpen(false);

    const ticketId = notification.ticket?._id || notification.ticket;
    if (!ticketId) return;

    navigate(user?.role === "agent"
      ? `/agent-dashboard/tickets/${ticketId}`
      : `/tickets/${ticketId}`);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#8d5fe5] bg-[#1b2434] text-[#f3edff] transition-colors hover:bg-[#27344a]"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <section className="absolute right-0 z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#3a4760] bg-[#111a29] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#2c3850] px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-white">Notifications</h2>
              <p className="text-xs text-[#aeb9d1]">{unreadCount ? `${unreadCount} unread` : "You're all caught up"}</p>
            </div>
            {unreadCount > 0 && (
              <button type="button" onClick={markAllAsRead} className="inline-flex items-center gap-1 text-xs font-medium text-[#cdb8ff] hover:text-white">
                <CheckCheck size={15} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <p className="px-4 py-6 text-center text-sm text-[#aeb9d1]">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-7 text-center text-sm text-[#aeb9d1]">No message notifications yet.</p>
            ) : notifications.map((notification) => (
              <button
                key={notification._id}
                type="button"
                onClick={() => openNotification(notification)}
                className={`flex w-full gap-3 border-b border-[#263248] px-4 py-3 text-left transition-colors hover:bg-[#1c2940] ${notification.isRead ? "" : "bg-[#1b2c49]"}`}
              >
                <span className="mt-0.5 rounded-lg bg-[#6d4bc8]/30 p-2 text-[#d7c4ff]"><MessageSquareText size={16} /></span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3"><strong className="text-sm text-white">{notification.title}</strong>{!notification.isRead && <i className="h-2 w-2 shrink-0 rounded-full bg-[#b68cff]" />}</span>
                  <span className="mt-1 block text-xs leading-5 text-[#bbc4d9]">{notification.message}</span>
                  <span className="mt-1 block text-[11px] text-[#8290ad]">{new Date(notification.createdAt).toLocaleString()}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default NotificationBell;
