import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../contexts/NotificationContext";
import {
  Bell,
  Check,
  CheckCheck,
  X,
  Trash2,
  User,
  FileText,
  Settings,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
} from "lucide-react";

const NotificationDropdown = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    formatNotificationTime,
  } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case "user":
        return User;
      case "service":
        return FileText;
      case "system":
        return Settings;
      case "security":
        return AlertCircle;
      case "info":
        return Info;
      case "success":
        return CheckCircle;
      case "warning":
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "user":
        return "text-blue-400 bg-blue-400/10";
      case "service":
        return "text-green-400 bg-green-400/10";
      case "system":
        return "text-purple-400 bg-purple-400/10";
      case "security":
        return "text-red-400 bg-red-400/10";
      case "success":
        return "text-green-400 bg-green-400/10";
      case "warning":
        return "text-yellow-400 bg-yellow-400/10";
      default:
        return "text-cyan-400 bg-cyan-400/10";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 max-h-[600px] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                    >
                      <CheckCheck className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-gray-400 text-sm">
                    Loading notifications...
                  </p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">No notifications yet</p>
                  <p className="text-gray-500 text-sm mt-1">
                    You'll see updates here when they happen
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.slice(0, 10).map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    const colorClass = getNotificationColor(notification.type);

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                          !notification.isRead ? "bg-cyan-500/5" : ""
                        }`}
                        onClick={() =>
                          !notification.isRead && markAsRead(notification.id)
                        }
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p
                                  className={`text-sm ${
                                    !notification.isRead
                                      ? "text-white font-medium"
                                      : "text-gray-300"
                                  }`}
                                >
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {formatNotificationTime(
                                    notification.createdAt
                                  )}
                                </p>
                              </div>

                              <div className="flex items-center gap-1 flex-shrink-0">
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="p-1 hover:bg-red-500/20 rounded transition-colors"
                                >
                                  <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 10 && (
              <div className="p-3 border-t border-white/10 text-center">
                <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;
