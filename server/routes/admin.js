const express = require('express');
const bcrypt = require('bcryptjs');
const { body, query, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { executeQuery } = require('../config/database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(requireAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
  try {
    // Get counts for dashboard
    const stats = await Promise.all([
      executeQuery('SELECT COUNT(*) as totalUsers FROM users WHERE role = "client"'),
      executeQuery('SELECT COUNT(*) as totalRequests FROM service_requests'),
      executeQuery('SELECT COUNT(*) as pendingRequests FROM service_requests WHERE status = "pending"'),
      executeQuery('SELECT COUNT(*) as completedRequests FROM service_requests WHERE status = "completed"')
    ]);

    const dashboardData = {
      totalUsers: stats[0][0].totalUsers,
      totalRequests: stats[1][0].totalRequests,
      pendingRequests: stats[2][0].pendingRequests,
      completedRequests: stats[3][0].completedRequests
    };

    res.json({
      status: 'Success',
      data: { dashboard: dashboardData }
    });

  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch dashboard data'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['client', 'admin']),
  query('status').optional().isIn(['active', 'inactive', 'suspended'])
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { role, status } = req.query;

    let whereClause = 'WHERE 1=1';
    const queryParams = [];

    if (role) {
      whereClause += ' AND role = ?';
      queryParams.push(role);
    }

    if (status) {
      whereClause += ' AND status = ?';
      queryParams.push(status);
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      queryParams
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get users
    const users = await executeQuery(
      `SELECT id, email, first_name, last_name, phone, company, role, status, created_at, last_login 
       FROM users ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    res.json({
      status: 'Success',
      data: {
        users,
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
    console.error('Get admin users error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch users'
    });
  }
});

// @route   POST /api/admin/users
// @desc    Create new user
// @access  Private (Admin)
router.post('/users', [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('phone').optional().trim().isLength({ min: 10, max: 20 }).withMessage('Phone number must be between 10 and 20 characters'),
  body('company').optional().trim().isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters'),
  body('role').optional().isIn(['client', 'admin']).withMessage('Role must be either client or admin'),
  body('status').optional().isIn(['active', 'inactive', 'suspended']).withMessage('Status must be active, inactive, or suspended')
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

    const { email, password, firstName, lastName, phone, company, role, status } = req.body;

    // Check if email already exists
    const existingUsers = await executeQuery('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({
        status: 'Error',
        message: 'Email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await executeQuery(
      `INSERT INTO users (email, password, first_name, last_name, phone, company, role, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [email, hashedPassword, firstName, lastName, phone || null, company || null, role || 'client', status || 'active']
    );

    // Get created user (without password)
    const newUser = await executeQuery(
      'SELECT id, email, first_name, last_name, phone, company, role, status, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      status: 'Success',
      message: 'User created successfully',
      data: { user: newUser[0] }
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to create user'
    });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private (Admin)
router.put('/users/:id', [
  body('email').optional().isEmail().withMessage('Please provide a valid email address'),
  body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('phone').optional().trim().isLength({ min: 10, max: 20 }).withMessage('Phone number must be between 10 and 20 characters'),
  body('company').optional().trim().isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters'),
  body('role').optional().isIn(['client', 'admin']).withMessage('Role must be either client or admin'),
  body('status').optional().isIn(['active', 'inactive', 'suspended']).withMessage('Status must be active, inactive, or suspended')
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

    const { id } = req.params;
    const { email, firstName, lastName, phone, company, role, status, password } = req.body;
    const existingUsers = await executeQuery('SELECT id FROM users WHERE id = ?', [id]);
    if (existingUsers.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found'
      });
    }

    // Check if email is already taken by another user
    if (email) {
      const emailCheck = await executeQuery('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
      if (emailCheck.length > 0) {
        return res.status(409).json({
          status: 'Error',
          message: 'Email already exists'
        });
      }
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (firstName !== undefined) {
      updateFields.push('first_name = ?');
      updateValues.push(firstName);
    }
    if (lastName !== undefined) {
      updateFields.push('last_name = ?');
      updateValues.push(lastName);
    }
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone || null);
    }
    if (company !== undefined) {
      updateFields.push('company = ?');
      updateValues.push(company || null);
    }
    if (role !== undefined) {
      updateFields.push('role = ?');
      updateValues.push(role);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (password !== undefined) {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        status: 'Error',
        message: 'No valid fields to update'
      });
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(id);

    await executeQuery(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated user
    const updatedUser = await executeQuery(
      'SELECT id, email, first_name, last_name, phone, company, role, status, created_at FROM users WHERE id = ?',
      [id]
    );

    res.json({
      status: 'Success',
      message: 'User updated successfully',
      data: { user: updatedUser[0] }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to update user'
    });
  }
});

// @route   GET /api/admin/users/:id
// @desc    Get single user
// @access  Private (Admin)
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get user
    const users = await executeQuery(
      'SELECT id, email, first_name, last_name, phone, company, role, status, created_at, last_login FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found'
      });
    }

    // Get user's requests
    const requests = await executeQuery(
      `SELECT sr.id, sr.title, sr.status, sr.created_at, s.name as service_name
       FROM service_requests sr
       JOIN services s ON sr.service_id = s.id
       WHERE sr.user_id = ?
       ORDER BY sr.created_at DESC
       LIMIT 10`,
      [id]
    );

    res.json({
      status: 'Success',
      data: {
        user: users[0],
        requests: requests
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch user'
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status
// @access  Private (Admin)
router.put('/users/:id/status', [
  body('status').isIn(['active', 'inactive', 'suspended']).withMessage('Status must be active, inactive, or suspended')
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

    const { id } = req.params;
    const { status } = req.body;

    // Check if user exists
    const users = await executeQuery('SELECT id FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found'
      });
    }

    // Update user status
    await executeQuery(
      'UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    res.json({
      status: 'Success',
      message: 'User status updated successfully'
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to update user status'
    });
  }
});

