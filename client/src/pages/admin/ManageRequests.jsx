import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  User,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Calendar,
  DollarSign,
  Building,
  MessageSquare,
  Star,
  TrendingUp,
  Activity,
  BarChart3,
  ArrowUpDown,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Globe,
  Zap,
  Target,
  Award,
  AlertCircle as AlertIcon,
  X,
} from "lucide-react";

const ManageRequests = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showAddRequest, setShowAddRequest] = useState(false);
  const [showEditRequest, setShowEditRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // API functions
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(activeTab !== "all" && { status: activeTab }),
      });

      const response = await fetch(`/api/admin/requests?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = `Server error (${response.status}): `;

        if (response.status >= 500) {
          errorMessage +=
            "The server is currently experiencing issues. Please try again later.";
        } else if (response.status === 401) {
          errorMessage +=
            "You are not authorized to access this data. Please log in again.";
        } else if (response.status === 404) {
          errorMessage += "The requested resource was not found.";
        } else {
          errorMessage += response.statusText || "An unknown error occurred.";
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      setRequests(data.data.requests);
      setPagination((prev) => ({
        ...prev,
        ...data.data.pagination,
      }));
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError(error.message);
      // Set empty array on error to prevent app crashes
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users?limit=100", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = `Server error (${response.status}): `;

        if (response.status >= 500) {
          errorMessage +=
            "The server is currently experiencing issues. Please try again later.";
        } else if (response.status === 401) {
          errorMessage +=
            "You are not authorized to access this data. Please log in again.";
        } else if (response.status === 404) {
          errorMessage += "The requested resource was not found.";
        } else {
          errorMessage += response.statusText || "An unknown error occurred.";
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      setUsers(data.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Set empty array on error to prevent app crashes
      setUsers([]);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = `Server error (${response.status}): `;
        
        if (response.status >= 500) {
          errorMessage += "The server is currently experiencing issues. Please try again later.";
        } else if (response.status === 401) {
          errorMessage += "You are not authorized to access this data. Please log in again.";
        } else if (response.status === 404) {
          errorMessage += "The requested resource was not found.";
        } else {
          errorMessage += response.statusText || "An unknown error occurred.";
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setServices(data.data.services);
    } catch (error) {
      console.error("Error fetching services:", error);
      // Set empty array on error to prevent app crashes
      setServices([]);
    }
  };

  const createRequest = async (requestData) => {
    try {
      const response = await fetch("/api/admin/requests", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create request";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;

          // Handle validation errors specifically
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors
              .map((err) => err.msg || err.message)
              .join(", ");
          }
        } catch (parseError) {
          // If response is not JSON, use status text
          errorMessage = `Failed to create request: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      await fetchRequests(); // Refresh requests list
      setShowAddRequest(false);
    } catch (error) {
      console.error("Error creating request:", error);
      throw error;
    }
  };

  const updateRequest = async (requestId, requestData) => {
    try {
      const response = await fetch(`/api/admin/requests/${requestId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        let errorMessage = "Failed to update request";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;

          // Handle validation errors specifically
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors
              .map((err) => err.msg || err.message)
              .join(", ");
          }
        } catch (parseError) {
          // If response is not JSON, use status text
          errorMessage = `Failed to update request: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      await fetchRequests(); // Refresh requests list
      setShowEditRequest(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error updating request:", error);
      throw error;
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      const response = await fetch(`/api/admin/requests/${requestId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update request status");
      }

      await fetchRequests(); // Refresh requests list
    } catch (error) {
      console.error("Error updating request status:", error);
      throw error;
    }
  };

  // Transform API data to match component structure
  const transformedRequests = requests.map((request) => ({
    ...request,
    client: {
      name: `${request.first_name} ${request.last_name}`,
      email: request.email,
      phone: request.user_phone || "Not provided",
      company: request.company || "Not specified",
      address: "Address not provided", // This would come from user profile in a real app
    },
    submittedDate: request.created_at,
    estimatedCompletion: request.estimated_completion,
    lastUpdate: request.updated_at,
    priority:
      request.budget > 20000
        ? "high"
        : request.budget > 10000
        ? "medium"
        : "low",
    progress:
      request.status === "completed"
        ? 100
        : request.status === "in_progress"
        ? 50
        : 10,
    paid: `${Math.floor((request.budget || 0) * 0.5)}`, // This would come from payment data
    assignedTeam: ["Team Member 1", "Team Member 2"], // This would come from assignment data
    messages: Math.floor(Math.random() * 20), // This would come from messaging data
    attachments: Math.floor(Math.random() * 10), // This would come from attachments data
  }));

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchRequests();
  }, [activeTab, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchUsers();
    fetchServices();
  }, []);

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
      case "cancelled":
        return "text-red-400 bg-red-400/10 border-red-400/20";
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
      case "in_review":
        return <Eye className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
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

  const filteredRequests = transformedRequests.filter((request) => {
    const matchesTab = activeTab === "all" || request.status === activeTab;
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.client.company &&
        request.client.company
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (request.service_name &&
        request.service_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.submittedDate) - new Date(a.submittedDate);
      case "budget":
        return (b.budget || 0) - (a.budget || 0);
      case "title":
        return a.title.localeCompare(b.title);
      case "client":
        return a.client.name.localeCompare(b.client.name);
      default:
        return 0;
    }
  });

  const stats = [
    {
      title: "Total Requests",
      value: requests.length,
      description: "All service requests",
      icon: FileText,
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
    },
    {
      title: "In Progress",
      value: transformedRequests.filter((r) => r.status === "in_progress")
        .length,
      description: "Currently active",
      icon: Activity,
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-500/10 to-orange-500/10",
    },
    {
      title: "Completed",
      value: transformedRequests.filter((r) => r.status === "completed").length,
      description: "Successfully delivered",
      icon: CheckCircle,
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-500/10 to-emerald-500/10",
    },
    {
      title: "Total Revenue",
      value:
        "₵" +
        transformedRequests
          .reduce((sum, r) => sum + (r.budget || 0), 0)
          .toLocaleString(),
      description: "Total budget",
      icon: DollarSign,
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
    },
  ];

  const tabs = [
    { id: "all", label: "All Requests", count: requests.length },
    {
      id: "pending",
      label: "Pending",
      count: transformedRequests.filter((r) => r.status === "pending").length,
    },
    {
      id: "in_progress",
      label: "In Progress",
      count: transformedRequests.filter((r) => r.status === "in_progress")
        .length,
    },
    {
      id: "completed",
      label: "Completed",
      count: transformedRequests.filter((r) => r.status === "completed").length,
    },
    {
      id: "in_review",
      label: "In Review",
      count: transformedRequests.filter((r) => r.status === "in_review").length,
    },
  ];

  const RequestCard = ({ request }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/5 transition-all duration-300 group"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
            <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
              {request.title}
            </h3>
            <span className="text-sm text-gray-400 font-mono">
              #{request.id.toString().padStart(3, "0")}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-400 mb-4">
            <span className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              <span className="truncate">{request.client.company}</span>
            </span>
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="truncate">{request.client.name}</span>
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(request.submittedDate).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-300 text-sm md:text-base line-clamp-2 leading-relaxed">
            {request.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium border ${getPriorityColor(
              request.priority
            )}`}
          >
            {request.priority.toUpperCase()}
          </span>
          <div className="flex items-center gap-2">
            {getStatusIcon(request.status)}
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                request.status
              )}`}
            >
              {request.status.replace("_", " ").toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-400 mb-2">Budget</p>
          <p className="text-base md:text-lg font-bold text-white">
            {request.budget}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-2">Paid</p>
          <p className="text-base md:text-lg font-bold text-green-400">
            {request.paid}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-2">Progress</p>
          <p className="text-base md:text-lg font-bold text-white">
            {request.progress}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-2">Team</p>
          <p className="text-base md:text-lg font-bold text-white">
            {request.assignedTeam.length} members
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base text-gray-300">Progress</span>
          <span className="text-base font-medium text-white">
            {request.progress}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="h-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${request.progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm text-gray-400">
          <span className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            {request.messages} messages
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Due: {new Date(request.estimatedCompletion).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedRequest(request);
              setShowEditRequest(true);
            }}
            className="p-3 hover:bg-white/10 rounded-lg transition-colors"
            title="Edit Request"
          >
            <Edit className="w-5 h-5 text-gray-400" />
          </button>
          <select
            value={request.status}
            onChange={(e) => updateRequestStatus(request.id, e.target.value)}
            className="px-3 py-1 bg-white/5 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-cyan-400/50"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 lg:space-y-8 max-w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Manage Requests
          </h1>
          <p className="text-gray-400 mt-2 text-base md:text-lg">
            Monitor and manage all service requests
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

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 lg:py-4 bg-white/5 border border-white/10 rounded-lg text-base focus:outline-none focus:border-cyan-400/50 transition-colors"
          >
            <option value="date">Sort by Date</option>
            <option value="budget">Sort by Budget</option>
            <option value="title">Sort by Title</option>
            <option value="client">Sort by Client</option>
          </select>

          <button className="p-3 lg:p-4 hover:bg-white/10 rounded-lg transition-colors">
            <Filter className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => setShowAddRequest(true)}
            className="px-6 py-3 lg:py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-base font-medium hover:from-cyan-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            New Request
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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
                    <p className="text-xl lg:text-2xl font-bold text-white">
                      {stat.value}
                    </p>
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

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg text-base font-medium transition-all ${
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

      {/* View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-base text-gray-400">
          {sortedRequests.length} requests found
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-3 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-3 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <ArrowUpDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Requests Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 lg:grid-cols-2 gap-8"
            : "space-y-6"
        }
      >
        {sortedRequests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </motion.div>

      {sortedRequests.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <FileText className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-4">
            No requests found
          </h3>
          <p className="text-gray-400 mb-8 text-lg">
            {searchQuery
              ? "No requests match your search criteria."
              : "No service requests to manage."}
          </p>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/80 border border-cyan-500/20 rounded-2xl p-8 flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <span className="text-white text-lg">Loading requests...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 z-50">
          <AlertIcon className="w-5 h-5 text-red-400" />
          <span className="text-red-400">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add Request Modal */}
      {showAddRequest && (
        <RequestModal
          isOpen={showAddRequest}
          onClose={() => setShowAddRequest(false)}
          onSubmit={createRequest}
          title="Create New Request"
          users={users}
          services={services}
        />
      )}

      {/* Edit Request Modal */}
      {showEditRequest && selectedRequest && (
        <RequestModal
          isOpen={showEditRequest}
          onClose={() => {
            setShowEditRequest(false);
            setSelectedRequest(null);
          }}
          onSubmit={(data) => updateRequest(selectedRequest.id, data)}
          title="Edit Request"
          request={selectedRequest}
          users={users}
          services={services}
        />
      )}
    </div>
  );
};

// Request Modal Component
const RequestModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  request,
  users,
  services,
}) => {
  const [formData, setFormData] = useState({
    userId: request?.user_id || "",
    serviceId: request?.service_id || "",
    title: request?.title || "",
    description: request?.description || "",
    budget: request?.budget || "",
    timeline: request?.timeline || "",
    requirements: request?.requirements || "",
    status: request?.status || "pending",
    adminNotes: request?.admin_notes || "",
    estimatedCompletion: request?.estimated_completion || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/80 border border-cyan-500/20 rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertIcon className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Client *
              </label>
              <select
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50"
                required
              >
                <option value="">Select a client</option>
                {users
                  .filter((u) => u.role === "client")
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.email})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Service *
              </label>
              <select
                value={formData.serviceId}
                onChange={(e) =>
                  setFormData({ ...formData, serviceId: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50"
                required
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ₵{service.price}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Budget (₵)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Timeline
              </label>
              <input
                type="text"
                value={formData.timeline}
                onChange={(e) =>
                  setFormData({ ...formData, timeline: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50"
                placeholder="e.g., 2-4 weeks"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Requirements
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50"
                required
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Completion
              </label>
              <input
                type="date"
                value={formData.estimatedCompletion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedCompletion: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Notes
              </label>
              <textarea
                value={formData.adminNotes}
                onChange={(e) =>
                  setFormData({ ...formData, adminNotes: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-medium hover:from-cyan-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {request ? "Updating..." : "Creating..."}
                </div>
              ) : request ? (
                "Update Request"
              ) : (
                "Create Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageRequests;
