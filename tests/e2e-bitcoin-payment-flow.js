#!/usr/bin/env node
// filepath: /workspaces/snakkaz-chat/tests/e2e-bitcoin-payment-flow.js

/**
 * End-to-End Test for Bitcoin Payment Flow
 * 
 * This script tests the complete Bitcoin payment flow using the testnet
 * It requires a local Electrum server running in testnet mode
 */

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { electrumConnector } = require('../src/server/payments/electrumConnector');
const { bitcoinElectrumAdapter } = require('../src/server/payments/bitcoinElectrumAdapter');
const { paymentService } = require('../src/server/paymentService');

// Set environment to testing
process.env.NODE_ENV = 'test';
process.env.ENABLE_ELECTRUM_PAYMENTS = 'true';
process.env.ELECTRUM_TEST_MODE = 'true';
process.env.ELECTRUM_HOST = 'localhost';
process.env.ELECTRUM_PORT = '51001'; // Standard testnet port
process.env.ELECTRUM_PROTOCOL = 'tcp';

// Test configuration
const config = {
  serverUrl: 'http://localhost:8080',
  testUser: {
    id: uuidv4(),
    email: 'test-user@example.com',
  },
  testPayment: {
    amount: 100,
    currency: 'NOK',
    productType: 'subscription',
    productId: 'premium-monthly',
  },
  // Testnet wallet with funds for testing
  testWallet: {
    privateKey: process.env.TEST_WALLET_PRIVATE_KEY,
    address: process.env.TEST_WALLET_ADDRESS,
  }
};

// Helper: Log with timestamp
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Helper: Wait for a specific duration
async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Step 1: Initialize connection to Electrum
async function connectToElectrum() {
  log('Connecting to Electrum testnet server...');
  try {
    await electrumConnector.connect();
    log('✓ Connected to Electrum server');
    
    const balance = await electrumConnector.getWalletBalance();
    log(`✓ Wallet balance: ${balance.confirmed / 100000000} BTC (confirmed), ${balance.unconfirmed / 100000000} BTC (unconfirmed)`);
    
    return true;
  } catch (error) {
    log(`✗ Failed to connect to Electrum: ${error.message}`);
    return false;
  }
}

// Step 2: Create payment request
async function createPaymentRequest() {
  log('Creating payment request...');
  try {
    const paymentData = {
      userId: config.testUser.id,
      amount: config.testPayment.amount,
      currency: config.testPayment.currency,
      productType: config.testPayment.productType,
      productId: config.testPayment.productId,
      method: 'bitcoin'
    };
    
    const payment = await paymentService.createPaymentRequest(paymentData);
    
    log(`✓ Payment request created: ${payment.id}`);
    log(`✓ Bitcoin address: ${payment.bitcoin_address}`);
    log(`✓ Expected amount: ${payment.btc_amount} BTC`);
    
    return payment;
  } catch (error) {
    log(`✗ Failed to create payment request: ${error.message}`);
    return null;
  }
}

// Step 3: Simulate sending Bitcoin
async function sendBitcoin(payment) {
  log(`Simulating Bitcoin transaction to address: ${payment.bitcoin_address}...`);
  
  try {
    // In a real test, we would use a real testnet wallet to send Bitcoin
    // For this simulation, we'll mock the transaction
    const mockTxid = `test_tx_${Date.now().toString(16)}`;
    log(`✓ Transaction sent: ${mockTxid}`);
    
    // In test mode, manually trigger payment detection
    await electrumConnector.paymentAddressCache.set(payment.bitcoin_address, {
      userId: payment.user_id,
      address: payment.bitcoin_address,
      amountSats: payment.btc_amount * 100000000,
      paymentRef: payment.id,
      createdAt: new Date().toISOString(),
      status: 'pending',
      mockTxid: mockTxid
    });
    
    return mockTxid;
  } catch (error) {
    log(`✗ Failed to send Bitcoin: ${error.message}`);
    return null;
  }
}

// Step 4: Check for payment confirmation
async function checkPaymentStatus(paymentId, maxAttempts = 10) {
  log(`Checking payment status for payment ID: ${paymentId}`);
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      log(`Attempt ${attempt}/${maxAttempts}...`);
      
      const response = await axios.get(`${config.serverUrl}/api/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer test_token_${config.testUser.id}`,
        }
      });
      
      const status = response.data.payment.status;
      log(`Payment status: ${status}`);
      
      if (['confirmed', 'completed'].includes(status)) {
        log('✓ Payment confirmed!');
        return response.data.payment;
      } else if (status === 'failed') {
        log('✗ Payment failed');
        return null;
      }
      
      // Wait before next attempt
      await wait(5000); // 5 seconds
    } catch (error) {
      log(`Error checking payment status: ${error.message}`);
    }
  }
  
  log('✗ Maximum attempts reached without confirmation');
  return null;
}

// Step 5: Verify subscription activation
async function verifySubscriptionActivation(userId) {
  log(`Verifying subscription activation for user: ${userId}`);
  
  try {
    const response = await axios.get(`${config.serverUrl}/api/users/${userId}/subscription`, {
      headers: {
        'Authorization': `Bearer test_token_${userId}`,
      }
    });
    
    if (response.data.subscription && response.data.subscription.active) {
      log('✓ Subscription successfully activated');
      return true;
    } else {
      log('✗ Subscription not activated');
      return false;
    }
  } catch (error) {
    log(`Error verifying subscription: ${error.message}`);
    return false;
  }
}

// Run the complete test flow
async function runE2ETest() {
  log('Starting Bitcoin payment E2E test');
  
  // Step 1: Connect to Electrum
  const connected = await connectToElectrum();
  if (!connected) {
    log('Test failed: Could not connect to Electrum');
    return false;
  }
  
  // Step 2: Create payment request
  const payment = await createPaymentRequest();
  if (!payment) {
    log('Test failed: Could not create payment request');
    return false;
  }
  
  // Step 3: Send Bitcoin
  const txid = await sendBitcoin(payment);
  if (!txid) {
    log('Test failed: Could not send Bitcoin');
    return false;
  }
  
  // Step 4: Check for payment confirmation
  const confirmedPayment = await checkPaymentStatus(payment.id);
  if (!confirmedPayment) {
    log('Test failed: Payment was not confirmed');
    return false;
  }
  
  // Step 5: Verify subscription activation
  const subscriptionActive = await verifySubscriptionActivation(config.testUser.id);
  if (!subscriptionActive) {
    log('Test failed: Subscription was not activated');
    return false;
  }
  
  log('✓✓✓ E2E test completed successfully! ✓✓✓');
  return true;
}

// Run the test if this script is executed directly
if (require.main === module) {
  runE2ETest()
    .then(success => {
      if (success) {
        log('Test finished successfully');
        process.exit(0);
      } else {
        log('Test finished with failures');
        process.exit(1);
      }
    })
    .catch(error => {
      log(`Unhandled error: ${error.message}`);
      process.exit(1);
    });
} else {
  module.exports = { runE2ETest };
}
