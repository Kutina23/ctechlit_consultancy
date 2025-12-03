import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Building, Zap, CheckCircle } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    company: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      alert("Please agree to the terms and conditions");
      return;
    }
    setLoading(true);

    const result = await register(formData);
    if (result.success) {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  const passwordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = passwordStrength(formData.password);
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
  const strengthTexts = ["Weak", "Fair", "Good", "Strong"];

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 particles-bg relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-cyan-900/20 to-pink-900/20"></div>
      <div className="absolute inset-0 bg-cyber-dots opacity-20"></div>
      
      {/* Floating elements */}
      <div className="absolute top-32 right-10 w-36 h-36 bg-cyan-500/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-32 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-float" style={{animationDelay: '3s'}}></div>
      <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-pink-500/10 rounded-full blur-xl animate-float" style={{animationDelay: '6s'}}></div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="card-futuristic p-8"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-futuristic border border-purple-400/30 text-purple-400 text-sm font-mono mb-6 animate-neon-flicker">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              NEW USER REGISTRATION
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              <span className="text-futuristic">JOIN OUR</span>{' '}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                TEAM
              </span>
            </h2>
            
            <p className="text-gray-400 font-light">
              Become part of our IT consultancy community
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-cyan-400" />
                  </div>
                  <input
                    name="firstName"
                    type="text"
                    required
                    className="input-futuristic w-full pl-10 pr-4 py-3 text-white placeholder-gray-400"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-cyan-400" />
                  </div>
                  <input
                    name="lastName"
                    type="text"
                    required
                    className="input-futuristic w-full pl-10 pr-4 py-3 text-white placeholder-gray-400"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-cyan-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-futuristic w-full pl-10 pr-4 py-3 text-white placeholder-gray-400"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                Company (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-cyan-400" />
                </div>
                <input
                  name="company"
                  type="text"
                  className="input-futuristic w-full pl-10 pr-4 py-3 text-white placeholder-gray-400"
                  placeholder="Your company name"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-cyan-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="input-futuristic w-full pl-10 pr-12 py-3 text-white placeholder-gray-400"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-cyan-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded ${
                          i < strength ? strengthColors[strength - 1] : "bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs mt-1 text-gray-400">
                    Password strength: {strength > 0 && strengthTexts[strength - 1]}
                  </p>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="flex items-start"
            >
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500 focus:ring-2"
                />
              </div>
              <div className="ml-3 text-sm">
                <span className="text-gray-400">
                  I agree to the{" "}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium">
                    Privacy Policy
                  </a>
                </span>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !agreed}
              className="w-full btn-futuristic py-4 text-lg font-bold rounded-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  CREATING ACCOUNT...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  CREATE ACCOUNT
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Security info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-futuristic border border-green-400/30 text-green-400 text-xs font-mono">
            <CheckCircle className="w-4 h-4" />
            END-TO-END ENCRYPTION ENABLED
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
