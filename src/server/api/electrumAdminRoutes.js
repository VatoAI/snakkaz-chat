/**
 * Electrum Admin API Routes
 * 
 * Routes for administrative functions related to Electrum wallet integration
 * These endpoints should only be accessible to admins
 */

const express = require('express');
const router = express.Router();
const { checkAuth, checkAdmin } = require('../../middleware/authMiddleware');
const { electrumConnector } = require('../payments/electrumConnector');
const { bitcoinElectrumAdapter } = require('../payments/bitcoinElectrumAdapter');
const { logApiOperation } = require('../../middleware/apiSecurityMiddleware');

// Applied to all routes
router.use(logApiOperation);
router.use(checkAuth);
router.use(checkAdmin);

/**
 * @route   GET /api/admin/electrum/status
 * @desc    Check connection status
 * @access  Admin
 */
router.get('/status', async (req, res) => {
  try {
    const status = {
      isConnected: electrumConnector.isConnected,
      serverInfo: {
        host: electrumConnector.config.host,
        port: electrumConnector.config.port,
        protocol: electrumConnector.config.protocol
      }
    };
    
    return res.status(200).json({
      success: true,
      status
    });
  } catch (error) {
    console.error('Error checking Electrum status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error when checking Electrum status'
    });
  }
});

/**
 * @route   GET /api/admin/electrum/balance
 * @desc    Get wallet balance
 * @access  Admin
 */
router.get('/balance', async (req, res) => {
  try {
    const balance = await bitcoinElectrumAdapter.getWalletBalance();
    
    return res.status(200).json({
      success: true,
      balance
    });
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error when getting wallet balance'
    });
  }
});

/**
 * @route   GET /api/admin/electrum/transactions
 * @desc    List recent transactions
 * @access  Admin
 */
router.get('/transactions', async (req, res) => {
  try {
    const history = await electrumConnector.sendRequest('history', []);
    
    return res.status(200).json({
      success: true,
      transactions: history
    });
  } catch (error) {
    console.error('Error getting transaction history:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error when getting transaction history'
    });
  }
});

/**
 * @route   GET /api/admin/electrum/transaction/:txid
 * @desc    Get transaction details
 * @access  Admin
 */
router.get('/transaction/:txid', async (req, res) => {
  try {
    const { txid } = req.params;
    const transaction = await bitcoinElectrumAdapter.getTransactionDetails(txid);
    
    return res.status(200).json({
      success: true,
      transaction
    });
  } catch (error) {
    console.error('Error getting transaction details:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error when getting transaction details'
    });
  }
});

/**
 * @route   POST /api/admin/electrum/reset-connection
 * @desc    Force reconnection to Electrum server
 * @access  Admin
 */
router.post('/reset-connection', async (req, res) => {
  try {
    await electrumConnector.disconnect();
    const connected = await electrumConnector.connect();
    
    if (connected) {
      return res.status(200).json({
        success: true,
        message: 'Electrum connection reset successfully'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to reconnect to Electrum server'
      });
    }
  } catch (error) {
    console.error('Error resetting Electrum connection:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error when resetting connection'
    });
  }
});

module.exports = router;
