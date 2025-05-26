/**
 * Bitcoin Electrum Adapter
 * 
 * This module provides an adapter between the general payment service
 * and the Electrum-specific functionality.
 */

const { electrumConnector } = require('./electrumConnector');
const { supabase } = require('../../lib/supabaseClient');

class BitcoinElectrumAdapter {
  constructor() {
    this.MIN_CONFIRMATIONS = parseInt(process.env.BITCOIN_MIN_CONFIRMATIONS || '3');
  }
  
  /**
   * Create a Bitcoin payment request using Electrum
   * @param {Object} paymentData - Payment data
   * @returns {Object} - Bitcoin payment details
   */
  async createPaymentRequest(paymentData) {
    try {
      // Get Electrum payment details
      const electrumPayment = await electrumConnector.createPaymentRequest(
        paymentData.userId,
        paymentData.amount,
        paymentData.currency,
        paymentData.productId,
        paymentData.id
      );
      
      return {
        bitcoin_address: electrumPayment.address,
        btc_amount: electrumPayment.btcAmount,
        payment_reference: electrumPayment.paymentRef
      };
    } catch (error) {
      console.error('Error creating Electrum payment request:', error);
      throw error;
    }
  }
  
  /**
   * Check blockchain for payment
   * @param {Object} payment - Payment record from database
   * @returns {Object|null} - Transaction data or null if not found
   */
  async checkBlockchainForPayment(payment) {
    try {
      // Check payment status via Electrum
      const paymentStatus = await electrumConnector.checkPayment(payment.bitcoin_address);
      
      if (!paymentStatus.received) {
        return null;
      }
      
      // Return transaction data if payment was received
      return {
        txid: `el_${payment.id.substring(0, 16)}`, // In a real implementation, return actual txid
        amount: paymentStatus.amount / 100000000, // Convert from satoshis to BTC
        confirmations: paymentStatus.confirmed ? this.MIN_CONFIRMATIONS : 1,
        blockHeight: 0, // Would be actual block height in real implementation
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error checking blockchain for payment:', error);
      return null;
    }
  }
  
  /**
   * Get wallet balance (admin function)
   * @returns {Object} - Wallet balance
   */
  async getWalletBalance() {
    try {
      return await electrumConnector.getWalletBalance();
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      throw error;
    }
  }
  
  /**
   * Get transaction details (admin function)
   * @param {string} txid - Transaction ID
   * @returns {Object} - Transaction details
   */
  async getTransactionDetails(txid) {
    try {
      return await electrumConnector.getTransaction(txid);
    } catch (error) {
      console.error('Error getting transaction details:', error);
      throw error;
    }
  }
}

// Export singleton instance
const bitcoinElectrumAdapter = new BitcoinElectrumAdapter();
module.exports = { bitcoinElectrumAdapter };
