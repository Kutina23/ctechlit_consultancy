const express = require('express');
const { query, validationResult } = require('express-validator');
const { executeQuery } = require('../config/database');
const { authenticateToken, requireClientOrAdmin } = require('../middleware/auth');

const router = express.Router();

// All client routes require authentication
router.use(authenticateToken, requireClientOrAdmin);

// @route   GET /api/client/dashboard
// @desc    Get client dashboard statistics
// @access  Private (Client)
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get dashboard statistics for the client
    const stats = await Promise.all([
      // Total service requests
      executeQuery(
        'SELECT COUNT(*) as total FROM service_requests WHERE user_id = ?',
        [userId]
      ),
      // Active projects (requests in progress)
      executeQuery(
        'SELECT COUNT(*) as active FROM service_requests WHERE user_id = ? AND status = "in_progress"',
        [userId]
      ),
      // Completed projects
      executeQuery(
        'SELECT COUNT(*) as completed FROM service_requests WHERE user_id = ? AND status = "completed"',
        [userId]
      ),
      // Pending requests
      executeQuery(
        'SELECT COUNT(*) as pending FROM service_requests WHERE user_id = ? AND status = "pending"',
        [userId]
      ),
      // Total budget spent
      executeQuery(
        'SELECT COALESCE(SUM(budget), 0) as total_spent FROM service_requests WHERE user_id = ? AND budget IS NOT NULL',
        [userId]
      )
    ]);

    const dashboardData = {
      totalRequests: stats[0][0].total,
      activeProjects: stats[1][0].active,
      completedProjects: stats[2][0].completed,
      pendingRequests: stats[3][0].pending,
      totalInvestment: stats[4][0].total_spent,
      satisfactionScore: 98 // This could be calculated from feedback data
    };

    res.json({
      status: 'Success',
      data: { dashboard: dashboardData }
    });

  } catch (error) {
    console.error('Get client dashboard error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch dashboard data'
    });
  }
});

// @route   GET /api/client/projects
// @desc    Get client's projects
// @access  Private (Client)
router.get('/projects', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'Error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { status } = req.query;

    let whereClause = 'WHERE sr.user_id = ?';
    const queryParams = [userId];

    if (status) {
      whereClause += ' AND sr.status = ?';
      queryParams.push(status);
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM service_requests sr ${whereClause}`,
      queryParams
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get projects
    const projects = await executeQuery(
      `SELECT sr.*, s.name as service_name, s.category as service_category
       FROM service_requests sr
       JOIN services s ON sr.service_id = s.id
       ${whereClause}
       ORDER BY sr.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    // Transform data to match frontend expectations
    const transformedProjects = projects.map(project => ({
      id: project.id,
      title: project.title,
      status: project.status,
      progress: project.status === 'completed' ? 100 : project.status === 'in_progress' ? 75 : 25,
      dueDate: project.estimated_completion || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget: project.budget ? `$${project.budget.toLocaleString()}` : '$0',
      priority: 'medium', // Could be calculated based on timeline/budget
      team: ['CTechLit Team'], // This would come from a team assignment table
      description: project.description,
      serviceName: project.service_name,
      category: project.service_category,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    }));

    res.json({
      status: 'Success',
      data: {
        projects: transformedProjects,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get client projects error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch projects'
    });
  }
});

// @route   GET /api/client/projects/:id
// @desc    Get specific client project
// @access  Private (Client)
router.get('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const projects = await executeQuery(
      `SELECT sr.*, s.name as service_name, s.category as service_category
       FROM service_requests sr
       JOIN services s ON sr.service_id = s.id
       WHERE sr.id = ? AND sr.user_id = ?`,
      [id, userId]
    );

    if (projects.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Project not found'
      });
    }

    const project = projects[0];
    const transformedProject = {
      id: project.id,
      title: project.title,
      status: project.status,
      progress: project.status === 'completed' ? 100 : project.status === 'in_progress' ? 75 : 25,
      dueDate: project.estimated_completion || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget: project.budget ? `$${project.budget.toLocaleString()}` : '$0',
      priority: 'medium',
      team: ['CTechLit Team'],
      description: project.description,
      serviceName: project.service_name,
      category: project.service_category,
      timeline: project.timeline,
      requirements: project.requirements,
      adminNotes: project.admin_notes,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    };

    res.json({
      status: 'Success',
      data: { project: transformedProject }
    });

  } catch (error) {
    console.error('Get client project error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch project'
    });
  }
});