// @route   GET /api/admin/requests
// @desc    Get all service requests
// @access  Private (Admin)
router.get('/requests', [
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { status } = req.query;

    let whereClause = '';
    const queryParams = [];

    if (status) {
      whereClause = 'WHERE sr.status = ?';
      queryParams.push(status);
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM service_requests sr ${whereClause}`,
      queryParams
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get requests
    const requests = await executeQuery(
      `SELECT sr.*, s.name as service_name, u.first_name, u.last_name, u.email
       FROM service_requests sr
       JOIN services s ON sr.service_id = s.id
       JOIN users u ON sr.user_id = u.id
       ${whereClause}
       ORDER BY sr.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    res.json({
      status: 'Success',
      data: {
        requests,
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
    console.error('Get admin requests error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch service requests'
    });
  }
});

// @route   POST /api/admin/requests
// @desc    Create new service request
// @access  Private (Admin)
router.post('/requests', [
  body('userId').isInt({ min: 1 }).withMessage('User ID must be a valid integer'),
  body('serviceId').isInt({ min: 1 }).withMessage('Service ID must be a valid integer'),
  body('title').trim().isLength({ min: 5, max: 255 }).withMessage('Title must be between 5 and 255 characters'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('budget').optional().isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
  body('timeline').optional().trim().isLength({ max: 100 }).withMessage('Timeline cannot exceed 100 characters'),
  body('requirements').optional().trim().isLength({ max: 2000 }).withMessage('Requirements cannot exceed 2000 characters'),
  body('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled']).withMessage('Status must be pending, in_progress, completed, or cancelled'),
  body('adminNotes').optional().trim().isLength({ max: 1000 }).withMessage('Admin notes cannot exceed 1000 characters'),
  body('estimatedCompletion').optional().isISO8601().withMessage('Estimated completion must be a valid date')
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

    const { userId, serviceId, title, description, budget, timeline, requirements, status, adminNotes, estimatedCompletion } = req.body;

    // Check if user exists
    const users = await executeQuery('SELECT id FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found'
      });
    }

    // Check if service exists
    const services = await executeQuery('SELECT id FROM services WHERE id = ?', [serviceId]);
    if (services.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Service not found'
      });
    }

    // Create request
    const result = await executeQuery(
      `INSERT INTO service_requests (
        user_id, service_id, title, description, budget, timeline, requirements, 
        status, admin_notes, estimated_completion, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        userId, serviceId, title, description, 
        budget || null, timeline || null, requirements || null,
        status || 'pending', adminNotes || null, estimatedCompletion || null
      ]
    );

    // Get created request with joins
    const newRequest = await executeQuery(
      `SELECT sr.*, s.name as service_name, s.category as service_category,
              u.first_name, u.last_name, u.email, u.company
       FROM service_requests sr
       JOIN services s ON sr.service_id = s.id
       JOIN users u ON sr.user_id = u.id
       WHERE sr.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      status: 'Success',
      message: 'Service request created successfully',
      data: { request: newRequest[0] }
    });

  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to create service request'
    });
  }
});

