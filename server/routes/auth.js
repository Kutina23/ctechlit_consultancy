const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { executeQuery, startTransaction, commitTransaction, rollbackTransaction } = require('../config/database');
const { generateToken, generateRefreshToken, verifyRefreshToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
  body('phone').optional().trim(),
  body('company').optional().trim()
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

    const { email, password, firstName, lastName, phone, company } = req.body;

    // Check if user already exists
    const existingUser = await executeQuery(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        status: 'Error',
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Start transaction
    const connection = await startTransaction();

    try {
      // Create user
      const result = await executeQuery(
        `INSERT INTO users (email, password, first_name, last_name, phone, company, role, status, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, 'client', 'active', NOW(), NOW())`,
        [email, hashedPassword, firstName, lastName, phone || null, company || null]
      );

      // Generate tokens
      const userId = result.insertId;
      const token = generateToken(userId, 'client');
      const refreshToken = generateRefreshToken(userId);

      await commitTransaction(connection);

      // Get created user (without password)
      const user = await executeQuery(
        'SELECT id, email, first_name, last_name, phone, company, role, status, created_at FROM users WHERE id = ?',
        [userId]
      );

      res.status(201).json({
        status: 'Success',
        message: 'User registered successfully',
        data: {
          user: user[0],
          token,
          refreshToken
        }
      });

    } catch (error) {
      await rollbackTransaction(connection);
      throw error;
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Registration failed'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
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

    const { email, password } = req.body;

    // Get user from database
    const users = await executeQuery(
      'SELECT id, email, password, first_name, last_name, role, status, failed_login_attempts, last_login_attempt FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        status: 'Error',
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        status: 'Error',
        message: 'Account is not active'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Update failed login attempts
      await executeQuery(
        'UPDATE users SET failed_login_attempts = failed_login_attempts + 1, last_login_attempt = NOW() WHERE id = ?',
        [user.id]
      );

      return res.status(401).json({
        status: 'Error',
        message: 'Invalid credentials'
      });
    }

    // Reset failed login attempts on successful login
    await executeQuery(
      'UPDATE users SET failed_login_attempts = 0, last_login_attempt = NOW(), last_login = NOW() WHERE id = ?',
      [user.id]
    );

    // Generate tokens
    const token = generateToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Remove password from response
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      status: user.status
    };

    res.json({
      status: 'Success',
      message: 'Login successful',
      data: {
        user: userResponse,
        token,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Login failed'
    });
  }
});

// @route   GET /api/auth/verify
// @desc    Verify token and get user info
// @access  Private
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const user = await executeQuery(
      'SELECT id, email, first_name, last_name, phone, company, role, status, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (user.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found'
      });
    }

    // Transform user object to have camelCase field names for consistency
    const userResponse = {
      id: user[0].id,
      email: user[0].email,
      firstName: user[0].first_name,
      lastName: user[0].last_name,
      phone: user[0].phone,
      company: user[0].company,
      role: user[0].role,
      status: user[0].status,
      createdAt: user[0].created_at
    };

    res.json({
      status: 'Success',
      data: {
        user: userResponse
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Token verification failed'
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        status: 'Error',
        message: 'Refresh token required'
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    
    const user = await executeQuery(
      'SELECT id, email, role, status FROM users WHERE id = ? AND status = "active"',
      [decoded.userId]
    );

    if (user.length === 0) {
      return res.status(401).json({
        status: 'Error',
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const newToken = generateToken(user[0].id, user[0].role);
    const newRefreshToken = generateRefreshToken(user[0].id);

    res.json({
      status: 'Success',
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      status: 'Error',
      message: 'Invalid refresh token'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a production app, you might want to blacklist the token
    // For now, we'll just return success (client will remove token from localStorage)
    res.json({
      status: 'Success',
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Logout failed'
    });
  }
});

module.exports = router;