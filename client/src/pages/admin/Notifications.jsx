import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useAdminNotifications } from "../../hooks/useApi";
import {
  Bell,
  Check,
  X,
  Filter,
  Search,
  MoreVertical,
  Archive,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  Mail,
  MessageSquare,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  User,
  DollarSign,
  FileText,
  Activity,
  Zap,
  Calendar,
  Star,
  ArrowUpRight,
} from "lucide-react";

const Notifications = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
  });

  // Use the admin notifications API hook
  const {
    notifications,
    loading,
    createNotification,
    deleteNotification,
    markAsRead,
    markAllAsRead,
  } = useAdminNotifications();

  // If no data from API, show loading or empty state

  // Handle creating new notification
  const handleCreateNotification = async () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await createNotification(newNotification);

      // Reset form
      setNewNotification({
        title: "",
        message: "",
        type: "info",
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error("Failed to create notification:", error);
    }
  };

  const deleteSelectedNotifications = () => {
    setNotifications((prev) =>
      prev.filter(
        (notification) => !selectedNotifications.includes(notification.id)
      )
    );
    setSelectedNotifications([]);
  };

  const toggleNotificationSelection = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id)
        ? prev.filter((notifId) => notifId !== id)
        : [...prev, id]
    );
  };

  const notificationTypes = [
    { id: "all", label: "All Notifications", count: notifications.length },
    {
      id: "unread",
      label: "Unread",
      count: notifications.filter((n) => !n.read).length,
    },
    {
      id: "system",
      label: "System",
      count: notifications.filter((n) => n.type === "system").length,
    },
    {
      id: "user",
      label: "User",
      count: notifications.filter((n) => n.type === "user").length,
    },
    {
      id: "security",
      label: "Security",
      count: notifications.filter((n) => n.type === "security").length,
    },
    {
      id: "payment",
      label: "Payment",
      count: notifications.filter((n) => n.type === "payment").length,
    },
  ];

  const priorityColors = {
    critical: "text-red-400 bg-red-400/10 border-red-400/20",
    high: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    low: "text-green-400 bg-green-400/10 border-green-400/20",
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "critical":
        return <AlertTriangle className="w-5 h-5" />;
      case "high":
        return <Zap className="w-5 h-5" />;
      case "medium":
        return <Info className="w-5 h-5" />;
      case "low":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && !notification.read) ||
      notification.type === activeTab;

    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const NotificationCard = ({ notification }) => {
    const Icon = notification.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-black/50 backdrop-blur-xl border rounded-2xl p-10 lg:p-12 hover:bg-white/5 transition-all duration-300 group ${
          notification.read ? "border-white/10" : "border-cyan-400/30"
        }`}
      >
        <div className="flex items-start gap-6">
          {/* Icon */}
          <div
            className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              notification.priority === "critical"
                ? "bg-red-400/20"
                : notification.priority === "high"
                ? "bg-orange-400/20"
                : notification.priority === "medium"
                ? "bg-yellow-400/20"
                : "bg-green-400/20"
            }`}
          >
            <Icon
              className={`w-8 h-8 ${
                notification.priority === "critical"
                  ? "text-red-400"
                  : notification.priority === "high"
                  ? "text-orange-400"
                  : notification.priority === "medium"
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3
                    className={`text-xl font-bold ${
                      notification.read ? "text-white" : "text-cyan-400"
                    }`}
                  >
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                  )}
                </div>
                <p className="text-gray-400 text-base mb-3 leading-relaxed">
                  {notification.message}
                </p>
                <div className="flex items-center gap-4 text-base text-gray-500">
                  <span>{notification.category}</span>
                  <span>•</span>
                  <span>{formatTimestamp(notification.timestamp)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 ml-6">
                <div
                  className={`px-4 py-2 rounded-full text-base font-medium border ${
                    priorityColors[notification.priority]
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(notification.priority)}
                    {notification.priority.toUpperCase()}
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-3 hover:bg-white/10 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Eye className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-3 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-400" />
                  </button>
                  <button className="p-3 hover:bg-white/10 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8 lg:space-y-10 max-w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-gray-400 mt-2 text-base md:text-lg">
            Stay updated with system alerts and important events
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:min-w-0 lg:w-auto">
          <div className="flex relative lg:w-80 sm:w-72 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 lg:py-4 bg-white/5 border border-white/10 rounded-lg text-base focus:outline-none focus:border-cyan-400/50 transition-colors w-full"
            />
          </div>

          <button className="p-3 lg:p-4 hover:bg-white/10 rounded-lg transition-colors">
            <Filter className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={markAllAsRead}
            className="px-6 py-3 lg:py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-base font-medium hover:from-cyan-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Check className="w-5 h-5" />
            Mark All Read
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 lg:py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-base font-medium hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Bell className="w-5 h-5" />
            Create Notification
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4 gap-8 lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 lg:p-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Bell className="w-10 h-10 lg:w-12 lg:h-12 text-cyan-400" />
            <div>
              <p className="text-xl lg:text-2xl font-bold text-white">
                {notifications.length}
              </p>
              <p className="text-sm lg:text-base text-gray-400">Total</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 lg:p-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Eye className="w-10 h-10 lg:w-12 lg:h-12 text-yellow-400" />
            <div>
              <p className="text-xl lg:text-2xl font-bold text-white">
                {notifications.filter((n) => !n.read).length}
              </p>
              <p className="text-sm lg:text-base text-gray-400">Unread</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 lg:p-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <AlertTriangle className="w-10 h-10 lg:w-12 lg:h-12 text-red-400" />
            <div>
              <p className="text-xl lg:text-2xl font-bold text-white">
                {
                  notifications.filter(
                    (n) => n.priority === "critical" || n.priority === "high"
                  ).length
                }
              </p>
              <p className="text-sm lg:text-base text-gray-400">Priority</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 lg:p-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Activity className="w-10 h-10 lg:w-12 lg:h-12 text-green-400" />
            <div>
              <p className="text-xl lg:text-2xl font-bold text-white">98.5%</p>
              <p className="text-sm lg:text-base text-gray-400">Uptime</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-lg border border-white/10 overflow-x-auto">
        {notificationTypes.map((type) => {
          const active = activeTab === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium transition-all whitespace-nowrap ${
                active
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {type.label}
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  active ? "bg-white/20" : "bg-gray-600"
                }`}
              >
                {type.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-8"
      >
        {filteredNotifications.length > 0 ? (
          <AnimatePresence>
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Bell className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">
              No notifications found
            </h3>
            <p className="text-gray-400 text-lg">
              {searchQuery
                ? "No notifications match your search criteria."
                : "You're all caught up! No new notifications."}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/95 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-10 lg:p-12 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                Create New Notification
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-3 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-base font-medium text-gray-300 mb-3">
                  Title *
                </label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) =>
                    setNewNotification((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                  placeholder="Enter notification title"
                  required
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-300 mb-3">
                  Message *
                </label>
                <textarea
                  rows={4}
                  value={newNotification.message}
                  onChange={(e) =>
                    setNewNotification((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                  placeholder="Enter notification message"
                  required
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-300 mb-3">
                  Type
                </label>
                <select
                  value={newNotification.type}
                  onChange={(e) =>
                    setNewNotification((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  onClick={handleCreateNotification}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white font-medium hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Bell className="w-5 h-5" />
                  {loading ? "Creating..." : "Create Notification"}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
