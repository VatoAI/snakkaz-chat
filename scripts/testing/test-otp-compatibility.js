/**
 * OTP Compatibility Test Script
 * 
 * This script tests the functionality of the OTPAuth library replacement
 * for the deprecated speakeasy library that was causing browser errors.
 * 
 * Created: May 23, 2025
 */

import * as OTPAuth from 'otpauth';

// Test 1: Generate a random secret
function testSecretGeneration() {
  console.log('🔹 Test 1: Secret Generation');
  
  try {
    // Generate a random secret key in hex format
    const hexString = Array.from(
      { length: 32 }, 
      () => Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    // Create OTP Secret
    const secret = OTPAuth.Secret.fromHex(hexString);
    
    // Convert to different formats for display
    console.log('✅ Secret generated successfully!');
    console.log(`  - Base32: ${secret.base32}`);
    console.log(`  - Hex: ${secret.hex}`);
    
    return secret;
  } catch (error) {
    console.error('❌ Error generating secret:', error);
    return null;
  }
}

// Test 2: Create TOTP object and generate a token
function testTOTPGeneration(secret) {
  console.log('\n🔹 Test 2: TOTP Generation');
  
  try {
    if (!secret) {
      console.error('❌ No secret provided for TOTP generation');
      return null;
    }
    
    // Create a TOTP object
    const totp = new OTPAuth.TOTP({
      issuer: 'Snakkaz Chat',
      label: 'test@example.com',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret
    });
    
    // Generate a token
    const token = totp.generate();
    
    console.log('✅ TOTP token generated successfully!');
    console.log(`  - Current token: ${token}`);
    console.log(`  - URI: ${totp.toString()}`);
    
    return { totp, token };
  } catch (error) {
    console.error('❌ Error generating TOTP:', error);
    return null;
  }
}

// Test 3: Verify a token
function testVerification(totp, token) {
  console.log('\n🔹 Test 3: Token Verification');
  
  try {
    if (!totp || !token) {
      console.error('❌ No TOTP or token provided for verification');
      return false;
    }
    
    // Verify the token
    const isValid = totp.validate({ token, timestamp: Date.now(), window: 0 }) !== null;
    
    if (isValid) {
      console.log('✅ Token verification successful!');
    } else {
      console.log('❌ Token verification failed!');
    }
    
    // Test with wrong token
    const wrongToken = '000000';
    const isInvalidValid = totp.validate({ token: wrongToken, timestamp: Date.now(), window: 0 }) !== null;
    
    if (!isInvalidValid) {
      console.log('✅ Invalid token correctly rejected!');
    } else {
      console.log('❌ Error: Invalid token was accepted!');
    }
    
    return isValid;
  } catch (error) {
    console.error('❌ Error verifying token:', error);
    return false;
  }
}

// Run all tests
function runAllTests() {
  console.log('📱 RUNNING OTPAUTH LIBRARY TESTS');
  console.log('===============================\n');
  
  // Test 1: Generate secret
  const secret = testSecretGeneration();
  
  // Test 2: Generate TOTP
  const { totp, token } = testTOTPGeneration(secret) || {};
  
  // Test 3: Verify token
  const isVerified = testVerification(totp, token);
  
  // Summary
  console.log('\n📋 TEST SUMMARY');
  console.log('===============');
  console.log(`Secret Generation: ${secret ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`TOTP Generation: ${totp && token ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Token Verification: ${isVerified ? '✅ PASSED' : '❌ FAILED'}`);
  
  const allPassed = secret && totp && token && isVerified;
  console.log(`\nOverall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  console.log('\nThe browser-compatible OTP implementation should now work correctly!');
}

// Export for use in other scripts
export { runAllTests, testSecretGeneration, testTOTPGeneration, testVerification };

// Instructions for running the test
console.log(`
OTP COMPATIBILITY TEST
=====================

This file tests the browser-compatible OTPAuth library implementation
that replaces the Node.js specific speakeasy library.

To run this test:
1. Ensure the development server is running
2. Open the browser console
3. Import this module:
   import { runAllTests } from './test-otp-compatibility.js'
4. Run the tests:
   runAllTests()

If all tests pass, the 2FA implementation should work
correctly without the "util.deprecate is not a function" error.
`);
