// emailRoutes.js
// API endpoints for premium email accounts

const express = require('express');
const router = express.Router();
const { 
  createPremiumEmail, 
  deletePremiumEmail, 
  changeEmailPassword, 
  getUserEmails,
  adminEmailFunctions
} = require('../emailService');
const { checkAuth, checkPremium, checkAdmin } = require('../../middleware/authMiddleware');
const { logApiOperation, restrictApiOperations } = require('../../middleware/apiSecurityMiddleware');

// Applied to all routes
router.use(logApiOperation);

/**
 * @route   POST /api/emails
 * @desc    Create a new email account for a premium user
 * @access  Private (Premium users only)
 */
router.post('/', checkAuth, checkPremium, async (req, res) => {
  const { username, password, quota = 250 } = req.body;
  const userId = req.user.id;
  const isAdmin = req.isAdmin || false;

  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username and password are required' 
    });
  }

  // Validate username (no spaces, special chars limited to .-_)
  if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    return res.status(400).json({
      success: false,
      message: 'Username can only contain letters, numbers, dots, hyphens, and underscores'
    });
  }

  // Validate password strength
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long'
    });
  }

  try {
    const result = await createPremiumEmail(username, password, quota, userId, isAdmin);
    
    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error creating email account:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error when creating email account'
    });
  }
});

/**
 * @route   DELETE /api/emails/:username
 * @desc    Delete an email account
 * @access  Private
 */
router.delete('/:username', checkAuth, checkPremium, async (req, res) => {
  const { username } = req.params;
  const userId = req.user.id;
  const isAdmin = req.isAdmin || false;

  try {
    const result = await deletePremiumEmail(username, userId, isAdmin);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error deleting email account:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error when deleting email account'
    });
  }
});

/**
 * @route   PATCH /api/emails/:username/password
 * @desc    Change email account password
 * @access  Private
 */
router.patch('/:username/password', checkAuth, checkPremium, async (req, res) => {
  const { username } = req.params;
  const { password } = req.body;
  const userId = req.user.id;
  const isAdmin = req.isAdmin || false;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'New password is required'
    });
  }

  // Validate password strength
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long'
    });
  }

  try {
    const result = await changeEmailPassword(username, password, userId, isAdmin);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error changing email password:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error when changing email password'
    });
  }
});

/**
 * @route   GET /api/emails
 * @desc    Get all email accounts for a user
 * @access  Private
 */
router.get('/', checkAuth, checkPremium, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await getUserEmails(userId);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error fetching user emails:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error when fetching email accounts'
    });
  }
});

// ========== ADMIN ONLY ROUTES ==========

/**
 * @route   GET /api/emails/admin/all
 * @desc    List all email accounts on the domain
 * @access  Admin only
 */
router.get('/admin/all', checkAuth, checkAdmin, async (req, res) => {
  try {
    const result = await adminEmailFunctions.listAllEmails();
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error fetching all emails:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error when fetching all email accounts'
    });
  }
});

/**
 * @route   DELETE /api/emails/admin/:username/force
 * @desc    Force delete an email account (admin only)
 * @access  Admin only
 */
router.delete('/admin/:username/force', checkAuth, checkAdmin, async (req, res) => {
  const { username } = req.params;

  try {
    const result = await adminEmailFunctions.forceDeleteEmail(username);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error force deleting email account:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error when force deleting email account'
    });
  }
});

/**
 * @route   POST /api/emails/admin/raw
 * @desc    Execute raw cPanel API operations (admin only, restricted)
 * @access  Admin only
 */
router.post('/admin/raw', checkAuth, checkAdmin, restrictApiOperations, async (req, res) => {
  const { operation, params } = req.body;

  try {
    const { secureCpanelApiCall } = require('../emailService');
    const result = await secureCpanelApiCall(operation, params, true);
    
    return res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Error executing raw API operation:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error when executing API operation'
    });
  }
});

module.exports = router;
