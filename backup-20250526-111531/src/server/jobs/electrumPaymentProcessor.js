/**
 * Electrum Payment Processor
 * 
 * This module schedules regular checks for incoming Bitcoin payments via Electrum
 * and handles payment confirmations
 */

const { electrumConnector } = require('../payments/electrumConnector');
const { paymentService } = require('../paymentService');
const { paymentSubscriptionConnector } = require('../paymentSubscriptionConnector');

class ElectrumPaymentProcessor {
  constructor() {
    this.checkInterval = parseInt(process.env.ELECTRUM_CHECK_INTERVAL || '60000'); // 1 minute default
    this.checkIntervalId = null;
    this.isRunning = false;
  }
  
  /**
   * Start the payment processor
   */
  start() {
    if (this.isRunning) return;
    
    console.log('Starting Electrum payment processor');
    this.isRunning = true;
    
    // Connect to Electrum server
    electrumConnector.connect()
      .then(() => {
        console.log('Connected to Electrum server, setting up auto-reconnect');
        electrumConnector.setupAutoReconnect();
      })
      .catch(err => {
        console.error('Failed to connect to Electrum server:', err);
        // Still set up auto-reconnect to try again
        electrumConnector.setupAutoReconnect();
      });
      
    // Set up regular payment checks
    this.checkIntervalId = setInterval(() => this.processPayments(), this.checkInterval);
    
    // Run immediately on start
    this.processPayments();
  }
  
  /**
   * Stop the payment processor
   */
  stop() {
    if (!this.isRunning) return;
    
    console.log('Stopping Electrum payment processor');
    this.isRunning = false;
    
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
      this.checkIntervalId = null;
    }
    
    // Disconnect from Electrum
    electrumConnector.disconnect();
  }
  
  /**
   * Process payments
   */
  async processPayments() {
    try {
      console.log('Checking for incoming Bitcoin payments via Electrum');
      
      // Check for incoming payments
      const payments = await electrumConnector.checkForIncomingPayments();
      
      // Process each payment
      for (const payment of payments) {
        try {
          console.log(`Processing payment ${payment.paymentId}, status: ${payment.status}`);
          
          // Only process confirmed payments
          if (payment.status === 'confirmed') {
            await paymentService.updatePaymentStatus(payment.paymentId, 'confirmed');
            
            // Complete the payment
            await paymentService.completePayment(payment.paymentId);
            
            // Get the updated payment data
            const updatedPayment = await paymentService.getPayment(payment.paymentId);
            
            // Notify subscription connector
            if (updatedPayment && updatedPayment.status === 'completed') {
              await paymentSubscriptionConnector.handlePaymentConfirmed(updatedPayment);
            }
          }
        } catch (err) {
          console.error(`Error processing payment ${payment.paymentId}:`, err);
        }
      }
    } catch (err) {
      console.error('Error in payment processor:', err);
    }
  }
}

// Export singleton instance
const electrumPaymentProcessor = new ElectrumPaymentProcessor();
module.exports = { electrumPaymentProcessor };
