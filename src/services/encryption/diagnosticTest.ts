/**
 * Comprehensive Diagnostic Test for Snakkaz Chat
 * 
 * This file provides various tests to diagnose and fix issues with:
 * - End-to-end encryption
 * - API connections to Supabase
 * - Content Security Policy issues
 */

import * as GroupE2EE from '../../utils/encryption/group-e2ee';
import { storeKey, retrieveKey } from './keyStorageService';
import { testConnection } from './supabasePatch';
import { checkContentSecurityPolicy, testSupabaseConnection } from './corsTest';
import { testCsp, testContentSecurityPolicy as testCspConfiguration } from './cspConfig';

/**
 * Run a comprehensive diagnostic test on all systems
 */
export async function runDiagnosticTest() {
  console.log('===================================');
  console.log('SNAKKAZ CHAT DIAGNOSTIC TEST');
  console.log('===================================');
  
  const results = {
    e2ee: await testE2EE(),
    connection: await testConnections(),
    browser: await testBrowserCompatibility(),
    csp: testContentSecurityPolicy()
  };
  
  console.log('===================================');
  console.log('DIAGNOSTIC SUMMARY:');
  console.log('===================================');
  console.log('E2EE:', results.e2ee.success ? '✅ PASSED' : '❌ FAILED');
  console.log('API Connections:', results.connection.success ? '✅ PASSED' : '❌ FAILED');
  console.log('Browser Compatibility:', results.browser.success ? '✅ PASSED' : '❌ FAILED');
  console.log('Content Security Policy:', results.csp.success ? '✅ PASSED' : '❌ FAILED');
  console.log('===================================');
  
  if (!results.e2ee.success || !results.connection.success || !results.browser.success || !results.csp.success) {
    console.log('RECOMMENDATIONS:');
    if (!results.e2ee.success) {
      console.log('- Check the encryption implementation and key management');
    }
    if (!results.connection.success) {
      console.log('- Update Supabase client configuration using the supabasePatch.ts file');
      console.log('- Verify that CORS is properly configured in your Supabase project settings');
      console.log('- Check network requests in your browser console for specific errors');
    }
    if (!results.browser.success) {
      console.log('- Ensure the browser supports required features like SubtleCrypto, IndexedDB, and LocalStorage');
      console.log('- Update the browser to the latest version');
    }
    if (!results.csp.success) {
      console.log('- Apply the CSP configuration from cspConfig.ts to your application');
      console.log('- Add the necessary domains to your CSP policy');
    }
    console.log('===================================');
  }
  
  return results;
}

/**
 * Test E2EE functionality
 */