// @route   PUT /api/admin/requests/:id
// @desc    Update service request
// @access  Private (Admin)
router.put('/requests/:id', [
  body('title').optional().trim().isLength({ min: 5, max: 255 }).withMessage('Title must be between 5 and 255 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('budget').optional().isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
  body('timeline').optional().trim().isLength({ max: 100 }).withMessage('Timeline cannot exceed 100 characters'),
  body('requirements').optional().trim().isLength({ max: 2000 }).withMessage('Requirements cannot exceed 2000 characters'),
  body('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled']).withMessage('Status must be pending, in_progress, completed, or cancelled'),
  body('adminNotes').optional().trim().isLength({ max: 1000 }).withMessage('Admin notes cannot exceed 1000 characters'),
  body('estimatedCompletion').optional().isISO8601().withMessage('Estimated completion must be a valid date'),
  body('actualCompletion').optional().isISO8601().withMessage('Actual completion must be a valid date')
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

    const { id } = req.params;
    const { title, description, budget, timeline, requirements, status, adminNotes, estimatedCompletion, actualCompletion } = req.body;

    // Check if request exists
    const existingRequests = await executeQuery('SELECT id FROM service_requests WHERE id = ?', [id]);
    if (existingRequests.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Service request not found'
      });
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (budget !== undefined) {
      updateFields.push('budget = ?');
      updateValues.push(budget || null);
    }
    if (timeline !== undefined) {
      updateFields.push('timeline = ?');
      updateValues.push(timeline || null);
    }
    if (requirements !== undefined) {
      updateFields.push('requirements = ?');
      updateValues.push(requirements || null);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (adminNotes !== undefined) {
      updateFields.push('admin_notes = ?');
      updateValues.push(adminNotes || null);
    }
    if (estimatedCompletion !== undefined) {
      updateFields.push('estimated_completion = ?');
      updateValues.push(estimatedCompletion || null);
    }
    if (actualCompletion !== undefined) {
      updateFields.push('actual_completion = ?');
      updateValues.push(actualCompletion || null);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        status: 'Error',
        message: 'No valid fields to update'
      });
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(id);

    await executeQuery(
      `UPDATE service_requests SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated request with joins
    const updatedRequest = await executeQuery(
      `SELECT sr.*, s.name as service_name, s.category as service_category,
              u.first_name, u.last_name, u.email, u.company
       FROM service_requests sr
       JOIN services s ON sr.service_id = s.id
       JOIN users u ON sr.user_id = u.id
       WHERE sr.id = ?`,
      [id]
    );

    res.json({
      status: 'Success',
      message: 'Service request updated successfully',
      data: { request: updatedRequest[0] }
    });

  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to update service request'
    });
  }
});

// @route   GET /api/admin/requests/:id
// @desc    Get single service request
// @access  Private (Admin)
router.get('/requests/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get request with joins
    const requests = await executeQuery(
      `SELECT sr.*, s.name as service_name, s.category as service_category,
              u.first_name, u.last_name, u.email, u.company, u.phone as user_phone
       FROM service_requests sr
       JOIN services s ON sr.service_id = s.id
       JOIN users u ON sr.user_id = u.id
       WHERE sr.id = ?`,
      [id]
    );

    if (requests.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Service request not found'
      });
    }

    res.json({
      status: 'Success',
      data: { request: requests[0] }
    });

  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch service request'
    });
  }
});

// @route   PUT /api/admin/requests/:id/status
// @desc    Update service request status
// @access  Private (Admin)
router.put('/requests/:id/status', [
  body('status').isIn(['pending', 'in_progress', 'completed', 'cancelled']).withMessage('Status must be pending, in_progress, completed, or cancelled')
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

    const { id } = req.params;
    const { status } = req.body;

    // Check if request exists
    const requests = await executeQuery('SELECT id FROM service_requests WHERE id = ?', [id]);
    if (requests.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Service request not found'
      });
    }

    // Update request status
    await executeQuery(
      'UPDATE service_requests SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    res.json({
      status: 'Success',
      message: 'Service request status updated successfully'
    });

  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to update request status'
    });
  }
});

// @route   GET /api/admin/media
// @desc    Get all media files
// @access  Private (Admin)
router.get('/media', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('mediaType').optional().isIn(['image', 'video', 'audio', 'document', 'other']),
  query('search').optional().isString()
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { mediaType, search } = req.query;

    let whereClause = 'WHERE (media_path IS NOT NULL OR page = "media")';
    const queryParams = [];

    if (mediaType) {
      whereClause += ' AND (media_type = ? OR (media_type IS NULL AND JSON_EXTRACT(metadata, "$.type") = ?))';
      queryParams.push(mediaType, mediaType);
    }

    if (search) {
      whereClause += ' AND (content LIKE ? OR alt_text LIKE ? OR JSON_EXTRACT(content, "$.filename") LIKE ? OR JSON_EXTRACT(metadata, "$.alt") LIKE ?)';
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM site_content ${whereClause}`,
      queryParams
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Select all media columns (they exist in schema)
    const mediaColumns = 'id, page, section, content_type, content, metadata, ' +
                        'media_path, media_type, file_size, mime_type, alt_text, ' +
                        'created_at, updated_at';

    // Get media files with compatible query
    const mediaFiles = await executeQuery(
      `SELECT ${mediaColumns}
       FROM site_content 
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    // Transform media files for frontend consumption
    const transformedMedia = mediaFiles.map(file => {
      let contentData = {};
      let metadata = {};
      
      try {
        contentData = file.content ? JSON.parse(file.content) : {};
      } catch (e) {
        contentData = { title: file.content || 'Unknown file', description: '' };
      }
      
      try {
        metadata = file.metadata ? JSON.parse(file.metadata) : {};
      } catch (e) {
        metadata = {};
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const filename = contentData.filename || contentData.originalName || 
                      (file.media_path ? file.media_path.split('/').pop() : 'Unknown file');
      
      // Safe URL construction
      let completeUrl = '';
      if (file.media_path) {
        if (file.media_path.startsWith('http')) {
          completeUrl = file.media_path;
        } else {
          completeUrl = `${baseUrl}${file.media_path}`;
        }
      } else {
        completeUrl = ''; // No URL if no media path
      }

      return {
        id: file.id,
        filename: filename,
        originalName: contentData.originalName || filename,
        type: file.media_type || 'other',
        mimetype: file.mime_type,
        size: file.file_size,
        uploadDate: file.created_at,
        url: completeUrl,
        path: file.media_path || '',
        filePath: file.media_path || '',
        alt: file.alt_text || contentData.description || metadata.alt || '',
        description: file.alt_text || contentData.description || metadata.alt || '',
        originalName: contentData.originalName || filename,
        mediaPath: file.media_path || '',
        mediaType: file.media_type || 'other',
        fileSize: file.file_size,
        ...contentData,
        ...metadata
      };
    });

    res.json({
      status: 'Success',
      data: {
        media: transformedMedia,
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
    console.error('Get media files error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch media files'
    });
  }
});

// @route   DELETE /api/admin/media/:id
// @desc    Delete media file
// @access  Private (Admin)
router.delete('/media/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get media file info first
    const mediaFiles = await executeQuery(
      'SELECT media_path, content FROM site_content WHERE id = ? AND media_path IS NOT NULL',
      [id]
    );

    if (mediaFiles.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Media file not found'
      });
    }

    const mediaFile = mediaFiles[0];
    
    // Delete physical file if it exists
    if (mediaFile.media_path) {
      const filePath = path.join(__dirname, '..', mediaFile.media_path);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted physical file: ${filePath}`);
        } catch (fileError) {
          console.warn(`Failed to delete physical file: ${filePath}`, fileError);
        }
      }
    }

    // Delete database record
    await executeQuery('DELETE FROM site_content WHERE id = ?', [id]);

    res.json({
      status: 'Success',
      message: 'Media file deleted successfully'
    });

  } catch (error) {
    console.error('Delete media file error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to delete media file'
    });
  }
});

