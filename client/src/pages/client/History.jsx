import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  DollarSign,
  Download,
  Search,
  Filter,
  Eye,
  FileText,
  User,
  Building,
  Briefcase,
  CreditCard,
  UserCheck,
  MessageSquare,
  Star,
  TrendingUp,
  Activity,
  Award,
  Zap,
  Target,
  ArrowUpDown,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Globe,
  Smartphone,
  Monitor,
  Database,
  Cloud,
  Palette,
  BarChart3,
  Code,
  Settings,
} from "lucide-react";

const History = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Sample history data - in real app this would come from API
  const historyItems = [
    {
      id: 1,
      type: "project_completed",
      title: "Mobile App UI/UX Design",
      category: "Design",
      client: "TechStart Inc",
      amount: "₵8,500",
      date: "2024-12-20",
      status: "completed",
      rating: 5,
      feedback:
        "Outstanding work! The design exceeded our expectations and the team was very responsive throughout the process.",
      deliverables: [
        "User Research",
        "Wireframes",
        "UI Design",
        "Interactive Prototype",
      ],
      team: ["Diana Prince", "Eve Wilson"],
    },
    {
      id: 2,
      type: "payment_made",
      title: "Payment for E-commerce Platform",
      category: "Payment",
      client: "Acme Corporation",
      amount: "₵15,000",
      date: "2024-12-18",
      status: "completed",
      paymentMethod: "Bank Transfer",
      transactionId: "TXN-2024-1218-001",
      description:
        "Second payment milestone for e-commerce platform development",
    },
    {
      id: 3,
      type: "project_started",
      title: "Cloud Infrastructure Setup",
      category: "Infrastructure",
      client: "DataFlow Systems",
      amount: "₵25,000",
      date: "2024-12-15",
      status: "in_progress",
      description: "Cloud migration and infrastructure setup project initiated",
      estimatedCompletion: "2025-02-01",
      team: ["Frank Castle", "Grace Hopper"],
    },
    {
      id: 4,
      type: "request_submitted",
      title: "AI Analytics Dashboard",
      category: "AI/ML",
      client: "Analytics Pro",
      amount: "₵35,000",
      date: "2024-12-10",
      status: "approved",
      description:
        "AI-powered analytics dashboard development request submitted and approved",
      requirements: [
        "Data Pipeline",
        "ML Models",
        "Dashboard UI",
        "API Integration",
      ],
    },
    {
      id: 5,
      type: "project_completed",
      title: "Website Redesign",
      category: "Web Development",
      client: "Creative Agency",
      amount: "₵12,000",
      date: "2024-11-25",
      status: "completed",
      rating: 4.5,
      feedback:
        "Great work on the redesign. The new site looks modern and professional. Minor adjustments were needed but overall very satisfied.",
      deliverables: [
        "UI/UX Design",
        "Frontend Development",
        "CMS Integration",
        "SEO Optimization",
      ],
      team: ["Alice Johnson", "Bob Smith"],
    },
    {
      id: 6,
      type: "payment_made",
      title: "Payment for Website Redesign",
      category: "Payment",
      client: "Creative Agency",
      amount: "₵12,000",
      date: "2024-11-22",
      status: "completed",
      paymentMethod: "Credit Card",
      transactionId: "TXN-2024-1122-003",
      description: "Final payment for website redesign project",
    },
    {
      id: 7,
      type: "project_completed",
      title: "Database Optimization",
      category: "Infrastructure",
      client: "DataCorp",
      amount: "₵6,500",
      date: "2024-10-15",
      status: "completed",
      rating: 5,
      feedback:
        "Excellent optimization work. Our database performance improved significantly. Highly recommend!",
      deliverables: [
        "Performance Analysis",
        "Query Optimization",
        "Index Optimization",
        "Monitoring Setup",
      ],
      team: ["Frank Castle"],
    },
    {
      id: 8,
      type: "request_submitted",
      title: "Custom CRM Development",
      category: "Web Development",
      client: "SalesForce Pro",
      amount: "₵22,000",
      date: "2024-09-28",
      status: "rejected",
      description:
        "Custom CRM development request - rejected due to scope complexity",
      rejectionReason:
        "Project scope too large for current timeline. Recommended breaking into smaller phases.",
    },
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case "project_completed":
        return <CheckCircle className="w-5 h-5" />;
      case "payment_made":
        return <CreditCard className="w-5 h-5" />;
      case "project_started":
        return <Zap className="w-5 h-5" />;
      case "request_submitted":
        return <FileText className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "project_completed":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "payment_made":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "project_started":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "request_submitted":
        return "text-purple-400 bg-purple-400/10 border-purple-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "in_progress":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "approved":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "rejected":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Web Development":
        return <Monitor className="w-4 h-4" />;
      case "Design":
        return <Palette className="w-4 h-4" />;
      case "Infrastructure":
        return <Cloud className="w-4 h-4" />;
      case "AI/ML":
        return <BarChart3 className="w-4 h-4" />;
      case "Payment":
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Code className="w-4 h-4" />;
    }
  };

  const filteredItems = historyItems.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (dateRange !== "all") {
      const itemDate = new Date(item.date);
      const now = new Date();
      const daysAgo = {
        "7days": 7,
        "30days": 30,
        "90days": 90,
        "1year": 365,
      }[dateRange];

      if (daysAgo) {
        const cutoffDate = new Date(
          now.getTime() - daysAgo * 24 * 60 * 60 * 1000
        );
        matchesDate = itemDate >= cutoffDate;
      }
    }

    return matchesTab && matchesSearch && matchesDate;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date) - new Date(a.date);
      case "amount":
        return (
          parseInt(b.amount.replace(/[₵,]/g, "")) -
          parseInt(a.amount.replace(/[₵,]/g, ""))
        );
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const stats = [
    {
      title: "Total Projects",
      value: historyItems.filter((i) => i.type === "project_completed").length,
      description: "Completed projects",
      icon: Briefcase,
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
    },
    {
      title: "Total Investment",
      value:
        "₵" +
        historyItems
          .filter((i) => i.amount)
          .reduce((sum, i) => sum + parseInt(i.amount.replace(/[₵,]/g, "")), 0)
          .toLocaleString(),
      description: "All payments made",
      icon: DollarSign,
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
    },
    {
      title: "Average Rating",
      value: (
        historyItems
          .filter((i) => i.rating)
          .reduce((sum, i) => sum + i.rating, 0) /
        historyItems.filter((i) => i.rating).length
      ).toFixed(1),
      description: "Project satisfaction",
      icon: Star,
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-500/10 to-orange-500/10",
    },
    {
      title: "This Year",
      value: historyItems.filter((i) => {
        const itemDate = new Date(i.date);
        const currentYear = new Date().getFullYear();
        return itemDate.getFullYear() === currentYear;
      }).length,
      description: "Total activities",
      icon: Activity,
      color: "from-emerald-400 to-teal-500",
      bgColor: "from-emerald-500/10 to-teal-500/10",
    },
  ];

  const tabs = [
    { id: "all", label: "All Activities", count: historyItems.length },
    {
      id: "project_completed",
      label: "Completed",
      count: historyItems.filter((i) => i.type === "project_completed").length,
    },
    {
      id: "payment_made",
      label: "Payments",
      count: historyItems.filter((i) => i.type === "payment_made").length,
    },
    {
      id: "request_submitted",
      label: "Requests",
      count: historyItems.filter((i) => i.type === "request_submitted").length,
    },
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-600"
        }`}
      />
    ));
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
            History
          </h1>
          <p className="text-gray-400 mt-1">
            Track all your past activities and transactions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-400/50 transition-colors"
            />
          </div>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-400/50 transition-colors"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>

          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Filter className="w-4 h-4 text-gray-400" />
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

      {/* Sort and Filter Bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {sortedItems.length} activities found
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-400/50 transition-colors"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {/* History Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {sortedItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(
                    item.type
                  )}`}
                >
                  {getTypeIcon(item.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(item.category)}
                      <span className="text-sm text-gray-400">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{item.client}</p>
                  {item.description && (
                    <p className="text-gray-300 text-sm mt-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {item.status && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status.replace("_", " ").toUpperCase()}
                  </span>
                )}
                <span className="text-lg font-bold text-white">
                  {item.amount}
                </span>
              </div>
            </div>

            {/* Date and Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(item.date).toLocaleDateString()}
                </span>
                {item.rating && (
                  <div className="flex items-center gap-1">
                    {renderStars(item.rating)}
                    <span className="ml-1">{item.rating}</span>
                  </div>
                )}
                {item.transactionId && (
                  <span className="font-mono text-xs">
                    {item.transactionId}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Additional Details */}
            {item.feedback && (
              <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-400/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-emerald-400 font-medium mb-1">
                      Client Feedback
                    </p>
                    <p className="text-sm text-gray-300">{item.feedback}</p>
                  </div>
                </div>
              </div>
            )}

            {item.deliverables && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Deliverables:</p>
                <div className="grid grid-cols-2 gap-2">
                  {item.deliverables.map((deliverable, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-300"
                    >
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      {deliverable}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.requirements && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Requirements:</p>
                <div className="grid grid-cols-2 gap-2">
                  {item.requirements.map((req, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-300"
                    >
                      <Target className="w-3 h-3 text-blue-400" />
                      {req}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.rejectionReason && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-400/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-400 font-medium mb-1">
                      Rejection Reason
                    </p>
                    <p className="text-sm text-gray-300">
                      {item.rejectionReason}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {item.team && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Team:</p>
                <div className="flex -space-x-2">
                  {item.team.map((member, idx) => (
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
                </div>
              </div>
            )}

            {item.estimatedCompletion && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                Estimated completion:{" "}
                {new Date(item.estimatedCompletion).toLocaleDateString()}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {sortedItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            No history found
          </h3>
          <p className="text-gray-400 mb-6">
            {searchQuery
              ? "No activities match your search criteria."
              : "No activities recorded yet."}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default History;
