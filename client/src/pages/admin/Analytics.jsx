import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useAdminAnalytics } from "../../hooks/useApi";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Eye,
  Clock,
  MapPin,
  Globe,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Target,
  Zap,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart,
} from "lucide-react";

const Analytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("overview");
  const [isExporting, setIsExporting] = useState(false);

  const { analyticsData, loading, exportAnalytics, refetch } =
    useAdminAnalytics(timeRange);

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const result = await exportAnalytics("csv");

      // Check if the result contains the expected data structure
      if (!result || !result.data || !result.data.downloadUrl) {
        throw new Error(
          "Export service is not available or returned invalid data"
        );
      }

      // Create download link
      const link = document.createElement("a");
      link.href = result.data.downloadUrl;
      link.download = `analytics-${timeRange}-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      // Show user-friendly error message
      alert(
        `Export failed: ${error.message}. Please try again later or contact support.`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };

  // Use real data or fallback to empty data if still loading
  const data = analyticsData || {
    overview: {
      totalUsers: 0,
      totalRevenue: 0,
      totalRequests: 0,
      conversionRate: 0,
      growth: {
        users: 0,
        revenue: 0,
        requests: 0,
        conversion: 0,
      },
    },
    userGrowth: [],
    revenueData: [],
    trafficSources: [],
    topPages: [],
    deviceStats: [],
    geographicData: [],
  };

  const stats = [
    {
      title: "Total Users",
      value: data.overview.totalUsers.toLocaleString(),
      change: data.overview.growth.users,
      icon: Users,
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
    },
    {
      title: "Total Revenue",
      value: `₵${Math.round(data.overview.totalRevenue).toLocaleString()}`,
      change: data.overview.growth.revenue,
      icon: DollarSign,
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-500/10 to-emerald-500/10",
    },
    {
      title: "Service Requests",
      value: data.overview.totalRequests.toLocaleString(),
      change: data.overview.growth.requests,
      icon: Activity,
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
    },
    {
      title: "Conversion Rate",
      value: `${data.overview.conversionRate}%`,
      change: data.overview.growth.conversion,
      icon: Target,
      color: "from-orange-400 to-red-500",
      bgColor: "from-orange-500/10 to-red-500/10",
    },
  ];

  const renderMetricCard = (stat, index) => {
    const Icon = stat.icon;
    const isPositive = stat.change > 0;

    return (
      <motion.div
        key={stat.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`relative p-12 lg:p-16 bg-gradient-to-br ${stat.bgColor} border border-white/10 rounded-xl overflow-hidden group hover:border-white/20 transition-all duration-300 h-full`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
            >
              <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm lg:text-base font-medium ${
                isPositive
                  ? "text-green-400 bg-green-400/10"
                  : "text-red-400 bg-red-400/10"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(stat.change)}%
            </div>
          </div>
          <div>
            <p className="text-2xl lg:text-3xl font-bold text-white mb-2">
              {stat.value}
            </p>
            <h3 className="font-medium text-gray-300 text-lg lg:text-xl">
              {stat.title}
            </h3>
          </div>
        </div>
      </motion.div>
    );
  };

  const ChartBar = ({ data, height = 200 }) => (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={item.month} className="flex items-center gap-4">
          <span className="text-base text-gray-400 w-12">{item.month}</span>
          <div className="flex-1 bg-gray-700 rounded-full h-3 relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${
                  (item.users / Math.max(...data.map((d) => d.users))) * 100
                }%`,
              }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="h-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
            />
          </div>
          <span className="text-base text-gray-300 w-16 text-right">
            {item.users}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-12 lg:space-y-16 max-w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-gray-400 mt-2 text-base md:text-lg">
            Comprehensive insights into your platform performance
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:min-w-0 lg:w-auto">
          <select
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="px-4 py-3 lg:py-4 bg-white/5 border border-white/10 rounded-lg text-base focus:outline-none focus:border-cyan-400/50 transition-colors"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-3 lg:p-4 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-400 ${
                loading ? "animate-spin" : ""
              }`}
            />
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-3 lg:py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-base font-medium hover:from-cyan-600 hover:to-purple-600 transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4 gap-10 lg:gap-12">
        {loading
          ? // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-48 bg-gray-800/50 rounded-xl animate-pulse"
              ></div>
            ))
          : stats.map((stat, index) => renderMetricCard(stat, index))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-10 lg:p-12"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">User Growth</h3>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"></div>
              <span className="text-base text-gray-400">Current</span>
              <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
              <span className="text-base text-gray-400">Target</span>
            </div>
          </div>
          <div className="space-y-6">
            {loading
              ? // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between">
                      <div className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="h-3 bg-gray-700 rounded-full animate-pulse"></div>
                  </div>
                ))
              : data.userGrowth.map((item, index) => (
                  <div key={item.month} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base text-gray-300">
                        {item.month}
                      </span>
                      <span className="text-base font-medium text-white">
                        {item.users} users
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 bg-gray-700 rounded-full h-3 relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              (item.users /
                                Math.max(
                                  ...data.userGrowth.map((d) => d.users || 0),
                                  1
                                )) *
                              100
                            }%`,
                          }}
                          transition={{ delay: index * 0.1, duration: 0.8 }}
                          className="h-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                        />
                      </div>
                      <div className="flex-1 bg-gray-800 rounded-full h-3 relative opacity-50">
                        <div
                          className="h-3 bg-gray-600 rounded-full"
                          style={{
                            width: `${
                              (item.target /
                                Math.max(
                                  ...data.userGrowth.map((d) => d.target || 0),
                                  1
                                )) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-10 lg:p-12"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">Revenue Trend</h3>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-base text-green-400">+18.3%</span>
            </div>
          </div>
          <div className="space-y-6">
            {data.revenueData.map((item, index) => (
              <div key={item.month} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base text-gray-300">{item.month}</span>
                  <span className="text-base font-medium text-white">
                    ₵{item.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 bg-gray-700 rounded-full h-3 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (item.revenue /
                            Math.max(
                              ...data.revenueData.map((d) => d.revenue || 0),
                              1
                            )) *
                          100
                        }%`,
                      }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                      className="h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                    />
                  </div>
                  <div className="flex-1 bg-gray-800 rounded-full h-3 relative opacity-50">
                    <div
                      className="h-3 bg-gray-600 rounded-full"
                      style={{
                        width: `${
                          (item.target /
                            Math.max(
                              ...data.revenueData.map((d) => d.target || 0),
                              1
                            )) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Traffic Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 lg:p-10"
        >
          <h3 className="text-lg lg:text-xl font-bold text-white mb-4 lg:mb-6">
            Traffic Sources
          </h3>
          <div className="space-y-4 lg:space-y-6">
            {data.trafficSources.map((source, index) => (
              <div
                key={source.source}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"></div>
                  <span className="text-sm lg:text-base text-gray-300">
                    {source.source}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm lg:text-base font-medium text-white">
                    {source.visitors.toLocaleString()}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-400">
                    {source.percentage}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 lg:p-10"
        >
          <h3 className="text-lg lg:text-xl font-bold text-white mb-4 lg:mb-6">
            Top Pages
          </h3>
          <div className="space-y-4 lg:space-y-6">
            {data.topPages.map((page, index) => (
              <div
                key={page.page}
                className="flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="text-sm lg:text-base font-medium text-white truncate">
                    {page.page}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-400">
                    {page.avgTime} avg. time
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm lg:text-base font-medium text-white">
                    {page.views.toLocaleString()}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-400">
                    {page.bounceRate}% bounce
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Geographic Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 lg:p-10"
        >
          <h3 className="text-lg lg:text-xl font-bold text-white mb-4 lg:mb-6">
            Top Countries
          </h3>
          <div className="space-y-4 lg:space-y-6">
            {data.geographicData.map((country, index) => (
              <div
                key={country.country}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                  <span className="text-sm lg:text-base text-gray-300">
                    {country.country}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm lg:text-base font-medium text-white">
                    {country.users.toLocaleString()}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-400">
                    {country.percentage}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
