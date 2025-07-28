/**
 * WalletSecurity - Secure handling of Bitcoin wallet data
 * 
 * This module implements secure cryptographic methods for protecting
 * Bitcoin wallet data, including seed phrases and private keys.
 */

const crypto = require('crypto');
const util = require('util');

// Promisify crypto pbkdf2 function
const pbkdf2 = util.promisify(crypto.pbkdf2);

class WalletSecurity {
  /**
   * Initialize the wallet security module
   * @param {Object} options - Configuration options
   * @param {number} options.encryptionIterations - Number of PBKDF2 iterations
   * @param {number} options.encryptionKeyLength - Key length in bytes
   * @param {string} options.encryptionAlgorithm - Encryption algorithm to use
   */
  constructor(options = {}) {
    this.encryptionIterations = options.encryptionIterations || 100000;
    this.encryptionKeyLength = options.encryptionKeyLength || 32;
    this.encryptionAlgorithm = options.encryptionAlgorithm || 'aes-256-gcm';
  }
  
  /**
   * Encrypt wallet seed data with a password
   * Uses proper AES-GCM encryption with PBKDF2 key derivation
   * 
   * @param {string} seed - The seed phrase or private key to encrypt
   * @param {string} password - The password to encrypt with
   * @returns {string} - JSON string containing encrypted data and parameters
   */
  async encryptWalletData(seed, password) {
    if (!seed || !password) {
      throw new Error('Both seed and password are required');
    }
    
    // Generate a salt for the password
    const salt = this.createStrongSalt();
    
    // Generate a key from the password
    const key = await this.hashPassword(password, salt);
    
    // Generate a random IV
    const iv = crypto.randomBytes(16);
    
    // Encrypt the seed
    const cipher = crypto.createCipheriv(this.encryptionAlgorithm, key, iv);
    let encrypted = cipher.update(seed, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Get the auth tag for GCM mode
    const authTag = cipher.getAuthTag();
    
    // Return the encrypted data as a JSON string with all necessary components
    return JSON.stringify({
      encrypted,
      iv: iv.toString('hex'),
      salt: salt.toString('hex'),
      authTag: authTag.toString('hex'),
      algorithm: this.encryptionAlgorithm,
      keyDerivation: 'pbkdf2'
    });
  }
  
  /**
   * Decrypt wallet data using the provided password
   * 
   * @param {string} encryptedData - JSON string with encrypted data and parameters
   * @param {string} password - The password to decrypt with
   * @returns {string} - The decrypted seed phrase or private key
   */
  async decryptWalletData(encryptedData, password) {
    try {
      const data = JSON.parse(encryptedData);
      
      // Convert components back to buffers
      const iv = Buffer.from(data.iv, 'hex');
      const salt = Buffer.from(data.salt, 'hex');
      const authTag = Buffer.from(data.authTag, 'hex');
      
      // Derive the key using the same parameters
      const key = await this.hashPassword(password, salt);
      
      // Create decipher
      const decipher = crypto.createDecipheriv(data.algorithm || this.encryptionAlgorithm, key, iv);
      decipher.setAuthTag(authTag);
      
      // Decrypt
      let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error('Failed to decrypt wallet data. Invalid password or corrupted data.');
    }
  }
  
  /**
   * Verify if a password can decrypt the data without returning the decrypted content
   * 
   * @param {string} encryptedData - JSON string with encrypted data
   * @param {string} password - The password to verify
   * @returns {boolean} - True if password is correct
   */
  async verifyPassword(encryptedData, password) {
    try {
      await this.decryptWalletData(encryptedData, password);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Generate a cryptographically secure random string
   * Useful for creating random passwords or seeds
   * 
   * @param {number} length - The length of the string to generate
   * @returns {string} - Random string
   */
  generateSecureRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomBytes = crypto.randomBytes(length);
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(randomBytes[i] % chars.length);
    }
    
    return result;
  }
  
  /**
   * Create a cryptographically secure salt
   * 
   * @param {number} size - Size of salt in bytes
   * @returns {Buffer} - Salt as Buffer
   */
  createStrongSalt(size = 16) {
    return crypto.randomBytes(size);
  }
  
  /**
   * Hash a password using PBKDF2
   * 
   * @param {string} password - The password to hash
   * @param {Buffer} salt - Salt to use
   * @returns {Buffer} - Hashed password
   */
  async hashPassword(password, salt) {
    return pbkdf2(
      password, 
      salt, 
      this.encryptionIterations, 
      this.encryptionKeyLength, 
      'sha512'
    );
  }
}

module.exports = { WalletSecurity };
