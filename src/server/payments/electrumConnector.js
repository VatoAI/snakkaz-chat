// electrumConnector.js
// Connector for Electrum wallet integration with Snakkaz Chat payment system

const net = require('net');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { supabase } = require('../../lib/supabaseClient');

class ElectrumConnector {
  constructor(config) {
    this.config = config || {
      host: process.env.ELECTRUM_HOST || 'localhost',
      port: process.env.ELECTRUM_PORT || 50001,
      protocol: process.env.ELECTRUM_PROTOCOL || 'tls', 
      walletPath: process.env.ELECTRUM_WALLET_PATH,
      walletPassword: process.env.ELECTRUM_WALLET_PASSWORD,
      minConfirmations: parseInt(process.env.ELECTRUM_MIN_CONFIRMATIONS || '3'),
      reconnectInterval: parseInt(process.env.ELECTRUM_RECONNECT_INTERVAL || '30000'), // 30 seconds
      txCachePath: process.env.ELECTRUM_TX_CACHE_PATH || path.join(__dirname, '../..', 'data', 'tx-cache.json')
    };
    
    this.requestCounter = 0;
    this.pendingRequests = new Map();
    this.client = null;
    this.isConnected = false;
    this.paymentAddressCache = new Map(); // Cache for payment addresses by user
    this.reconnectTimer = null;
    this.transactionCache = new Map(); // Cache for transaction data
    
    // Ensure cache directory exists
    const cacheDir = path.dirname(this.config.txCachePath);
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    
    // Load cached transactions
    this._loadTransactionCache();
  }
  
  /**
   * Connect to Electrum server
   */
  async connect() {
    return new Promise((resolve, reject) => {
      try {
        this.client = new net.Socket();
        
        this.client.connect(this.config.port, this.config.host, () => {
          console.log(`Connected to Electrum server at ${this.config.host}:${this.config.port}`);
          this.isConnected = true;
          
          // Set up data handling
          this.client.on('data', (data) => this._handleResponse(data));
          this.client.on('error', (err) => {
            console.error('Electrum connection error:', err);
            this.isConnected = false;
          });
          this.client.on('close', () => {
            console.log('Electrum connection closed');
            this.isConnected = false;
          });
          
          resolve(true);
        });
      } catch (err) {
        console.error('Failed to connect to Electrum server:', err);
        this.isConnected = false;
        reject(err);
      }
    });
  }
  
  /**
   * Send a request to the Electrum server
   * @param {string} method - The Electrum method to call
   * @param {Array} params - Parameters for the method
   */
  async sendRequest(method, params = []) {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return new Promise((resolve, reject) => {
      const id = ++this.requestCounter;
      const request = {
        id,
        method,
        params
      };
      
      this.pendingRequests.set(id, { resolve, reject });
      
      this.client.write(JSON.stringify(request) + '\n');
    });
  }
  
