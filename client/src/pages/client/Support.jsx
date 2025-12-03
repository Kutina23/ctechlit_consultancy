import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import {
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Search,
  Filter,
  Plus,
  Send,
  Paperclip,
  Star,
  Zap,
  FileText,
  HelpCircle,
  BookOpen,
  Video,
  Users,
  Headphones,
  MessageCircle,
  Globe,
  MapPin,
  Clock4,
  TrendingUp,
  Award,
  Target,
  Activity,
  Settings,
  Bell,
  Eye,
  ArrowRight,
  Download,
  Upload,
} from "lucide-react";

const Support = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("tickets");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "general",
    priority: "medium",
    description: "",
    attachments: [],
  });

  // Sample support data - in real app this would come from API
  const supportTickets = [
    {
      id: "SUP-2024-001",
      subject: "Login Issues with Dashboard",
      category: "Technical",
      priority: "high",
      status: "open",
      createdDate: "2024-12-25",
      lastUpdate: "2024-12-26",
      description:
        "I'm unable to log into my dashboard. The system keeps showing 'Invalid credentials' even though I'm using the correct password.",
      messages: [
        {
          id: 1,
          author: "John Doe",
          role: "client",
          content:
            "I'm unable to log into my dashboard. The system keeps showing 'Invalid credentials' even though I'm using the correct password.",
          timestamp: "2024-12-25T10:30:00Z",
        },
        {
          id: 2,
          author: "Support Team",
          role: "support",
          content:
            "Thank you for reaching out. Could you please try clearing your browser cache and cookies, then try logging in again? Also, make sure you're using the correct email address associated with your account.",
          timestamp: "2024-12-25T14:22:00Z",
        },
        {
          id: 3,
          author: "John Doe",
          role: "client",
          content:
            "I've tried clearing cache and cookies but still getting the same error. The email address is correct - john.doe@acme.com",
          timestamp: "2024-12-25T16:45:00Z",
        },
      ],
    },
    {
      id: "SUP-2024-002",
      subject: "Payment Processing Question",
      category: "Billing",
      priority: "medium",
      status: "in_progress",
      createdDate: "2024-12-20",
      lastUpdate: "2024-12-24",
      description:
        "I want to understand the payment schedule for my ongoing project. When is the next payment due?",
      messages: [
        {
          id: 1,
          author: "John Doe",
          role: "client",
          content:
            "I want to understand the payment schedule for my ongoing project. When is the next payment due?",
          timestamp: "2024-12-20T09:15:00Z",
        },
        {
          id: 2,
          author: "Billing Support",
          role: "support",
          content:
            "Hello! Based on your project milestones, the next payment of ₵7,500 is due on January 15th, 2025. This corresponds to the completion of the backend development phase.",
          timestamp: "2024-12-20T11:30:00Z",
        },
      ],
    },
    {
      id: "SUP-2024-003",
      subject: "Feature Request: Dark Mode",
      category: "Feature Request",
      priority: "low",
      status: "closed",
      createdDate: "2024-12-10",
      lastUpdate: "2024-12-22",
      description:
        "Would it be possible to add a dark mode option to the dashboard? It would be easier on the eyes during long work sessions.",
      messages: [
        {
          id: 1,
          author: "John Doe",
          role: "client",
          content:
            "Would it be possible to add a dark mode option to the dashboard? It would be easier on the eyes during long work sessions.",
          timestamp: "2024-12-10T14:20:00Z",
        },
        {
          id: 2,
          author: "Product Team",
          role: "support",
          content:
            "Great suggestion! We've added dark mode to our roadmap for Q1 2025. You'll be among the first to know when it's available.",
          timestamp: "2024-12-15T10:00:00Z",
        },
        {
          id: 3,
          author: "Product Team",
          role: "support",
          content:
            "Dark mode has been successfully implemented and is now live! You can toggle it from the settings menu in your profile.",
          timestamp: "2024-12-22T16:30:00Z",
        },
      ],
    },
  ];

  const faqItems = [
    {
      question: "How do I track my project progress?",
      answer:
        "You can track your project progress by navigating to the 'Projects' section in your dashboard. Each project shows detailed progress bars, milestones, and team assignments.",
      category: "General",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, bank transfers, and PayPal. Payments can be made through your dashboard or via invoice links sent to your email.",
      category: "Billing",
    },
    {
      question: "How can I contact my project team?",
      answer:
        "You can communicate with your project team through the messaging system within each project, or by submitting a support ticket for urgent matters.",
      category: "Communication",
    },
    {
      question: "What if I'm not satisfied with the work?",
      answer:
        "We have a satisfaction guarantee policy. If you're not satisfied with the work, please contact our support team within 7 days of delivery, and we'll address your concerns promptly.",
      category: "Quality",
    },
    {
      question: "Can I request changes to my project?",
      answer:
        "Yes, you can request changes to your project scope. Minor changes within the original agreement are typically included. Major changes may require additional time and cost.",
      category: "Projects",
    },
  ];

  const knowledgeBase = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of using your client dashboard",
      icon: BookOpen,
      category: "Onboarding",
      articles: 12,
    },
    {
      title: "Project Management",
      description: "Best practices for managing your projects effectively",
      icon: Target,
      category: "Projects",
      articles: 8,
    },
    {
      title: "Billing & Payments",
      description: "Everything you need to know about payments and invoicing",
      icon: TrendingUp,
      category: "Billing",
      articles: 6,
    },
    {
      title: "Technical Support",
      description: "Troubleshooting common technical issues",
      icon: Settings,
      category: "Technical",
      articles: 15,
    },
  ];

  const supportStats = [
    {
      title: "Open Tickets",
      value: supportTickets.filter((t) => t.status === "open").length,
      description: "Requiring attention",
      icon: MessageSquare,
      color: "from-red-400 to-pink-500",
      bgColor: "from-red-500/10 to-pink-500/10",
    },
    {
      title: "In Progress",
      value: supportTickets.filter((t) => t.status === "in_progress").length,
      description: "Being resolved",
      icon: Clock,
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-500/10 to-orange-500/10",
    },
    {
      title: "Avg Response Time",
      value: "< 2h",
      description: "Typical response",
      icon: Zap,
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
    },
    {
      title: "Satisfaction Rate",
      value: "98%",
      description: "Client satisfaction",
      icon: Star,
      color: "from-emerald-400 to-teal-500",
      bgColor: "from-emerald-500/10 to-teal-500/10",
    },
  ];

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

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "in_progress":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "closed":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const filteredTickets = supportTickets.filter(
    (ticket) =>
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    console.log("Submitting ticket:", newTicket);
    // In real app, this would make an API call
    setShowNewTicketForm(false);
    setNewTicket({
      subject: "",
      category: "general",
      priority: "medium",
      description: "",
      attachments: [],
    });
  };

  const tabs = [
    { id: "tickets", label: "Support Tickets", icon: MessageSquare },
    { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
    { id: "faq", label: "FAQ", icon: HelpCircle },
    { id: "contact", label: "Contact", icon: Phone },
  ];

  const renderTicketsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-400/50 transition-colors"
            />
          </div>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Filter className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <button
          onClick={() => setShowNewTicketForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </button>
      </div>

      {/* Support Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket, index) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white hover:text-emerald-400 transition-colors">
                    {ticket.subject}
                  </h3>
                  <span className="font-mono text-xs text-gray-400">
                    #{ticket.id}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  {ticket.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Category: {ticket.category}</span>
                  <span>
                    Created: {new Date(ticket.createdDate).toLocaleDateString()}
                  </span>
                  <span>
                    Last Update:{" "}
                    {new Date(ticket.lastUpdate).toLocaleDateString()}
                  </span>
                  <span>{ticket.messages.length} messages</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                    ticket.priority
                  )}`}
                >
                  {ticket.priority.toUpperCase()}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {ticket.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <User className="w-4 h-4" />
                <span>Assigned to: Support Team</span>
              </div>
              <button className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
                View Details
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            No tickets found
          </h3>
          <p className="text-gray-400 mb-6">
            {searchQuery
              ? "No tickets match your search criteria."
              : "You haven't created any support tickets yet."}
          </p>
          <button
            onClick={() => setShowNewTicketForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Create New Ticket
          </button>
        </motion.div>
      )}
    </div>
  );

  const renderKnowledgeBaseTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {knowledgeBase.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400">{item.category}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {item.articles} articles
                </span>
                <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
                  Browse Articles →
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderFAQTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all duration-300"
          >
            <div className="flex items-start gap-3 mb-3">
              <HelpCircle className="w-5 h-5 text-emerald-400 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {item.question}
                </h3>
                <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
            </div>
            <p className="text-gray-300 text-sm">{item.answer}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContactTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Headphones className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Live Chat</h3>
          <p className="text-gray-400 text-sm mb-4">
            Get instant help from our support team
          </p>
          <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-all">
            Start Chat
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Phone Support</h3>
          <p className="text-gray-400 text-sm mb-4">
            Call us for urgent matters
          </p>
          <p className="text-white font-medium">+1 (555) 123-4567</p>
          <p className="text-gray-400 text-xs mt-1">Mon-Fri, 9AM-6PM EST</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
          <p className="text-gray-400 text-sm mb-4">
            Send us a detailed message
          </p>
          <p className="text-white font-medium">support@ctechlit.com</p>
          <p className="text-gray-400 text-xs mt-1">Response within 24h</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-black/50 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">
          Office Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-emerald-400 mt-1" />
            <div>
              <h4 className="font-medium text-white mb-1">Headquarters</h4>
              <p className="text-gray-400 text-sm">
                123 Tech Street
                <br />
                Suite 456
                <br />
                San Francisco, CA 94105
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-emerald-400 mt-1" />
            <div>
              <h4 className="font-medium text-white mb-1">Business Hours</h4>
              <p className="text-gray-400 text-sm">
                Monday - Friday: 9:00 AM - 6:00 PM
                <br />
                Saturday: 10:00 AM - 4:00 PM
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

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
            Support Center
          </h1>
          <p className="text-gray-400 mt-1">
            Get help and support whenever you need it
          </p>
        </div>
      </motion.div>

      {/* Support Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {supportStats.map((stat, index) => {
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

      {/* Tab Content */}
      {activeTab === "tickets" && renderTicketsTab()}
      {activeTab === "knowledge" && renderKnowledgeBaseTab()}
      {activeTab === "faq" && renderFAQTab()}
      {activeTab === "contact" && renderContactTab()}

      {/* New Ticket Modal */}
      {showNewTicketForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/95 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Create New Support Ticket
              </h2>
              <button
                onClick={() => setShowNewTicketForm(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, subject: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-400/50 transition-colors"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newTicket.category}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, category: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-400/50 transition-colors"
                  >
                    <option value="general">General</option>
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="feature_request">Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, priority: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-400/50 transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-400/50 transition-colors"
                  placeholder="Please provide detailed information about your issue..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Attachments (Optional)
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-emerald-400/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">
                    Click to upload files or drag and drop
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-white font-medium hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTicketForm(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
