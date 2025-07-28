/**
 * Electrum Initializer
 * 
 * This module initializes the Electrum payment processing system
 * and should be imported in the application entry point.
 */

const { electrumPaymentProcessor } = require('./jobs/electrumPaymentProcessor');

function initializeElectrum() {
  console.log('Initializing Electrum payment system...');
  
  // Check if Electrum is enabled
  const enabled = process.env.ENABLE_ELECTRUM_PAYMENTS === 'true';
  
  if (!enabled) {
    console.log('Electrum payments are disabled by configuration');
    return;
  }
  
  // Start the payment processor
  try {
    electrumPaymentProcessor.start();
    console.log('Electrum payment system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Electrum payment system:', error);
  }
}

// Handle graceful shutdown
function shutdownElectrum() {
  console.log('Shutting down Electrum payment system...');
  electrumPaymentProcessor.stop();
}

module.exports = { 
  initializeElectrum,
  shutdownElectrum
};
