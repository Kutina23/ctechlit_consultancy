import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";
import NotificationDropdown from "../common/NotificationDropdown";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Activity,
  Bell,
  Search,
  ChevronDown,
  Zap,
  Database,
  UserCheck,
  BarChart3,
  Globe,
  MessageSquare,
} from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount, isOpen, setIsOpen } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const adminMenuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
      color: "from-cyan-400 to-blue-500",
    },
    {
      title: "User Management",
      icon: Users,
      path: "/admin/users",
      color: "from-purple-400 to-pink-500",
    },
    {
      title: "Service Requests",
      icon: FileText,
      path: "/admin/requests",
      color: "from-green-400 to-teal-500",
    },
    {
      title: "Site Content",
      icon: Globe,
      path: "/admin/content",
      color: "from-orange-400 to-red-500",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      path: "/admin/analytics",
      color: "from-indigo-400 to-purple-500",
    },
    {
      title: "Notifications",
      icon: Bell,
      path: "/admin/notifications",
      color: "from-yellow-400 to-orange-500",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const SidebarContent = () => (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      className="h-full bg-black/95 backdrop-blur-xl border-r border-cyan-500/20"
    >
      {/* Logo and Title */}
      <div className="p-6 border-b border-cyan-500/20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              CTechLit
            </h1>
            <p className="text-xs text-gray-400 font-mono">ADMIN CONTROL</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {adminMenuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Link
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                    ${
                      active
                        ? "bg-gradient-to-r " +
                          item.color +
                          " text-white shadow-lg"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {active && (
                    <motion.div
                      layoutId="adminActiveTab"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-400/30"
                      initial={false}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}

                  <Icon
                    className={`w-5 h-5 relative z-10 ${
                      active
                        ? "text-white"
                        : "text-gray-400 group-hover:text-cyan-400"
                    }`}
                  />
                  <span className="font-medium relative z-10">
                    {item.title}
                  </span>

                  {active && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-cyan-500/20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-mono text-green-400">
              SYSTEM STATUS
            </span>
          </div>
          <p className="text-xs text-gray-300">All systems operational</p>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Desktop Sidebar - Fixed/Absolute positioned */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-80 z-30">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 w-80 lg:hidden">
              <SidebarContent />
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:ml-80 flex flex-col min-h-screen">
        {/* Top Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black/50 backdrop-blur-xl border-b border-cyan-500/20 px-6 py-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-300" />
              </button>

              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </h2>
                <p className="text-sm text-gray-400 font-mono">
                  Control Center • {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-cyan-400/50 transition-colors"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-300" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </div>
                  )}
                </button>
                <NotificationDropdown
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                />
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user?.firstName?.charAt(0) || "A"}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                      {user?.role?.toUpperCase()}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-xl border border-cyan-500/20 rounded-lg shadow-xl z-50"
                    >
                      <div className="p-4 border-b border-cyan-500/20">
                        <p className="text-sm font-medium text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/admin/profile"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300">
                            Settings
                          </span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-red-400"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="w-full px-6 py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
