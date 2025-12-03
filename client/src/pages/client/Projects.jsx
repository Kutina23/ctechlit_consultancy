import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  Search,
  Eye,
  Calendar,
  DollarSign,
  User,
  Users,
  TrendingUp,
  Star,
  Award,
  Target,
  Zap,
  Download,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Globe,
  Code,
  Smartphone,
  Monitor,
  Database,
  Cloud,
  Palette,
  BarChart3,
  MessageSquare,
  FileText,
  Settings,
  X,
} from "lucide-react";

const Projects = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  // Sample projects data - in real app this would come from API
  const projects = [
    {
      id: 1,
      title: "E-commerce Platform Development",
      category: "Web Development",
      status: "in_progress",
      priority: "high",
      progress: 75,
      startDate: "2024-11-01",
      dueDate: "2025-01-15",
      budget: "₵180,000",
      client: "Acme Corporation",
      team: ["Alice Johnson", "Bob Smith", "Charlie Brown"],
      description:
        "Building a modern e-commerce platform with advanced features including payment integration, inventory management, and customer analytics.",
      deliverables: [
        "Frontend Development",
        "Backend API",
        "Payment Integration",
        "Admin Dashboard",
      ],
      milestones: [
        { title: "Design Phase", completed: true, date: "2024-11-15" },
        { title: "Frontend Development", completed: true, date: "2024-12-10" },
        { title: "Backend Development", completed: true, date: "2024-12-20" },
        { title: "Testing & QA", completed: false, date: "2025-01-05" },
        { title: "Deployment", completed: false, date: "2025-01-15" },
      ],
      files: [
        { name: "Project_Requirements.pdf", size: "2.4 MB", type: "PDF" },
        { name: "UI_Mockups.figma", size: "15.2 MB", type: "Design" },
        { name: "API_Documentation.md", size: "1.1 MB", type: "Documentation" },
      ],
    },
    {
      id: 2,
      title: "Mobile App UI/UX Design",
      category: "Design",
      status: "completed",
      priority: "medium",
      progress: 100,
      startDate: "2024-10-15",
      dueDate: "2024-12-20",
      budget: "₵102,000",
      client: "TechStart Inc",
      team: ["Diana Prince", "Eve Wilson"],
      description:
        "Complete mobile app interface design and user experience optimization for a fitness tracking application.",
      deliverables: ["User Research", "Wireframes", "UI Design", "Prototype"],
      milestones: [
        { title: "Research & Planning", completed: true, date: "2024-10-30" },
        { title: "Wireframing", completed: true, date: "2024-11-10" },
        { title: "Visual Design", completed: true, date: "2024-11-25" },
        { title: "Prototyping", completed: true, date: "2024-12-10" },
        { title: "Final Handoff", completed: true, date: "2024-12-20" },
      ],
      files: [
        { name: "User_Research_Report.pdf", size: "3.1 MB", type: "PDF" },
        { name: "Final_Designs.sketch", size: "28.5 MB", type: "Design" },
        { name: "Interactive_Prototype.pdf", size: "8.7 MB", type: "PDF" },
      ],
    },
    {
      id: 3,
      title: "Cloud Infrastructure Setup",
      category: "Infrastructure",
      status: "pending",
      priority: "high",
      progress: 10,
      startDate: "2024-12-20",
      dueDate: "2025-02-01",
      budget: "₵300,000",
      client: "DataFlow Systems",
      team: ["Frank Castle", "Grace Hopper"],
      description:
        "Complete cloud migration and infrastructure setup for a data analytics platform with high availability requirements.",
      deliverables: [
        "Cloud Architecture",
        "Migration Plan",
        "Security Setup",
        "Monitoring",
      ],
      milestones: [
        { title: "Assessment", completed: false, date: "2024-12-25" },
        { title: "Architecture Design", completed: false, date: "2025-01-05" },
        { title: "Migration Phase 1", completed: false, date: "2025-01-20" },
        { title: "Migration Phase 2", completed: false, date: "2025-02-01" },
        { title: "Final Testing", completed: false, date: "2025-02-10" },
      ],
      files: [],
    },
    {
      id: 4,
      title: "AI-Powered Analytics Dashboard",
      category: "AI/ML",
      status: "in_review",
      priority: "high",
      progress: 90,
      startDate: "2024-11-10",
      dueDate: "2025-01-10",
      budget: "₵420,000",
      client: "Analytics Pro",
      team: ["Henry Jekyll", "Iris West"],
      description:
        "Building an AI-powered analytics dashboard with machine learning insights and predictive analytics capabilities.",
      deliverables: [
        "Data Pipeline",
        "ML Models",
        "Dashboard UI",
        "API Integration",
      ],
      milestones: [
        { title: "Data Analysis", completed: true, date: "2024-11-20" },
        { title: "Model Development", completed: true, date: "2024-12-05" },
        { title: "Dashboard Development", completed: true, date: "2024-12-20" },
        { title: "Integration Testing", completed: true, date: "2025-01-05" },
        { title: "Client Review", completed: false, date: "2025-01-10" },
      ],
      files: [
        { name: "Data_Analysis_Report.pdf", size: "4.2 MB", type: "PDF" },
        {
          name: "ML_Model_Specifications.md",
          size: "2.8 MB",
          type: "Documentation",
        },
      ],
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Web Development":
        return <Monitor className="w-5 h-5" />;
      case "Design":
        return <Palette className="w-5 h-5" />;
      case "Infrastructure":
        return <Cloud className="w-5 h-5" />;
      case "AI/ML":
        return <BarChart3 className="w-5 h-5" />;
      default:
        return <Code className="w-5 h-5" />;
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesTab = activeTab === "all" || project.status === activeTab;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = [
    {
      title: "Total Projects",
      value: projects.length,
      description: "All projects",
      icon: Briefcase,
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
    },
    {
      title: "Active Projects",
      value: projects.filter((p) => p.status === "in_progress").length,
      description: "Currently running",
      icon: Zap,
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-500/10 to-orange-500/10",
    },
    {
      title: "Completed",
      value: projects.filter((p) => p.status === "completed").length,
      description: "Successfully delivered",
      icon: CheckCircle,
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-500/10 to-emerald-500/10",
    },
    {
      title: "Total Value",
      value:
        "₵" +
        projects
          .reduce((sum, p) => sum + parseInt(p.budget.replace(/[₵,]/g, "")), 0)
          .toLocaleString(),
      description: "Combined budget",
      icon: DollarSign,
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
    },
  ];

  const tabs = [
    { id: "all", label: "All Projects", count: projects.length },
    {
      id: "in_progress",
      label: "In Progress",
      count: projects.filter((p) => p.status === "in_progress").length,
    },
    {
      id: "completed",
      label: "Completed",
      count: projects.filter((p) => p.status === "completed").length,
    },
    {
      id: "pending",
      label: "Pending",
      count: projects.filter((p) => p.status === "pending").length,
    },
  ];

  const ProjectCard = ({ project }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 group cursor-pointer"
      onClick={() => setSelectedProject(project)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
            {getCategoryIcon(project.category)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-gray-400">{project.client}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusIcon(project.status)}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              project.status
            )}`}
          >
            {project.status.replace("_", " ").toUpperCase()}
          </span>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          Due: {new Date(project.dueDate).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          {project.budget}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {project.team.length} members
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Progress</span>
          <span className="text-sm font-medium text-white">
            {project.progress}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.team.slice(0, 3).map((member, idx) => (
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
          {project.team.length > 3 && (
            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center border-2 border-black">
              <span className="text-xs text-white">
                +{project.team.length - 3}
              </span>
            </div>
          )}
        </div>

        <button className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
          View Details
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );

  const ProjectDetail = ({ project, onClose }) => {
    if (!project) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-black/95 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                {getCategoryIcon(project.category)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {project.title}
                </h2>
                <p className="text-gray-400">{project.client}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-3">
                  Description
                </h3>
                <p className="text-gray-300">{project.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">
                  Deliverables
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {project.deliverables.map((deliverable, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-gray-300">
                        {deliverable}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">
                  Milestones
                </h3>
                <div className="space-y-3">
                  {project.milestones.map((milestone, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        milestone.completed
                          ? "bg-emerald-500/10 border border-emerald-400/20"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      {milestone.completed ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white">
                          {milestone.title}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {new Date(milestone.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {project.files.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    Files & Documents
                  </h3>
                  <div className="space-y-2">
                    {project.files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-emerald-400" />
                          <div>
                            <h4 className="text-sm font-medium text-white">
                              {file.name}
                            </h4>
                            <p className="text-xs text-gray-400">
                              {file.type} • {file.size}
                            </p>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-3">
                  Project Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Status</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Category</span>
                    <span className="text-sm text-white">
                      {project.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Budget</span>
                    <span className="text-sm text-white">{project.budget}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Start Date</span>
                    <span className="text-sm text-white">
                      {new Date(project.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Due Date</span>
                    <span className="text-sm text-white">
                      {new Date(project.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">
                  Team Members
                </h3>
                <div className="space-y-2">
                  {project.team.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {member.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-300">{member}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">Progress</h3>
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">Completion</span>
                    <span className="text-sm font-medium text-white">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
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
            Projects
          </h1>
          <p className="text-gray-400 mt-1">
            Manage and track all your projects
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-400/50 transition-colors"
            />
          </div>

          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Filter className="w-4 h-4 text-gray-400" />
          </button>

          <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Project
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

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>

      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            No projects found
          </h3>
          <p className="text-gray-400 mb-6">
            {searchQuery
              ? "No projects match your search criteria."
              : "You haven't started any projects yet."}
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-2 mx-auto">
            <Plus className="w-4 h-4" />
            Create New Project
          </button>
        </motion.div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default Projects;
