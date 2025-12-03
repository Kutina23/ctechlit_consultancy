import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Request queue to prevent concurrent requests that trigger rate limiting
let requestQueue = [];
let isProcessingQueue = false;

// Process queued requests with delays to avoid rate limiting
const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const { method, url, data, config, resolve, reject } = requestQueue.shift();
    
    try {
      const response = await axios({
        method,
        url,
        data,
        ...config
      });
      resolve(response.data);
    } catch (err) {
      // Handle rate limiting specifically
      if (err.response?.status === 429) {
        const retryAfter = err.response.headers['retry-after'] || 2;
        console.warn(`Rate limited (429), waiting ${retryAfter}s before retry...`);
        
        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        
        try {
          const retryResponse = await axios({
            method,
            url,
            data,
            ...config
          });
          resolve(retryResponse.data);
        } catch (retryErr) {
          reject(retryErr);
        }
      } else {
        reject(err);
      }
    }
    
    // Add delay between requests to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  isProcessingQueue = false;
};

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (method, url, data = null, config = {}) => {
    return new Promise((resolve, reject) => {
      requestQueue.push({ method, url, data, config, resolve, reject });
      processQueue();
    });
  };

  const get = async (url, config = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await request('GET', url, null, config);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      if (err.response?.status !== 429) { // Don't show toast for rate limiting errors
        toast.error(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const post = async (url, data, config = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await request('POST', url, data, config);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      if (err.response?.status !== 429) { // Don't show toast for rate limiting errors
        toast.error(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const put = async (url, data, config = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await request('PUT', url, data, config);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      if (err.response?.status !== 429) { // Don't show toast for rate limiting errors
        toast.error(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const del = async (url, config = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await request('DELETE', url, null, config);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      if (err.response?.status !== 429) { // Don't show toast for rate limiting errors
        toast.error(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del
  };
};

// Dashboard API hook
export const useDashboardData = () => {
  const api = useApi();
  const [dashboardData, setDashboardData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, projectsRes, notificationsRes] = await Promise.all([
        api.get('/client/dashboard'),
        api.get('/client/projects?limit=3'),
        api.get('/client/notifications?limit=5')
      ]);

      if (dashboardRes.status === 'Success') {
        setDashboardData(dashboardRes.data.dashboard);
      }

      if (projectsRes.status === 'Success') {
        setProjects(projectsRes.data.projects);
      }

      if (notificationsRes.status === 'Success') {
        setNotifications(notificationsRes.data.notifications);
        
        // Transform notifications to milestones
        const upcomingMilestones = notificationsRes.data.notifications
          .slice(0, 4)
          .map((notification, index) => ({
            title: notification.title,
            date: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            project: 'Current Project'
          }));
        setMilestones(upcomingMilestones);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    dashboardData,
    projects,
    notifications,
    milestones,
    loading,
    refetch: fetchDashboardData
  };
};

// Projects API hook
export const useProjects = (page = 1, limit = 10, status = null) => {
  const api = useApi();
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (status) {
        params.append('status', status);
      }

      const response = await api.get(`/client/projects?${params}`);
      
      if (response.status === 'Success') {
        setProjects(response.data.projects);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, limit, status]);

  return {
    projects,
    pagination,
    loading,
    refetch: fetchProjects
  };
};

// Notifications API hook
export const useNotifications = (page = 1, limit = 20, unreadOnly = false) => {
  const api = useApi();
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (unreadOnly) {
        params.append('unread', 'true');
      }

      const response = await api.get(`/client/notifications?${params}`);
      
      if (response.status === 'Success') {
        setNotifications(response.data.notifications);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/client/notifications/${notificationId}/read`);
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true, read_at: new Date() }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, limit, unreadOnly]);

  return {
    notifications,
    pagination,
    loading,
    markAsRead,
    refetch: fetchNotifications
  };
};

// Admin dashboard API hook
export const useAdminDashboard = () => {
  const api = useApi();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard');
      
      if (response.status === 'Success') {
        setDashboardData(response.data.dashboard);
      }
    } catch (error) {
      console.error('Failed to fetch admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add delay to prevent competing with auth verification and public content requests
    const timer = setTimeout(() => {
      fetchAdminDashboard();
    }, 2000); // Wait 2 seconds before making the admin dashboard request

    return () => clearTimeout(timer);
  }, []);

  return {
    dashboardData,
    loading,
    refetch: fetchAdminDashboard
  };
};

// Admin requests API hook
export const useAdminRequests = (page = 1, limit = 10, status = null) => {
  const api = useApi();
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (status) {
        params.append('status', status);
      }

      const response = await api.get(`/admin/requests?${params}`);
      
      if (response.status === 'Success') {
        setRequests(response.data.requests);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      await api.put(`/admin/requests/${requestId}/status`, { status });
      // Update local state
      setRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status }
            : request
        )
      );
    } catch (error) {
      console.error('Failed to update request status:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page, limit, status]);

  return {
    requests,
    pagination,
    loading,
    updateRequestStatus,
    refetch: fetchRequests
  };
};

// Admin content API hook
export const useAdminContent = (page = 1, limit = 10, pageName = null, section = null) => {
  const api = useApi();
  const [content, setContent] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (pageName) {
        params.append('page_name', pageName);
      }
      
      if (section) {
        params.append('section', section);
      }

      const response = await api.get(`/admin/content?${params}`);
      
      if (response.status === 'Success') {
        setContent(response.data.content);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (contentId, contentData) => {
    try {
      await api.put(`/admin/content/${contentId}`, contentData);
      await fetchContent(); // Refetch to get updated data
    } catch (error) {
      console.error('Failed to update content:', error);
    }
  };

  const createContent = async (contentData) => {
    try {
      await api.post('/admin/content', contentData);
      await fetchContent(); // Refetch to get updated data
    } catch (error) {
      console.error('Failed to create content:', error);
    }
  };

  const deleteContent = async (contentId) => {
    try {
      await api.delete(`/admin/content/${contentId}`);
      await fetchContent(); // Refetch to get updated data
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [page, limit, pageName, section]);

  return {
    content,
    pagination,
    loading,
    updateContent,
    createContent,
    deleteContent,
    refetch: fetchContent
  };
};

// Public site content API hook
export const usePublicContent = () => {
  const api = useApi();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/public/content');
      
      if (response.status === 'Success') {
        setContent(response.data.content);
      }
    } catch (error) {
      console.error('Failed to fetch public content:', error);
      setError(error.message || 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const fetchPageContent = async (pageName) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/public/content/${pageName}`);
      
      if (response.status === 'Success') {
        return response.data.page;
      }
    } catch (error) {
      console.error('Failed to fetch page content:', error);
      setError(error.message || 'Failed to fetch page content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return {
    content,
    loading,
    error,
    fetchPageContent,
    refetch: fetchContent
  };
};

// Admin notifications API hook
export const useAdminNotifications = (page = 1, limit = 10, type = null, isRead = null) => {
  const api = useApi();
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (type) {
        params.append('type', type);
      }
      
      if (isRead !== null) {
        params.append('is_read', isRead.toString());
      }

      const response = await api.get(`/admin/notifications?${params}`);
      
      if (response.status === 'Success') {
        setNotifications(response.data.notifications);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async (notificationData) => {
    try {
      await api.post('/admin/notifications', notificationData);
      await fetchNotifications(); // Refetch to get updated data
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  };

  const updateNotification = async (notificationId, updateData) => {
    try {
      await api.put(`/admin/notifications/${notificationId}`, updateData);
      await fetchNotifications(); // Refetch to get updated data
    } catch (error) {
      console.error('Failed to update notification:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/admin/notifications/${notificationId}`);
      await fetchNotifications(); // Refetch to get updated data
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/admin/notifications/${notificationId}/read`, { is_read: true });
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/admin/notifications/mark-all-read');
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, limit, type, isRead]);

  return {
    notifications,
    pagination,
    loading,
    createNotification,
    updateNotification,
    deleteNotification,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
};

// Admin media API hook
export const useAdminMedia = (page = 1, limit = 20, mediaType = null, search = null) => {
  const api = useApi();
  const [media, setMedia] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (mediaType) {
        params.append('mediaType', mediaType);
      }
      
      if (search) {
        params.append('search', search);
      }

      const response = await api.get(`/admin/media?${params}`);
      
      if (response.status === 'Success') {
        setMedia(response.data.media);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch media:', error);
      // Set empty media array instead of failing completely
      setMedia([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  const deleteMedia = async (mediaId) => {
    try {
      await api.delete(`/admin/media/${mediaId}`);
      await fetchMedia(); // Refetch to get updated data
    } catch (error) {
      console.error('Failed to delete media:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [page, limit, mediaType, search]);

  return {
    media,
    pagination,
    loading,
    deleteMedia,
    refetch: fetchMedia
  };
};

// Admin analytics API hook
export const useAdminAnalytics = (timeRange = '30d') => {
  const api = useApi();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/analytics?timeRange=${timeRange}`);
      
      if (response.status === 'Success') {
        setAnalyticsData(response.data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setAnalyticsData(null);
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = async (format = 'csv') => {
    try {
      const response = await api.post('/admin/analytics/export', { timeRange, format });
      return response.data;
    } catch (error) {
      console.error('Failed to export analytics:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  return {
    analyticsData,
    loading,
    exportAnalytics,
    refetch: fetchAnalytics
  };
};