import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useAdminContent, useAdminMedia } from "../../hooks/useApi";
import {
  Globe,
  Edit,
  Eye,
  Plus,
  Search,
  Filter,
  Save,
  X,
  Upload,
  Download,
  Image,
  FileText,
  Video,
  Music,
  Link,
  ExternalLink,
  Calendar,
  User,
  Clock,
  Star,
  TrendingUp,
  Activity,
  BarChart3,
  MoreVertical,
  Trash2,
  Copy,
  Share2,
  Settings,
  Tag,
  EyeOff,
  Lock,
  Unlock,
  Send,
  Mail,
  Bell,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  ArrowUpDown,
  Archive,
} from "lucide-react";

const SiteContent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pages");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewContent, setShowNewContent] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [copySuccess, setCopySuccess] = useState("");
  const [newContentType, setNewContentType] = useState("page");
  const [newContentTitle, setNewContentTitle] = useState("");
  const [newContentDescription, setNewContentDescription] = useState("");
  const [newContentPage, setNewContentPage] = useState("");
  const [newContentSection, setNewContentSection] = useState("");
  const [newContentSlug, setNewContentSlug] = useState("");
  const [newContentCategory, setNewContentCategory] = useState("");
  const [newContentTags, setNewContentTags] = useState("");
  const [newContentAlt, setNewContentAlt] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Use the admin content API hook
  const {
    content,
    loading,
    createContent,
    deleteContent,
    updateContent,
    refetch,
  } = useAdminContent();

  // Use the admin media API hook
  const {
    media,
    loading: mediaLoading,
    deleteMedia,
    refetch: refetchMedia,
  } = useAdminMedia();

  // Calculate stats dynamically from actual content data
  const stats = React.useMemo(() => {
    // Ensure content exists and has the expected structure
    const pages = content?.pages || [];
    const blogPosts = content?.blogPosts || [];
    const media = content?.media || [];

    return [
      {
        title: "Total Pages",
        value: pages.length,
        description: `${
          pages.filter((p) => p.status === "published").length
        } published, ${
          pages.filter((p) => p.status === "draft").length
        } drafts`,
        icon: Globe,
        color: "from-blue-400 to-cyan-500",
        bgColor: "from-blue-500/10 to-cyan-500/10",
        trend: pages.length > 0 ? "+" + Math.floor(Math.random() * 5) : "0",
      },
      {
        title: "Blog Posts",
        value: blogPosts.length,
        description: `${
          blogPosts.filter((p) => p.status === "published").length
        } published, ${
          blogPosts.filter((p) => p.status === "draft").length
        } drafts`,
        icon: FileText,
        color: "from-green-400 to-emerald-500",
        bgColor: "from-green-500/10 to-emerald-500/10",
        trend: blogPosts.length > 0 ? "+" + Math.floor(Math.random() * 3) : "0",
      },
      {
        title: "Media Files",
        value: media.length,
        description: `${
          media.filter((m) => m.type === "image").length
        } images, ${media.filter((m) => m.type === "video").length} videos`,
        icon: Image,
        color: "from-purple-400 to-pink-500",
        bgColor: "from-purple-500/10 to-pink-500/10",
        trend: media.length > 0 ? "+" + Math.floor(Math.random() * 2) : "0",
      },
      {
        title: "Total Views",
        value: pages
          .reduce((sum, page) => sum + (page.views || 0), 0)
          .toLocaleString(),
        description: "Monthly page views",
        icon: Eye,
        color: "from-orange-400 to-red-500",
        bgColor: "from-orange-500/10 to-red-500/10",
        trend:
          pages.length > 0 ? "+" + Math.floor(Math.random() * 10) + "%" : "0%",
      },
    ];
  }, [content]);

  // Use API data with fallback to sample data, combining content and media
  const siteContent = React.useMemo(() => {
    const baseContent = content || {
      pages: [
        {
          id: 1,
          title: "Home",
          slug: "/",
          status: "published",
          lastModified: "2024-12-20",
          author: "Admin User",
          views: 15420,
          seoScore: 95,
          featured: true,
          description: "Welcome page with company overview and services",
        },
        {
          id: 2,
          title: "About Us",
          slug: "/about",
          status: "published",
          lastModified: "2024-12-15",
          author: "Content Team",
          views: 8930,
          seoScore: 88,
          featured: true,
          description: "Company history, mission, and team information",
        },
        {
          id: 3,
          title: "Services",
          slug: "/services",
          status: "published",
          lastModified: "2024-12-18",
          author: "Admin User",
          views: 12650,
          seoScore: 92,
          featured: true,
          description: "Detailed overview of our consultancy services",
        },
        {
          id: 4,
          title: "Contact",
          slug: "/contact",
          status: "published",
          lastModified: "2024-12-10",
          author: "Support Team",
          views: 6780,
          seoScore: 85,
          featured: false,
          description: "Contact information and inquiry form",
        },
        {
          id: 5,
          title: "Privacy Policy",
          slug: "/privacy",
          status: "published",
          lastModified: "2024-11-30",
          author: "Legal Team",
          views: 2340,
          seoScore: 78,
          featured: false,
          description: "Privacy policy and data protection information",
        },
        {
          id: 6,
          title: "Blog",
          slug: "/blog",
          status: "draft",
          lastModified: "2024-12-22",
          author: "Content Team",
          views: 0,
          seoScore: 0,
          featured: false,
          description: "Company blog and industry insights",
        },
      ],
      blogPosts: [
        {
          id: 1,
          title: "The Future of Web Development in 2025",
          slug: "/blog/future-web-development-2025",
          status: "published",
          publishDate: "2024-12-20",
          author: "Tech Lead",
          views: 3420,
          likes: 89,
          comments: 12,
          featured: true,
          category: "Technology",
          tags: ["web development", "trends", "2025"],
          excerpt:
            "Exploring the emerging technologies and methodologies that will shape web development in the coming year.",
        },
        {
          id: 2,
          title: "Why Your Business Needs a Digital Transformation",
          slug: "/blog/digital-transformation-business",
          status: "published",
          publishDate: "2024-12-18",
          author: "Strategy Consultant",
          views: 2890,
          likes: 76,
          comments: 8,
          featured: false,
          category: "Business",
          tags: ["digital transformation", "business strategy", "technology"],
          excerpt:
            "Understanding the importance of digital transformation for modern businesses and how to implement it effectively.",
        },
        {
          id: 3,
          title: "UI/UX Design Principles for Better User Experience",
          slug: "/blog/ui-ux-design-principles",
          status: "published",
          publishDate: "2024-12-15",
          author: "Design Lead",
          views: 4150,
          likes: 124,
          comments: 23,
          featured: true,
          category: "Design",
          tags: ["UI/UX", "design principles", "user experience"],
          excerpt:
            "Essential principles and best practices for creating intuitive and engaging user interfaces.",
        },
        {
          id: 4,
          title: "Cloud Security Best Practices for Enterprises",
          slug: "/blog/cloud-security-best-practices",
          status: "draft",
          publishDate: null,
          author: "Security Expert",
          views: 0,
          likes: 0,
          comments: 0,
          featured: false,
          category: "Security",
          tags: ["cloud security", "enterprise", "best practices"],
          excerpt:
            "Comprehensive guide to securing your cloud infrastructure and protecting sensitive data.",
        },
      ],
      media: [
        {
          id: 1,
          filename: "hero-banner.jpg",
          type: "image",
          size: "2.4 MB",
          uploadDate: "2024-12-20",
          url: "/uploads/hero-banner.jpg",
          usedIn: ["Home page", "About page"],
          alt: "Modern office workspace with team collaboration",
        },
        {
          id: 2,
          filename: "team-photo.jpg",
          type: "image",
          size: "3.1 MB",
          uploadDate: "2024-12-18",
          url: "/uploads/team-photo.jpg",
          usedIn: ["About page"],
          alt: "CTechLit team members in modern office",
        },
        {
          id: 3,
          filename: "company-presentation.mp4",
          type: "video",
          size: "45.2 MB",
          uploadDate: "2024-12-15",
          url: "/uploads/company-presentation.mp4",
          usedIn: ["Services page"],
          alt: "Company presentation and capabilities overview",
        },
        {
          id: 4,
          filename: "brand-logo.svg",
          type: "image",
          size: "45 KB",
          uploadDate: "2024-12-10",
          url: "/uploads/brand-logo.svg",
          usedIn: ["Header", "Footer", "All pages"],
          alt: "CTechLit Consultancy logo",
        },
      ],
    };

    // Use media from the new hook if available, otherwise fall back to content.media
    const mediaData = media && media.length > 0 ? media : baseContent.media;

    return {
      ...baseContent,
      media: mediaData,
    };
  }, [content, media]);

  const contentSettings = {
    seo: {
      siteTitle: "CTechLit Consultancy",
      siteDescription:
        "Professional technology consultancy services for modern businesses",
      keywords:
        "technology consulting, web development, digital transformation, software solutions",
      googleAnalytics: "GA-XXXXXXXXX",
      googleTagManager: "GTM-XXXXXXX",
    },
    social: {
      facebook: "https://facebook.com/ctechlit",
      twitter: "https://twitter.com/ctechlit",
      linkedin: "https://linkedin.com/company/ctechlit",
      instagram: "https://instagram.com/ctechlit",
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      newUserAlerts: true,
      systemAlerts: true,
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "draft":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "scheduled":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "archived":
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "published":
        return <CheckCircle className="w-5 h-5" />;
      case "draft":
        return <Edit className="w-5 h-5" />;
      case "scheduled":
        return <Clock className="w-5 h-5" />;
      case "archived":
        return <Archive className="w-5 h-5" />;
      default:
        return <Edit className="w-5 h-5" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "image":
        return <Image className="w-6 h-6 text-white" />;
      case "video":
        return <Video className="w-6 h-6 text-white" />;
      case "audio":
        return <Music className="w-6 h-6 text-white" />;
      default:
        return <FileText className="w-6 h-6 text-white" />;
    }
  };

  // File handling functions
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/avi",
      "video/mov",
      "video/wmv",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid image or video file");
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert("File size must be less than 50MB");
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview("");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview("");
    // Reset file input
    const fileInput = document.getElementById("media-file-input");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  };

  const handleContentTypeChange = (type) => {
    setNewContentType(type);
    // Reset form when type changes
    setNewContentTitle("");
    setNewContentDescription("");
    setNewContentPage("");
    setNewContentSection("");
    setNewContentSlug("");
    setNewContentCategory("");
    setNewContentTags("");
    setNewContentAlt("");
    setSelectedFile(null);
    setFilePreview("");
    removeSelectedFile();
  };

  const handleTitleChange = (title) => {
    setNewContentTitle(title);
    // Auto-generate slug for blog posts
    if (newContentType === "blog" && !newContentSlug) {
      setNewContentSlug(generateSlug(title));
    }
  };

  // Handle creating new content
  const handleCreateContent = async () => {
    try {
      setUploading(true);

      // Validate required fields based on content type
      if (newContentType === "page") {
        if (!newContentTitle.trim() || !newContentPage.trim()) {
          alert("Please fill in all required fields for page content");
          setUploading(false);
          return;
        }
      } else if (newContentType === "blog") {
        if (
          !newContentTitle.trim() ||
          !newContentDescription.trim() ||
          !newContentCategory.trim()
        ) {
          alert("Please fill in all required fields for blog post");
          setUploading(false);
          return;
        }
      } else if (newContentType === "media") {
        if (!selectedFile || !newContentAlt.trim()) {
          alert("Please select a file and provide alt text for media content");
          setUploading(false);
          return;
        }
      }

      let contentData;
      let successMessage = "Content created successfully!";
      let isMediaUpload = false;

      if (newContentType === "media" && selectedFile) {
        // Handle file upload for media content
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("page", "media");
        formData.append("section", "uploads");
        formData.append("contentType", "json");
        formData.append(
          "metadata",
          JSON.stringify({
            alt: newContentAlt,
            type: selectedFile.type,
            size: selectedFile.size,
            filename: selectedFile.name,
            createdBy: user?.id,
          })
        );

        // Make API call to upload file
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("File upload failed");
        }

        const result = await response.json();
        console.log("File uploaded successfully:", result);
        successMessage = "Media file uploaded successfully!";
        isMediaUpload = true;
      } else if (newContentType === "blog" && selectedFile) {
        // Handle blog post with featured image
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("page", "blog");
        formData.append("section", "featured");
        formData.append("contentType", "json");
        formData.append(
          "metadata",
          JSON.stringify({
            alt: newContentAlt || `${newContentTitle} featured image`,
            type: selectedFile.type,
            size: selectedFile.size,
            filename: selectedFile.name,
            createdBy: user?.id,
            isBlogFeatured: true,
            blogTitle: newContentTitle,
          })
        );

        // Upload featured image first
        const uploadResponse = await fetch("/api/admin/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Featured image upload failed");
        }

        const uploadResult = await uploadResponse.json();
        console.log("Featured image uploaded successfully:", uploadResult);

        // Create blog post with featured image reference
        contentData = {
          page: "blog",
          section: "posts",
          content: JSON.stringify({
            ...getContentData(),
            featuredImage: uploadResult.data?.filename || selectedFile.name,
            featuredImageUrl: uploadResult.data?.filePath || "",
          }),
          contentType: "json",
          metadata: {
            ...getMetadata(),
            hasFeaturedImage: true,
            featuredImageFilename: selectedFile.name,
          },
        };

        successMessage = "Blog post with featured image created successfully!";
      } else {
        // Handle regular content creation
        contentData = {
          page: newContentPage || newContentType,
          section: newContentSection || "main",
          content: JSON.stringify(getContentData()),
          contentType: "json",
          metadata: getMetadata(),
        };

        successMessage = `${
          newContentType === "page" ? "Page" : "Blog post"
        } created successfully!`;
      }

      // Create content if not handled by media upload
      if (!isMediaUpload && contentData) {
        await createContent(contentData);
      }

      // Reset form and close modal
      resetForm();
      setShowNewContent(false);

      // Refetch content to update stats and tabs - multiple times to ensure consistency
      await refetch();

      // Small delay to ensure backend has processed the update
      setTimeout(async () => {
        await refetch();
      }, 500);

      // Show success message
      setCopySuccess(successMessage);
      setTimeout(() => setCopySuccess(""), 3000);

      // Ensure the current tab shows updated content
      if (activeTab === "pages" && newContentType === "page") {
        setActiveTab("pages");
      } else if (activeTab === "blog" && newContentType === "blog") {
        setActiveTab("blog");
      } else if (
        activeTab === "media" &&
        (newContentType === "media" ||
          (newContentType === "blog" && selectedFile))
      ) {
        setActiveTab("media");
      }
    } catch (error) {
      console.error("Failed to create content:", error);
      setCopySuccess(`Failed to create content: ${error.message}`);
      setTimeout(() => setCopySuccess(""), 3000);
    } finally {
      setUploading(false);
    }
  };

  const getContentData = () => {
    const baseContent = {
      title: newContentTitle,
      description: newContentDescription,
    };

    if (newContentType === "page") {
      return {
        ...baseContent,
        page: newContentPage,
        section: newContentSection,
      };
    } else if (newContentType === "blog") {
      return {
        ...baseContent,
        slug: newContentSlug,
        category: newContentCategory,
        tags: newContentTags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        excerpt: newContentDescription,
      };
    }

    return baseContent;
  };

  const getMetadata = () => {
    const baseMetadata = {
      featured: false,
      createdBy: user?.id,
    };

    if (newContentType === "blog") {
      return {
        ...baseMetadata,
        category: newContentCategory,
        tags: newContentTags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };
    }

    return baseMetadata;
  };

  const resetForm = () => {
    setNewContentTitle("");
    setNewContentDescription("");
    setNewContentPage("");
    setNewContentSection("");
    setNewContentSlug("");
    setNewContentCategory("");
    setNewContentTags("");
    setNewContentAlt("");
    setSelectedFile(null);
    setFilePreview("");
    setNewContentType("page");
  };

  // Handle deleting content
  const handleDeleteContent = async (id) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      try {
        await deleteContent(id);
        // Refetch both content and media to update the list and stats
        await refetch();
        await refetchMedia();
        setCopySuccess("Content deleted successfully!");
        setTimeout(() => setCopySuccess(""), 3000);
      } catch (error) {
        console.error("Failed to delete content:", error);
        setCopySuccess("Failed to delete content. Please try again.");
        setTimeout(() => setCopySuccess(""), 3000);
      }
    }
  };

  // Handle deleting media files specifically
  const handleDeleteMedia = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this media file? This action cannot be undone."
      )
    ) {
      try {
        await deleteMedia(id);
        setCopySuccess("Media file deleted successfully!");
        setTimeout(() => setCopySuccess(""), 3000);
      } catch (error) {
        console.error("Failed to delete media:", error);
        setCopySuccess("Failed to delete media file. Please try again.");
        setTimeout(() => setCopySuccess(""), 3000);
      }
    }
  };

  // Handle editing content
  const handleEditContent = (contentItem) => {
    setEditingContent(contentItem);
    setEditMode(true);
  };

  // Handle copying URL
  const handleCopyUrl = async (contentItem) => {
    try {
      const url = `${window.location.origin}${
        contentItem.slug || `/${contentItem.page}`
      }`;
      await navigator.clipboard.writeText(url);
      setCopySuccess(`URL copied: ${url}`);
      setTimeout(() => setCopySuccess(""), 3000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
      setCopySuccess("Failed to copy URL");
      setTimeout(() => setCopySuccess(""), 3000);
    }
  };

  // Handle saving edited content
  const handleSaveEdit = async () => {
    if (!editingContent) return;

    try {
      // For now, we'll just close the edit modal
      // In a full implementation, you'd call updateContent here
      setEditMode(false);
      setEditingContent(null);
      refetch(); // Refresh to show changes
    } catch (error) {
      console.error("Failed to update content:", error);
    }
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingContent(null);
  };

  const tabs = React.useMemo(() => {
    const pages = content?.pages || [];
    const blogPosts = content?.blogPosts || [];
    const media = content?.media || [];

    // Count blog posts with featured images
    const blogPostsWithMedia = blogPosts.filter(
      (post) => post.featuredImage || post.hasFeaturedImage
    ).length;

    return [
      {
        id: "pages",
        label: "Pages",
        icon: Globe,
        count: pages.length,
        description: `${
          pages.filter((p) => p.status === "published").length
        } published`,
      },
      {
        id: "blog",
        label: "Blog Posts",
        icon: FileText,
        count: blogPosts.length,
        description: `${
          blogPosts.filter((p) => p.status === "published").length
        } published, ${blogPostsWithMedia} with media`,
      },
      {
        id: "media",
        label: "Media Library",
        icon: Image,
        count: media.length,
        description: `${
          media.filter((m) => m.type === "image").length
        } images, ${media.filter((m) => m.type === "video").length} videos`,
      },
      { id: "settings", label: "Settings", icon: Settings, count: null },
    ];
  }, [content]);

  const renderPagesTab = () => {
    const pages = content?.pages || [];

    if (pages.length === 0) {
      return (
        <div className="text-center py-20">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-400 mb-2">
            No pages created yet
          </h3>
          <p className="text-gray-500">Create your first page to get started</p>
        </div>
      );
    }

    return (
      <div className="space-y-10">
        {pages.map((page) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-10 lg:p-12 hover:bg-white/5 transition-all duration-300 group"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {page.title}
                  </h3>
                  {page.featured && (
                    <span className="px-4 py-2 bg-yellow-400/20 border border-yellow-400/30 rounded-full text-sm text-yellow-400 font-medium">
                      FEATURED
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-base mb-4">
                  {page.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-base text-gray-400">
                  <span>Slug: {page.slug}</span>
                  <span>Views: {(page.views || 0).toLocaleString()}</span>
                  <span>SEO Score: {page.seoScore || 0}/100</span>
                  <span>Author: {page.author || "Unknown"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusIcon(page.status)}
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                    page.status
                  )}`}
                >
                  {page.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-base text-gray-400">
                Last modified:{" "}
                {page.lastModified
                  ? new Date(page.lastModified).toLocaleDateString()
                  : "Unknown"}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.open(page.slug, "_blank")}
                  className="p-3 hover:bg-white/10 rounded-lg transition-colors"
                  title="View page"
                >
                  <Eye className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={() => handleEditContent(page)}
                  className="p-3 hover:bg-white/10 rounded-lg transition-colors"
                  title="Edit content"
                >
                  <Edit className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={() => handleCopyUrl(page)}
                  className="p-3 hover:bg-white/10 rounded-lg transition-colors"
                  title="Copy URL"
                >
                  <Copy className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={() => handleDeleteContent(page.id)}
                  className="p-3 hover:bg-red-500/20 rounded-lg transition-colors"
                  title="Delete content"
                >
                  <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-400" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderBlogTab = () => {
    const blogPosts = content?.blogPosts || [];

    // Calculate media statistics for blog posts
    const blogPostsWithMedia = blogPosts.filter(
      (post) => post.featuredImage || post.hasFeaturedImage
    ).length;
    const totalBlogMedia = blogPostsWithMedia;

    if (blogPosts.length === 0) {
      return (
        <div className="text-center py-20">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-400 mb-2">
            No blog posts created yet
          </h3>
          <p className="text-gray-500">
            Create your first blog post to get started
          </p>
        </div>
      );
    }

    // Media usage summary for blog posts
    const mediaSummary =
      totalBlogMedia > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-purple-500/10 border border-purple-400/20 rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <Image className="w-8 h-8 text-purple-400" />
            <div>
              <h3 className="text-lg font-medium text-purple-400">
                Blog Media Integration
              </h3>
              <p className="text-sm text-gray-400">
                {blogPostsWithMedia} blog posts with featured images •{" "}
                {totalBlogMedia} total media files
              </p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setActiveTab("media")}
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 text-sm font-medium transition-colors"
              >
                View Media
              </button>
            </div>
          </div>
        </motion.div>
      ) : null;

    return (
      <div className="space-y-10">
        {mediaSummary}
        {blogPosts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-10 lg:p-12 hover:bg-white/5 transition-all duration-300 group"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {post.title}
                  </h3>
                  {post.featured && (
                    <span className="px-4 py-2 bg-yellow-400/20 border border-yellow-400/30 rounded-full text-sm text-yellow-400 font-medium">
                      FEATURED
                    </span>
                  )}
                  {post.featuredImage && (
                    <span className="px-4 py-2 bg-purple-400/20 border border-purple-400/30 rounded-full text-sm text-purple-400 font-medium">
                      HAS MEDIA
                    </span>
                  )}
                </div>

                {/* Featured Image Display */}
                {post.featuredImage &&
                  (() => {
                    const fixFilename = (filename) => {
                      if (!filename) return filename;
                      // Replace spaces and parentheses with underscores to match actual files
                      let fixedFilename = filename
                        .replace(/\s+/g, "_")
                        .replace(/\(/g, "_")
                        .replace(/\)/g, "_");
                      // Clean up multiple underscores
                      fixedFilename = fixedFilename.replace(/_+/g, "_");
                      return fixedFilename;
                    };

                    const fixedImageName = fixFilename(post.featuredImage);
                    const imageSrc =
                      post.featuredImageUrl ||
                      `http://localhost:5000/uploads/${fixedImageName}`;

                    return (
                      <div className="mb-4">
                        <div className="w-full h-48 bg-gray-800 rounded-lg overflow-hidden">
                          <img
                            src={imageSrc}
                            alt={`Featured image for ${post.title}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error(
                                "Featured image failed to load:",
                                imageSrc,
                                "Original:",
                                post.featuredImage
                              );
                              // Try with original filename as fallback
                              if (
                                post.featuredImage &&
                                imageSrc !==
                                  `http://localhost:5000/uploads/${post.featuredImage}`
                              ) {
                                e.target.src = `http://localhost:5000/uploads/${post.featuredImage}`;
                              } else {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }
                            }}
                          />
                          <div
                            className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center"
                            style={{ display: "none" }}
                          >
                            <Image className="w-10 h-10 text-gray-400" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Featured image: {post.featuredImage}
                        </p>
                      </div>
                    );
                  })()}

                <p className="text-gray-400 text-base mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-base text-gray-400 mb-4">
                  <span>Category: {post.category || "Uncategorized"}</span>
                  <span>Views: {(post.views || 0).toLocaleString()}</span>
                  <span>Likes: {post.likes || 0}</span>
                  <span>Comments: {post.comments || 0}</span>
                  <span>Author: {post.author || "Unknown"}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {(post.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-sm text-cyan-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusIcon(post.status)}
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                    post.status
                  )}`}
                >
                  {post.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-base text-gray-400">
                {post.publishDate
                  ? `Published: ${new Date(
                      post.publishDate
                    ).toLocaleDateString()}`
                  : "Not published"}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.open(post.slug, "_blank")}
                  className="p-3 hover:bg-white/10 rounded-lg transition-colors"
                  title="View post"
                >
                  <Eye className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={() => handleEditContent(post)}
                  className="p-3 hover:bg-white/10 rounded-lg transition-colors"
                  title="Edit post"
                >
                  <Edit className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={() => handleCopyUrl(post)}
                  className="p-3 hover:bg-white/10 rounded-lg transition-colors"
                  title="Copy URL"
                >
                  <Share2 className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={() => handleDeleteContent(post.id)}
                  className="p-3 hover:bg-red-500/20 rounded-lg transition-colors"
                  title="Delete post"
                >
                  <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-400" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderMediaTab = () => {
    // Enhanced media processing to properly categorize files and track usage
    const mediaItems = (content?.media || []).map((media) => {
      // Parse content and metadata if they're strings
      let contentData = {};
      let metadata = {};

      try {
        if (typeof media.content === "string") {
          contentData = JSON.parse(media.content);
        } else {
          contentData = media.content || {};
        }
      } catch (e) {
        contentData = { title: media.filename || "Unknown", description: "" };
      }

      try {
        if (typeof media.metadata === "string") {
          metadata = JSON.parse(media.metadata);
        } else {
          metadata = media.metadata || {};
        }
      } catch (e) {
        metadata = {};
      }

      // Determine media type based on mimetype or file extension
      let mediaType = "image"; // default
      if (media.mimetype) {
        if (media.mimetype.startsWith("video/")) {
          mediaType = "video";
        } else if (media.mimetype.startsWith("audio/")) {
          mediaType = "audio";
        }
      } else if (media.filename) {
        const ext = media.filename.toLowerCase().split(".").pop();
        if (["mp4", "avi", "mov", "wmv", "flv", "webm"].includes(ext)) {
          mediaType = "video";
        } else if (["mp3", "wav", "flac", "aac", "ogg"].includes(ext)) {
          mediaType = "audio";
        }
      }

      // Enhanced usage tracking for blog featured images
      const usedIn = [];
      if (metadata.isBlogFeatured && metadata.blogTitle) {
        usedIn.push(`Blog: ${metadata.blogTitle}`);
      }
      if (contentData.usedIn && Array.isArray(contentData.usedIn)) {
        usedIn.push(...contentData.usedIn);
      } else if (contentData.usedIn) {
        usedIn.push(contentData.usedIn);
      }
      if (metadata.usedIn && Array.isArray(metadata.usedIn)) {
        usedIn.push(...metadata.usedIn);
      } else if (metadata.usedIn) {
        usedIn.push(metadata.usedIn);
      }

      // Determine usage context
      let usageContext = "General Media";
      if (metadata.isBlogFeatured) {
        usageContext = "Blog Featured Image";
      } else if (media.section === "hero") {
        usageContext = "Page Hero Section";
      } else if (media.section === "featured") {
        usageContext = "Featured Content";
      } else if (media.page === "blog") {
        usageContext = "Blog Content";
      }

      return {
        ...media,
        ...contentData,
        ...metadata,
        type: mediaType,
        // Ensure we have proper URLs
        url: metadata.filePath || contentData.path || media.url || "",
        filename:
          media.filename ||
          contentData.filename ||
          contentData.originalName ||
          "Unknown file",
        size: metadata.size || contentData.size || media.size || "Unknown size",
        usedIn,
        usageContext,
        isBlogFeatured: metadata.isBlogFeatured || false,
        blogTitle: metadata.blogTitle || null,
      };
    });

    if (mediaItems.length === 0) {
      return (
        <div className="text-center py-20">
          <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-400 mb-2">
            No media files uploaded yet
          </h3>
          <p className="text-gray-500">
            Upload your first image or video to get started
          </p>
        </div>
      );
    }

    // Calculate media usage statistics
    const blogMedia = mediaItems.filter((item) => item.isBlogFeatured);
    const generalMedia = mediaItems.filter((item) => !item.isBlogFeatured);
    const videoMedia = mediaItems.filter((item) => item.type === "video");
    const imageMedia = mediaItems.filter((item) => item.type === "image");

    const mediaUsageSummary = (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-400/20 rounded-xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {imageMedia.length}
            </div>
            <div className="text-sm text-gray-400">Images</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {videoMedia.length}
            </div>
            <div className="text-sm text-gray-400">Videos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {blogMedia.length}
            </div>
            <div className="text-sm text-gray-400">Blog Featured</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {generalMedia.length}
            </div>
            <div className="text-sm text-gray-400">General</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-sm text-gray-400 text-center">
            Total: {mediaItems.length} media files • Blog posts with media:{" "}
            {new Set(blogMedia.map((m) => m.blogTitle)).size}
          </p>
        </div>
      </motion.div>
    );

    return (
      <div>
        {mediaUsageSummary}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {mediaItems.map((media) => (
            <motion.div
              key={media.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-10 lg:p-12 hover:bg-white/5 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
                  {getTypeIcon(media.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {media.filename || media.originalName}
                  </h3>
                  <p className="text-base text-gray-400">
                    {media.size
                      ? typeof media.size === "string"
                        ? media.size
                        : `${(media.size / (1024 * 1024)).toFixed(2)} MB`
                      : "Unknown size"}
                  </p>
                </div>
              </div>

              {/* Display media content */}
              {media.type === "image" &&
                media.url &&
                (() => {
                  // Fix filename encoding issues
                  const fixFilename = (url) => {
                    if (!url) return url;
                    // Replace spaces and parentheses with underscores to match actual files
                    let fixedUrl = url
                      .replace(/\s+/g, "_")
                      .replace(/\(/g, "_")
                      .replace(/\)/g, "_");
                    // Clean up multiple underscores
                    fixedUrl = fixedUrl.replace(/_+/g, "_");
                    return fixedUrl;
                  };

                  const fixedUrl = fixFilename(media.url);
                  const imageSrc = fixedUrl.startsWith("http")
                    ? fixedUrl
                    : `http://localhost:5000${fixedUrl}`;

                  return (
                    <div className="w-full h-48 bg-gray-800 rounded-lg mb-6 overflow-hidden">
                      <img
                        src={imageSrc}
                        alt={media.alt || media.filename}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(
                            "Image failed to load:",
                            imageSrc,
                            "Original URL:",
                            media.url
                          );
                          // Try with the original URL as fallback
                          if (
                            imageSrc !== media.url &&
                            media.url.startsWith("http")
                          ) {
                            e.target.src = media.url;
                          } else {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }
                        }}
                        onLoad={() => {
                          console.log("Image loaded successfully:", imageSrc);
                        }}
                      />
                      <div
                        className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center"
                        style={{ display: "none" }}
                      >
                        <div className="text-center">
                          <Image className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">
                            Image failed to load
                          </p>
                          <p className="text-xs text-gray-600 mt-1 break-all">
                            {imageSrc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              {media.type === "video" && media.url && (
                <div className="w-full h-48 bg-gray-800 rounded-lg mb-6 overflow-hidden">
                  <video
                    src={media.url}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                    onError={(e) => {
                      console.error("Video failed to load:", media.url);
                    }}
                    onLoad={() => {
                      console.log("Video loaded successfully:", media.url);
                    }}
                  />
                </div>
              )}

              {!media.url && (
                <div className="w-full h-48 bg-gray-800 rounded-lg mb-6 flex items-center justify-center">
                  {media.type === "image" ? (
                    <Image className="w-10 h-10 text-gray-400" />
                  ) : media.type === "video" ? (
                    <Video className="w-10 h-10 text-gray-400" />
                  ) : (
                    <FileText className="w-10 h-10 text-gray-400" />
                  )}
                </div>
              )}

              <p className="text-base text-gray-400 mb-6">
                {media.alt || media.description || "No description available"}
              </p>

              {/* Media metadata */}
              <div className="text-sm text-gray-500 mb-4 space-y-1">
                {media.mimetype && <p>Type: {media.mimetype}</p>}
                <p>Usage: {media.usageContext}</p>
                {media.uploadDate && (
                  <p>
                    Uploaded: {new Date(media.uploadDate).toLocaleDateString()}
                  </p>
                )}
                {media.isBlogFeatured && media.blogTitle && (
                  <div className="p-2 bg-yellow-400/10 border border-yellow-400/20 rounded text-yellow-400 text-xs">
                    Featured image for blog post: "{media.blogTitle}"
                  </div>
                )}
                {media.usedIn && media.usedIn.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-400 mb-1">Used in:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {media.usedIn.map((usage, index) => (
                        <li key={index} className="text-gray-400 text-xs">
                          {usage}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-base text-gray-400">ID: {media.id}</span>

                <div className="flex items-center gap-3">
                  {media.url && (
                    <>
                      <button
                        onClick={() => window.open(media.url, "_blank")}
                        className="p-3 hover:bg-white/10 rounded-lg transition-colors"
                        title="View full size"
                      >
                        <Eye className="w-5 h-5 text-gray-400" />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(media.url);
                          setCopySuccess(`URL copied: ${media.url}`);
                          setTimeout(() => setCopySuccess(""), 3000);
                        }}
                        className="p-3 hover:bg-white/10 rounded-lg transition-colors"
                        title="Copy URL"
                      >
                        <Copy className="w-5 h-5 text-gray-400" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteMedia(media.id)}
                    className="p-3 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Delete media"
                  >
                    <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderSettingsTab = () => (
    <div className="space-y-10">
      {/* SEO Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-10 lg:p-12"
      >
        <h2 className="text-2xl font-bold text-white mb-8">SEO Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-medium text-gray-300 mb-3">
              Site Title
            </label>
            <input
              type="text"
              value={contentSettings.seo.siteTitle}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-300 mb-3">
              Site Description
            </label>
            <input
              type="text"
              value={contentSettings.seo.siteDescription}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-base font-medium text-gray-300 mb-3">
              Keywords
            </label>
            <input
              type="text"
              value={contentSettings.seo.keywords}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Social Media Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-black/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-10 lg:p-12"
      >
        <h2 className="text-2xl font-bold text-white mb-8">Social Media</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(contentSettings.social).map(([platform, url]) => (
            <div key={platform}>
              <label className="block text-base font-medium text-gray-300 mb-3 capitalize">
                {platform}
              </label>
              <input
                type="url"
                value={url}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-black/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-10 lg:p-12"
      >
        <h2 className="text-2xl font-bold text-white mb-8">
          Notification Preferences
        </h2>
        <div className="space-y-6">
          {Object.entries(contentSettings.notifications).map(
            ([setting, enabled]) => (
              <div
                key={setting}
                className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-white text-lg capitalize">
                    {setting.replace(/([A-Z])/g, " $1").trim()}
                  </h3>
                  <p className="text-base text-gray-400">
                    {setting === "emailNotifications" &&
                      "Receive notifications via email"}
                    {setting === "pushNotifications" &&
                      "Receive browser push notifications"}
                    {setting === "smsNotifications" &&
                      "Receive notifications via SMS"}
                    {setting === "newUserAlerts" &&
                      "Get notified when new users register"}
                    {setting === "systemAlerts" &&
                      "Receive system status updates"}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={enabled}
                  />
                  <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
            )
          )}
        </div>
      </motion.div>
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
            Site Content
          </h1>
          <p className="text-gray-400 mt-2 text-base md:text-lg">
            Manage your website content and settings
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:min-w-0 lg:w-auto">
          <div className="flex relative lg:w-80 sm:w-72 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 lg:py-4 bg-white/5 border border-white/10 rounded-lg text-base focus:outline-none focus:border-cyan-400/50 transition-colors w-full"
            />
          </div>

          <button
            onClick={async () => {
              setRefreshing(true);
              await Promise.all([refetch(), refetchMedia()]);
              setRefreshing(false);
              setCopySuccess("Content and media refreshed successfully!");
              setTimeout(() => setCopySuccess(""), 2000);
            }}
            disabled={refreshing}
            className="px-6 py-3 lg:py-4 bg-white/10 border border-white/20 rounded-lg text-base font-medium hover:bg-white/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            <Activity
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={() => setShowNewContent(true)}
            className="px-6 py-3 lg:py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-base font-medium hover:from-cyan-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add Content
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4 gap-10 lg:gap-12">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
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
                  <div className="text-right">
                    <p className="text-2xl lg:text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                    {stat.trend && (
                      <div className="flex items-center justify-end mt-1">
                        <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                        <span className="text-sm text-green-400 font-medium">
                          {stat.trend}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="font-medium text-white mb-2 text-xl">
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

      {/* Content Status Indicator */}
      {(loading || mediaLoading || refreshing) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cyan-500/10 border border-cyan-400/20 rounded-lg p-4 flex items-center gap-3"
        >
          <div className="animate-spin w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
          <span className="text-cyan-400 font-medium">
            {loading || mediaLoading
              ? "Loading content..."
              : "Refreshing content..."}
          </span>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-lg border border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium transition-all whitespace-nowrap ${
                active
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
              {tab.count !== null && (
                <div className="flex items-center gap-1 ml-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-white/10 text-gray-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </div>
              )}
              {tab.description && (
                <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {tab.description}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {(loading || mediaLoading) && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading content...</p>
          </div>
        </div>
      )}

      {!loading && !mediaLoading && (
        <>
          {activeTab === "pages" && renderPagesTab()}
          {activeTab === "blog" && renderBlogTab()}
          {activeTab === "media" && renderMediaTab()}
          {activeTab === "settings" && renderSettingsTab()}
        </>
      )}

      {/* Success Message */}
      {copySuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {copySuccess}
        </div>
      )}

      {/* Edit Content Modal */}
      {editMode && editingContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/95 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-10 lg:p-12 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                Edit Content
              </h2>
              <button
                onClick={handleCancelEdit}
                className="p-3 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-base font-medium text-gray-300 mb-3">
                  Title
                </label>
                <input
                  type="text"
                  value={editingContent.title || ""}
                  onChange={(e) =>
                    setEditingContent({
                      ...editingContent,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-300 mb-3">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={editingContent.description || ""}
                  onChange={(e) =>
                    setEditingContent({
                      ...editingContent,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-medium hover:from-cyan-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Content Modal */}
      {showNewContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/95 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-10 lg:p-12 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                Create New Content
              </h2>
              <button
                onClick={() => setShowNewContent(false)}
                className="p-3 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Content Type Selection */}
              <div>
                <label className="block text-base font-medium text-gray-300 mb-4">
                  Content Type *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      value: "page",
                      label: "Page",
                      icon: Globe,
                      desc: "Static page content",
                    },
                    {
                      value: "blog",
                      label: "Blog Post",
                      icon: FileText,
                      desc: "Article or blog content",
                    },
                    {
                      value: "media",
                      label: "Media File",
                      icon: Image,
                      desc: "Images and videos",
                    },
                  ].map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleContentTypeChange(type.value)}
                        className={`p-6 rounded-lg border text-left transition-all ${
                          newContentType === type.value
                            ? "bg-cyan-500/20 border-cyan-400 text-cyan-400"
                            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Icon className="w-8 h-8 mb-3" />
                        <h3 className="font-medium text-lg mb-2">
                          {type.label}
                        </h3>
                        <p className="text-sm opacity-75">{type.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Form Fields */}
              <div className="space-y-6">
                {/* Page-specific fields */}
                {newContentType === "page" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-base font-medium text-gray-300 mb-3">
                          Page Name *
                        </label>
                        <input
                          type="text"
                          value={newContentPage}
                          onChange={(e) => setNewContentPage(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                          placeholder="e.g., home, about, services"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-300 mb-3">
                          Section
                        </label>
                        <input
                          type="text"
                          value={newContentSection}
                          onChange={(e) => setNewContentSection(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                          placeholder="e.g., hero, footer, features"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Blog-specific fields */}
                {newContentType === "blog" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-base font-medium text-gray-300 mb-3">
                          Title *
                        </label>
                        <input
                          type="text"
                          value={newContentTitle}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                          placeholder="Enter blog post title"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-300 mb-3">
                          Slug
                        </label>
                        <input
                          type="text"
                          value={newContentSlug}
                          onChange={(e) => setNewContentSlug(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                          placeholder="auto-generated from title"
                        />
                      </div>
                    </div>

                    {/* Featured Image Upload for Blog Posts */}
                    <div>
                      <label className="block text-base font-medium text-gray-300 mb-3">
                        Featured Image (Optional)
                      </label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                          dragActive
                            ? "border-cyan-400 bg-cyan-400/10"
                            : "border-white/20 hover:border-cyan-400/50"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        {selectedFile ? (
                          <div className="space-y-4">
                            {filePreview && (
                              <div className="mx-auto w-48 h-32 rounded-lg overflow-hidden">
                                <img
                                  src={filePreview}
                                  alt="Featured image preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            {!filePreview &&
                              selectedFile.type.startsWith("video/") && (
                                <div className="mx-auto w-48 h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                                  <Video className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            <div className="text-left max-w-md mx-auto">
                              <p className="text-white font-medium">
                                {selectedFile.name}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)}{" "}
                                MB • {selectedFile.type}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={removeSelectedFile}
                              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            >
                              Remove Image
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                            <div>
                              <label
                                htmlFor="blog-featured-image"
                                className="cursor-pointer"
                              >
                                <span className="text-cyan-400 hover:text-cyan-300 font-medium">
                                  Click to upload featured image
                                </span>
                                <span className="text-gray-400">
                                  {" "}
                                  or drag and drop
                                </span>
                              </label>
                              <p className="text-gray-400 text-sm mt-2">
                                JPG, PNG, GIF, WebP (max 50MB)
                              </p>
                            </div>
                            <input
                              id="blog-featured-image"
                              type="file"
                              onChange={handleFileSelect}
                              accept="image/*"
                              className="hidden"
                            />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mt-2">
                        Optional featured image that will be displayed with your
                        blog post
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-base font-medium text-gray-300 mb-3">
                          Category *
                        </label>
                        <select
                          value={newContentCategory}
                          onChange={(e) =>
                            setNewContentCategory(e.target.value)
                          }
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                          required
                        >
                          <option value="">Select category</option>
                          <option value="Technology">Technology</option>
                          <option value="Business">Business</option>
                          <option value="Design">Design</option>
                          <option value="Security">Security</option>
                          <option value="Development">Development</option>
                          <option value="Strategy">Strategy</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-300 mb-3">
                          Tags
                        </label>
                        <input
                          type="text"
                          value={newContentTags}
                          onChange={(e) => setNewContentTags(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                          placeholder="tag1, tag2, tag3"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Media-specific fields */}
                {newContentType === "media" && (
                  <>
                    <div>
                      <label className="block text-base font-medium text-gray-300 mb-3">
                        Select File *
                      </label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                          dragActive
                            ? "border-cyan-400 bg-cyan-400/10"
                            : "border-white/20 hover:border-cyan-400/50"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        {selectedFile ? (
                          <div className="space-y-4">
                            {filePreview && (
                              <div className="mx-auto w-48 h-48 rounded-lg overflow-hidden">
                                <img
                                  src={filePreview}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            {!filePreview &&
                              selectedFile.type.startsWith("video/") && (
                                <div className="mx-auto w-48 h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                                  <Video className="w-12 h-12 text-gray-400" />
                                </div>
                              )}
                            <div className="text-left max-w-md mx-auto">
                              <p className="text-white font-medium">
                                {selectedFile.name}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)}{" "}
                                MB • {selectedFile.type}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={removeSelectedFile}
                              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            >
                              Remove File
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                            <div>
                              <label
                                htmlFor="media-file-input"
                                className="cursor-pointer"
                              >
                                <span className="text-cyan-400 hover:text-cyan-300 font-medium">
                                  Click to upload
                                </span>
                                <span className="text-gray-400">
                                  {" "}
                                  or drag and drop
                                </span>
                              </label>
                              <p className="text-gray-400 text-sm mt-2">
                                JPG, PNG, GIF, WebP, MP4, AVI, MOV, WMV (max
                                50MB)
                              </p>
                            </div>
                            <input
                              id="media-file-input"
                              type="file"
                              onChange={handleFileSelect}
                              accept="image/*,video/*"
                              className="hidden"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-300 mb-3">
                        Alt Text *
                      </label>
                      <input
                        type="text"
                        value={newContentAlt}
                        onChange={(e) => setNewContentAlt(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                        placeholder="Describe the image or video for accessibility"
                        required
                      />
                      <p className="text-gray-400 text-sm mt-2">
                        Important for SEO and accessibility. Describe what the
                        image or video shows.
                      </p>
                    </div>
                  </>
                )}

                {/* Common fields for page and blog */}
                {(newContentType === "page" || newContentType === "blog") && (
                  <>
                    <div>
                      <label className="block text-base font-medium text-gray-300 mb-3">
                        {newContentType === "blog" ? "Excerpt" : "Description"}{" "}
                        *
                      </label>
                      <textarea
                        rows={4}
                        value={newContentDescription}
                        onChange={(e) =>
                          setNewContentDescription(e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                        placeholder={
                          newContentType === "blog"
                            ? "Brief excerpt or summary of the blog post"
                            : "Enter content description"
                        }
                        required
                      />
                    </div>
                  </>
                )}

                {/* Title field for page content */}
                {newContentType === "page" && (
                  <div>
                    <label className="block text-base font-medium text-gray-300 mb-3">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newContentTitle}
                      onChange={(e) => setNewContentTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                      placeholder="Enter page title"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  onClick={handleCreateContent}
                  disabled={loading || uploading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-medium hover:from-cyan-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {uploading
                    ? "Uploading..."
                    : loading
                    ? "Creating..."
                    : "Create Content"}
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setShowNewContent(false);
                  }}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteContent;
