// paymentRoutes.js
// API endpoints for Bitcoin payments

const express = require('express');
const router = express.Router();
const { checkAuth, checkAdmin } = require('../../middleware/authMiddleware');
const { paymentService } = require('../paymentService');
const { logApiOperation } = require('../../middleware/apiSecurityMiddleware');

// Applied to all routes
router.use(logApiOperation);

/**
 * @route   POST /api/payments
 * @desc    Create a new payment request
 * @access  Private
 */
router.post('/', checkAuth, async (req, res) => {
  const { amount, currency = 'NOK', productType, productId } = req.body;
  const userId = req.user.id;

  if (!amount || amount <= 0 || !productId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Amount and productId are required' 
    });
  }

  try {
    const paymentRequest = await paymentService.createPaymentRequest({
      userId,
      amount: parseFloat(amount),
      currency,
      productType: productType || 'subscription',
      productId,
      method: 'bitcoin'
    });
    
    return res.status(201).json({
      success: true,
      payment: paymentRequest
    });
  } catch (error) {
    console.error('Error creating payment request:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error when creating payment request'
    });
  }
});

/**
 * @route   GET /api/payments/:id
 * @desc    Get payment status
 * @access  Private
 */
router.get('/:id', checkAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const payment = await paymentService.getPayment(id, userId);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error when fetching payment'
    });
  }
});

/**
 * @route   GET /api/payments/user
 * @desc    Get all payments for a user
 * @access  Private
 */
router.get('/user/history', checkAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const payments = await paymentService.getUserPayments(userId);
    return res.status(200).json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Error fetching user payments:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error when fetching user payments'
    });
  }
});

/**
 * @route   POST /api/payments/webhook
 * @desc    Webhook for payment processor callbacks
 * @access  Public (secured by secret)
 */
router.post('/webhook', async (req, res) => {
  const { signature } = req.headers;
  
  if (!paymentService.verifyWebhookSignature(signature, req.body)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid signature'
    });
  }
  
  try {
    await paymentService.handleWebhook(req.body);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error processing webhook'
    });
  }
});

// ADMIN ROUTES

/**
 * @route   GET /api/payments/admin/all
 * @desc    Get all payments (admin)
 * @access  Admin
 */
router.get('/admin/all', checkAuth, checkAdmin, async (req, res) => {
  const { status, limit = 50, offset = 0 } = req.query;
  
  try {
    const payments = await paymentService.getAllPayments({
      status,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    return res.status(200).json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Error fetching all payments:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error when fetching payments'
    });
  }
});

/**
 * @route   PATCH /api/payments/admin/:id
 * @desc    Update payment status manually (admin)
 * @access  Admin
 */
router.patch('/admin/:id', checkAuth, checkAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const adminId = req.user.id;
  
  if (!['pending', 'confirmed', 'completed', 'failed', 'refunded'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status value'
    });
  }
  
  try {
    const payment = await paymentService.updatePaymentStatus(id, status, { adminId, notes });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error when updating payment'
    });
  }
});

module.exports = router;