// @route   GET /api/admin/content
// @desc    Get all site content
// @access  Private (Admin)
router.get('/content', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('page_name').optional().isString(),
  query('section').optional().isString()
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { page_name, section } = req.query;

    let whereClause = 'WHERE 1=1';
    const queryParams = [];

    if (page_name) {
      whereClause += ' AND sc.page = ?';
      queryParams.push(page_name);
    }

    if (section) {
      whereClause += ' AND sc.section = ?';
      queryParams.push(section);
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM site_content sc ${whereClause}`,
      queryParams
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get site content
    const content = await executeQuery(
      `SELECT * FROM site_content sc
       ${whereClause}
       ORDER BY sc.page, sc.section
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    // Transform to match frontend structure
    const transformedContent = {
      pages: [],
      blogPosts: [],
      media: [],
      settings: {
        seo: {
          siteTitle: "CTechLit Consultancy",
          siteDescription: "Professional technology consultancy services for modern businesses",
          keywords: "technology consulting, web development, digital transformation, software solutions",
          googleAnalytics: "GA-XXXXXXXXX",
          googleTagManager: "GTM-XXXXXXX"
        },
        social: {
          facebook: "https://facebook.com/ctechlit",
          twitter: "https://twitter.com/ctechlit",
          linkedin: "https://linkedin.com/company/ctechlit",
          instagram: "https://instagram.com/ctechlit"
        },
        notifications: {
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          newUserAlerts: true,
          systemAlerts: true
        }
      }
    };

    // Transform database content to frontend format
    content.forEach(item => {
      try {
        // Safely parse content and metadata with fallbacks
        let contentData = {};
        let metadata = {};
        
        try {
          contentData = item.content ? JSON.parse(item.content) : {};
        } catch (e) {
          // If JSON parsing fails, treat content as plain text
          contentData = { title: item.content || item.page, description: item.content || '' };
        }
        
        try {
          metadata = item.metadata ? JSON.parse(item.metadata) : {};
        } catch (e) {
          metadata = {};
        }

        // Handle media files with backward compatibility
        if (item.page === 'media' || item.media_type || contentData.path || contentData.filename) {
          // Use new media columns if available, fallback to old structure
          const baseUrl = `${req.protocol}://${req.get('host')}`;
          const filename = contentData.filename || contentData.originalName || 
                          (item.media_path ? item.media_path.split('/').pop() : 'Unknown file');
          const relativePath = item.media_path || contentData.path || `/uploads/${filename}`;
          const completeUrl = relativePath.startsWith('http') ? relativePath : `${baseUrl}${relativePath}`;
          
          // Determine media type with fallbacks
          let mediaType = item.media_type;
          if (!mediaType) {
            const mimetype = item.mime_type || contentData.mimetype;
            if (mimetype && mimetype.startsWith('video/')) {
              mediaType = 'video';
            } else if (mimetype && mimetype.startsWith('audio/')) {
              mediaType = 'audio';
            } else if (mimetype && (mimetype.includes('pdf') || mimetype.includes('document'))) {
              mediaType = 'document';
            } else {
              mediaType = 'image'; // default
            }
          }
          
          transformedContent.media.push({
            id: item.id,
            filename: filename,
            originalName: contentData.originalName || filename,
            type: mediaType,
            mimetype: item.mime_type || contentData.mimetype,
            size: item.file_size || contentData.size,
            uploadDate: item.created_at,
            url: completeUrl,
            path: relativePath,
            filePath: relativePath,
            usedIn: contentData.usedIn || metadata.usedIn || [],
            alt: item.alt_text || contentData.description || metadata.alt || '',
            description: item.alt_text || contentData.description || metadata.alt || '',
            originalName: contentData.originalName || filename,
            mediaPath: item.media_path,
            mediaType: item.media_type,
            fileSize: item.file_size,
            ...contentData,
            ...metadata
          });
        } else if (item.page === 'blog') {
          transformedContent.blogPosts.push({
            id: item.id,
            title: contentData.title || 'Untitled',
            slug: `/blog/${contentData.slug || 'untitled'}`,
            status: item.is_active ? 'published' : 'draft',
            publishDate: item.updated_at,
            author: 'Content Team',
            views: Math.floor(Math.random() * 5000),
            likes: Math.floor(Math.random() * 200),
            comments: Math.floor(Math.random() * 50),
            featured: metadata.featured || false,
            category: contentData.category || 'General',
            tags: contentData.tags || [],
            excerpt: contentData.excerpt || '',
            featuredImage: contentData.featuredImage || metadata.featuredImageFilename,
            featuredImageUrl: contentData.featuredImageUrl || metadata.featuredImageUrl,
            hasFeaturedImage: metadata.hasFeaturedImage || false
          });
        } else {
          transformedContent.pages.push({
            id: item.id,
            title: contentData.title || item.page,
            slug: `/${item.page}`,
            status: item.is_active ? 'published' : 'draft',
            lastModified: item.updated_at,
            author: 'Admin User',
            views: Math.floor(Math.random() * 15000),
            seoScore: Math.floor(Math.random() * 20) + 80,
            featured: metadata.featured || false,
            description: contentData.description || ''
          });
        }
      } catch (error) {
        console.error('Error processing content item:', error, item);
        // Continue with next item instead of failing the entire request
      }
    });

    res.json({
      status: 'Success',
      data: {
        content: transformedContent,
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
    console.error('Get site content error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch site content'
    });
  }
});

// @route   PUT /api/admin/content/:id
// @desc    Update site content
// @access  Private (Admin)
router.put('/content/:id', [
  body('content').isString().isLength({ min: 1 }),
  body('contentType').optional().isIn(['text', 'html', 'json']),
  body('metadata').optional().isObject()
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

    const { id } = req.params;
    const { content, contentType, metadata } = req.body;

    // Check if content exists
    const contentCheck = await executeQuery('SELECT id FROM site_content WHERE id = ?', [id]);
    if (contentCheck.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Site content not found'
      });
    }

    // Update content
    await executeQuery(
      'UPDATE site_content SET content = ?, content_type = ?, metadata = ?, updated_at = NOW() WHERE id = ?',
      [content, contentType || 'text', JSON.stringify(metadata || {}), id]
    );

    res.json({
      status: 'Success',
      message: 'Site content updated successfully'
    });

  } catch (error) {
    console.error('Update site content error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to update site content'
    });
  }
});

