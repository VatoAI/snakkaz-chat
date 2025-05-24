// Unit tests for wallet security implementation

const { expect } = require('chai');
const sinon = require('sinon');
const crypto = require('crypto');
const { WalletSecurity } = require('../../src/server/payments/walletSecurity');

describe('WalletSecurity', () => {
  let walletSecurity;
  
  beforeEach(() => {
    walletSecurity = new WalletSecurity({
      encryptionIterations: 10000,
      encryptionKeyLength: 32,
      encryptionAlgorithm: 'aes-256-gcm'
    });
  });
  
  afterEach(() => {
    sinon.restore();
  });
  
  describe('encryptWalletData', () => {
    it('should encrypt wallet seed with password', async () => {
      const seed = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
      const password = 'securepassword123';
      
      const encrypted = await walletSecurity.encryptWalletData(seed, password);
      
      // Check that the result is a JSON string
      expect(() => JSON.parse(encrypted)).not.to.throw();
      
      const parsed = JSON.parse(encrypted);
      
      // Check that it contains all required fields
      expect(parsed).to.have.property('encrypted').that.is.a('string');
      expect(parsed).to.have.property('iv').that.is.a('string');
      expect(parsed).to.have.property('salt').that.is.a('string');
      expect(parsed).to.have.property('authTag').that.is.a('string');
      expect(parsed).to.have.property('algorithm').that.equals('aes-256-gcm');
      expect(parsed).to.have.property('keyDerivation').that.equals('pbkdf2');
      
      // Original seed should not be present in the encrypted data
      expect(encrypted).not.to.include(seed);
    });
    
    it('should use a random salt and IV for each encryption', async () => {
      const seed = 'test seed';
      const password = 'password';
      
      const encrypted1 = await walletSecurity.encryptWalletData(seed, password);
      const encrypted2 = await walletSecurity.encryptWalletData(seed, password);
      
      const parsed1 = JSON.parse(encrypted1);
      const parsed2 = JSON.parse(encrypted2);
      
      // Salt and IV should be different between encryptions
      expect(parsed1.salt).not.to.equal(parsed2.salt);
      expect(parsed1.iv).not.to.equal(parsed2.iv);
      expect(parsed1.encrypted).not.to.equal(parsed2.encrypted);
    });
    
    it('should handle empty strings', async () => {
      const encrypted = await walletSecurity.encryptWalletData('', 'password');
      expect(() => JSON.parse(encrypted)).not.to.throw();
    });
    
    it('should throw error if arguments are missing', async () => {
      try {
        await walletSecurity.encryptWalletData();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('required');
      }
    });
  });
  
  describe('decryptWalletData', () => {
    it('should decrypt previously encrypted wallet data', async () => {
      const seed = 'test wallet seed phrase very secure and random';
      const password = 'correctpassword';
      
      // First encrypt the data
      const encrypted = await walletSecurity.encryptWalletData(seed, password);
      
      // Then decrypt it
      const decrypted = await walletSecurity.decryptWalletData(encrypted, password);
      
      // Check that we got back the original seed
      expect(decrypted).to.equal(seed);
    });
    
    it('should throw error with invalid password', async () => {
      const seed = 'wallet seed';
      const encryptPassword = 'correctpassword';
      const decryptPassword = 'wrongpassword';
      
      const encrypted = await walletSecurity.encryptWalletData(seed, encryptPassword);
      
      try {
        await walletSecurity.decryptWalletData(encrypted, decryptPassword);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('decrypt');
      }
    });
    
    it('should throw error with tampered encrypted data', async () => {
      const seed = 'wallet seed';
      const password = 'password';
      
      const encrypted = await walletSecurity.encryptWalletData(seed, password);
      const parsed = JSON.parse(encrypted);
      
      // Tamper with the encrypted data
      parsed.encrypted = parsed.encrypted.substring(0, parsed.encrypted.length - 5) + 'aaaaa';
      const tampered = JSON.stringify(parsed);
      
      try {
        await walletSecurity.decryptWalletData(tampered, password);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('decrypt');
      }
    });
    
    it('should throw error with malformed data', async () => {
      try {
        await walletSecurity.decryptWalletData('not valid json', 'password');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('parse');
      }
    });
  });
  
  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const seed = 'verify test seed';
      const password = 'correctpass';
      
      const encrypted = await walletSecurity.encryptWalletData(seed, password);
      
      const result = await walletSecurity.verifyPassword(encrypted, password);
      expect(result).to.be.true;
    });
    
    it('should return false for incorrect password', async () => {
      const seed = 'verify test seed';
      const correctPassword = 'correctpass';
      const wrongPassword = 'wrongpass';
      
      const encrypted = await walletSecurity.encryptWalletData(seed, correctPassword);
      
      const result = await walletSecurity.verifyPassword(encrypted, wrongPassword);
      expect(result).to.be.false;
    });
  });
  
  describe('generateSecureRandomString', () => {
    it('should generate a string of requested length', () => {
      const result = walletSecurity.generateSecureRandomString(20);
      expect(result).to.be.a('string');
      expect(result).to.have.lengthOf(20);
    });
    
    it('should generate different strings on each call', () => {
      const result1 = walletSecurity.generateSecureRandomString(16);
      const result2 = walletSecurity.generateSecureRandomString(16);
      expect(result1).not.to.equal(result2);
    });
    
    it('should use secure random source', () => {
      // Mock crypto.randomBytes to verify it gets called
      const randomBytesSpy = sinon.spy(crypto, 'randomBytes');
      
      walletSecurity.generateSecureRandomString(10);
      
      expect(randomBytesSpy.called).to.be.true;
    });
  });
  
  describe('createStrongSalt', () => {
    it('should create a buffer of correct size', () => {
      const salt = walletSecurity.createStrongSalt();
      expect(Buffer.isBuffer(salt)).to.be.true;
      expect(salt.length).to.equal(16); // Default size
    });
    
    it('should respect custom size parameter', () => {
      const salt = walletSecurity.createStrongSalt(24);
      expect(salt.length).to.equal(24);
    });
  });
  
  describe('hashPassword', () => {
    it('should consistently hash a password with the same salt', async () => {
      const password = 'user_password';
      const salt = Buffer.from('0123456789abcdef');
      
      const hash1 = await walletSecurity.hashPassword(password, salt);
      const hash2 = await walletSecurity.hashPassword(password, salt);
      
      expect(hash1.toString('hex')).to.equal(hash2.toString('hex'));
    });
    
    it('should produce different hashes for different passwords', async () => {
      const salt = Buffer.from('0123456789abcdef');
      
      const hash1 = await walletSecurity.hashPassword('password1', salt);
      const hash2 = await walletSecurity.hashPassword('password2', salt);
      
      expect(hash1.toString('hex')).not.to.equal(hash2.toString('hex'));
    });
    
    it('should produce different hashes for different salts', async () => {
      const password = 'same_password';
      
      const hash1 = await walletSecurity.hashPassword(password, Buffer.from('0123456789abcdef'));
      const hash2 = await walletSecurity.hashPassword(password, Buffer.from('fedcba9876543210'));
      
      expect(hash1.toString('hex')).not.to.equal(hash2.toString('hex'));
    });
  });
});
