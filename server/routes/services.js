const express = require('express');
const { body, validationResult } = require('express-validator');
const { executeQuery, startTransaction, commitTransaction, rollbackTransaction } = require('../config/database');
const { authenticateToken, requireClientOrAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/services
// @desc    Get all active services
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const services = await executeQuery(
      'SELECT id, name, description, price, duration, category, status FROM services WHERE status = "active" ORDER BY category, name'
    );

    res.json({
      status: 'Success',
      data: { services }
    });

  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch services'
    });
  }
});

// @route   GET /api/services/:id
// @desc    Get service by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const services = await executeQuery(
      'SELECT id, name, description, price, duration, category, status, features, requirements FROM services WHERE id = ? AND status = "active"',
      [id]
    );

    if (services.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Service not found'
      });
    }

    res.json({
      status: 'Success',
      data: { service: services[0] }
    });

  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch service'
    });
  }
});

// @route   POST /api/services/request
// @desc    Submit service request
// @access  Private (Client)
router.post('/request', authenticateToken, requireClientOrAdmin, [
  body('serviceId').isInt({ min: 1 }),
  body('title').trim().isLength({ min: 5, max: 200 }),
  body('description').trim().isLength({ min: 10, max: 2000 }),
  body('budget').optional().isFloat({ min: 0 }),
  body('timeline').optional().isLength({ max: 100 }),
  body('requirements').optional().trim()
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

    const { serviceId, title, description, budget, timeline, requirements } = req.body;

    // Verify service exists and is active
    const services = await executeQuery(
      'SELECT id, name FROM services WHERE id = ? AND status = "active"',
      [serviceId]
    );

    if (services.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Service not found'
      });
    }

    // Start transaction
    const connection = await startTransaction();

    try {
      // Create service request
      const result = await executeQuery(
        `INSERT INTO service_requests 
         (user_id, service_id, title, description, budget, timeline, requirements, status, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
        [req.user.id, serviceId, title, description, budget || null, timeline || null, requirements || null]
      );

      const requestId = result.insertId;

      await commitTransaction(connection);

      // Get created request
      const request = await executeQuery(
        `SELECT sr.*, s.name as service_name 
         FROM service_requests sr 
         JOIN services s ON sr.service_id = s.id 
         WHERE sr.id = ?`,
        [requestId]
      );

      res.status(201).json({
        status: 'Success',
        message: 'Service request submitted successfully',
        data: { request: request[0] }
      });

    } catch (error) {
      await rollbackTransaction(connection);
      throw error;
    }

  } catch (error) {
    console.error('Submit service request error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to submit service request'
    });
  }
});

// @route   GET /api/services/requests
// @desc    Get user's service requests
// @access  Private (Client)
router.get('/requests/my', authenticateToken, requireClientOrAdmin, async (req, res) => {
  try {
    const requests = await executeQuery(
      `SELECT sr.*, s.name as service_name, s.category as service_category
       FROM service_requests sr
       JOIN services s ON sr.service_id = s.id
       WHERE sr.user_id = ?
       ORDER BY sr.created_at DESC`,
      [req.user.id]
    );

    res.json({
      status: 'Success',
      data: { requests }
    });

  } catch (error) {
    console.error('Get user requests error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch service requests'
    });
  }
});

// @route   GET /api/services/requests/:id
// @desc    Get service request by ID
// @access  Private
router.get('/requests/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const requests = await executeQuery(
      `SELECT sr.*, s.name as service_name, u.first_name, u.last_name, u.email
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

    const request = requests[0];

    // Check if user has permission to view this request
    if (req.user.role !== 'admin' && request.user_id !== req.user.id) {
      return res.status(403).json({
        status: 'Error',
        message: 'Access denied'
      });
    }

    res.json({
      status: 'Success',
      data: { request }
    });

  } catch (error) {
    console.error('Get service request error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch service request'
    });
  }
});

module.exports = router;