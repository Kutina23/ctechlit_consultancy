import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { useApi } from "../hooks/useApi";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const { get, post, put, delete: deleteRequest } = useApi();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Use admin routes for admin users, client routes for client users
      const route =
        user.role === "admin"
          ? "/admin/notifications"
          : "/client/notifications";
      const response = await get(route);
      if (response.status === "Success") {
        setNotifications(response.data.notifications || []);
        // Calculate unread count from notifications
        const unreadCount =
          response.data.notifications?.filter((n) => !n.is_read && !n.read)
            .length || 0;
        setUnreadCount(unreadCount);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        // Use admin routes for admin users, client routes for client users
        const route =
          user.role === "admin"
            ? `/admin/notifications/${notificationId}/read`
            : `/client/notifications/${notificationId}/read`;
        await put(route);

        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId
              ? { ...notif, is_read: true, read: true, read_at: new Date() }
              : notif
          )
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    [user?.role]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      // Use admin routes for admin users, client routes for client users
      if (user.role === "admin") {
        // Use the bulk mark endpoint for admin
        await put("/admin/notifications/mark-all-read");
      } else {
        // For client users, mark each notification individually
        const unreadNotifications = notifications.filter(
          (n) => !n.is_read && !n.read
        );
        await Promise.all(
          unreadNotifications.map((notif) =>
            put(`/client/notifications/${notif.id}/read`)
          )
        );
      }

      setNotifications((prev) =>
        prev.map((notif) => ({
          ...notif,
          is_read: true,
          read: true,
          read_at: new Date(),
        }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, [put, user?.role]);

  // Create notification (for admin functions)
  const createNotification = useCallback(async (notificationData) => {
    try {
      // Note: There's no create notification endpoint, this would need to be implemented
      console.warn("Create notification not implemented on server");
      return { success: false, message: "Not implemented" };
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }, []);

  // Add new notification to the list (for real-time updates)
  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (!notification.isRead) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      // Note: There's no delete notification endpoint on the server
      console.warn("Delete notification not implemented on server");

      // For now, just remove from local state
      setNotifications((prev) => {
        const notif = prev.find((n) => n.id === notificationId);
        if (notif && !notif.is_read) {
          setUnreadCount((count) => Math.max(0, count - 1));
        }
        return prev.filter((n) => n.id !== notificationId);
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }, []);

  // Initial fetch and polling for updates
  useEffect(() => {
    if (user) {
      fetchNotifications();

      // Poll for new notifications every 60 seconds (reduced for development)
      const interval = setInterval(fetchNotifications, 60000);

      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  // Format notification time
  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      // 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    isOpen,
    setIsOpen,
    markAsRead,
    markAllAsRead,
    createNotification,
    addNotification,
    deleteNotification,
    fetchNotifications,
    formatNotificationTime,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
