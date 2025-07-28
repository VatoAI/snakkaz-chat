/**
 * PaymentSubscriptionConnector - Connects the payment service with the subscription service
 * This module ensures that when payments are confirmed, the appropriate subscriptions are activated
 */

const { paymentService } = require('./paymentService');
const subscriptionService = require('../services/subscription/subscriptionService').default;

class PaymentSubscriptionConnector {
  constructor() {
    // Initialize connection between services
    this.setupListeners();
  }

  /**
   * Set up listeners for payment events
   */
  setupListeners() {
    // In a real implementation, this would use an event emitter or message queue
    // For now, we'll use functions that are called directly
    paymentService.onPaymentConfirmed = this.handlePaymentConfirmed.bind(this);
    paymentService.onPaymentFailed = this.handlePaymentFailed.bind(this);
  }

  /**
   * Handle confirmed payments and activate subscriptions
   * @param {Object} payment - The confirmed payment
   */
  async handlePaymentConfirmed(payment) {
    try {
      console.log(`Payment confirmed: ${payment.id}. Activating subscription for user ${payment.user_id}`);
      
      if (payment.product_type === 'subscription') {
        // Activate subscription based on the plan
        const success = await subscriptionService.createSubscription(
          payment.user_id, 
          payment.product_id,
          {
            paymentId: payment.id,
            paymentMethod: 'bitcoin',
            amount: payment.amount,
            currency: payment.currency
          }
        );
        
        if (success) {
          console.log(`Subscription activated successfully for user ${payment.user_id}, plan ${payment.product_id}`);
          
          // Update payment with subscription info
          await paymentService.updatePaymentMetadata(payment.id, {
            subscription_activated: true,
            subscription_activation_time: new Date().toISOString()
          });
        } else {
          console.error(`Failed to activate subscription for user ${payment.user_id}`);
          
          // Log the failure
          await paymentService.createPaymentLog({
            payment_id: payment.id,
            action: 'subscription_activation_failed',
            metadata: {
              error: 'Failed to activate subscription',
              product_id: payment.product_id
            }
          });
        }
      }
      
      // Handle one-time purchases or other product types
      if (payment.product_type === 'one-time') {
        // Process one-time purchases
        console.log(`Processing one-time purchase: ${payment.product_id}`);
        // Implementation for one-time products would go here
      }
      
    } catch (error) {
      console.error('Error handling confirmed payment:', error);
      
      // Log the error
      await paymentService.createPaymentLog({
        payment_id: payment.id,
        action: 'subscription_error',
        metadata: {
          error: error.message
        }
      });
    }
  }

  /**
   * Handle failed payments
   * @param {Object} payment - The failed payment
   */
  async handlePaymentFailed(payment) {
    try {
      console.log(`Payment failed: ${payment.id} for user ${payment.user_id}`);
      
      // Log the failure
      await paymentService.createPaymentLog({
        payment_id: payment.id,
        action: 'payment_failed',
        metadata: {
          reason: payment.failure_reason || 'Unknown reason'
        }
      });
      
    } catch (error) {
      console.error('Error handling failed payment:', error);
    }
  }

  /**
   * Check for pending subscriptions that need to be activated
   * This can be run periodically to catch any missed activations
   */
  async checkPendingActivations() {
    try {
      // Get confirmed payments that don't have subscriptions activated yet
      const pendingPayments = await paymentService.getPendingActivationPayments();
      
      console.log(`Found ${pendingPayments.length} payments pending subscription activation`);
      
      // Process each pending payment
      for (const payment of pendingPayments) {
        await this.handlePaymentConfirmed(payment);
      }
      
    } catch (error) {
      console.error('Error checking pending activations:', error);
    }
  }
}

// Export singleton instance
const paymentSubscriptionConnector = new PaymentSubscriptionConnector();
module.exports = { paymentSubscriptionConnector };