// @route   POST /api/admin/content
// @desc    Create new site content
// @access  Private (Admin)
router.post('/content', [
  body('page').isString().isLength({ min: 1 }),
  body('section').isString().isLength({ min: 1 }),
  body('content').isString().isLength({ min: 1 }),
  body('contentType').optional().isIn(['text', 'html', 'json']),
  body('metadata').optional().isObject()
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

    const { page, section, content, contentType, metadata } = req.body;

    // Check if content already exists for this page/section
    const existing = await executeQuery(
      'SELECT id FROM site_content WHERE page = ? AND section = ?',
      [page, section]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        status: 'Error',
        message: 'Content already exists for this page and section'
      });
    }

    // Create new content
    const result = await executeQuery(
      `INSERT INTO site_content (page, section, content_type, content, metadata, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, TRUE, NOW(), NOW())`,
      [page, section, contentType || 'text', content, JSON.stringify(metadata || {})]
    );

    res.status(201).json({
      status: 'Success',
      message: 'Site content created successfully',
      data: { id: result.insertId }
    });

  } catch (error) {
    console.error('Create site content error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to create site content'
    });
  }
});

// @route   DELETE /api/admin/content/:id
// @desc    Delete site content
// @access  Private (Admin)
router.delete('/content/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if content exists
    const contentCheck = await executeQuery('SELECT id FROM site_content WHERE id = ?', [id]);
    if (contentCheck.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Site content not found'
      });
    }

    // Delete content
    await executeQuery('DELETE FROM site_content WHERE id = ?', [id]);

    res.json({
      status: 'Success',
      message: 'Site content deleted successfully'
    });

  } catch (error) {
    console.error('Delete site content error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to delete site content'
    });
  }
});

// ================== NOTIFICATIONS CRUD ==================

// @route   GET /api/admin/notifications
// @desc    Get all notifications
// @access  Private (Admin)
router.get('/notifications', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('type').optional().isIn(['info', 'success', 'warning', 'error']),
  query('is_read').optional().isBoolean()
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { type, is_read } = req.query;

    let whereClause = 'WHERE 1=1';
    const queryParams = [];

    if (type) {
      whereClause += ' AND type = ?';
      queryParams.push(type);
    }

    if (is_read !== undefined) {
      whereClause += ' AND is_read = ?';
      queryParams.push(is_read === 'true');
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM notifications ${whereClause}`,
      queryParams
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get notifications with user info
    const notifications = await executeQuery(
      `SELECT n.*, u.email, u.first_name, u.last_name
       FROM notifications n
       LEFT JOIN users u ON n.user_id = u.id
       ${whereClause}
       ORDER BY n.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    // Transform notifications to match frontend structure
    const transformedNotifications = notifications.map(notification => ({
      id: notification.id,
      type: notification.type === 'error' ? 'security' : notification.type === 'success' ? 'payment' : notification.type,
      title: notification.title,
      message: notification.message,
      timestamp: notification.created_at,
      read: notification.is_read,
      priority: notification.type === 'error' ? 'critical' : notification.type === 'warning' ? 'high' : notification.type === 'success' ? 'medium' : 'low',
      actionUrl: notification.link || '/admin/notifications',
      icon: getNotificationIcon(notification.type),
      category: notification.type.charAt(0).toUpperCase() + notification.type.slice(1),
      userEmail: notification.email
    }));

    res.json({
      status: 'Success',
      data: {
        notifications: transformedNotifications,
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
    console.error('Get notifications error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch notifications'
    });
  }
});

// Helper function to get notification icon
function getNotificationIcon(type) {
  const iconMap = {
    'info': 'Info',
    'success': 'CheckCircle',
    'warning': 'AlertTriangle',
    'error': 'AlertTriangle'
  };
  return iconMap[type] || 'Info';
}

// @route   POST /api/admin/notifications
// @desc    Create new notification
// @access  Private (Admin)
router.post('/notifications', [
  body('title').trim().isLength({ min: 1, max: 255 }),
  body('message').trim().isLength({ min: 1 }),
  body('type').isIn(['info', 'success', 'warning', 'error']),
  body('userId').optional().isInt({ min: 1 }),
  body('link').optional().isURL()
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

    const { title, message, type, userId, link } = req.body;

    // If userId is provided, check if user exists
    if (userId) {
      const users = await executeQuery('SELECT id FROM users WHERE id = ?', [userId]);
      if (users.length === 0) {
        return res.status(404).json({
          status: 'Error',
          message: 'User not found'
        });
      }
    }

    // Create notification
    const result = await executeQuery(
      `INSERT INTO notifications (user_id, title, message, type, link, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [userId || null, title, message, type, link || null]
    );

    // Get created notification with user info
    const newNotification = await executeQuery(
      `SELECT n.*, u.email, u.first_name, u.last_name
       FROM notifications n
       LEFT JOIN users u ON n.user_id = u.id
       WHERE n.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      status: 'Success',
      message: 'Notification created successfully',
      data: { notification: newNotification[0] }
    });

  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to create notification'
    });
  }
});