async function testE2EE() {
  console.log('\n[TESTING E2EE]');
  try {
    console.log('Generating test group and keys...');
    const groupId = 'test-group-' + Date.now();
    const userId = 'test-user-' + Date.now();
    
    // Test key generation
    const { key, groupKey } = await GroupE2EE.generateGroupKey(groupId, userId);
    console.log('✅ Generated group key with ID:', groupKey.keyId);
    
    // Test key storage
    await storeKey(groupKey.keyId, key);
    const retrievedKey = await retrieveKey(groupKey.keyId);
    console.log('✅ Key storage and retrieval working:', !!retrievedKey);
    
    // Test message encryption/decryption
    const testMessage = 'This is a secure test message! 🔒';
    const { encryptedData, iv } = await GroupE2EE.encryptGroupMessage(testMessage, key);
    console.log('✅ Message encrypted:', encryptedData.substring(0, 20) + '...');
    
    const decryptedMessage = await GroupE2EE.decryptGroupMessage(encryptedData, iv, key);
    const decryptionSuccess = decryptedMessage === testMessage;
    console.log(decryptionSuccess ? '✅ Decryption successful' : '❌ Decryption failed');
    
    return { 
      success: decryptionSuccess, 
      key: groupKey.keyId,
      details: { keyGeneration: true, storage: !!retrievedKey, decryption: decryptionSuccess }
    };
  } catch (error) {
    console.error('❌ E2EE test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Test API connections
 */
async function testConnections() {
  console.log('\n[TESTING API CONNECTIONS]');
  
  try {
    // Test connection to Supabase
    const connResult = await testConnection();
    console.log(connResult.success ? '✅ Basic connection test passed' : '❌ Basic connection test failed');
    
    // Detailed API tests
    const apiTests = await testSupabaseConnection();
    
    return { 
      success: connResult.success && apiTests.success,
      details: {
        basic: connResult,
        api: apiTests
      }
    };
  } catch (error) {
    console.error('❌ Connection tests failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Test Content Security Policy
 */
function testContentSecurityPolicy() {
  console.log('\n[TESTING CONTENT SECURITY POLICY]');
  
  try {
    // Check current CSP
    const currentCsp = checkContentSecurityPolicy();
    console.log(currentCsp.success ? 
      '✅ Current CSP allows required connections' : 
      '❌ Current CSP may block required connections'
    );
    
    // Test recommended CSP
    const recommendedCsp = testCsp();
    console.log('ℹ️ Recommended allowed domains:', recommendedCsp.allowedDomains);
    
    // Use the new CSP test from cspConfig
    const cspTest = testCspConfiguration();
    
    return {
      success: currentCsp.success && cspTest.success,
      current: currentCsp,
      recommended: recommendedCsp,
      details: cspTest
    };
  } catch (error) {
    console.error('❌ CSP test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Test browser compatibility and features
 */
async function testBrowserCompatibility() {
  console.log('\nRunning browser compatibility tests...');
  
  const results = {
    success: true,
    issues: [],
    supportedFeatures: [],
    unsupportedFeatures: []
  };
  
  // Sjekk om vi er i en browser
  if (typeof window === 'undefined') {
    return { 
      success: false, 
      issues: ['Not running in browser environment'],
      supportedFeatures: [],
      unsupportedFeatures: ['all - not in browser']
    };
  }
  
  // Test SubtleCrypto API
  try {
    if (window.crypto && window.crypto.subtle) {
      results.supportedFeatures.push('SubtleCrypto API');
      
      // Test actual encryption
      try {
        const testData = new Uint8Array([1, 2, 3, 4]);
        const testKey = await window.crypto.subtle.generateKey(
          { name: 'AES-GCM', length: 256 },
          true,
          ['encrypt', 'decrypt']
        );
        
        await window.crypto.subtle.encrypt(
          { name: 'AES-GCM', iv: window.crypto.getRandomValues(new Uint8Array(12)) },
          testKey,
          testData
        );
        
        results.supportedFeatures.push('AES-GCM encryption');
      } catch (e) {
        results.unsupportedFeatures.push('AES-GCM encryption');
        results.issues.push(`Crypto API available but encryption failed: ${e.message}`);
        results.success = false;
      }
    } else {
      results.unsupportedFeatures.push('SubtleCrypto API');
      results.issues.push('Web Cryptography API not supported');
      results.success = false;
    }
  } catch (e) {
    results.unsupportedFeatures.push('SubtleCrypto API');
    results.issues.push(`Error testing crypto: ${e.message}`);
    results.success = false;
  }
  
  // Test IndexedDB
  try {
    if (window.indexedDB) {
      results.supportedFeatures.push('IndexedDB');
      
      // Test actual access
      try {
        const request = window.indexedDB.open('diagnostic_test', 1);
        request.onerror = () => {
          results.unsupportedFeatures.push('IndexedDB access');
          results.issues.push('IndexedDB API available but access denied');
          results.success = false;
        };
      } catch (e) {
        results.unsupportedFeatures.push('IndexedDB access');
        results.issues.push(`IndexedDB error: ${e.message}`);
        results.success = false;
      }
    } else {
      results.unsupportedFeatures.push('IndexedDB');
      results.issues.push('IndexedDB not supported');
      results.success = false;
    }
  } catch (e) {
    results.unsupportedFeatures.push('IndexedDB');
    results.issues.push(`Error testing IndexedDB: ${e.message}`);
    results.success = false;
  }
  
  // Test LocalStorage
  try {
    if (window.localStorage) {
      results.supportedFeatures.push('LocalStorage');
      
      try {
        window.localStorage.setItem('test', 'test');
        window.localStorage.removeItem('test');
      } catch (e) {
        results.unsupportedFeatures.push('LocalStorage access');
        results.issues.push('LocalStorage API available but access denied');
        results.success = false;
      }
    } else {
      results.unsupportedFeatures.push('LocalStorage');
      results.issues.push('LocalStorage not supported');
      results.success = false;
    }
  } catch (e) {
    results.unsupportedFeatures.push('LocalStorage');
    results.issues.push(`Error testing LocalStorage: ${e.message}`);
    results.success = false;
  }
  
  // Test for ES6+ features
  try {
    new Promise(() => {});
    results.supportedFeatures.push('ES6 Promises');
  } catch (e) {
    results.unsupportedFeatures.push('ES6 Promises');
    results.issues.push('ES6 Promises not supported');
    results.success = false;
  }
  
  // Log browser info
  console.log('Browser features:');
  console.log('- Supported:', results.supportedFeatures.join(', '));
  
  if (results.unsupportedFeatures.length > 0) {
    console.log('- Unsupported:', results.unsupportedFeatures.join(', '));
  }
  
  if (results.issues.length > 0) {
    console.log('Browser issues:');
    results.issues.forEach(issue => console.log(`- ${issue}`));
  }
  
  return results;
}

// Export individual tests
export { testE2EE, testConnections, testContentSecurityPolicy, testBrowserCompatibility };
