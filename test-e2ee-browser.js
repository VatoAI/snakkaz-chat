/**
 * Browser E2EE Test
 * 
 * Run this in the browser console to test the E2EE functionality
 */

console.log('🔒 Testing E2EE functionality in browser...');

async function testE2EEInBrowser() {
  try {
    // Test if crypto API is available
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('Web Crypto API not available');
    }
    console.log('✅ Web Crypto API available');

    // Test basic AES-GCM encryption/decryption
    console.log('🔑 Testing basic AES-GCM encryption...');
    
    const testMessage = 'Hello, E2EE World! 🔒';
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    // Generate key
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
    console.log('✅ Generated AES-GCM key');
    
    // Generate IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    console.log('✅ Generated IV');
    
    // Encrypt
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encoder.encode(testMessage)
    );
    console.log('✅ Message encrypted');
    
    // Decrypt
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encrypted
    );
    
    const decryptedText = decoder.decode(decrypted);
    console.log('✅ Message decrypted:', decryptedText);
    
    if (decryptedText === testMessage) {
      console.log('✅ E2EE test PASSED - Basic encryption/decryption working');
      return true;
    } else {
      console.log('❌ E2EE test FAILED - Decrypted text does not match');
      return false;
    }
    
  } catch (error) {
    console.error('❌ E2EE test FAILED:', error);
    return false;
  }
}

// Run the test
testE2EEInBrowser().then(success => {
  console.log(success ? '🎉 All E2EE tests passed!' : '💥 E2EE tests failed!');
});