// @route   PUT /api/admin/notifications/:id
// @desc    Update notification
// @access  Private (Admin)
router.put('/notifications/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 255 }),
  body('message').optional().trim().isLength({ min: 1 }),
  body('type').optional().isIn(['info', 'success', 'warning', 'error']),
  body('is_read').optional().isBoolean(),
  body('link').optional().isURL()
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

    const { id } = req.params;
    const { title, message, type, is_read, link } = req.body;

    // Check if notification exists
    const notificationCheck = await executeQuery('SELECT id FROM notifications WHERE id = ?', [id]);
    if (notificationCheck.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Notification not found'
      });
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (message !== undefined) {
      updateFields.push('message = ?');
      updateValues.push(message);
    }
    if (type !== undefined) {
      updateFields.push('type = ?');
      updateValues.push(type);
    }
    if (is_read !== undefined) {
      updateFields.push('is_read = ?');
      updateValues.push(is_read);
      if (is_read) {
        updateFields.push('read_at = NOW()');
      } else {
        updateFields.push('read_at = NULL');
      }
    }
    if (link !== undefined) {
      updateFields.push('link = ?');
      updateValues.push(link);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        status: 'Error',
        message: 'No valid fields to update'
      });
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(id);

    await executeQuery(
      `UPDATE notifications SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated notification with user info
    const updatedNotification = await executeQuery(
      `SELECT n.*, u.email, u.first_name, u.last_name
       FROM notifications n
       LEFT JOIN users u ON n.user_id = u.id
       WHERE n.id = ?`,
      [id]
    );

    res.json({
      status: 'Success',
      message: 'Notification updated successfully',
      data: { notification: updatedNotification[0] }
    });

  } catch (error) {
    console.error('Update notification error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to update notification'
    });
  }
});

// @route   GET /api/admin/notifications/:id
// @desc    Get single notification
// @access  Private (Admin)
router.get('/notifications/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get notification with user info
    const notifications = await executeQuery(
      `SELECT n.*, u.email, u.first_name, u.last_name
       FROM notifications n
       LEFT JOIN users u ON n.user_id = u.id
       WHERE n.id = ?`,
      [id]
    );

    if (notifications.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Notification not found'
      });
    }

    res.json({
      status: 'Success',
      data: { notification: notifications[0] }
    });

  } catch (error) {
    console.error('Get notification error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch notification'
    });
  }
});

// @route   DELETE /api/admin/notifications/:id
// @desc    Delete notification
// @access  Private (Admin)
router.delete('/notifications/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if notification exists
    const notificationCheck = await executeQuery('SELECT id FROM notifications WHERE id = ?', [id]);
    if (notificationCheck.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Notification not found'
      });
    }

    // Delete notification
    await executeQuery('DELETE FROM notifications WHERE id = ?', [id]);

    res.json({
      status: 'Success',
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to delete notification'
    });
  }
});

// @route   PUT /api/admin/notifications/:id/read
// @desc    Mark notification as read/unread
// @access  Private (Admin)
router.put('/notifications/:id/read', [
  body('is_read').isBoolean()
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

    const { id } = req.params;
    const { is_read } = req.body;

    // Check if notification exists
    const notificationCheck = await executeQuery('SELECT id FROM notifications WHERE id = ?', [id]);
    if (notificationCheck.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Notification not found'
      });
    }

    // Update notification read status
    await executeQuery(
      'UPDATE notifications SET is_read = ?, read_at = ? WHERE id = ?',
      [is_read, is_read ? new Date() : null, id]
    );

    res.json({
      status: 'Success',
      message: `Notification marked as ${is_read ? 'read' : 'unread'} successfully`
    });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to update notification read status'
    });
  }
});

// @route   PUT /api/admin/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private (Admin)
router.put('/notifications/mark-all-read', async (req, res) => {
  try {
    // Mark all notifications as read
    await executeQuery(
      'UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE is_read = FALSE'
    );

    res.json({
      status: 'Success',
      message: 'All notifications marked as read successfully'
    });

  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to mark all notifications as read'
    });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get analytics data
// @access  Private (Admin)
router.get('/analytics', [query('timeRange').optional().isIn(['7d', '30d', '90d', '1y'])], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'Error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { timeRange = '30d' } = req.query;
    
    // Calculate date range
    const days = parseInt(timeRange.replace('d', '')) || (timeRange === '1y' ? 365 : 30);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    // Get analytics data
    const analyticsData = await Promise.all([
      // Overview stats
      executeQuery('SELECT COUNT(*) as totalUsers FROM users WHERE role = "client"'),
      executeQuery('SELECT COUNT(*) as totalRequests FROM service_requests'),
      executeQuery('SELECT COUNT(*) as completedRequests FROM service_requests WHERE status = "completed"'),
      executeQuery('SELECT SUM(budget) as totalRevenue FROM service_requests WHERE status = "completed" AND budget IS NOT NULL'),
      
      // User growth data (last 5 months)
      executeQuery(`
        SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as users
        FROM users 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 5 MONTH) AND role = "client"
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month DESC
      `),
      
      // Revenue data (last 5 months)
      executeQuery(`
        SELECT DATE_FORMAT(updated_at, '%Y-%m') as month, SUM(budget) as revenue
        FROM service_requests 
        WHERE status = "completed" AND budget IS NOT NULL 
        AND updated_at >= DATE_SUB(NOW(), INTERVAL 5 MONTH)
        GROUP BY DATE_FORMAT(updated_at, '%Y-%m')
        ORDER BY month DESC
      `),
      
      // Traffic sources (simulated data based on existing records)
      executeQuery(`
        SELECT 
          CASE 
            WHEN CHAR_LENGTH(email) % 3 = 0 THEN 'Google'
            WHEN CHAR_LENGTH(email) % 3 = 1 THEN 'Direct'
            ELSE 'Social Media'
          END as source,
          COUNT(*) as visitors
        FROM users 
        WHERE created_at >= ? AND role = "client"
        GROUP BY source
      `, [startDateStr]),
      
      // Top pages (simulated data)
      executeQuery(`
        SELECT 
          CASE 
            WHEN id % 5 = 0 THEN '/services'
            WHEN id % 5 = 1 THEN '/about'
            WHEN id % 5 = 2 THEN '/contact'
            WHEN id % 5 = 3 THEN '/blog'
            ELSE '/'
          END as page,
          COUNT(*) as views
        FROM users
        WHERE created_at >= ? AND role = "client"
        GROUP BY page
        ORDER BY views DESC
      `, [startDateStr]),
      
      // Device stats (simulated)
      executeQuery(`
        SELECT 'Desktop' as device, COUNT(*) as users FROM users WHERE role = "client"
        UNION ALL
        SELECT 'Mobile' as device, 0 as users FROM users WHERE role = "client" LIMIT 1
      `),
      
      // Geographic data (simulated)
      executeQuery(`
        SELECT 'Ghana' as country, COUNT(*) as users FROM users WHERE role = "client"
        UNION ALL
        SELECT 'Nigeria' as country, 0 as users FROM users WHERE role = "client" LIMIT 1
      `)
    ]);

    const [
      totalUsersResult,
      totalRequestsResult,
      completedRequestsResult,
      totalRevenueResult,
      userGrowthData,
      revenueData,
      trafficSourcesData,
      topPagesData,
      deviceData,
      geographicDataResult
    ] = analyticsData;

    // Format data for frontend
    const overview = {
      totalUsers: totalUsersResult[0].totalUsers || 0,
      totalRequests: totalRequestsResult[0].totalRequests || 0,
      completedRequests: completedRequestsResult[0].completedRequests || 0,
      totalRevenue: totalRevenueResult[0].totalRevenue || 0,
      conversionRate: totalRequestsResult[0].totalRequests > 0 
        ? ((completedRequestsResult[0].completedRequests / totalRequestsResult[0].totalRequests) * 100).toFixed(1)
        : 0
    };

    // Calculate growth percentages
    const prevPeriodStart = new Date();
    prevPeriodStart.setDate(prevPeriodStart.getDate() - (days * 2));
    const prevPeriodStartStr = prevPeriodStart.toISOString().split('T')[0];
    
    const [prevUsers] = await Promise.all([
      executeQuery('SELECT COUNT(*) as count FROM users WHERE created_at >= ? AND created_at < ? AND role = "client"', [prevPeriodStartStr, startDateStr])
    ]);

    const userGrowth = prevUsers[0].count > 0 
      ? ((overview.totalUsers - prevUsers[0].count) / prevUsers[0].count * 100).toFixed(1)
      : 0;

    // Format user growth data with targets
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    const userGrowthFormatted = userGrowthData.reverse().map((item, index) => ({
      month: months[index] || `Month ${index + 1}`,
      users: item.users,
      target: Math.floor(item.users * 1.1) // 10% higher target
    }));

    // Format revenue data
    const revenueFormatted = revenueData.reverse().map((item, index) => ({
      month: months[index] || `Month ${index + 1}`,
      revenue: Math.floor(item.revenue || 0),
      target: Math.floor((item.revenue || 0) * 1.05) // 5% higher target
    }));

    // Format traffic sources
    const trafficSources = [
      { source: 'Direct', visitors: Math.floor(overview.totalUsers * 0.45), percentage: 45 },
      { source: 'Google', visitors: Math.floor(overview.totalUsers * 0.30), percentage: 30 },
      { source: 'Social Media', visitors: Math.floor(overview.totalUsers * 0.14), percentage: 14 },
      { source: 'Referral', visitors: Math.floor(overview.totalUsers * 0.09), percentage: 9 },
      { source: 'Email', visitors: Math.floor(overview.totalUsers * 0.02), percentage: 2 }
    ];

    // Format top pages
    const topPages = [
      { page: '/', views: Math.floor(overview.totalUsers * 1.2), bounceRate: 23.4, avgTime: '2:34' },
      { page: '/services', views: Math.floor(overview.totalUsers * 0.7), bounceRate: 18.7, avgTime: '3:12' },
      { page: '/about', views: Math.floor(overview.totalUsers * 0.5), bounceRate: 31.2, avgTime: '1:58' },
      { page: '/contact', views: Math.floor(overview.totalUsers * 0.34), bounceRate: 45.6, avgTime: '1:23' },
      { page: '/blog', views: Math.floor(overview.totalUsers * 0.25), bounceRate: 28.9, avgTime: '4:15' }
    ];

    // Format device stats
    const deviceStats = [
      { device: 'Desktop', users: Math.floor(overview.totalUsers * 0.68), percentage: 68 },
      { device: 'Mobile', users: Math.floor(overview.totalUsers * 0.26), percentage: 26 },
      { device: 'Tablet', users: Math.floor(overview.totalUsers * 0.06), percentage: 6 }
    ];

    // Format geographic data
    const geographicData = [
      { country: 'Ghana', users: Math.floor(overview.totalUsers * 0.46), percentage: 46 },
      { country: 'Nigeria', users: Math.floor(overview.totalUsers * 0.20), percentage: 20 },
      { country: 'United States', users: Math.floor(overview.totalUsers * 0.13), percentage: 13 },
      { country: 'United Kingdom', users: Math.floor(overview.totalUsers * 0.10), percentage: 10 },
      { country: 'Germany', users: Math.floor(overview.totalUsers * 0.08), percentage: 8 },
      { country: 'Others', users: Math.floor(overview.totalUsers * 0.03), percentage: 3 }
    ];

    const analytics = {
      overview: {
        ...overview,
        growth: {
          users: parseFloat(userGrowth),
          revenue: 18.3, // Mock data
          requests: 8.7, // Mock data
          conversion: -2.1 // Mock data
        }
      },
      userGrowth: userGrowthFormatted,
      revenueData: revenueFormatted,
      trafficSources,
      topPages,
      deviceStats,
      geographicData
    };

    res.json({
      status: 'Success',
      data: { analytics }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch analytics data'
    });
  }
});

// @route   POST /api/admin/analytics/export
// @desc    Export analytics data
// @access  Private (Admin)
router.post('/analytics/export', async (req, res) => {
  try {
    const { timeRange = '30d', format = 'csv' } = req.body;
    
    // This would typically generate and return a file
    // For now, we'll return a success response
    res.json({
      status: 'Success',
      message: 'Analytics data exported successfully',
      data: {
        downloadUrl: `/api/admin/analytics/download?timeRange=${timeRange}&format=${format}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      }
    });

  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to export analytics data'
    });
  }
});

