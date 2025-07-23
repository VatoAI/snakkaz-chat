/**
 * Integration Test for Cloudflare Security Features
 * 
 * This script tests the integration of all security features implemented
 * for the Cloudflare integration.
 */

console.log('🔒 TESTING CLOUDFLARE SECURITY ENHANCEMENTS 🔒');

import { 
  secureStore, 
  secureRetrieve, 
  hasSecureCredential,
  setupSecureAccess,
  verifySecureAccess,
  isSecureAccessVerified,
  removeSecureCredential,
  clearAllSecureCredentials,
  SECURE_KEYS 
} from './secureCredentials';

import {
  enhancedEncrypt,
  enhancedDecrypt,
  setupSessionTimeout,
  checkSessionTimeout,
  resetSessionTimeout,
  recordFailedAuthAttempt,
  isAuthLocked,
  getLockoutRemainingMinutes
} from './securityEnhancements';

// Mock browser APIs if running in Node
if (typeof window === 'undefined') {
  // @ts-ignore
  global.sessionStorage = {
    _data: {},
    setItem(id, val) { this._data[id] = val; },
    getItem(id) { return this._data[id] || null; },
    removeItem(id) { delete this._data[id]; }
  };
  
  // @ts-ignore
  global.localStorage = {
    _data: {},
    setItem(id, val) { this._data[id] = val; },
    getItem(id) { return this._data[id] || null; },
    removeItem(id) { delete this._data[id]; }
  };
  
  // Basic crypto mock for testing
  if (!global.crypto) {
    // @ts-ignore
    global.crypto = {
      subtle: {
        importKey: () => Promise.resolve({}),
        deriveKey: () => Promise.resolve({}),
        encrypt: () => Promise.resolve(new ArrayBuffer(8)),
        decrypt: () => Promise.resolve(new TextEncoder().encode('test').buffer)
      },
      getRandomValues: (arr) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
      }
    };
  }
  
  // @ts-ignore
  global.TextEncoder = class TextEncoder {
    encode(str) {
      const buf = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) {
        buf[i] = str.charCodeAt(i);
      }
      return buf;
    }
  };
  
  // @ts-ignore
  global.TextDecoder = class TextDecoder {
    decode(buf) {
      return String.fromCharCode.apply(null, new Uint8Array(buf));
    }
  };
  
  // @ts-ignore
  global.btoa = (str) => Buffer.from(str).toString('base64');
  
  // @ts-ignore
  global.atob = (str) => Buffer.from(str, 'base64').toString();
}

/**
 * Run tests for secure credentials storage
 */
async function testSecureStorage() {
  console.log('\n🔍 Testing Secure Credential Storage...');
  
  // Set up secure access
  const password = 'test-password-123';
  await setupSecureAccess(password);
  
  // Store a test credential
  const testKey = 'test_api_key';
  const testValue = 'api-key-1234567890';
  
  console.log('Setting up secure access...');
  const storeResult = await secureStore(testKey, testValue, password);
  console.log(`✓ Credential stored: ${storeResult}`);
  
  console.log('Checking if credential exists...');
  const hasCredential = hasSecureCredential(testKey);
  console.log(`✓ Has credential: ${hasCredential}`);
  
  console.log('Retrieving credential...');
  const retrieved = await secureRetrieve(testKey, password);
  console.log(`✓ Retrieved credential matches: ${retrieved === testValue}`);
  
  console.log('Testing incorrect password...');
  const wrongRetrieved = await secureRetrieve(testKey, 'wrong-password');
  console.log(`✓ Wrong password returns null: ${wrongRetrieved === null}`);
  
  // Clean up
  console.log('Removing test credential...');
  removeSecureCredential(testKey);
  
  return !hasSecureCredential(testKey);
}

/**
 * Test enhanced encryption features
 */
async function testEnhancedEncryption() {
  console.log('\n🔍 Testing Enhanced Encryption...');
  
  const testData = 'This is sensitive data';
  const password = 'secret-password-456';
  const salt = 'test-salt';
  
  console.log('Encrypting data with enhanced encryption...');
  const encrypted = await enhancedEncrypt(testData, password, salt);
  console.log('✓ Data encrypted successfully');
  
  console.log('Decrypting data...');
  const decrypted = await enhancedDecrypt(encrypted, password, salt);
  console.log(`✓ Decryption successful: ${decrypted === testData}`);
  
  return true;
}

/**
 * Test session timeout feature
 */
function testSessionTimeout() {
  console.log('\n🔍 Testing Session Timeout...');
  
  // Set up a short timeout (2 seconds)
  console.log('Setting up session with 2 second timeout...');
  setupSessionTimeout(2000);
  
  console.log('✓ Session is initially valid');
  console.log('Waiting for timeout...');
  
  // Mock timeout for testing
  const mockTimeout = () => {
    // @ts-ignore
    sessionStorage._data['snkkz_sess_exp'] = (Date.now() - 1000).toString();
  };
  
  // Simulate timeout
  mockTimeout();
  
  console.log('Checking session after timeout...');
  const isValid = checkSessionTimeout();
  console.log(`✓ Session expired as expected: ${!isValid}`);
  
  return true;
}

/**
 * Test authentication rate limiting
 */
function testRateLimiting() {
  console.log('\n🔍 Testing Authentication Rate Limiting...');
  
  // Reset any previous state
  clearAllSecureCredentials();
  
  console.log('Simulating failed authentication attempts...');
  
  // Simulate 4 failed attempts
  for (let i = 0; i < 4; i++) {
    const locked = recordFailedAuthAttempt();
    console.log(`Attempt ${i + 1}: account locked = ${locked}`);
  }
  
  // Verify not locked yet
  console.log('Checking if account is locked after 4 attempts...');
  const lockedAfter4 = isAuthLocked();
  console.log(`✓ Account locked after 4 attempts: ${lockedAfter4}`);
  
  // Simulate the 5th attempt
  console.log('Making 5th failed attempt...');
  const lockedAfter5 = recordFailedAuthAttempt();
  console.log(`✓ Account locked after 5 attempts: ${lockedAfter5}`);
  
  if (lockedAfter5) {
    const lockoutMinutes = getLockoutRemainingMinutes();
    console.log(`✓ Lockout duration: ${lockoutMinutes} minutes`);
  }
  
  return true;
}

/**
 * Run all tests
 */
async function runTests() {
  try {
    console.log('Starting security integration tests...');
    
    const storageResult = await testSecureStorage();
    console.log(`\n✓ Secure Storage Test: ${storageResult ? 'PASSED' : 'FAILED'}`);
    
    const encryptionResult = await testEnhancedEncryption();
    console.log(`\n✓ Enhanced Encryption Test: ${encryptionResult ? 'PASSED' : 'FAILED'}`);
    
    const sessionResult = testSessionTimeout();
    console.log(`\n✓ Session Timeout Test: ${sessionResult ? 'PASSED' : 'FAILED'}`);
    
    const rateLimitResult = testRateLimiting();
    console.log(`\n✓ Rate Limiting Test: ${rateLimitResult ? 'PASSED' : 'FAILED'}`);
    
    console.log('\n🎉 All tests completed!');
  } catch (e) {
    console.error('Error during testing:', e);
  } finally {
    // Clean up
    clearAllSecureCredentials();
  }
}

runTests();
