/**
 * Simple E2EE Test
 * Tests the basic encryption/decryption functionality
 */

// Test basic crypto functionality
async function testBasicCrypto() {
  console.log('🔐 Testing Basic Crypto API...');
  
  try {
    // Test if crypto.subtle is available
    if (!window?.crypto?.subtle && !globalThis?.crypto?.subtle) {
      console.log('❌ crypto.subtle not available');
      return false;
    }
    
    const crypto = globalThis.crypto || window.crypto;
    console.log('✅ crypto.subtle available');
    
    // Test key generation
    const key = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
    
    console.log('✅ AES-GCM key generation successful');
    
    // Test message encryption/decryption
    const message = 'Hello, this is a test message! 🔒';
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      data
    );
    
    console.log('✅ Message encryption successful');
    
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encrypted
    );
    
    const decoder = new TextDecoder();
    const decryptedMessage = decoder.decode(decrypted);
    
    const success = decryptedMessage === message;
    console.log(success ? '✅ Message decryption successful' : '❌ Message decryption failed');
    console.log('Original:', message);
    console.log('Decrypted:', decryptedMessage);
    
    return success;
    
  } catch (error) {
    console.error('❌ Basic crypto test failed:', error);
    return false;
  }
}

// Test if we're in browser or Node.js and run test
if (typeof window !== 'undefined') {
  // Browser environment
  testBasicCrypto().then(result => {
    console.log(`\nOverall: ${result ? '✅ SUCCESS' : '❌ FAILED'}`);
  });
} else {
  // Node.js environment
  const { webcrypto } = require('crypto');
  globalThis.crypto = webcrypto;
  
  testBasicCrypto().then(result => {
    console.log(`\nOverall: ${result ? '✅ SUCCESS' : '❌ FAILED'}`);
  });
}
