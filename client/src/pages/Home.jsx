import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Bot,
  Code2,
  Laptop,
  Wifi,
  Database,
  Cpu,
  Zap,
  Lock,
  Gamepad2,
  GraduationCap,
  Settings,
  X,
  ExternalLink,
} from "lucide-react";
import { usePublicContent } from "../hooks/useApi";
import { useAdminDashboard } from "../hooks/useApi";

const Home = () => {
  const { content, loading, error } = usePublicContent();
  const { dashboardData } = useAdminDashboard();
  const navigate = useNavigate();

  // State for modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open media/blog post details
  const openDetails = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };
  const services = [
    {
      icon: Shield,
      title: "Cybersecurity Consulting",
      description:
        "Advanced threat assessment, penetration testing, and security framework implementation for enterprise protection",
      gradient: "from-red-400 to-orange-600",
    },
    {
      icon: Bot,
      title: "Robotics & AI Solutions",
      description:
        "Custom robotics development, AI integration, and automation systems for modern industrial applications",
      gradient: "from-blue-400 to-cyan-600",
    },
    {
      icon: Code2,
      title: "Programming Education",
      description:
        "Comprehensive programming courses including Scratch for beginners, Python, JavaScript, and advanced development",
      gradient: "from-green-400 to-emerald-600",
    },
    {
      icon: Laptop,
      title: "IT Infrastructure",
      description:
        "Complete IT solutions including network setup, server management, cloud migration, and technical support",
      gradient: "from-purple-400 to-pink-600",
    },
  ];

  const techPrograms = [
    { icon: Shield, text: "Cybersecurity", desc: "Advanced security training" },
    { icon: Bot, text: "Robotics", desc: "AI & automation solutions" },
    { icon: Code2, text: "Programming", desc: "From Scratch to advanced" },
    { icon: Settings, text: "IT Systems", desc: "Infrastructure & support" },
  ];

  return (
    <div className="min-h-screen bg-black text-white particles-bg">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0 bg-cyber-grid opacity-30"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-center max-w-6xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-8"
            ></motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight"
            >
              <span className="text-futuristic animate-neon-pulse block">
                {content?.pages?.home?.sections?.hero?.content?.title ||
                  "IT SOLUTIONS"}
              </span>
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-holographic">
                {content?.pages?.home?.sections?.hero?.content?.subtitle ||
                  "CONSULTANCY"}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-xl md:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed font-light"
            >
              {content?.pages?.home?.sections?.hero?.content?.description ||
                "Leading experts in cybersecurity consulting, robotics & AI development, programming education, and IT infrastructure solutions for businesses and educational institutions."}
            </motion.p>

            {/* Tech Programs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto"
            >
              {techPrograms.map((program, index) => {
                const Icon = program.icon;
                return (
                  <motion.div
                    key={program.text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                    className="glass-futuristic p-4 rounded-lg text-center group hover:scale-105 transition-transform"
                  >
                    <Icon className="w-8 h-8 text-cyan-400 mx-auto mb-2 group-hover:animate-float" />
                    <h3 className="font-semibold text-sm text-white mb-1">
                      {program.text}
                    </h3>
                    <p className="text-xs text-gray-400">{program.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/contact")}
              className="btn-futuristic px-12 py-4 text-lg font-bold rounded-xl inline-flex items-center gap-3 animate-energy-pulse cursor-pointer"
            >
              {content?.pages?.home?.sections?.hero?.content?.cta_text ||
                "GET IT CONSULTATION"}
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                number: dashboardData?.totalRequests || "0",
                label: "Projects Completed",
              },
              {
                number: dashboardData?.totalUsers || "0",
                label: "Enterprise Clients",
              },
              {
                number: dashboardData?.completedRequests
                  ? `${Math.round(
                      (dashboardData.completedRequests /
                        dashboardData.totalRequests) *
                        100
                    )}%`
                  : "0%",
                label: "Success Rate",
              },
              {
                number: "24/7",
                label: "Technical Support",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black text-cyan-400 mb-2 animate-neon-pulse">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium uppercase tracking-wider text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 to-purple-900/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-block px-4 py-2 rounded-full glass-futuristic border border-purple-400/30 text-purple-400 text-sm font-mono mb-6">
              <span className="animate-pulse">◉</span> OUR IT SERVICES
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="text-futuristic">SPECIALIZED</span>{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                SOLUTIONS
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Comprehensive IT consultancy services tailored for modern
              businesses and educational institutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  viewport={{ once: true }}
                  onClick={() => navigate('/contact')}
                  className="card-futuristic p-8 group cursor-pointer"
                >
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-6 group-hover:animate-float`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mt-6 flex items-center text-cyan-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    EXPLORE <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Posts Section - Dynamic content */}
      {content?.blogPosts && content.blogPosts.length > 0 && (
        <section className="py-24 relative" data-section="blog">
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 to-emerald-900/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <div className="inline-block px-4 py-2 rounded-full glass-futuristic border border-green-400/30 text-green-400 text-sm font-mono mb-6">
                <span className="animate-pulse">📝</span> BLOG POSTS
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                <span className="text-futuristic">LATEST</span>{" "}
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  INSIGHTS
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Stay updated with our latest thoughts on technology,
                cybersecurity, and digital transformation
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.blogPosts.slice(0, 6).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  viewport={{ once: true }}
                  className="card-futuristic p-6 group cursor-pointer overflow-hidden"
                >
                  {/* Featured Image */}
                  <div className="relative mb-6 overflow-hidden rounded-lg">
                    {post.featuredImageUrl ? (
                      <img
                        src={post.featuredImageUrl}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          console.error(
                            "Blog post image failed to load:",
                            post.featuredImageUrl
                          );
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-r from-green-600/20 to-emerald-600/20 flex items-center justify-center">
                        <div className="text-4xl">📝</div>
                      </div>
                    )}

                    {/* Fallback for failed images */}
                    <div
                      className="w-full h-48 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center"
                      style={{ display: "none" }}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">📝</div>
                        <p className="text-sm text-gray-400">
                          Image unavailable
                        </p>
                      </div>
                    </div>

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Post type indicator */}
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/50 text-xs text-white backdrop-blur-sm">
                      📝 Blog
                    </div>
                  </div>

                  {/* Post Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-green-400/20 text-green-400 rounded-full text-xs">
                        {post.category}
                      </span>
                      <span className="text-gray-500">
                        {new Date(post.publishDate).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                      <span className="text-xs text-gray-500">
                        By {post.author}
                      </span>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>👁 {post.views}</span>
                        <span>❤️ {post.likes}</span>
                        <span>💬 {post.comments}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover effect arrow */}
                  <div className="mt-4 flex items-center text-green-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetails({ ...post, isBlogPost: true });
                      }}
                      className="flex items-center hover:text-green-300 transition-colors"
                    >
                      READ MORE <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View all blog posts button */}
            {content.blogPosts.length > 6 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Scroll to show more blog posts or could navigate to a dedicated blog page
                    const blogSection = document.querySelector(
                      '[data-section="blog"]'
                    );
                    if (blogSection) {
                      blogSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="px-8 py-3 text-lg font-bold rounded-xl border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all duration-300 backdrop-blur-sm cursor-pointer"
                >
                  VIEW ALL POSTS
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Media Section - Dynamic content */}
      {content?.media && content.media.length > 0 && (
        <section className="py-24 relative" data-section="media">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-pink-900/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <div className="inline-block px-4 py-2 rounded-full glass-futuristic border border-pink-400/30 text-pink-400 text-sm font-mono mb-6">
                <span className="animate-pulse">📸</span> MEDIA GALLERY
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                <span className="text-futuristic">OUR</span>{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  COLLECTION
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Explore our visual portfolio featuring projects, workshops, and
                technical innovations
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.media.map((media, index) => (
                <motion.div
                  key={media.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  viewport={{ once: true }}
                  className="card-futuristic p-6 group cursor-pointer overflow-hidden"
                >
                  {/* Media Image */}
                  <div className="relative mb-6 overflow-hidden rounded-lg">
                    {media.url ? (
                      <img
                        src={media.url}
                        alt={media.title || media.alt || "Media"}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          console.error(
                            "Media image failed to load:",
                            media.url,
                            "Error details:",
                            e
                          );

                          // Try to reload the image with proper encoding if it fails
                          const originalSrc = media.url;
                          const encodedSrc = encodeURIComponent(originalSrc);

                          // Only retry if we haven't tried encoding before and encoding changes the URL
                          if (
                            !e.target.src.includes("%25") &&
                            originalSrc !== encodedSrc
                          ) {
                            console.log(
                              "Retrying with properly encoded URL:",
                              encodedSrc
                            );
                            e.target.src = encodedSrc;
                            return;
                          }

                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                        onLoad={() => {
                          console.log(
                            "Media image loaded successfully:",
                            media.url
                          );
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-r from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                        <div className="text-4xl">🎨</div>
                      </div>
                    )}

                    {/* Fallback for failed images */}
                    <div
                      className="w-full h-48 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center"
                      style={{ display: "none" }}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">🖼️</div>
                        <p className="text-sm text-gray-400">
                          Image unavailable
                        </p>
                        <p className="text-xs text-gray-500 mt-1 break-all">
                          {media.filename}
                        </p>
                      </div>
                    </div>

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Media type indicator */}
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/50 text-xs text-white backdrop-blur-sm">
                      {media.mimetype?.includes("image")
                        ? "📷"
                        : media.mimetype?.includes("video")
                        ? "🎥"
                        : "📄"}{" "}
                      Media
                    </div>
                  </div>

                  {/* Media Info */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                      {media.title || "Untitled Media"}
                    </h3>

                    {media.description && (
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                        {media.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                      <span className="text-xs text-gray-500">
                        {media.size
                          ? `${(media.size / 1024 / 1024).toFixed(1)} MB`
                          : ""}
                      </span>
                      <span className="text-xs text-purple-400 font-medium">
                        {media.mimetype?.split("/")[1]?.toUpperCase() ||
                          "MEDIA"}
                      </span>
                    </div>
                  </div>

                  {/* Hover effect arrow */}
                  <div className="mt-4 flex items-center text-purple-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetails(media);
                      }}
                      className="flex items-center hover:text-purple-300 transition-colors"
                    >
                      VIEW DETAILS <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View all media button */}
            {content.media.length > 6 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Scroll to show more media or could navigate to a dedicated media gallery page
                    const mediaSection = document.querySelector('[data-section="media"]');
                    if (mediaSection) {
                      mediaSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-8 py-3 text-lg font-bold rounded-xl border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black transition-all duration-300 backdrop-blur-sm cursor-pointer"
                >
                  VIEW ALL MEDIA
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 to-purple-900/30"></div>
        <div className="absolute inset-0 bg-cyber-dots opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card-futuristic max-w-5xl mx-auto p-12 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-futuristic border border-green-400/30 text-green-400 text-sm font-mono animate-neon-flicker">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                READY FOR IT TRANSFORMATION
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black mb-6 leading-tight"
            >
              <span className="text-futuristic">SECURE YOUR</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                IT INFRASTRUCTURE
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Partner with our cybersecurity experts, robotics specialists, and
              programming educators to build robust IT solutions for your
              organization.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/contact")}
                className="btn-futuristic px-10 py-4 text-lg font-bold rounded-xl inline-flex items-center gap-3 cursor-pointer"
              >
                START CONSULTATION
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/services")}
                className="px-10 py-4 text-lg font-bold rounded-xl border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black transition-all duration-300 backdrop-blur-sm cursor-pointer"
              >
                VIEW PROGRAMS
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Details Modal */}
      {isModalOpen && selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="card-futuristic max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {selectedItem.title || "Media Details"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6">
              {/* Media Display (for media items) */}
              {selectedItem.url && !selectedItem.isBlogPost && (
                <div className="relative">
                  {selectedItem.mimetype?.includes("image") ? (
                    <img
                      src={selectedItem.url}
                      alt={selectedItem.title || selectedItem.alt || "Media"}
                      className="w-full max-h-96 object-contain rounded-lg"
                      onError={(e) => {
                        console.error(
                          "Modal image failed to load:",
                          selectedItem.url
                        );
                        e.target.style.display = "none";
                      }}
                    />
                  ) : selectedItem.mimetype?.includes("video") ? (
                    <video
                      src={selectedItem.url}
                      controls
                      className="w-full max-h-96 rounded-lg"
                      onError={(e) => {
                        console.error(
                          "Modal video failed to load:",
                          selectedItem.url
                        );
                      }}
                    >
                      Your browser does not support video playback.
                    </video>
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center">
                      <div className="text-6xl">📄</div>
                    </div>
                  )}

                  {/* Download Link */}
                  <div className="absolute top-4 right-4">
                    <a
                      href={selectedItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/70 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Blog Post Display */}
              {selectedItem.isBlogPost && (
                <div className="relative">
                  {selectedItem.featuredImageUrl ? (
                    <img
                      src={selectedItem.featuredImageUrl}
                      alt={selectedItem.title}
                      className="w-full max-h-96 object-cover rounded-lg"
                      onError={(e) => {
                        console.error(
                          "Blog image failed to load:",
                          selectedItem.featuredImageUrl
                        );
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg flex items-center justify-center">
                      <div className="text-6xl">📝</div>
                    </div>
                  )}
                </div>
              )}

              {/* Media Information or Blog Content */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">
                    {selectedItem.isBlogPost ? "Content" : "Description"}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedItem.description ||
                      selectedItem.excerpt ||
                      "No description available."}
                  </p>

                  {/* Blog post content */}
                  {selectedItem.isBlogPost && selectedItem.content && (
                    <div className="mt-4">
                      <div className="prose prose-invert max-w-none">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: selectedItem.content,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">
                    Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    {selectedItem.isBlogPost ? (
                      <>
                        <div>
                          <span className="text-gray-400">Author:</span>
                          <span className="text-white ml-2">
                            {selectedItem.author}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Category:</span>
                          <span className="text-white ml-2">
                            {selectedItem.category}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Published:</span>
                          <span className="text-white ml-2">
                            {new Date(
                              selectedItem.publishDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Status:</span>
                          <span className="text-white ml-2 capitalize">
                            {selectedItem.status}
                          </span>
                        </div>
                        <div className="flex gap-4 pt-2">
                          <span>👁 {selectedItem.views} views</span>
                          <span>❤️ {selectedItem.likes} likes</span>
                          <span>💬 {selectedItem.comments} comments</span>
                        </div>
                      </>
                    ) : (
                      <>
                        {selectedItem.filename && (
                          <div>
                            <span className="text-gray-400">Filename:</span>
                            <span className="text-white ml-2">
                              {selectedItem.filename}
                            </span>
                          </div>
                        )}
                        {selectedItem.mimetype && (
                          <div>
                            <span className="text-gray-400">Type:</span>
                            <span className="text-white ml-2">
                              {selectedItem.mimetype}
                            </span>
                          </div>
                        )}
                        {selectedItem.size && (
                          <div>
                            <span className="text-gray-400">Size:</span>
                            <span className="text-white ml-2">
                              {(selectedItem.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        )}
                        {selectedItem.uploadedAt && (
                          <div>
                            <span className="text-gray-400">Uploaded:</span>
                            <span className="text-white ml-2">
                              {new Date(
                                selectedItem.uploadedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags for blog posts */}
              {selectedItem.isBlogPost &&
                selectedItem.tags &&
                selectedItem.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-3">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Additional Metadata (for media items) */}
              {!selectedItem.isBlogPost &&
                Object.keys(selectedItem).length > 1 && (
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-3">
                      Additional Information
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      {Object.entries(selectedItem)
                        .filter(
                          ([key]) =>
                            ![
                              "id",
                              "title",
                              "description",
                              "url",
                              "filename",
                              "mimetype",
                              "size",
                              "uploadedAt",
                              "isBlogPost",
                            ].includes(key)
                        )
                        .map(
                          ([key, value]) =>
                            value && (
                              <div
                                key={key}
                                className="bg-black/20 p-3 rounded-lg"
                              >
                                <span className="text-gray-400 block text-xs uppercase tracking-wider mb-1">
                                  {key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                                </span>
                                <span className="text-white">
                                  {typeof value === "object"
                                    ? JSON.stringify(value)
                                    : String(value)}
                                </span>
                              </div>
                            )
                        )}
                    </div>
                  </div>
                )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
