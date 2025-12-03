const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');

// JWT authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        status: 'Error',
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database to ensure they still exist
    const user = await executeQuery(
      'SELECT id, email, role, first_name, last_name FROM users WHERE id = ? AND status = "active"',
      [decoded.userId]
    );

    if (user.length === 0) {
      return res.status(401).json({
        status: 'Error',
        message: 'Invalid or expired token'
      });
    }

    req.user = {
      id: user[0].id,
      email: user[0].email,
      role: user[0].role,
      firstName: user[0].first_name,
      lastName: user[0].last_name
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        status: 'Error',
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'Error',
        message: 'Token expired'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Authentication failed'
    });
  }
};

// Role-based authorization middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'Error',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log(`Role check failed: User role '${req.user.role}' not in allowed roles [${roles.join(', ')}]`);
      return res.status(403).json({
        status: 'Error',
        message: `Access denied. Required roles: ${roles.join(', ')}. Your role: ${req.user.role}`
      });
    }

    next();
  };
};

// Admin only middleware
const requireAdmin = authorizeRoles('admin');

// Client or Admin middleware
const requireClientOrAdmin = authorizeRoles('client', 'admin');

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await executeQuery(
        'SELECT id, email, role, first_name, last_name FROM users WHERE id = ? AND status = "active"',
        [decoded.userId]
      );

      if (user.length > 0) {
        req.user = {
          id: user[0].id,
          email: user[0].email,
          role: user[0].role,
          firstName: user[0].first_name,
          lastName: user[0].last_name
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  requireAdmin,
  requireClientOrAdmin,
  optionalAuth,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken
};