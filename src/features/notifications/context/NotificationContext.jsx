import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import socket from "../../../services/socket.js";
import { useAuth } from "../../auth/context/authContext.jsx";
import {
  getNotificationsService,
  markAllNotificationsAsReadService,
  markNotificationAsReadService,
} from "../services/notification.service.js";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user, accessToken, restoringSession } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshNotifications = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const data = await getNotificationsService();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Fetch notifications error:", error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (restoringSession) return;

    if (!user || !accessToken) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    refreshNotifications();
  }, [user, accessToken, restoringSession, refreshNotifications]);

  useEffect(() => {
    const handleNotification = ({ notification }) => {
      if (!notification?._id) return;

      setNotifications((current) => {
        if (current.some((item) => item._id === notification._id)) return current;
        return [notification, ...current];
      });
      setUnreadCount((count) => count + (notification.isRead ? 0 : 1));
    };

    socket.on("notification", handleNotification);
    return () => socket.off("notification", handleNotification);
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    const existing = notifications.find((item) => item._id === notificationId);
    if (!existing || existing.isRead) return;

    try {
      await markNotificationAsReadService(notificationId);
      setNotifications((current) => current.map((item) =>
        item._id === notificationId ? { ...item, isRead: true } : item
      ));
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (error) {
      console.error("Mark notification read error:", error);
    }
  }, [notifications]);

  const markAllAsRead = useCallback(async () => {
    if (!unreadCount) return;

    try {
      await markAllNotificationsAsReadService();
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Mark all notifications read error:", error);
    }
  }, [unreadCount]);

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    loading,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
  }), [notifications, unreadCount, loading, refreshNotifications, markAsRead, markAllAsRead]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used inside NotificationProvider");
  return context;
};
