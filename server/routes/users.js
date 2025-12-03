const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const users = await executeQuery(
      'SELECT id, email, first_name, last_name, phone, company, role, status, created_at, last_login FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'Success',
      data: { user: users[0] }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, [
  body('firstName').optional().trim().isLength({ min: 2 }),
  body('lastName').optional().trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone(),
  body('company').optional().trim().isLength({ max: 100 })
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

    const { firstName, lastName, phone, company } = req.body;
    
    const updateFields = [];
    const updateValues = [];

    if (firstName) {
      updateFields.push('first_name = ?');
      updateValues.push(firstName);
    }
    
    if (lastName) {
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

    if (updateFields.length === 0) {
      return res.status(400).json({
        status: 'Error',
        message: 'No valid fields to update'
      });
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(req.user.id);

    await executeQuery(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated user
    const users = await executeQuery(
      'SELECT id, email, first_name, last_name, phone, company, role, status, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({
      status: 'Success',
      message: 'Profile updated successfully',
      data: { user: users[0] }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to update profile'
    });
  }
});

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', authenticateToken, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
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

    const { currentPassword, newPassword } = req.body;

    // Get current password hash
    const users = await executeQuery(
      'SELECT password FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, users[0].password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        status: 'Error',
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await executeQuery(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    res.json({
      status: 'Success',
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to change password'
    });
  }
});

module.exports = router;