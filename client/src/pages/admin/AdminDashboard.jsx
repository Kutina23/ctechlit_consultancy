import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAdminDashboard, useAdminRequests } from "../../hooks/useApi";
import {
  Users,
  FileText,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  MoreVertical,
  Download,
  Filter,
  Search,
  Zap,
  Mail,
  Bell,
  BarChart3,
  ArrowUpRight,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { dashboardData, loading: dashboardLoading } = useAdminDashboard();
  const { requests, loading: requestsLoading } = useAdminRequests(1, 10);

  // Calculate stats from API data
  const stats = [
    {
      title: "Total Users",
      value: dashboardData?.totalUsers?.toLocaleString() || "0",
      description: "Registered clients",
      icon: Users,
      color: "from-cyan-400 to-blue-500",
      bgColor: "from-cyan-500/10 to-blue-500/10",
    },
    {
      title: "Total Requests",
      value: dashboardData?.totalRequests?.toLocaleString() || "0",
      description: "All service requests",
      icon: FileText,
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
    },
    {
      title: "Pending Requests",
      value: dashboardData?.pendingRequests?.toLocaleString() || "0",
      description: "Awaiting action",
      icon: Clock,
      color: "from-orange-400 to-yellow-500",
      bgColor: "from-orange-500/10 to-yellow-500/10",
    },
    {
      title: "Completed Requests",
      value: dashboardData?.completedRequests?.toLocaleString() || "0",
      description: "Successfully delivered",
      icon: CheckCircle,
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-500/10 to-emerald-500/10",
    },
  ];

  // Transform API requests to match component structure
  const recentRequests =
    requests?.map((request) => ({
      id: request.id,
      title: request.title || `Service Request #${request.id}`,
      client: `${request.first_name} ${request.last_name}`,
      status: request.status,
      priority: request.priority || "medium",
      date: new Date(request.created_at).toLocaleDateString(),
      budget: request.budget ? `₵${request.budget.toLocaleString()}` : "TBD",
      service_name: request.service_name,
      progress: Math.floor(Math.random() * 100), // Placeholder until API provides this
    })) || [];

  const filteredRequests = recentRequests.filter((request) => {
    const matchesTab = activeTab === "all" || request.status === activeTab;
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs = [
    { id: "all", label: "All Requests", count: recentRequests.length },
    {
      id: "pending",
      label: "Pending",
      count: recentRequests.filter((r) => r.status === "pending").length,
    },
    {
      id: "in_progress",
      label: "In Progress",
      count: recentRequests.filter((r) => r.status === "in_progress").length,
    },
    {
      id: "completed",
      label: "Completed",
      count: recentRequests.filter((r) => r.status === "completed").length,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "in_progress":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "pending":
        return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      case "in_progress":
        return <Clock className="w-5 h-5" />;
      case "pending":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <XCircle className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "low":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 max-w-full">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2 text-base md:text-lg">
            Monitor and manage your consultancy platform
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:min-w-0 lg:w-auto">
          <div className="flex relative lg:w-80 sm:w-72 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 lg:py-4 bg-white/5 border border-white/10 rounded-lg text-base focus:outline-none focus:border-cyan-400/50 transition-colors w-full"
            />
          </div>

          <button className="px-6 py-3 lg:py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-base font-medium hover:from-cyan-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4 gap-6 lg:gap-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 lg:p-8 bg-gradient-to-br ${stat.bgColor} border border-white/10 rounded-xl overflow-hidden group hover:border-white/20 transition-all duration-300 h-full`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                  </div>
                  <div className="text-right">
                    {dashboardLoading ? (
                      <div className="h-8 bg-white/10 rounded animate-pulse w-16" />
                    ) : (
                      <p className="text-xl lg:text-2xl font-bold text-white">
                        {stat.value}
                      </p>
                    )}
                  </div>
                </div>
                <h3 className="font-medium text-white mb-2 text-lg">
                  {stat.title}
                </h3>
                <p className="text-sm lg:text-base text-gray-400">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Recent Requests */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-4 bg-black/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl lg:text-2xl font-bold text-white">
                Recent Requests
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <p className="text-gray-400 text-sm lg:text-base">
                  Monitor service requests and their status
                </p>
                {/* Session Status Indicator */}
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-400 font-mono">
                    SESSION ACTIVE
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-lg border border-white/10 mb-6">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium transition-all whitespace-nowrap ${
                    active
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      active ? "bg-white/20" : "bg-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            {requestsLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="h-5 bg-white/20 rounded w-1/3 mb-3" />
                      <div className="h-4 bg-white/10 rounded w-2/3 mb-3" />
                      <div className="flex gap-3">
                        <div className="h-3 bg-white/10 rounded w-20" />
                        <div className="h-3 bg-white/10 rounded w-20" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-white/20 rounded" />
                      <div className="w-6 h-6 bg-white/20 rounded" />
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="h-2 bg-white/20 rounded-full w-1/2" />
                  </div>
                </div>
              ))
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-white group-hover:text-cyan-400 transition-colors text-base lg:text-lg">
                          {request.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(
                            request.priority
                          )}`}
                        >
                          {request.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm lg:text-base text-gray-400 mb-3">
                        {request.client}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-400">
                        <span>{request.date}</span>
                        <span>•</span>
                        <span>{request.budget}</span>
                        {request.service_name && (
                          <>
                            <span>•</span>
                            <span>{request.service_name}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {request.status !== "completed" && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm lg:text-base text-gray-300">
                          Progress
                        </span>
                        <span className="text-sm lg:text-base font-medium text-white">
                          {request.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${request.progress}%` }}
                          transition={{
                            delay: 0.5 + index * 0.1,
                            duration: 0.8,
                          }}
                          className="h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <FileText className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">
                  No requests found
                </h3>
                <p className="text-gray-400 text-base lg:text-lg">
                  {searchQuery
                    ? "No requests match your search criteria."
                    : "No service requests available."}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Sidebar Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6 lg:space-y-8"
        >
          {/* Quick Stats */}
          <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-white">
                  Quick Stats
                </h2>
                <p className="text-gray-400 text-sm lg:text-base">
                  Today's overview
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-base">New Requests</span>
                <span className="text-cyan-400 font-medium text-base">
                  {dashboardData?.newRequestsToday || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-base">Completed Today</span>
                <span className="text-green-400 font-medium text-base">
                  {dashboardData?.completedToday || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-base">Active Users</span>
                <span className="text-purple-400 font-medium text-base">
                  {dashboardData?.activeUsers || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-base">System Health</span>
                <span className="text-green-400 font-medium text-base">
                  99.9%
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-white">
                  Recent Activity
                </h2>
                <p className="text-gray-400 text-sm lg:text-base">
                  Latest system events
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-base text-white">New user registered</p>
                  <p className="text-sm text-gray-400">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-base text-white">Request completed</p>
                  <p className="text-sm text-gray-400">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-base text-white">Payment received</p>
                  <p className="text-sm text-gray-400">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-400/30 rounded-2xl p-6 lg:p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-white mb-2">
                System Status
              </h3>
              <p className="text-sm lg:text-base text-gray-300">
                All systems operational
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-base text-white">Database</span>
                <span className="text-sm text-green-400">Online</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-base text-white">API</span>
                <span className="text-sm text-green-400">Online</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-base text-white">Storage</span>
                <span className="text-sm text-green-400">Online</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
