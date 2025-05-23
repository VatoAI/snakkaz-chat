// paymentService.js
// Service for handling Bitcoin payments

const { supabase } = require('../lib/supabaseClient');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

class PaymentService {
  constructor() {
    // Set minimum confirmation count for considering a transaction confirmed
    this.MIN_CONFIRMATIONS = 3;
    
    // Set Bitcoin API endpoint for checking transactions
    this.BITCOIN_API_URL = process.env.BITCOIN_API_URL || 'https://blockstream.info/api';
    
    // Set webhook secret for validating callbacks
    this.WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || 'your-webhook-secret';
    
    // Conversion rate cache
    this.exchangeRates = {
      lastUpdated: null,
      rates: { NOK: null } // NOK to BTC rate
    };
  }
  
  /**
   * Create a new payment request
   * @param {Object} paymentData
   * @returns {Object} Payment request
   */
  async createPaymentRequest(paymentData) {
    try {
      // Generate a unique Bitcoin address for this payment
      const bitcoinAddress = await this.generatePaymentAddress();
      
      // Get current exchange rate
      const btcAmount = await this.convertToBitcoin(paymentData.amount, paymentData.currency);
      
      // Prepare payment data
      const payment = {
        id: uuidv4(),
        user_id: paymentData.userId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        btc_amount: btcAmount,
        product_type: paymentData.productType,
        product_id: paymentData.productId,
        payment_method: paymentData.method || 'bitcoin',
        bitcoin_address: bitcoinAddress,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
      
      // Save to database
      const { data, error } = await supabase
        .from('payments')
        .insert([payment])
        .single();
      
      if (error) {
        console.error('Database error creating payment:', error);
        throw new Error(`Failed to create payment: ${error.message}`);
      }
      
      // Send email notification about new payment
      await this.sendPaymentEmail(payment, 'created');
      
      // Return payment with success
      return { ...payment, success: true };
    } catch (error) {
      console.error('Payment creation error:', error);
      throw error;
    }
  }
  
  /**
   * Get a specific payment
   * @param {string} paymentId
   * @param {string} userId
   * @returns {Object} Payment data
   */
  async getPayment(paymentId, userId = null) {
    try {
      let query = supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId);
      
      // If userId provided, restrict to that user's payments
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query.single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows matched
          return null;
        }
        throw error;
      }
      