// @route   GET /api/client/notifications
// @desc    Get client notifications
// @access  Private (Client)
router.get('/notifications', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('unread').optional().isBoolean()
], async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const unreadOnly = req.query.unread === 'true';

    let whereClause = 'WHERE n.user_id = ?';
    const queryParams = [userId];

    if (unreadOnly) {
      whereClause += ' AND n.is_read = FALSE';
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM notifications n ${whereClause}`,
      queryParams
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get notifications
    const notifications = await executeQuery(
      `SELECT n.*, 
        CASE 
          WHEN n.created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR) THEN 'Just now'
          WHEN n.created_at > DATE_SUB(NOW(), INTERVAL 1 DAY) THEN CONCAT(HOUR(TIMEDIFF(NOW(), n.created_at)), ' hours ago')
          WHEN n.created_at > DATE_SUB(NOW(), INTERVAL 7 DAY) THEN CONCAT(DAY(TIMEDIFF(NOW(), n.created_at)), ' days ago')
          ELSE DATE_FORMAT(n.created_at, '%M %d, %Y')
        END as time_ago
       FROM notifications n
       ${whereClause}
       ORDER BY n.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    res.json({
      status: 'Success',
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get client notifications error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch notifications'
    });
  }
});

// @route   PUT /api/client/notifications/:id/read
// @desc    Mark notification as read
// @access  Private (Client)
router.put('/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if notification belongs to user
    const notifications = await executeQuery(
      'SELECT id FROM notifications WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (notifications.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Notification not found'
      });
    }

    // Mark as read
    await executeQuery(
      'UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE id = ?',
      [id]
    );

    res.json({
      status: 'Success',
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to mark notification as read'
    });
  }
});

// @route   GET /api/client/history
// @desc    Get client project history
// @access  Private (Client)
router.get('/history', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get completed projects as history
    let whereClause = 'WHERE sr.user_id = ? AND sr.status = "completed"';
    const queryParams = [userId];

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM service_requests sr ${whereClause}`,
      queryParams
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get history projects
    const history = await executeQuery(
      `SELECT sr.*, s.name as service_name, s.category as service_category
       FROM service_requests sr
       JOIN services s ON sr.service_id = s.id
       ${whereClause}
       ORDER BY sr.actual_completion DESC, sr.updated_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    const transformedHistory = history.map(project => ({
      id: project.id,
      title: project.title,
      serviceName: project.service_name,
      category: project.service_category,
      completionDate: project.actual_completion || project.updated_at,
      budget: project.budget ? `$${project.budget.toLocaleString()}` : '$0',
      rating: 5, // This would come from a feedback/rating system
      feedback: 'Excellent work delivered on time!' // This would come from client feedback
    }));

    res.json({
      status: 'Success',
      data: {
        history: transformedHistory,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get client history error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch project history'
    });
  }
});

// @route   POST /api/client/requests
// @desc    Create new service request
// @access  Private (Client)
router.post('/requests', async (req, res) => {
  try {
    const { serviceId, title, description, budget, timeline, requirements } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!serviceId || !title || !description) {
      return res.status(400).json({
        status: 'Error',
        message: 'Service ID, title, and description are required'
      });
    }

    // Check if service exists
    const services = await executeQuery('SELECT id, name FROM services WHERE id = ?', [serviceId]);
    if (services.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Service not found'
      });
    }

    // Create the request
    const result = await executeQuery(
      `INSERT INTO service_requests (
        user_id, service_id, title, description, budget, timeline, requirements, 
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
      [userId, serviceId, title, description, budget || null, timeline || null, requirements || null]
    );

    // Get created request with service info
    const newRequest = await executeQuery(
      `SELECT sr.*, s.name as service_name, s.category as service_category
       FROM service_requests sr
       JOIN services s ON sr.service_id = s.id
       WHERE sr.id = ?`,
      [result.insertId]
    );

    // Create notification for admin
    await executeQuery(
      `INSERT INTO notifications (user_id, title, message, type, created_at)
       VALUES (NULL, 'New Service Request', 'A new service request has been submitted', 'info', NOW())`
    );

    res.status(201).json({
      status: 'Success',
      message: 'Service request created successfully',
      data: { 
        request: {
          id: newRequest[0].id,
          title: newRequest[0].title,
          description: newRequest[0].description,
          status: newRequest[0].status,
          serviceName: newRequest[0].service_name,
          category: newRequest[0].service_category,
          budget: newRequest[0].budget,
          timeline: newRequest[0].timeline,
          requirements: newRequest[0].requirements,
          createdAt: newRequest[0].created_at
        }
      }
    });

  } catch (error) {
    console.error('Create client request error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to create service request'
    });
  }
});

module.exports = router;