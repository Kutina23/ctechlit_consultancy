import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Bot,
  Code2,
  Settings,
  Check,
  ArrowRight,
  Zap,
  Lock,
  Cpu,
  Database,
  Network,
  Cloud,
} from "lucide-react";
import MediaDisplay, { MediaGrid } from "../components/MediaDisplay";
import { usePublicContent } from "../hooks/useApi";

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("cybersecurity");
  const { content } = usePublicContent();
  const [portfolioMedia, setPortfolioMedia] = useState([]);
  const navigate = useNavigate();

  // Get media for portfolio showcase
  useEffect(() => {
    if (content?.media) {
      // Filter for images that could be used in portfolio/services
      const portfolio = content.media.filter(
        (media) =>
          media.type === "image" &&
          (media.alt?.toLowerCase().includes("project") ||
            media.alt?.toLowerCase().includes("solution") ||
            media.alt?.toLowerCase().includes("service") ||
            media.alt?.toLowerCase().includes("cybersecurity") ||
            media.alt?.toLowerCase().includes("robotics") ||
            media.alt?.toLowerCase().includes("network") ||
            media.description?.toLowerCase().includes("project") ||
            media.description?.toLowerCase().includes("service"))
      );
      setPortfolioMedia(portfolio);
    }
  }, [content]);

  const serviceCategories = [
    {
      id: "cybersecurity",
      icon: Shield,
      title: "Cybersecurity",
      description: "Comprehensive security solutions for enterprise protection",
      gradient: "from-red-400 to-orange-600",
    },
    {
      id: "robotics",
      icon: Bot,
      title: "Robotics & AI",
      description: "Intelligent automation and robotics systems",
      gradient: "from-blue-400 to-cyan-600",
    },
    {
      id: "education",
      icon: Code2,
      title: "Programming Education",
      description: "Complete learning paths from beginner to expert",
      gradient: "from-green-400 to-emerald-600",
    },
    {
      id: "infrastructure",
      icon: Settings,
      title: "IT Infrastructure",
      description: "Enterprise-grade infrastructure solutions",
      gradient: "from-purple-400 to-pink-600",
    },
  ];

  const services = {
    cybersecurity: [
      {
        title: "Security Assessment",
        price: "GHS 15,000",
        duration: "2-4 weeks",
        description:
          "Comprehensive security audit and vulnerability assessment",
        features: [
          "Network security analysis",
          "Penetration testing",
          "Compliance review",
          "Risk assessment report",
          "Recommendations roadmap",
        ],
      },
      {
        title: "Threat Monitoring",
        price: "GHS 8,000/month",
        duration: "Ongoing",
        description: "24/7 security monitoring and incident response",
        features: [
          "Real-time threat detection",
          "SIEM implementation",
          "Incident response team",
          "Monthly security reports",
          "Emergency support",
        ],
      },
      {
        title: "Security Training",
        price: "GHS 5,000",
        duration: "1 week",
        description: "Employee cybersecurity awareness training",
        features: [
          "Phishing simulation",
          "Security best practices",
          "Compliance training",
          "Certification included",
          "Custom materials",
        ],
      },
    ],
    robotics: [
      {
        title: "Robotics Consultation",
        price: "GHS 20,000",
        duration: "4-6 weeks",
        description: "Custom robotics system design and planning",
        features: [
          "Process analysis",
          "System architecture",
          "Technology selection",
          "Implementation roadmap",
          "ROI projections",
        ],
      },
      {
        title: "AI Integration",
        price: "GHS 25,000",
        duration: "6-8 weeks",
        description: "Artificial intelligence and machine learning solutions",
        features: [
          "AI strategy development",
          "ML model training",
          "Data pipeline setup",
          "Performance optimization",
          "Training and support",
        ],
      },
      {
        title: "Automation Systems",
        price: "GHS 30,000",
        duration: "8-12 weeks",
        description: "Complete industrial automation solutions",
        features: [
          "Process automation",
          "Sensor integration",
          "Control systems",
          "Monitoring dashboard",
          "Maintenance plans",
        ],
      },
    ],
    education: [
      {
        title: "Scratch Programming",
        price: "GHS 2,000",
        duration: "4 weeks",
        description: "Beginner-friendly visual programming course",
        features: [
          "Game development",
          "Interactive animations",
          "Problem-solving skills",
          "Portfolio projects",
          "Certificate of completion",
        ],
      },
      {
        title: "Web Development",
        price: "GHS 8,000",
        duration: "8 weeks",
        description: "Full-stack web development bootcamp",
        features: [
          "HTML, CSS, JavaScript",
          "React/Vue framework",
          "Backend development",
          "Database integration",
          "Deploy to production",
        ],
      },
      {
        title: "Cybersecurity Fundamentals",
        price: "GHS 6,000",
        duration: "6 weeks",
        description: "Professional cybersecurity certification course",
        features: [
          "Network security",
          "Ethical hacking",
          "Incident response",
          "Compliance standards",
          "Industry certification",
        ],
      },
    ],
    infrastructure: [
      {
        title: "Network Setup",
        price: "GHS 12,000",
        duration: "2-3 weeks",
        description: "Enterprise network design and implementation",
        features: [
          "Network architecture",
          "Hardware installation",
          "Security configuration",
          "Performance tuning",
          "Documentation",
        ],
      },
      {
        title: "Cloud Migration",
        price: "GHS 18,000",
        duration: "4-6 weeks",
        description: "Seamless migration to cloud infrastructure",
        features: [
          "Cloud strategy planning",
          "Data migration",
          "Security setup",
          "Cost optimization",
          "Training and handover",
        ],
      },
      {
        title: "24/7 Support",
        price: "GHS 10,000/month",
        duration: "Ongoing",
        description: "Round-the-clock technical support services",
        features: [
          "Remote monitoring",
          "Priority support",
          "Regular maintenance",
          "Performance reports",
          "Emergency response",
        ],
      },
    ],
  };

  const getIconForCategory = (categoryId) => {
    const category = serviceCategories.find((cat) => cat.id === categoryId);
    return category ? category.icon : Shield;
  };

  return (
    <div className="min-h-screen bg-black text-white particles-bg">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0 bg-cyber-grid opacity-30"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-futuristic border border-cyan-400/30 text-cyan-400 text-sm font-mono animate-neon-flicker">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                IT CONSULTANCY SERVICES
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-6xl font-black mb-8 leading-tight"
            >
              <span className="text-futuristic animate-neon-pulse">
                SPECIALIZED
              </span>{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-holographic">
                SOLUTIONS
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Comprehensive IT consultancy services tailored for modern
              businesses. From cybersecurity to robotics, programming education
              to infrastructure management.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-8">
              <span className="text-futuristic">SERVICE</span>{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                CATEGORIES
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {serviceCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    activeCategory === category.id
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-gray-600 bg-gray-800/50 hover:border-gray-500"
                  }`}
                >
                  <Icon
                    className={`w-8 h-8 mx-auto mb-3 ${
                      activeCategory === category.id
                        ? "text-cyan-400"
                        : "text-gray-400"
                    }`}
                  />
                  <h3
                    className={`font-bold text-sm mb-2 ${
                      activeCategory === category.id
                        ? "text-cyan-400"
                        : "text-white"
                    }`}
                  >
                    {category.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-tight">
                    {category.description}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Details */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {services[activeCategory]?.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-futuristic p-8 group hover:scale-105"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {service.title}
                  </h3>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${
                      serviceCategories.find((cat) => cat.id === activeCategory)
                        ?.gradient
                    } flex items-center justify-center`}
                  >
                    {React.createElement(getIconForCategory(activeCategory), {
                      className: "w-6 h-6 text-white",
                    })}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-3xl font-black text-cyan-400 mb-2">
                    {service.price}
                  </div>
                  <div className="text-sm text-gray-400">
                    Duration: {service.duration}
                  </div>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/contact')}
                  className="w-full btn-futuristic py-3 text-lg font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  GET QUOTE
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      {portfolioMedia.length > 0 && (
        <section className="py-24 relative">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-block px-4 py-2 rounded-full glass-futuristic border border-orange-400/30 text-orange-400 text-sm font-mono mb-6 animate-neon-flicker">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                PROJECT SHOWCASE
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-8">
                <span className="text-futuristic">OUR</span>{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
                  SOLUTIONS
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                See our work in action. These projects showcase our expertise across different technology domains.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <MediaGrid
                media={portfolioMedia}
                columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                renderItem={(media, index) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="card-futuristic overflow-hidden group"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <MediaDisplay
                        src={media.url || media.path}
                        alt={media.alt || media.filename}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-white font-bold text-lg mb-2">
                            {media.alt || media.filename}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            {media.description || "View project details"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-400 font-medium text-sm">
                          Project #{media.id || index + 1}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {media.type}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-cyan-900/20"></div>
        <div className="absolute inset-0 bg-cyber-dots opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-block px-4 py-2 rounded-full glass-futuristic border border-green-400/30 text-green-400 text-sm font-mono mb-6 animate-neon-flicker">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              WHY CHOOSE US
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-8">
              <span className="text-futuristic">PROVEN</span>{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                EXCELLENCE
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Enterprise Security",
                description:
                  "Military-grade security protocols and compliance standards",
              },
              {
                icon: Cpu,
                title: "Cutting-Edge Technology",
                description:
                  "Latest tools and frameworks for optimal performance",
              },
              {
                icon: Database,
                title: "24/7 Support",
                description:
                  "Round-the-clock monitoring and technical assistance",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  viewport={{ once: true }}
                  className="card-futuristic p-8 text-center group"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card-futuristic max-w-4xl mx-auto p-12 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-futuristic border border-cyan-400/30 text-cyan-400 text-sm font-mono animate-neon-flicker">
                <Zap className="w-4 h-4" />
                READY TO GET STARTED?
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black mb-6 leading-tight"
            >
              <span className="text-futuristic">TRANSFORM YOUR</span>
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
              className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Contact us today for a free consultation and discover how our
              specialized IT services can secure and optimize your business
              operations.
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
                onClick={() => navigate('/contact')}
                className="btn-futuristic px-10 py-4 text-lg font-bold rounded-xl inline-flex items-center gap-3 cursor-pointer"
              >
                FREE CONSULTATION
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-10 py-4 text-lg font-bold rounded-xl border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black transition-all duration-300 backdrop-blur-sm cursor-pointer"
              >
                VIEW ALL SERVICES
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