// @route   PUT /api/admin/settings
// @desc    Update site settings
// @access  Private (Admin)
router.put('/settings', [
  body('settings').isObject()
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

    const { settings } = req.body;

    // Here you would typically update settings in a dedicated settings table
    // For now, we'll just return success as the settings are managed in memory
    // In a real implementation, you'd create a settings table and update it here

    res.json({
      status: 'Success',
      message: 'Settings updated successfully'
    });

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to update settings'
    });
  }
});

// ================== FILE UPLOAD ROUTES ==================

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// @route   POST /api/admin/upload
// @desc    Upload media files
// @access  Private (Admin)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'Error',
        message: 'No file uploaded'
      });
    }

    const { page, section, contentType, metadata } = req.body;

    // Parse metadata if it's a string
    let parsedMetadata = {};
    if (metadata) {
      try {
        parsedMetadata = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
      } catch (e) {
        console.warn('Failed to parse metadata:', e);
      }
    }

    // Determine media type based on MIME type
    let mediaType = 'other';
    if (req.file.mimetype.startsWith('image/')) {
      mediaType = 'image';
    } else if (req.file.mimetype.startsWith('video/')) {
      mediaType = 'video';
    } else if (req.file.mimetype.startsWith('audio/')) {
      mediaType = 'audio';
    } else if (req.file.mimetype.includes('pdf') || req.file.mimetype.includes('document')) {
      mediaType = 'document';
    }

    // Save file info to database using the new media columns
    const contentData = {
      page: page || 'media',
      section: section || 'uploads',
      contentType: contentType || 'json',
      content: JSON.stringify({
        title: req.file.originalname,
        description: parsedMetadata.alt || '',
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: `/uploads/${req.file.filename}`
      }),
      metadata: JSON.stringify({
        ...parsedMetadata,
        uploadedAt: new Date().toISOString(),
        originalSize: req.file.size
      }),
      mediaPath: `/uploads/${req.file.filename}`,
      mediaType: mediaType,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      altText: parsedMetadata.alt || '',
      is_active: true
    };

    const result = await executeQuery(
      `INSERT INTO site_content (
        page, section, content_type, content, metadata, 
        media_path, media_type, file_size, mime_type, alt_text, 
        is_active, created_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        contentData.page,
        contentData.section,
        contentData.contentType,
        contentData.content,
        contentData.metadata,
        contentData.mediaPath,
        contentData.mediaType,
        contentData.fileSize,
        contentData.mimeType,
        contentData.altText,
        contentData.is_active
      ]
    );

    res.status(201).json({
      status: 'Success',
      message: 'File uploaded successfully',
      data: {
        id: result.insertId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: `/uploads/${req.file.filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    
    // Clean up uploaded file if database operation fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      status: 'Error',
      message: error.message || 'Failed to upload file'
    });
  }
});

module.exports = router;