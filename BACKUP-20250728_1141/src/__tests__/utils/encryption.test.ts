import { 
  generateKeyPair, 
  generateEncryptionKey
} from '@/utils/encryption';
import { SecureKeyStorage } from '@/utils/security/secure-key-storage';

// Mock window.crypto for the test environment
Object.defineProperty(window, 'crypto', {
  value: global.crypto,
});

describe('End-to-End Encryption Utils', () => {
  describe('Key Generation', () => {
    it('should generate a valid key pair', async () => {
      const keyPair = await generateKeyPair();
      
      expect(keyPair).toHaveProperty('publicKey');
      expect(keyPair).toHaveProperty('privateKey');
      expect(typeof keyPair.publicKey).toBe('object');
      expect(typeof keyPair.privateKey).toBe('object');
      expect(keyPair.publicKey).toHaveProperty('kty');
      expect(keyPair.privateKey).toHaveProperty('kty');
    });

    it('should generate different key pairs each time', async () => {
      const keyPair1 = await generateKeyPair();
      const keyPair2 = await generateKeyPair();
      
      // JsonWebKey objects should have different values
      expect(keyPair1.publicKey.x).not.toEqual(keyPair2.publicKey.x);
    });

    it('should generate encryption keys', () => {
      const key1 = generateEncryptionKey();
      const key2 = generateEncryptionKey();
      
      expect(typeof key1).toBe('string');
      expect(typeof key2).toBe('string');
      expect(key1.length).toBe(64); // 32 bytes * 2 hex chars = 64
      expect(key2.length).toBe(64);
      expect(key1).not.toBe(key2);
    });
  });

  describe('SecureKeyStorage', () => {
    let storage: SecureKeyStorage;
    
    beforeEach(() => {
      storage = new SecureKeyStorage();
    });

    afterEach(() => {
      // Clean up storage
      if (storage && typeof storage.dispose === 'function') {
        storage.dispose();
      }
    });

    it('should store and retrieve keys securely', () => {
      const keyId = 'test-key-123';
      const keyMaterial = new Uint8Array([1, 2, 3, 4, 5]);
      
      const stored = storage.storeKey(keyId, keyMaterial);
      expect(stored).toBe(true);
      
      const retrieved = storage.getKey(keyId);
      expect(retrieved).toEqual(keyMaterial);
    });

    it('should return null for non-existent keys', () => {
      const retrieved = storage.getKey('non-existent-key');
      expect(retrieved).toBeNull();
    });

    it('should delete keys properly', () => {
      const keyId = 'test-key-456';
      const keyMaterial = new Uint8Array([6, 7, 8, 9, 10]);
      
      storage.storeKey(keyId, keyMaterial);
      expect(storage.getKey(keyId)).toEqual(keyMaterial);
      
      const deleted = storage.deleteKey(keyId);
      expect(deleted).toBe(true);
      expect(storage.getKey(keyId)).toBeNull();
    });
  });
});
