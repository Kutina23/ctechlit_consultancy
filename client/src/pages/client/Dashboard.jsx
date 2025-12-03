import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useDashboardData } from "../../hooks/useApi";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  TrendingUp,
  Calendar,
  DollarSign,
  Star,
  MessageSquare,
  Download,
  Filter,
  Search,
  Zap,
  Eye,
  ArrowRight,
  Briefcase,
  Activity,
  Users,
  Target,
  Award,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  Globe,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const { dashboardData, projects, milestones, loading } = useDashboardData();

  // Transform API data to match component structure
  const dashboardStats = dashboardData ? [
    {
      title: "Active Projects",
      value: dashboardData.activeProjects || 0,
      description: "Currently in progress",
      icon: Briefcase,
      color: "from-emerald-400 to-teal-500",
      bgColor: "from-emerald-500/10 to-teal-500/10",
    },
    {
      title: "Completed Projects",
      value: dashboardData.completedProjects || 0,
      description: "Successfully delivered",
      icon: CheckCircle,
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
    },
    {
      title: "Total Investment",
      value: `${dashboardData.totalInvestment?.toLocaleString() || 0}`,
      description: "Across all projects",
      icon: DollarSign,
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
    },
    {
      title: "Satisfaction Score",
      value: `${dashboardData.satisfactionScore || 0}%`,
      description: "Client satisfaction rating",
      icon: Star,
      color: "from-orange-400 to-red-500",
      bgColor: "from-orange-500/10 to-red-500/10",
    },
  ] : [];

  const recentProjects = projects;

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-400 mt-1">
              Loading your dashboard...
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="animate-pulse">
                <div className="h-12 bg-gray-700 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const quickActions = [
    { icon: Plus, label: "New Request", color: "from-emerald-400 to-teal-500" },
    {
      icon: MessageSquare,
      label: "Contact Support",
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: FileText,
      label: "View Projects",
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: Download,
      label: "Download Report",
      color: "from-orange-400 to-red-500",
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
        return <CheckCircle className="w-4 h-4" />;
      case "in_progress":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "timeline", label: "Timeline", icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-400 mt-1">
            Here's what's happening with your projects today
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-400/50 transition-colors"
            />
          </div>

          <Link
            to="/dashboard/requests"
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Request
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 bg-gradient-to-br ${stat.bgColor} border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 transition-all duration-300`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>

                <h3 className="font-medium text-white mb-1">{stat.title}</h3>
                <p className="text-sm text-gray-400">{stat.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 p-1 rounded-xl border border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-black/50 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">My Projects</h2>
                <p className="text-gray-400 text-sm">
                  Track your project progress
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Filter className="w-4 h-4 text-gray-400" />
              </button>
              <Link
                to="/dashboard/projects"
                className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 rounded-lg text-sm text-emerald-400 transition-colors flex items-center gap-2"
              >
                View All
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {recentProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-white group-hover:text-emerald-400 transition-colors mb-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>Budget: {project.budget}</span>
                      <span>
                        Due: {new Date(project.dueDate).toLocaleDateString()}
                      </span>
                      <span>Team: {project.team.length} members</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusIcon(project.status)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">Progress</span>
                    <span className="text-sm font-medium text-white">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center border-2 border-black"
                      >
                        <span className="text-xs font-bold text-white">
                          {member.charAt(0)}
                        </span>
                      </div>
                    ))}
                    {project.team.length > 3 && (
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center border-2 border-black">
                        <span className="text-xs text-white">
                          +{project.team.length - 3}
                        </span>
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/dashboard/projects/${project.id}`}
                    className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    View Details
                    <Eye className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sidebar Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <div className="bg-black/50 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Quick Actions</h2>
                <p className="text-gray-400 text-sm">Common tasks</p>
              </div>
            </div>

            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 group"
                  >
                    <div
                      className={`w-8 h-8 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                      {action.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Upcoming Milestones */}
          <div className="bg-black/50 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Upcoming Milestones
                </h2>
                <p className="text-gray-400 text-sm">Next deadlines</p>
              </div>
            </div>

            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-white">
                      {milestone.title}
                    </h3>
                    <span className="text-xs text-emerald-400 font-mono">
                      {new Date(milestone.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{milestone.project}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Support Contact */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-400/30 rounded-2xl p-6">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Need Help?</h3>
              <p className="text-sm text-gray-300">
                Our support team is here for you
              </p>
            </div>

            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-white">support@ctechlit.com</span>
              </button>
              <button className="w-full flex items-center gap-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-white">+1 (555) 123-4567</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
