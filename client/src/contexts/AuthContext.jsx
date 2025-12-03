import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionRefreshInterval, setSessionRefreshInterval] = useState(null);

  // Configure axios defaults - use relative URLs to let Vite proxy handle routing
  axios.defaults.baseURL = "/api";

  // Request interceptor to add auth token
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for handling errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 429) {
        // Only clear token and user for actual authentication failures on auth endpoints
        const isAuthEndpoint =
          error.config.url?.includes("/auth/login") ||
          error.config.url?.includes("/auth/register") ||
          error.config.url?.includes("/auth/verify");

        if (isAuthEndpoint) {
          console.log(
            `Clearing auth session due to ${error.response.status} on auth endpoint`
          );
          localStorage.removeItem("token");
          sessionStorage.removeItem("backup_token");
          setUser(null);
          stopSessionRefresh();
          // Only show error message for actual auth failures, not network issues or rate limiting
          if (!error.config._retry && error.response.status === 401) {
            toast.error("Authentication failed. Please try again.");
          }
        }
        // For non-auth endpoints (like admin endpoints), don't clear session automatically
        // Let the components handle their own 401 errors
      }
      return Promise.reject(error);
    }
  );

  const startSessionRefresh = () => {
    // Refresh session every 30 minutes to maintain login state
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Add delay before refresh to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 2000));

          const response = await axios.get("/auth/verify", {
            _retry: true,
          });
          // Update user data from server
          if (response.data.status === "Success" && response.data.data.user) {
            setUser(response.data.data.user);
            console.log("Session refreshed successfully");
          } else {
            throw new Error("Invalid response format");
          }
        } else {
          // No token, stop refreshing
          stopSessionRefresh();
        }
      } catch (error) {
        console.warn("Session refresh failed:", error.message);
        // Only clear session if it's a genuine authentication failure
        if (error.response?.status === 401 || error.response?.status === 429) {
          console.log("Session expired during refresh, clearing session");
          clearStoredSession();
        }
        // For network errors, just log and continue - will retry next interval
      }
    }, 30 * 60 * 1000); // 30 minutes

    setSessionRefreshInterval(interval);
  };

  const stopSessionRefresh = () => {
    if (sessionRefreshInterval) {
      clearInterval(sessionRefreshInterval);
      setSessionRefreshInterval(null);
    }
  };

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          console.log("Verifying token on app load...");

          // Add delay to prevent competing with other initial requests
          await new Promise((resolve) => setTimeout(resolve, 3000));

          const response = await axios.get("/auth/verify", {
            _retry: true,
          });

          if (response.data.status === "Success" && response.data.data.user) {
            setUser(response.data.data.user);
            startSessionRefresh();
            console.log("✅ Authentication verified successfully");
          } else {
            throw new Error("Invalid response format");
          }
        } catch (verifyError) {
          console.warn("Token verification failed:", verifyError.message);

          if (
            verifyError.response?.status === 401 ||
            verifyError.response?.status === 429
          ) {
            console.log(
              "Token expired/invalid or rate limited, clearing session"
            );
            clearStoredSession();
          }
        }
      } else {
        console.log("No token found in localStorage");
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post("/auth/login", credentials);
      const { token, user: userData } = response.data.data;

      localStorage.setItem("token", token);
      // Also store backup token in sessionStorage for extra persistence
      sessionStorage.setItem("backup_token", token);
      setUser(userData);
      toast.success("Login successful!");

      // Start session refresh for authenticated users
      startSessionRefresh();

      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post("/auth/register", userData);
      const { token, user: newUser } = response.data.data;

      localStorage.setItem("token", token);
      // Also store backup token in sessionStorage for extra persistence
      sessionStorage.setItem("backup_token", token);
      setUser(newUser);
      toast.success("Registration successful!");

      // Start session refresh for authenticated users
      startSessionRefresh();

      return { success: true, user: newUser };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    clearStoredSession();
    setUser(null);
    toast.success("Logged out successfully!");
  };

  // Cleanup session refresh interval on unmount
  useEffect(() => {
    return () => {
      stopSessionRefresh();
    };
  }, []);

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put("/auth/profile", profileData);
      setUser(response.data.user);
      toast.success("Profile updated successfully!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Profile update failed";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Clear stored session data when manually logging out or session expires
  const clearStoredSession = () => {
    console.log("Clearing all stored session data");
    localStorage.removeItem("token");
    sessionStorage.removeItem("backup_token");
    sessionStorage.removeItem("user_preferences");
    setUser(null);
    stopSessionRefresh();
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    initializeAuth,
    isAuthenticated: !!user,
    clearStoredSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
