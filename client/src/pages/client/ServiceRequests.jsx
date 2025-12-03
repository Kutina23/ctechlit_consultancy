import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Star,
  MessageSquare,
  Download,
  Calendar,
  DollarSign,
  User,
  Building,
  Phone,
  Mail,
  Globe,
  Zap,
  TrendingUp,
  Activity,
  Users,
  Target,
  Award,
  BookOpen,
} from "lucide-react";

const ServiceRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);

  // Sample service requests data - in real app this would come from API
  const serviceRequests = [
    {
      id: 1,
      title: "E-commerce Website Development",
      category: "Web Development",
      status: "in_progress",
      priority: "high",
      submittedDate: "2024-12-15",
      estimatedCompletion: "2025-01-20",
      budget: "₵180,000",
      description: "Full-stack e-commerce platform with payment integration",
      assignedTeam: ["Alice Johnson", "Bob Smith", "Charlie Brown"],
      progress: 65,
      clientFeedback: "Satisfied with current progress",
    },
    {
      id: 2,
      title: "Mobile App UI/UX Design",
      category: "Design",
      status: "completed",
      priority: "medium",
      submittedDate: "2024-11-20",
      estimatedCompletion: "2024-12-20",
      budget: "₵102,000",
      description:
        "Complete mobile application interface design and user experience optimization",
      assignedTeam: ["Diana Prince", "Eve Wilson"],
      progress: 100,
      clientFeedback: "Excellent work, exceeded expectations",
    },
    {
      id: 3,
      title: "Cloud Infrastructure Setup",
      category: "Infrastructure",
      status: "pending",
      priority: "high",
      submittedDate: "2024-12-25",
      estimatedCompletion: "2025-02-01",
      budget: "₵300,000",
      description: "Complete cloud migration and infrastructure setup",
      assignedTeam: ["Frank Castle", "Grace Hopper"],
      progress: 15,
      clientFeedback: null,
    },
    {
      id: 4,
      title: "SEO Optimization",
      category: "Marketing",
      status: "in_review",
      priority: "low",
      submittedDate: "2024-12-10",
      estimatedCompletion: "2025-01-15",
      budget: "₵60,000",
      description: "Website SEO optimization and content strategy",
      assignedTeam: ["Henry Jekyll"],
      progress: 90,
      clientFeedback: "Good progress, awaiting final review",
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
      case "in_review":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
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
      case "in_review":
        return <Eye className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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

  const filteredRequests = serviceRequests.filter((request) => {
    const matchesTab = activeTab === "all" || request.status === activeTab;
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = [
    {
      title: "Total Requests",
      value: serviceRequests.length,
      description: "All time requests",
      icon: FileText,
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
    },
    {
      title: "In Progress",
      value: serviceRequests.filter((r) => r.status === "in_progress").length,
      description: "Currently active",
      icon: Activity,
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-500/10 to-orange-500/10",
    },
    {
      title: "Completed",
      value: serviceRequests.filter((r) => r.status === "completed").length,
      description: "Successfully delivered",
      icon: CheckCircle,
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-500/10 to-emerald-500/10",
    },
    {
      title: "Total Investment",
      value:
        "₵" +
        serviceRequests
          .reduce((sum, r) => sum + parseInt(r.budget.replace(/[₵,]/g, "")), 0)
          .toLocaleString(),
      description: "Across all requests",
      icon: DollarSign,
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
    },
  ];

  const tabs = [
    { id: "all", label: "All Requests", count: serviceRequests.length },
    {
      id: "pending",
      label: "Pending",
      count: serviceRequests.filter((r) => r.status === "pending").length,
    },
    {
      id: "in_progress",
      label: "In Progress",
      count: serviceRequests.filter((r) => r.status === "in_progress").length,
    },
    {
      id: "completed",
      label: "Completed",
      count: serviceRequests.filter((r) => r.status === "completed").length,
    },
  ];

  // Handler functions
  const handleNewRequest = () => {
    setShowNewRequestForm(true);
    // In a real app, you might navigate to a form page or show a modal
    navigate("/dashboard/requests/new");
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    // In a real app, you might navigate to a detail page or show a modal
    navigate(`/dashboard/requests/${request.id}`);
  };

  const handleEditRequest = (request) => {
    // In a real app, you might navigate to an edit form or show a modal
    navigate(`/dashboard/requests/${request.id}/edit`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Service Requests
          </h1>
          <p className="text-gray-400 mt-1">
            Manage and track all your service requests
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-400/50 transition-colors"
            />
          </div>

          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Filter className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={handleNewRequest}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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
              {tab.label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  active ? "bg-white/20" : "bg-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredRequests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white hover:text-emerald-400 transition-colors">
                    {request.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                      request.priority
                    )}`}
                  >
                    {request.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-400 mb-3">{request.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {request.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(request.submittedDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {request.budget}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(request.status)}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewRequest(request)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="View Request"
                  >
                    <Eye className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleEditRequest(request)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Edit Request"
                  >
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {request.status !== "completed" && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Progress</span>
                  <span className="text-sm font-medium text-white">
                    {request.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${request.progress}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Team Members */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Team:</span>
                <div className="flex -space-x-2">
                  {request.assignedTeam.slice(0, 3).map((member, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center border-2 border-black"
                      title={member}
                    >
                      <span className="text-xs font-bold text-white">
                        {member.charAt(0)}
                      </span>
                    </div>
                  ))}
                  {request.assignedTeam.length > 3 && (
                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center border-2 border-black">
                      <span className="text-xs text-white">
                        +{request.assignedTeam.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-400">
                Est. completion:{" "}
                {new Date(request.estimatedCompletion).toLocaleDateString()}
              </div>
            </div>

            {/* Client Feedback */}
            {request.clientFeedback && (
              <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-400/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-emerald-400 font-medium mb-1">
                      Client Feedback
                    </p>
                    <p className="text-sm text-gray-300">
                      {request.clientFeedback}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {filteredRequests.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            No requests found
          </h3>
          <p className="text-gray-400 mb-6">
            {searchQuery
              ? "No requests match your search criteria."
              : "You haven't made any service requests yet."}
          </p>
          <button
            onClick={handleNewRequest}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Create New Request
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ServiceRequests;
