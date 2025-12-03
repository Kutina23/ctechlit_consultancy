import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Lock,
  Bell,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Monitor,
  Globe,
  Moon,
  Sun,
  MonitorSpeaker,
  Settings,
  Save as SaveIcon,
  AlertTriangle,
  CheckCircle,
  Activity,
  Clock,
  Award,
  Star,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
} from "lucide-react";

const AdminProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [theme, setTheme] = useState("dark");

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "Admin",
    lastName: user?.lastName || "User",
    email: user?.email || "admin@ctechlit.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Experienced technology consultant with 10+ years in web development and digital transformation.",
    company: "CTechLit Consultancy",
    position: "Senior Administrator",
    joinDate: "2024-01-01",
    website: "https://ctechlit.com",
    linkedin: "https://linkedin.com/in/adminuser",
    github: "https://github.com/adminuser",
    timezone: "America/Los_Angeles",
    language: "en",
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
      security: true,
      updates: true,
    },
    privacy: {
      profileVisibility: "private",
      activityStatus: true,
      onlineStatus: true,
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    loginNotifications: true,
    sessionTimeout: "24h",
    deviceTrust: true,
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "activity", label: "Activity", icon: Activity },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Profile Updated",
      description: "Updated profile information and bio",
      timestamp: "2024-12-27T10:30:00Z",
      icon: User,
      type: "profile",
    },
    {
      id: 2,
      action: "Password Changed",
      description: "Successfully changed account password",
      timestamp: "2024-12-26T15:45:00Z",
      icon: Lock,
      type: "security",
    },
    {
      id: 3,
      action: "Two-Factor Authentication Enabled",
      description: "2FA was enabled for enhanced security",
      timestamp: "2024-12-25T09:20:00Z",
      icon: Shield,
      type: "security",
    },
    {
      id: 4,
      action: "Notification Preferences Updated",
      description: "Modified email and push notification settings",
      timestamp: "2024-12-24T14:15:00Z",
      icon: Bell,
      type: "settings",
    },
    {
      id: 5,
      action: "Login from New Device",
      description: "Logged in from Chrome on Windows",
      timestamp: "2024-12-23T11:30:00Z",
      icon: Monitor,
      type: "security",
    },
  ];

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (key, value) => {
    setProfileData((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setProfileData((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value },
    }));
  };

  const handlePasswordChange = () => {
    // In a real app, this would make an API call
    console.log("Changing password...");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-10">
      {/* Profile Header */}
      <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-10 lg:p-12">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {profileData.firstName?.charAt(0)}
                {profileData.lastName?.charAt(0)}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center hover:from-cyan-600 hover:to-purple-600 transition-all">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-4">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-gray-400 mb-4 text-lg">
              {profileData.position} at {profileData.company}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 text-base text-gray-400">
              <span className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                {profileData.email}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {profileData.location}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-base font-medium hover:from-cyan-600 hover:to-purple-600 transition-all flex items-center gap-2"
          >
            {isEditing ? (
              <X className="w-5 h-5" />
            ) : (
              <Edit className="w-5 h-5" />
            )}
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-10 lg:p-12">
          <h3 className="text-xl font-bold text-white mb-6">
            Personal Information
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium text-gray-300 mb-3">
                  First Name
                </label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-300 mb-3">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors disabled:opacity-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-base font-medium text-gray-300 mb-3">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-300 mb-3">
                Phone
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-300 mb-3">
                Location
              </label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-10 lg:p-12">
          <h3 className="text-xl font-bold text-white mb-6">
            Professional Information
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-base font-medium text-gray-300 mb-3">
                Position
              </label>
              <input
                type="text"
                value={profileData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-300 mb-3">
                Company
              </label>
              <input
                type="text"
                value={profileData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-300 mb-3">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-10 lg:p-12">
        <h3 className="text-xl font-bold text-white mb-6">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-base font-medium text-gray-300 mb-3">
              Website
            </label>
            <input
              type="url"
              value={profileData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-300 mb-3">
              LinkedIn
            </label>
            <input
              type="url"
              value={profileData.linkedin}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-300 mb-3">
              GitHub
            </label>
            <input
              type="url"
              value={profileData.github}
              onChange={(e) => handleInputChange("github", e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-end">
          <button
            onClick={() => {
              setIsEditing(false);
              // Save changes to backend
              console.log("Saving profile changes:", profileData);
            }}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-medium hover:from-cyan-600 hover:to-purple-600 transition-all flex items-center gap-2"
          >
            <SaveIcon className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-10">
      {/* Password Change */}
      <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-10 lg:p-12">
        <h3 className="text-xl font-bold text-white mb-6">Change Password</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-base font-medium text-gray-300 mb-3">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 pr-14 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-base font-medium text-gray-300 mb-3">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 pr-14 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-base font-medium text-gray-300 mb-3">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
          </div>
          <button
            onClick={handlePasswordChange}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-medium hover:from-cyan-600 hover:to-purple-600 transition-all flex items-center gap-2"
          >
            <Lock className="w-5 h-5" />
            Update Password
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-10 lg:p-12">
        <h3 className="text-xl font-bold text-white mb-6">Security Settings</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-lg">
            <div>
              <h4 className="font-medium text-white text-lg">
                Two-Factor Authentication
              </h4>
              <p className="text-base text-gray-400">
                Add an extra layer of security to your account
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={securitySettings.twoFactorEnabled}
                onChange={(e) =>
                  setSecuritySettings((prev) => ({
                    ...prev,
                    twoFactorEnabled: e.target.checked,
                  }))
                }
              />
              <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-lg">
            <div>
              <h4 className="font-medium text-white text-lg">
                Login Notifications
              </h4>
              <p className="text-base text-gray-400">
                Get notified of new login attempts
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={securitySettings.loginNotifications}
                onChange={(e) =>
                  setSecuritySettings((prev) => ({
                    ...prev,
                    loginNotifications: e.target.checked,
                  }))
                }
              />
              <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-10">
      <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-10 lg:p-12">
        <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
        <div className="space-y-6">
          {recentActivity.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-lg"
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    activity.type === "security"
                      ? "bg-red-400/20"
                      : activity.type === "profile"
                      ? "bg-blue-400/20"
                      : "bg-green-400/20"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      activity.type === "security"
                        ? "text-red-400"
                        : activity.type === "profile"
                        ? "text-blue-400"
                        : "text-green-400"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white text-lg">
                    {activity.action}
                  </h4>
                  <p className="text-base text-gray-400">
                    {activity.description}
                  </p>
                </div>
                <span className="text-base text-gray-500">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 lg:space-y-10 max-w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Admin Profile
          </h1>
          <p className="text-gray-400 mt-2 text-base md:text-lg">
            Manage your account settings and preferences
          </p>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-lg border border-white/10 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
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
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && renderProfileTab()}
      {activeTab === "security" && renderSecurityTab()}
      {activeTab === "activity" && renderActivityTab()}
      {(activeTab === "notifications" || activeTab === "preferences") && (
        <div className="text-center py-20">
          <Settings className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-4">
            Feature Coming Soon
          </h3>
          <p className="text-gray-400 text-lg">
            This section is under development and will be available soon.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
