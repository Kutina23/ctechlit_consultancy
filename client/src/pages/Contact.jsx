import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, Shield, Bot, Code2, Settings, MessageSquare, User, Zap } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      alert("Thank you for your message! We'll get back to you soon.");
      setFormData({ name: "", email: "", company: "", service: "", message: "" });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "info@ctechlit.com",
      description: "Send us an email anytime",
      gradient: "from-cyan-400 to-blue-600"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+233 (0) 302 123 456",
      description: "Mon-Fri from 8am to 6pm",
      gradient: "from-green-400 to-emerald-600"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "123 Tech Hub, Innovation District, Accra, Ghana",
      description: "Come say hello at our office",
      gradient: "from-purple-400 to-pink-600"
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: "Monday - Friday: 8:00 AM - 6:00 PM",
      description: "Weekend support available",
      gradient: "from-red-400 to-orange-600"
    }
  ];

  const services = [
    { value: "cybersecurity", label: "Cybersecurity Consulting" },
    { value: "robotics", label: "Robotics & AI Solutions" },
    { value: "education", label: "Programming Education" },
    { value: "infrastructure", label: "IT Infrastructure" },
    { value: "consultation", label: "General Consultation" }
  ];

  const departments = [
    { icon: Shield, name: "Cybersecurity", color: "text-red-400" },
    { icon: Bot, name: "Robotics & AI", color: "text-blue-400" },
    { icon: Code2, name: "Education", color: "text-green-400" },
    { icon: Settings, name: "Infrastructure", color: "text-purple-400" }
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
                GET IN TOUCH
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-6xl font-black mb-8 leading-tight"
            >
              <span className="text-futuristic animate-neon-pulse">CONTACT</span>{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-holographic">
                OUR EXPERTS
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Ready to transform your IT infrastructure? Our cybersecurity, robotics, 
              programming, and infrastructure experts are here to help you succeed.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  viewport={{ once: true }}
                  className="card-futuristic p-6 text-center group"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${info.gradient} flex items-center justify-center mx-auto mb-4 group-hover:animate-float`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">
                    {info.title}
                  </h3>
                  <p className="text-cyan-400 font-semibold mb-2">
                    {info.details}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {info.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="card-futuristic p-8"
            >
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-futuristic border border-cyan-400/30 text-cyan-400 text-sm font-mono mb-4">
                  <MessageSquare className="w-4 h-4" />
                  SEND US A MESSAGE
                </div>
                <h2 className="text-3xl font-black mb-4">
                  <span className="text-futuristic">GET A</span>{' '}
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    CONSULTATION
                  </span>
                </h2>
                <p className="text-gray-400">
                  Fill out the form below and our experts will get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-cyan-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        required
                        className="input-futuristic w-full pl-10 pr-4 py-3"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-cyan-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        className="input-futuristic w-full pl-10 pr-4 py-3"
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      className="input-futuristic w-full px-4 py-3"
                      placeholder="Your Company"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Service Interest *
                    </label>
                    <select
                      name="service"
                      required
                      className="input-futuristic w-full px-4 py-3"
                      value={formData.service}
                      onChange={handleChange}
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service.value} value={service.value}>
                          {service.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="input-futuristic w-full px-4 py-3 resize-none"
                    placeholder="Tell us about your project requirements..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-futuristic py-4 text-lg font-bold rounded-xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      SENDING MESSAGE...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      SEND MESSAGE
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Department Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="card-futuristic p-8">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-futuristic border border-purple-400/30 text-purple-400 text-sm font-mono mb-4">
                    <Zap className="w-4 h-4" />
                    OUR DEPARTMENTS
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    Specialized Teams
                  </h3>
                  <p className="text-gray-400 mt-2">
                    Connect with our expert teams for specific technical requirements
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {departments.map((dept, index) => {
                    const Icon = dept.icon;
                    return (
                      <motion.div
                        key={dept.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 p-4 rounded-lg glass-futuristic hover:bg-gray-800/50 transition-colors"
                      >
                        <Icon className={`w-6 h-6 ${dept.color}`} />
                        <span className="text-white font-medium">{dept.name}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="card-futuristic p-8">
                <h3 className="text-xl font-bold mb-6 text-white">Why Choose CTechLit?</h3>
                <div className="space-y-4">
                  {[
                    { stat: "24/7", label: "Support Available" },
                    { stat: "98%", label: "Client Satisfaction" },
                    { stat: "500+", label: "Projects Completed" },
                    { stat: "10+", label: "Years Experience" }
                  ].map((item, index) => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-gray-400">{item.label}</span>
                      <span className="text-cyan-400 font-bold text-lg">{item.stat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="card-futuristic p-8 border border-red-400/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                  <h3 className="text-xl font-bold text-red-400">Emergency IT Support</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Critical system down? Our emergency response team is available 24/7.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-black rounded-xl font-bold transition-all duration-300"
                >
                  CALL EMERGENCY LINE
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-block px-4 py-2 rounded-full glass-futuristic border border-green-400/30 text-green-400 text-sm font-mono mb-6 animate-neon-flicker">
              <MapPin className="w-4 h-4 inline mr-2" />
              OUR LOCATION
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              <span className="text-futuristic">VISIT OUR</span>{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                TECH HUB
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card-futuristic p-8 text-center"
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-12 border-2 border-dashed border-gray-600">
              <MapPin className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-bold text-white mb-2">Interactive Map</h3>
              <p className="text-gray-400 mb-4">
                123 Tech Hub, Innovation District<br />
                Accra, Ghana
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-futuristic px-6 py-3 inline-flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                GET DIRECTIONS
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