      // If payment is pending, check blockchain for updates
      if (data.status === 'pending') {
        await this.checkPaymentStatus(paymentId);
        
        // Get updated payment data
        const { data: updatedData, error: getError } = await supabase
          .from('payments')
          .select('*')
          .eq('id', paymentId)
          .single();
        
        if (getError) {
          throw getError;
        }
        
        return updatedData;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting payment:', error);
      throw error;
    }
  }
  
  /**
   * Get all payments for a user
   * @param {string} userId
   * @returns {Array} Payment list
   */
  async getUserPayments(userId) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting user payments:', error);
      throw error;
    }
  }
  
  /**
   * Get all payments (admin)
   * @param {Object} options
   * @returns {Array} Payment list
   */
  async getAllPayments(options = {}) {
    try {
      let query = supabase
        .from('payments')
        .select('*, profiles:user_id(username, full_name)');
      
      if (options.status) {
        query = query.eq('status', options.status);
      }
      
      query = query.order('created_at', { ascending: false });
      
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 9));
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting all payments:', error);
      throw error;
    }
  }
  
  /**
   * Check payment status on Bitcoin blockchain
   * @param {string} paymentId
   * @returns {Object} Updated payment data
   */
  async checkPaymentStatus(paymentId) {
    try {
      // Get payment data
      const { data: payment, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!payment || payment.status !== 'pending') {
        return payment;
      }
      
      // In real implementation: Check Bitcoin blockchain for transactions to this address
      // This is a simple demonstration - in production, you'd use a proper Bitcoin API 
      // or self-hosted node to check the blockchain
      const transactionFound = await this.checkBlockchainForPayment(payment);
      
      if (transactionFound) {
        // Update payment status
        const { data: updatedPayment, error: updateError } = await supabase.rpc(
          'confirm_bitcoin_payment',
          { 
            payment_id: paymentId,
            txid: transactionFound.txid, 
            confirmations: transactionFound.confirmations
          }
        );
        
        if (updateError) {
          throw updateError;
        }
        
        // If confirmations are sufficient, complete the payment
        if (transactionFound.confirmations >= this.MIN_CONFIRMATIONS) {
          await this.completePayment(paymentId);
          
          // Send confirmation email
          await this.sendPaymentEmail(payment, 'confirmed');
        }
        
        // Get the latest payment data
        const { data: latestPayment, error: getError } = await supabase
          .from('payments')
          .select('*')
          .eq('id', paymentId)
          .single();
        
        if (getError) {
          throw getError;
        }
        
        return latestPayment;
      }
      
      // Update the last checked time
      await supabase
        .from('payments')
        .update({ 
          last_checked_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId);
      
      return payment;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  }
  
  /**
   * Complete a payment and activate related services
   * @param {string} paymentId
   * @returns {boolean} Success status
   */
  async completePayment(paymentId) {
    try {
      const { data, error } = await supabase.rpc(
        'complete_payment_and_activate',
        { payment_id: paymentId }
      );
      
      if (error) {
        throw error;
      }
      
      // Get payment details for notification
      const { data: payment, error: getError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();
      
      if (getError) {
        throw getError;
      }
      
      // Send completion email
      await this.sendPaymentEmail(payment, 'completed');
      
      return true;
    } catch (error) {
      console.error('Error completing payment:', error);
      throw error;
    }
  }
  
  /**
   * Update payment status manually (admin)
   * @param {string} paymentId
   * @param {string} status
   * @param {Object} options
   * @returns {Object} Updated payment data
   */
  async updatePaymentStatus(paymentId, status, options = {}) {
    try {
      // Get current payment data
      const { data: currentPayment, error: getError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();
      
      if (getError) {
        throw getError;
      }
      
      if (!currentPayment) {
        return null;
      }
      
      // Update payment status
      const { data, error } = await supabase
        .from('payments')
        .update({ 
          status,
          admin_notes: options.notes || currentPayment.admin_notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId)
        .single();
      
      if (error) {
        throw error;
      }
      
      // Log the admin action
      await supabase
        .from('payment_logs')
        .insert([{
          payment_id: paymentId,
          admin_id: options.adminId,
          action: 'admin_status_update',
          previous_status: currentPayment.status,
          new_status: status,
          metadata: { 
            notes: options.notes || null
          },
          created_at: new Date().toISOString()
        }]);
      
      // If status is 'completed', activate subscription
      if (status === 'completed' && currentPayment.status !== 'completed') {
        await this.completePayment(paymentId);
      }
      
      // Send email notification if status changed to something meaningful
      if (['confirmed', 'completed', 'failed', 'refunded'].includes(status) && 
          currentPayment.status !== status) {
        await this.sendPaymentEmail(currentPayment, status);
      }
      
      return data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }
  
  /**
   * Handle webhook from payment processor
   * @param {Object} webhookData
   * @returns {boolean} Success status
   */
  async handleWebhook(webhookData) {
    try {
      const { payment_id, txid, confirmations, status } = webhookData;
      
      // Validate required fields
      if (!payment_id || !txid) {
        throw new Error('Invalid webhook data: missing required fields');
      }
      
      // Get payment data
      const { data: payment, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', payment_id)
        .single();
      
      if (error || !payment) {
        throw new Error('Payment not found');
      }
      
      // Store webhook data for reference
      await supabase
        .from('payments')
        .update({ 
          webhook_data: webhookData,
          updated_at: new Date().toISOString()
        })
        .eq('id', payment_id);
      
      // Handle based on webhook type
      if (confirmations >= this.MIN_CONFIRMATIONS) {
        // Payment is confirmed
        await supabase.rpc(
          'confirm_bitcoin_payment',
          { 
            payment_id,
            txid, 
            confirmations
          }
        );
        
        // Complete payment
        await this.completePayment(payment_id);
      } else {
        // Update confirmation count
        await supabase
          .from('payments')
          .update({ 
            transaction_id: txid,
            confirmation_count: confirmations,
            status: 'pending',
            last_checked_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', payment_id);
      }
      
      return true;
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }
  
  /**
   * Verify webhook signature
   * @param {string} signature
   * @param {Object} payload
   * @returns {boolean} Valid signature
   */
  verifyWebhookSignature(signature, payload) {
    try {
      // In production, validate the signature from your payment processor
      // This is a simplified example
      
      if (!signature) {
        return false;
      }
      
      const hmac = crypto.createHmac('sha256', this.WEBHOOK_SECRET);
      const calculatedSignature = hmac.update(JSON.stringify(payload)).digest('hex');
      
      return crypto.timingSafeEqual(
        Buffer.from(signature), 
        Buffer.from(calculatedSignature)
      );
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }
  
  /**
   * Send payment notification email
   * @param {Object} payment
   * @param {string} eventType
   * @returns {boolean} Success status
   */
  async sendPaymentEmail(payment, eventType) {
    try {
      // Get user email
      const { data: user, error } = await supabase
        .from('profiles')
        .select('username, full_name, email')
        .eq('id', payment.user_id)
        .single();
      
      if (error || !user) {
        throw new Error('User not found');
      }
      
      const email = user.email || await this.getUserEmail(payment.user_id);
      
      if (!email) {
        throw new Error('User email not found');
      }
      
      // Prepare email content based on event type
      let subject, content;
      
      switch (eventType) {
        case 'created':
          subject = 'Your Bitcoin Payment is Waiting';
          content = `
            <h1>Bitcoin Payment Created</h1>
            <p>Hi ${user.full_name || user.username},</p>
            <p>Your payment of ${payment.amount} ${payment.currency} (${payment.btc_amount} BTC) has been created.</p>
            <p>Please send your payment to the following Bitcoin address:</p>
            <p><strong>${payment.bitcoin_address}</strong></p>
            <p>This payment will expire in 24 hours. Current payment status: ${payment.status}</p>
            <p>Thank you for using Snakkaz Chat!</p>
          `;
          break;
        
        case 'confirmed':
          subject = 'Your Bitcoin Payment is Confirmed';
          content = `
            <h1>Bitcoin Payment Confirmed</h1>
            <p>Hi ${user.full_name || user.username},</p>
            <p>Your payment of ${payment.amount} ${payment.currency} (${payment.btc_amount} BTC) has been confirmed on the blockchain.</p>
            <p>Transaction ID: ${payment.transaction_id}</p>
            <p>We're now processing your payment to activate your purchase.</p>
            <p>Thank you for using Snakkaz Chat!</p>
          `;
          break;
        
        case 'completed':
          subject = 'Your Bitcoin Payment is Complete';
          content = `
            <h1>Payment Complete</h1>
            <p>Hi ${user.full_name || user.username},</p>
            <p>Your payment of ${payment.amount} ${payment.currency} (${payment.btc_amount} BTC) has been completed.</p>
            <p>Your purchase has been activated and is now available in your account.</p>
            <p>Thank you for using Snakkaz Chat!</p>
          `;
          break;
        
        case 'failed':
          subject = 'Your Bitcoin Payment Failed';
          content = `
            <h1>Payment Failed</h1>
            <p>Hi ${user.full_name || user.username},</p>
            <p>We're sorry, but your payment of ${payment.amount} ${payment.currency} (${payment.btc_amount} BTC) has failed.</p>
            <p>Please try again or contact our support team for assistance.</p>
            <p>Thank you for using Snakkaz Chat!</p>
          `;
          break;
          
        default:
          return false;
      }
      
      // Send email
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'payments@snakkaz.com',
        to: email,
        subject,
        html: content
      });
      
      return true;
    } catch (error) {
      console.error('Error sending payment email:', error);
      return false;
    }
  }
  
  /**
   * Helper to get user email from auth (not stored in profiles)
   * @param {string} userId
   * @returns {string} Email address
   */
  async getUserEmail(userId) {
    try {
      const { data, error } = await supabase.rpc('get_user_email', { userid: userId });
      
      if (error || !data) {
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting user email:', error);
      return null;
    }
  }
  
  /**
   * Generate a unique Bitcoin payment address
   * @returns {string} Bitcoin address
   */
  async generatePaymentAddress() {
    // In a real implementation, this would integrate with your Bitcoin wallet or payment processor API
    // For this demonstration, we'll use a dummy address generator
    
    // For simulation purposes only
    const dummyAddressPrefix = 'bc1q';
    const randomSuffix = crypto.randomBytes(16).toString('hex');
    
    return `${dummyAddressPrefix}${randomSuffix}`;
  }
  
  /**
   * Convert fiat currency to Bitcoin
   * @param {number} amount
   * @param {string} currency
   * @returns {number} BTC amount
   */
  async convertToBitcoin(amount, currency = 'NOK') {
    try {
      // Check if we need to update exchange rates
      if (!this.exchangeRates.lastUpdated || 
          Date.now() - this.exchangeRates.lastUpdated > 15 * 60 * 1000) { // 15 minutes
        await this.updateExchangeRates();
      }
      
      const rate = this.exchangeRates.rates[currency];
      
      if (!rate) {
        throw new Error(`Exchange rate for ${currency} not available`);
      }
      
      const btcAmount = amount * rate;
      
      // Round to 8 decimal places (satoshi precision)
      return Math.round(btcAmount * 100000000) / 100000000;
    } catch (error) {
      console.error('Error converting to Bitcoin:', error);
      
      // Use fallback rate for NOK (approximation)
      if (currency === 'NOK') {
        const fallbackRate = 0.0000028; // Approx. value as fallback
        return Math.round(amount * fallbackRate * 100000000) / 100000000;
      }
      
      throw error;
    }
  }
  
  /**
   * Update cryptocurrency exchange rates
   */
  async updateExchangeRates() {
    try {
      // In a real implementation, you would fetch from an exchange API
      // For this demonstration, we'll use hardcoded values
      
      this.exchangeRates = {
        lastUpdated: Date.now(),
        rates: {
          NOK: 0.0000028, // 1 NOK = 0.0000028 BTC (example value)
          USD: 0.000036   // 1 USD = 0.000036 BTC (example value)
        }
      };
    } catch (error) {
      console.error('Error updating exchange rates:', error);
    }
  }
  
  /**
   * Check the blockchain for payment to address
   * @param {Object} payment
   * @returns {Object|null} Transaction data if found
   */
  async checkBlockchainForPayment(payment) {
    try {
      // In a real implementation, this would query the Bitcoin blockchain
      // Through an API or direct node connection
      
      // For this demonstration, we'll simulate random transaction discovery
      // with a probability that increases over time
      const hoursSinceCreation = (Date.now() - new Date(payment.created_at).getTime()) / (1000 * 60 * 60);
      
      // Higher chance of finding a transaction as time passes (for demo purposes)
      const transactionProbability = Math.min(0.1 + (hoursSinceCreation * 0.1), 0.9);
      
      if (Math.random() < transactionProbability) {
        // Simulate finding a transaction
        const confirmations = Math.floor(Math.random() * 6) + 1; // 1-6 confirmations
        
        return {
          txid: `tx_${crypto.randomBytes(16).toString('hex')}`,
          amount: payment.btc_amount,
          confirmations: confirmations,
          blockHeight: 700000 + Math.floor(Math.random() * 1000),
          timestamp: Date.now()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error checking blockchain:', error);
      return null;
    }
  }
}

// Export a singleton instance
const paymentService = new PaymentService();
module.exports = { paymentService };
