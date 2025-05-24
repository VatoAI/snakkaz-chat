// stripeConnector.js
// Connector for Stripe payment integration with Snakkaz Chat

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { supabase } = require('../../lib/supabaseClient');

class StripeConnector {
  constructor() {
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    this.prices = {
      premiumMonthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
      premiumYearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY, 
      businessMonthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
      extraEmailMonthly: process.env.STRIPE_PRICE_EXTRA_EMAIL,
      extraStorageMonthly: process.env.STRIPE_PRICE_EXTRA_STORAGE
    };
  }
  
  /**
   * Create a checkout session for a user subscription
   * @param {Object} params - The checkout parameters
   * @returns {Object} - Checkout session
   */
  async createCheckoutSession(params) {
    const {
      userId,
      customerEmail,
      planType, // 'premium' or 'business'
      interval, // 'month' or 'year'
      successUrl,
      cancelUrl,
      metadata = {}
    } = params;
    
    // Determine price ID based on plan and interval
    let priceId;
    if (planType === 'premium') {
      priceId = interval === 'year' ? this.prices.premiumYearly : this.prices.premiumMonthly;
    } else if (planType === 'business') {
      priceId = this.prices.businessMonthly;
    } else {
      throw new Error('Invalid plan type');
    }
    
    try {
      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: customerEmail,
        client_reference_id: userId,
        metadata: {
          userId,
          planType,
          interval,
          ...metadata
        }
      });
      
      return session;
    } catch (error) {
      console.error('Failed to create Stripe checkout session:', error);
      throw error;
    }
  }
  
  /**
   * Handle Stripe webhook events
   * @param {Buffer} rawBody - The raw request body
   * @param {string} signature - The Stripe signature header
   * @returns {Object} - The event data and type
   */
  async handleWebhookEvent(rawBody, signature) {
    try {
      // Verify the signature
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.webhookSecret
      );
      
      console.log(`Received Stripe webhook: ${event.type}`);
      
      // Process event based on type
      switch (event.type) {
        case 'checkout.session.completed':
          await this._handleCheckoutSessionCompleted(event.data.object);
          break;
        
        case 'invoice.payment_succeeded':
          await this._handleInvoicePaymentSucceeded(event.data.object);
          break;
          
        case 'invoice.payment_failed':
          await this._handleInvoicePaymentFailed(event.data.object);
          break;
          
        case 'customer.subscription.deleted':
          await this._handleSubscriptionDeleted(event.data.object);
          break;
      }
      
      return { 
        type: event.type, 
        data: event.data.object 
      };
    } catch (error) {
      console.error('Error handling Stripe webhook:', error);
      throw error;
    }
  }
  
  /**
   * Handle checkout session completed event
   * @param {Object} session - The checkout session
   */
  async _handleCheckoutSessionCompleted(session) {
    // Get user ID from session metadata
    const userId = session.metadata?.userId;
    const planType = session.metadata?.planType;
    
    if (!userId) {
      console.error('No userId found in checkout session metadata');
      return;
    }
    
    // Store subscription info in database
    try {
      // Get subscription details from Stripe
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      
      // Store in Supabase
      const { error } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: userId,
          stripe_customer_id: subscription.customer,
          stripe_subscription_id: subscription.id,
          plan_type: planType,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
        }]);
        
      if (error) {
        console.error('Error storing subscription in database:', error);
      }
      
      // Update user's premium status
      const { error: userError } = await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', userId);
        
      if (userError) {
        console.error('Error updating user premium status:', userError);
      }
    } catch (error) {
      console.error('Error processing successful checkout:', error);
    }
  }
  
  /**
   * Handle successful invoice payment
   * @param {Object} invoice - The invoice object
   */
  async _handleInvoicePaymentSucceeded(invoice) {
    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    
    // Update subscription status in database
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          last_payment_date: new Date().toISOString()
        })
        .eq('stripe_subscription_id', invoice.subscription);
        
      if (error) {
        console.error('Error updating subscription payment info:', error);
      }
    } catch (error) {
      console.error('Error handling successful payment:', error);
    }
  }
  
  /**
   * Handle failed invoice payment
   * @param {Object} invoice - The invoice object
   */
  async _handleInvoicePaymentFailed(invoice) {
    try {
      // Update subscription status in database
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'past_due',
          last_payment_attempt: new Date().toISOString(),
          last_payment_error: invoice.last_payment_error?.message || 'Payment failed'
        })
        .eq('stripe_subscription_id', invoice.subscription);
        
      if (error) {
        console.error('Error updating subscription payment failure:', error);
      }
      
      // Get customer email for notification
      const customer = await stripe.customers.retrieve(invoice.customer);
      
      // TODO: Send payment failure notification to user
    } catch (error) {
      console.error('Error handling failed payment:', error);
    }
  }
  
  /**
   * Handle subscription deletion/cancellation
   * @param {Object} subscription - The subscription object
   */
  async _handleSubscriptionDeleted(subscription) {
    try {
      // Update subscription status in database
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscription.id);
        
      if (error) {
        console.error('Error updating subscription cancellation:', error);
      }
      
      // Find user ID associated with this subscription
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subscription.id)
        .single();
        
      if (subError) {
        console.error('Error finding user for canceled subscription:', subError);
        return;
      }
      
      // Update user's premium status if subscription has ended
      if (subscription.status === 'canceled') {
        const { error: userError } = await supabase
          .from('profiles')
          .update({ is_premium: false })
          .eq('id', subData.user_id);
          
        if (userError) {
          console.error('Error updating user premium status after cancellation:', userError);
        }
      }
    } catch (error) {
      console.error('Error handling subscription deletion:', error);
    }
  }
  
  /**
   * Cancel a subscription
   * @param {string} subscriptionId - The Stripe subscription ID
   * @returns {Object} - The updated subscription
   */
  async cancelSubscription(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      });
      
      // Update status in database
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceling',
          cancel_at: new Date(subscription.cancel_at * 1000).toISOString()
        })
        .eq('stripe_subscription_id', subscriptionId);
        
      if (error) {
        console.error('Error updating subscription cancellation in database:', error);
      }
      
      return subscription;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }
  
  /**
   * Get subscription details
   * @param {string} subscriptionId - The Stripe subscription ID
   * @returns {Object} - The subscription details
   */
  async getSubscription(subscriptionId) {
    try {
      return await stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      console.error('Error retrieving subscription:', error);
      throw error;
    }
  }
}

// Export singleton instance
const stripeConnector = new StripeConnector();
module.exports = { stripeConnector };
