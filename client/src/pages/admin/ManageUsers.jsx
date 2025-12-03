import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import {
  Users,
  User,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  DollarSign,
  TrendingUp,
  MoreVertical,
  Download,
  Upload,
  UserCheck,
  UserX,
  Crown,
  Settings,
  Bell,
  MessageSquare,
  BarChart3,
  ArrowUpDown,
  UserPlus,
  AlertCircle,
  X,
} from "lucide-react";

const ManageUsers = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // API functions
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(activeTab !== "all" && { status: activeTab }),
      });

      const response = await fetch(`/api/admin/users?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data.data.users);
      setPagination((prev) => ({
        ...prev,
        ...data.data.pagination,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      // Transform field names to match server expectations
      const transformedData = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        company: userData.company,
        role: userData.role,
        status: userData.status,
      };

      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create user";
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
          errorMessage = `Failed to create user: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      await fetchUsers(); // Refresh users list
      setShowAddUser(false);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      // Transform field names to match server expectations
      const transformedData = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        company: userData.company,
        role: userData.role,
        status: userData.status,
        ...(userData.password && { password: userData.password }),
      };

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        let errorMessage = "Failed to update user";
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
          errorMessage = `Failed to update user: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      await fetchUsers(); // Refresh users list
      setShowEditUser(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user status");
      }

      await fetchUsers(); // Refresh users list
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  };

  const getUserAvatar = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  // Fetch users on component mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [activeTab, pagination.page, pagination.limit]);

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "text-purple-400 bg-purple-400/10 border-purple-400/20";
      case "client":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "user":
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "pending":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "suspended":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "inactive":
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5" />;
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "suspended":
        return <XCircle className="w-5 h-5" />;
      case "inactive":
        return <UserX className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Crown className="w-5 h-5" />;
      case "client":
        return <UserCheck className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  // Transform API data to match component structure
  const transformedUsers = users.map((user) => ({
    ...user,
    name: `${user.first_name} ${user.last_name}`,
    location: user.company || "Not specified",
    totalSpent: "₵0", // This would come from a separate API in a real app
    projectsCompleted: 0,
    activeProjects: 0,
    satisfaction: 0,
    avatar: getUserAvatar(user.first_name, user.last_name),
    joinDate: user.created_at,
    lastActive: user.last_login || user.created_at,
  }));

  const filteredUsers = transformedUsers.filter((user) => {
    const matchesTab = activeTab === "all" || user.status === activeTab;
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.company &&
        user.company.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "email":
        return a.email.localeCompare(b.email);
      case "company":
        return (a.company || "").localeCompare(b.company || "");
      case "joinDate":
        return new Date(b.joinDate) - new Date(a.joinDate);
      case "lastActive":
        return new Date(b.lastActive) - new Date(a.lastActive);
      default:
        return 0;
    }
  });

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      description: "All registered users",
      icon: Users,
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
    },
    {
      title: "Active Clients",
      value: transformedUsers.filter(
        (u) => u.status === "active" && u.role === "client"
      ).length,
      description: "Currently active",
      icon: UserCheck,
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-500/10 to-emerald-500/10",
    },
    {
      title: "Pending Approval",
      value: transformedUsers.filter((u) => u.status === "pending").length,
      description: "Awaiting verification",
      icon: Clock,
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-500/10 to-orange-500/10",
    },
    {
      title: "Total Revenue",
      value: "₵0", // This would come from a separate API in a real app
      description: "From all clients",
      icon: DollarSign,
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
    },
  ];

  const tabs = [
    { id: "all", label: "All Users", count: users.length },
    {
      id: "active",
      label: "Active",
      count: transformedUsers.filter((u) => u.status === "active").length,
    },
    {
      id: "pending",
      label: "Pending",
      count: transformedUsers.filter((u) => u.status === "pending").length,
    },
    {
      id: "suspended",
      label: "Suspended",
      count: transformedUsers.filter((u) => u.status === "suspended").length,
    },
  ];

  const UserCard = ({ user }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/5 transition-all duration-300 group"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-white">{user.avatar}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
              {user.name}
            </h3>
            <p className="text-base text-gray-400">{user.email}</p>
            <p className="text-base text-gray-400">{user.company}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            {getRoleIcon(user.role)}
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium border ${getRoleColor(
                user.role
              )}`}
            >
              {user.role.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(user.status)}
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                user.status
              )}`}
            >
              {user.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-400 mb-2">Total Spent</p>
          <p className="text-lg font-bold text-white">{user.totalSpent}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-2">Projects</p>
          <p className="text-lg font-bold text-white">
            {user.projectsCompleted} completed
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-2">Active Projects</p>
          <p className="text-lg font-bold text-cyan-400">
            {user.activeProjects}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-2">Satisfaction</p>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <p className="text-lg font-bold text-white">{user.satisfaction}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-base text-gray-400 mb-6">
        <span className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {user.location}
        </span>
        <span className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Joined {new Date(user.joinDate).toLocaleDateString()}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="text-base text-gray-400">
          Last active: {new Date(user.lastActive).toLocaleDateString()}
        </span>

        <div className="flex items-center gap-3">
          <button className="p-3 hover:bg-white/10 rounded-lg transition-colors">
            <Eye className="w-5 h-5 text-gray-400" />
          </button>
          <button className="p-3 hover:bg-white/10 rounded-lg transition-colors">
            <Edit className="w-5 h-5 text-gray-400" />
          </button>
          <button className="p-3 hover:bg-white/10 rounded-lg transition-colors">
            <MessageSquare className="w-5 h-5 text-gray-400" />
          </button>
          <button className="p-3 hover:bg-white/10 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
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
            Manage Users
          </h1>
          <p className="text-gray-400 mt-2 text-base md:text-lg">
            Monitor and manage all platform users
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:min-w-0 lg:w-auto">
          <div className="flex relative lg:w-80 sm:w-72 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 lg:py-4 bg-white/5 border border-white/10 rounded-lg text-base focus:outline-none focus:border-cyan-400/50 transition-colors w-full"
            />
          </div>

          <button
            onClick={() => setShowAddUser(true)}
            className="px-6 py-3 lg:py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-base font-medium hover:from-cyan-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add User
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
      <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-lg border border-white/10">
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Users List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-4 bg-black/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl lg:text-2xl font-bold text-white">
                Users
              </h2>
              <p className="text-gray-400 text-sm lg:text-base">
                Manage platform users and their accounts
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-base focus:outline-none focus:border-cyan-400/50 transition-colors"
              >
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
                <option value="company">Sort by Company</option>
                <option value="joinDate">Sort by Join Date</option>
                <option value="lastActive">Sort by Last Active</option>
                <option value="totalSpent">Sort by Total Spent</option>
              </select>
              <button className="p-3 hover:bg-white/10 rounded-lg transition-colors">
                <Filter className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {sortedUsers.length > 0 ? (
              sortedUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-white">
                        {user.avatar}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-white group-hover:text-cyan-400 transition-colors mb-2 text-lg">
                            {user.name}
                          </h3>
                          <p className="text-base text-gray-400 mb-1">
                            {user.email}
                          </p>
                          <p className="text-base text-gray-400">
                            {user.company}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4 sm:mt-0">
                          <div className="flex items-center gap-2">
                            {getRoleIcon(user.role)}
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(
                                user.role
                              )}`}
                            >
                              {user.role.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(user.status)}
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                user.status
                              )}`}
                            >
                              {user.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-2">
                            Total Spent
                          </p>
                          <p className="text-lg font-bold text-white">
                            {user.totalSpent}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Projects</p>
                          <p className="text-lg font-bold text-white">
                            {user.projectsCompleted} completed
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Active</p>
                          <p className="text-lg font-bold text-cyan-400">
                            {user.activeProjects}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Rating</p>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <p className="text-lg font-bold text-white">
                              {user.satisfaction}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm text-gray-400">
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {user.location}
                          </span>
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Joined{" "}
                            {new Date(user.joinDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEditUser(true);
                            }}
                            className="p-2 hover:bg-white/10 rounded transition-colors"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                          <select
                            value={user.status}
                            onChange={(e) =>
                              updateUserStatus(user.id, e.target.value)
                            }
                            className="px-3 py-1 bg-white/5 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-cyan-400/50"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">
                  No users found
                </h3>
                <p className="text-gray-400 text-lg mb-6">
                  {searchQuery
                    ? "No users match your search criteria."
                    : "No users to display."}
                </p>
                <button
                  onClick={() => setShowAddUser(true)}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-base font-medium hover:from-cyan-600 hover:to-purple-600 transition-all flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Add New User
                </button>
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
          {/* User Analytics */}
          <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-white">
                  User Analytics
                </h2>
                <p className="text-gray-400 text-sm lg:text-base">
                  Platform insights
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-base">New This Month</span>
                <span className="text-cyan-400 font-medium text-base">
                  {
                    users.filter(
                      (u) =>
                        new Date(u.joinDate).getMonth() ===
                        new Date().getMonth()
                    ).length
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-base">Conversion Rate</span>
                <span className="text-green-400 font-medium text-base">
                  {(
                    (users.filter((u) => u.status === "active").length /
                      users.length) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-base">
                  Avg. Satisfaction
                </span>
                <span className="text-purple-400 font-medium text-base">
                  {(
                    users.reduce((acc, u) => acc + u.satisfaction, 0) /
                    users.filter((u) => u.satisfaction > 0).length
                  ).toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-base">Revenue/User</span>
                <span className="text-orange-400 font-medium text-base">
                  ₵
                  {(
                    transformedUsers.reduce(
                      (acc, u) =>
                        acc +
                        parseInt((u.totalSpent || "₵0").replace(/[₵,]/g, "")),
                      0
                    ) / users.length
                  ).toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <UserCheck className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-white">
                  Recent Users
                </h2>
                <p className="text-gray-400 text-sm lg:text-base">
                  Latest registrations
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {users
                .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
                .slice(0, 5)
                .map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-white">
                        {user.avatar}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {user.company}
                      </p>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-400/30 rounded-2xl p-6 lg:p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-white mb-2">
                Quick Actions
              </h3>
              <p className="text-sm lg:text-base text-gray-300">
                Common user management tasks
              </p>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <UserPlus className="w-5 h-5 text-cyan-400" />
                <span className="text-base text-white">Bulk Import Users</span>
              </button>
              <button className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-cyan-400" />
                <span className="text-base text-white">Export User Data</span>
              </button>
              <button className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <Mail className="w-5 h-5 text-cyan-400" />
                <span className="text-base text-white">Send Newsletter</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/80 border border-cyan-500/20 rounded-2xl p-8 flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <span className="text-white text-lg">Loading users...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 z-50">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <UserModal
          isOpen={showAddUser}
          onClose={() => setShowAddUser(false)}
          onSubmit={createUser}
          title="Add New User"
        />
      )}

      {/* Edit User Modal */}
      {showEditUser && selectedUser && (
        <UserModal
          isOpen={showEditUser}
          onClose={() => {
            setShowEditUser(false);
            setSelectedUser(null);
          }}
          onSubmit={(data) => updateUser(selectedUser.id, data)}
          title="Edit User"
          user={selectedUser}
        />
      )}
    </div>
  );
};

// User Modal Component
const UserModal = ({ isOpen, onClose, onSubmit, title, user }) => {
  const [formData, setFormData] = useState({
    email: user?.email || "",
    password: "",
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    phone: user?.phone || "",
    company: user?.company || "",
    role: user?.role || "client",
    status: user?.status || "active",
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
      <div className="bg-black/80 border border-cyan-500/20 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {user ? "New Password (optional)" : "Password *"}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50"
                {...(!user && { required: true })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50"
                required
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
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
                  {user ? "Updating..." : "Creating..."}
                </div>
              ) : user ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageUsers;
