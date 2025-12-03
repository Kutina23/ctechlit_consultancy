import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Bot,
  Code2,
  Settings,
  Award,
  Users,
  Target,
  Zap,
} from "lucide-react";
import MediaDisplay, { MediaGrid } from "../components/MediaDisplay";
import { usePublicContent } from "../hooks/useApi";

const About = () => {
  const { content } = usePublicContent();
  const [galleryMedia, setGalleryMedia] = useState([]);
  const navigate = useNavigate();
  
  // Get media for gallery display
  useEffect(() => {
    if (content?.media) {
      // Filter for images that could be used in gallery
      const gallery = content.media.filter(media => 
        media.type === 'image' && 
        (media.alt?.toLowerCase().includes('team') || 
         media.alt?.toLowerCase().includes('office') ||
         media.alt?.toLowerCase().includes('company') ||
         media.description?.toLowerCase().includes('team') ||
         media.description?.toLowerCase().includes('office'))
      );
      setGalleryMedia(gallery);
    }
  }, [content]);

  const values = [
    {
      icon: Shield,
      title: "Cybersecurity Excellence",
      description:
        "Advanced threat detection and comprehensive security frameworks to protect your digital assets.",
      gradient: "from-red-400 to-orange-600",
    },
    {
      icon: Bot,
      title: "Robotics Innovation",
      description:
        "Cutting-edge robotics and AI solutions that transform industrial processes and workflows.",
      gradient: "from-blue-400 to-cyan-600",
    },
    {
      icon: Code2,
      title: "Programming Education",
      description:
        "Comprehensive training programs from beginner Scratch to advanced development languages.",
      gradient: "from-green-400 to-emerald-600",
    },
    {
      icon: Settings,
      title: "IT Infrastructure",
      description:
        "Robust network design, cloud migration, and 24/7 technical support for enterprise needs.",
      gradient: "from-purple-400 to-pink-600",
    },
  ];

  const stats = [
    { number: "10+", label: "Years Experience" },
    { number: "500+", label: "Projects Delivered" },
    { number: "50+", label: "Enterprise Clients" },
    { number: "98%", label: "Client Satisfaction" },
  ];

  const teamHighlights = [
    { icon: Award, text: "Certified Experts" },
    { icon: Users, text: "Dedicated Team" },
    { icon: Target, text: "Results-Driven" },
    { icon: Zap, text: "Innovation Focus" },
  ];

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
                ABOUT OUR CONSULTANCY
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-6xl font-black mb-8 leading-tight"
            >
              <span className="text-futuristic animate-neon-pulse">
                LEADING
              </span>{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-holographic">
                IT CONSULTANCY
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              We are a premier IT consultancy specializing in cybersecurity,
              robotics, programming education, and enterprise infrastructure
              solutions with over a decade of excellence in digital
              transformation.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
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

      {/* Our Story Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 to-purple-900/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-block px-4 py-2 rounded-full glass-futuristic border border-purple-400/30 text-purple-400 text-sm font-mono mb-6">
                <span className="animate-pulse">◉</span> OUR STORY
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-8">
                <span className="text-futuristic">TRANSFORMING</span>{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  BUSINESSES
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="card-futuristic p-8 md:p-12"
            >
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed mb-6">
                  <span className="text-cyan-400 font-semibold">
                    CTechLit Consultancy
                  </span>{" "}
                  has been at the forefront of IT innovation for over a decade,
                  specializing in cybersecurity, robotics, programming
                  education, and enterprise infrastructure solutions. We are
                  dedicated to empowering businesses with cutting-edge
                  technology that drives growth and ensures security.
                </p>

                <p className="text-gray-300 leading-relaxed mb-6">
                  Our team of certified experts combines deep technical
                  knowledge with industry best practices to deliver
                  comprehensive solutions. From protecting your digital assets
                  with advanced cybersecurity measures to implementing
                  intelligent robotics systems, we provide the expertise your
                  organization needs to thrive in the digital age.
                </p>

                <p className="text-gray-300 leading-relaxed">
                  We believe in building long-term partnerships with our
                  clients, ensuring their success through continuous support,
                  education, and innovation. Our programming education programs,
                  including Scratch for beginners and advanced development
                  courses, prepare the next generation of IT professionals.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
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
            <div className="inline-block px-4 py-2 rounded-full glass-futuristic border border-cyan-400/30 text-cyan-400 text-sm font-mono mb-6">
              <span className="animate-pulse">◉</span> OUR EXPERTISE
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-8">
              <span className="text-futuristic">SPECIALIZED</span>{" "}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                SERVICES
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  viewport={{ once: true }}
                  onClick={() => navigate('/contact')}
                  className="card-futuristic p-8 group cursor-pointer"
                >
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${value.gradient} flex items-center justify-center mb-6 group-hover:animate-float`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Media Gallery Section */}
      {galleryMedia.length > 0 && (
        <section className="py-24 relative">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-block px-4 py-2 rounded-full glass-futuristic border border-pink-400/30 text-pink-400 text-sm font-mono mb-6 animate-neon-flicker">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                VISUAL INSIGHTS
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-8">
                <span className="text-futuristic">OUR</span>{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  WORKSPACE
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Explore our modern workspace and see how we bring innovation to life every day.
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
                media={galleryMedia}
                columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                renderItem={(media) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="card-futuristic overflow-hidden group"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <MediaDisplay
                        src={media.url || media.path}
                        alt={media.alt || media.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white text-sm font-medium">
                            {media.alt || media.description || media.filename}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Team Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 rounded-full glass-futuristic border border-green-400/30 text-green-400 text-sm font-mono mb-6 animate-neon-flicker">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              OUR COMMITMENT
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-8">
              <span className="text-futuristic">EXCELLENCE IN</span>{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                EVERY PROJECT
              </span>
            </h2>
          </motion.div>

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
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            >
              {teamHighlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <div
                    key={highlight.text}
                    className="flex flex-col items-center"
                  >
                    <Icon
                      className="w-12 h-12 text-cyan-400 mb-3 animate-float"
                      style={{ animationDelay: `${index * 0.5}s` }}
                    />
                    <span className="text-sm font-medium text-gray-300">
                      {highlight.text}
                    </span>
                  </div>
                );
              })}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl text-gray-300 leading-relaxed"
            >
              We are committed to delivering excellence in every project,
              ensuring your organization benefits from the latest technologies
              and best practices in cybersecurity, robotics, programming
              education, and IT infrastructure management.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