  /**
   * Handle response from Electrum server
   * @param {Buffer} data - Data received from Electrum
   */
  _handleResponse(data) {
    const responses = data.toString().split('\n').filter(line => line.trim());
    
    for (const responseText of responses) {
      try {
        const response = JSON.parse(responseText);
        
        if (response.id && this.pendingRequests.has(response.id)) {
          const { resolve, reject } = this.pendingRequests.get(response.id);
          
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response.result);
          }
          
          this.pendingRequests.delete(response.id);
        }
      } catch (err) {
        console.error('Failed to parse Electrum response:', err);
      }
    }
  }
  
  /**
   * Generate a new payment address for a user
   * @param {string} userId - The ID of the user
   * @param {number} amountSats - Amount in satoshis
   * @returns {object} - Payment details
   */
  async generatePaymentAddress(userId, amountSats) {
    try {
      // Generate a unique reference for this payment
      const paymentRef = uuidv4();
      
      // Request new address from Electrum
      const address = await this.sendRequest('createnewaddress', []);
      
      // Store address in cache with metadata
      const paymentData = {
        userId,
        address,
        amountSats,
        paymentRef,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      this.paymentAddressCache.set(address, paymentData);
      
      return paymentData;
    } catch (err) {
      console.error('Failed to generate payment address:', err);
      throw err;
    }
  }
  
  /**
   * Check if payment has been received for a specific address
   * @param {string} address - Bitcoin address to check
   * @returns {boolean} - Whether payment is received and confirmed
   */
  async checkPayment(address) {
    try {
      // Get payment details from cache
      const paymentData = this.paymentAddressCache.get(address);
      if (!paymentData) {
        throw new Error('Payment address not found');
      }
      
      // Check address history from Electrum
      const history = await this.sendRequest('getaddresshistory', [address]);
      
      if (!history || !history.length) {
        return { received: false, confirmed: false, amount: 0 };
      }
      
      let totalReceived = 0;
      let allConfirmed = true;
      
      // Get transaction details for each history item
      for (const item of history) {
        const tx = await this.sendRequest('gettransaction', [item.tx_hash]);
        
        // Sum up the outputs that match our address
        for (const output of tx.outputs) {
          if (output.address === address) {
            totalReceived += output.value;
          }
        }
        
        // Check if transaction has enough confirmations
        if (tx.confirmations < 3) {
          allConfirmed = false;
        }
      }
      
      // Check if received amount is equal or greater than requested amount
      const receivedEnough = totalReceived >= paymentData.amountSats;
      
      return {
        received: receivedEnough,
        confirmed: receivedEnough && allConfirmed,
        amount: totalReceived
      };
    } catch (err) {
      console.error('Failed to check payment status:', err);
      throw err;
    }
  }
  
  /**
   * Close the connection to the Electrum server
   */
  disconnect() {
    if (this.client) {
      this.client.destroy();
      this.isConnected = false;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
  
  /**
   * Set up automatic reconnection
   */
  setupAutoReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    this.reconnectTimer = setTimeout(async () => {
      console.log('Attempting to reconnect to Electrum server...');
      try {
        if (!this.isConnected) {
          await this.connect();
          console.log('Reconnected to Electrum server successfully');
        }
      } catch (err) {
        console.error('Failed to reconnect to Electrum server:', err);
      }
      
      // Set up next reconnection attempt
      this.setupAutoReconnect();
    }, this.config.reconnectInterval);
  }
  
  /**
   * Get wallet balance
   * @returns {object} - Wallet balance in confirmed and unconfirmed
   */
  async getWalletBalance() {
    try {
      const balance = await this.sendRequest('getbalance', []);
      return {
        confirmed: balance.confirmed,
        unconfirmed: balance.unconfirmed
      };
    } catch (err) {
      console.error('Failed to get wallet balance:', err);
      throw err;
    }
  }
  
  /**
   * Create a payment request for a specific amount
   * @param {string} userId - User ID
   * @param {number} amount - Amount in NOK
   * @param {string} productId - Product ID
   * @param {string} paymentId - Database payment ID
   * @returns {object} - Payment details including BTC address and amount
   */
  async createPaymentRequest(userId, amount, currency, productId, paymentId) {
    try {
      // Get current exchange rate and convert to satoshis
      const btcAmount = await this._convertToSatoshis(amount, currency);
      
      // Generate new address
      const paymentData = await this.generatePaymentAddress(userId, btcAmount);
      
      // Store in database
      const { error } = await supabase
        .from('electrum_payments')
        .insert([{
          payment_id: paymentId,
          bitcoin_address: paymentData.address,
          expected_amount: btcAmount,
          status: 'pending',
          created_at: new Date().toISOString(),
          user_id: userId,
          product_id: productId
        }]);
        
      if (error) {
        console.error('Failed to store Electrum payment data:', error);
        throw new Error('Database error when storing payment data');
      }
      
      return {
        address: paymentData.address,
        btcAmount: btcAmount / 100000000, // Convert satoshis to BTC
        paymentRef: paymentData.paymentRef
      };
    } catch (err) {
      console.error('Failed to create payment request:', err);
      throw err;
    }
  }
  
  /**
   * Broadcast raw transaction
   * @param {string} rawTx - Raw transaction hex
   * @returns {string} - Transaction hash
   */
  async broadcastTransaction(rawTx) {
    try {
      const txid = await this.sendRequest('broadcast', [rawTx]);
      return txid;
    } catch (err) {
      console.error('Failed to broadcast transaction:', err);
      throw err;
    }
  }
  
  /**
   * Get transaction details
   * @param {string} txid - Transaction ID
   * @returns {object} - Transaction details
   */
  async getTransaction(txid) {
    try {
      // Check cache first
      if (this.transactionCache.has(txid)) {
        return this.transactionCache.get(txid);
      }
      
      const tx = await this.sendRequest('gettransaction', [txid]);
      
      // Cache the result
      this.transactionCache.set(txid, tx);
      this._saveTransactionCache();
      
      return tx;
    } catch (err) {
      console.error(`Failed to get transaction ${txid}:`, err);
      throw err;
    }
  }
  
  /**
   * Check for payments to our addresses in batches
   * @returns {Array} - List of payments found
   */
  async checkForIncomingPayments() {
    try {
      // Get all pending payments from database
      const { data, error } = await supabase
        .from('electrum_payments')
        .select('*')
        .in('status', ['pending', 'unconfirmed'])
        .order('created_at', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      const results = [];
      
      for (const payment of data) {
        const status = await this.checkPayment(payment.bitcoin_address);
        
        if (status.received) {
          // Update payment status
          const newStatus = status.confirmed ? 'confirmed' : 'unconfirmed';
          
          const { error: updateError } = await supabase
            .from('electrum_payments')
            .update({
              status: newStatus,
              received_amount: status.amount,
              updated_at: new Date().toISOString(),
              last_checked_at: new Date().toISOString()
            })
            .eq('payment_id', payment.payment_id);
            
          if (updateError) {
            console.error('Error updating payment status:', updateError);
          }
          
          results.push({
            paymentId: payment.payment_id,
            status: newStatus,
            receivedAmount: status.amount,
            confirmedAmount: status.confirmed ? status.amount : 0
          });
        } else {
          // Update last checked time
          await supabase
            .from('electrum_payments')
            .update({
              last_checked_at: new Date().toISOString()
            })
            .eq('payment_id', payment.payment_id);
        }
      }
      
      return results;
    } catch (err) {
      console.error('Failed to check for incoming payments:', err);
      throw err;
    }
  }
  
  /**
   * Load transaction cache from disk
   * @private
   */
  _loadTransactionCache() {
    try {
      if (fs.existsSync(this.config.txCachePath)) {
        const data = JSON.parse(fs.readFileSync(this.config.txCachePath, 'utf8'));
        this.transactionCache = new Map(Object.entries(data));
      }
    } catch (err) {
      console.error('Failed to load transaction cache:', err);
      this.transactionCache = new Map();
    }
  }
  
  /**
   * Save transaction cache to disk
   * @private
   */
  _saveTransactionCache() {
    try {
      const cacheObj = Object.fromEntries(this.transactionCache);
      fs.writeFileSync(
        this.config.txCachePath, 
        JSON.stringify(cacheObj, null, 2)
      );
    } catch (err) {
      console.error('Failed to save transaction cache:', err);
    }
  }
  
  /**
   * Convert fiat amount to satoshis
   * @param {number} amount - Amount in fiat
   * @param {string} currency - Currency code
   * @returns {number} - Amount in satoshis
   * @private
   */
  async _convertToSatoshis(amount, currency = 'NOK') {
    // In a real implementation, this would call an exchange rate API
    // For demo purposes, we use hardcoded rates
    
    const rates = {
      NOK: 0.0000028, // 1 NOK = 0.0000028 BTC
      USD: 0.000036,  // 1 USD = 0.000036 BTC
      EUR: 0.000039   // 1 EUR = 0.000039 BTC
    };
    
    if (!rates[currency]) {
      throw new Error(`Unsupported currency: ${currency}`);
    }
    
    const btcAmount = amount * rates[currency];
    return Math.round(btcAmount * 100000000); // Convert to satoshis
  }
}

// Export singleton instance
const electrumConnector = new ElectrumConnector();
module.exports = { electrumConnector };
