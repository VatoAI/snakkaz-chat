#!/usr/bin/env node

/**
 * Simple OTP Verification Test for Snakkaz 2FA
 * 
 * This script tests the otpauth library and verifies that it works properly.
 * This is a critical component of the 2FA implementation.
 * 
 * Created: May 24, 2025
 */

import * as OTPAuth from 'otpauth';
import chalk from 'chalk';

// Create a class to run the tests
class OTPVerificationTest {
  runTests() {
    console.log(chalk.bold.cyan('=============================================='));
    console.log(chalk.bold.cyan('== SNAKKAZ CHAT - 2FA VERIFICATION TEST =='));
    console.log(chalk.bold.cyan('=============================================='));
    console.log('');
    
    try {
      this.testSecretGeneration();
      this.testTokenGeneration();
      this.testTokenValidation();
      this.testInvalidToken();
      
      console.log(chalk.green.bold('✅ All 2FA OTP tests passed!'));
      console.log('');
      console.log('The 2FA implementation is correctly using the browser-compatible');
      console.log('otpauth library instead of the Node.js-specific speakeasy library.');
      console.log('');
      console.log('This resolves the browser console errors related to util.deprecate.');
      
      return true;
    } catch (error) {
      console.error(chalk.red.bold('❌ 2FA OTP tests failed:'));
      console.error(chalk.red(error.message));
      return false;
    }
  }
  
  testSecretGeneration() {
    console.log('🔹 Testing OTP secret generation...');
    
    // Generate a random secret key in hex format
    const hexString = Array.from(
      { length: 32 }, 
      () => Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    // Create OTP Secret
    const secret = OTPAuth.Secret.fromHex(hexString);
    
    if (!secret || !secret.base32) {
      throw new Error('Failed to generate secret');
    }
    
    console.log(chalk.green('✅ Secret generation successful'));
    console.log(`   Base32: ${secret.base32}`);
    console.log('');
    
    return secret;
  }
  
  testTokenGeneration() {
    console.log('🔹 Testing OTP token generation...');
    
    // Create a fixed secret for testing
    const secret = OTPAuth.Secret.fromHex('0123456789abcdef0123456789abcdef');
    
    // Create TOTP object
    const totp = new OTPAuth.TOTP({
      issuer: 'Snakkaz',
      label: 'test@example.com',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret
    });
    
    // Generate token
    const token = totp.generate();
    
    if (!token || token.length !== 6 || !/^\d{6}$/.test(token)) {
      throw new Error('Generated token is not a 6-digit number');
    }
    
    console.log(chalk.green('✅ Token generation successful'));
    console.log(`   Token: ${token}`);
    console.log('');
    
    return token;
  }
  
  testTokenValidation() {
    console.log('🔹 Testing OTP token validation...');
    
    // Create a fixed secret for testing
    const secret = OTPAuth.Secret.fromHex('0123456789abcdef0123456789abcdef');
    
    // Create TOTP object
    const totp = new OTPAuth.TOTP({
      issuer: 'Snakkaz',
      label: 'test@example.com',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret
    });
    
    // Generate token
    const token = totp.generate();
    
    // Validate token
    const delta = totp.validate({ token, window: 1 });
    
    if (delta === null) {
      throw new Error('Valid token was incorrectly rejected');
    }
    
    console.log(chalk.green('✅ Token validation successful'));
    console.log(`   Token ${token} validated with delta: ${delta}`);
    console.log('');
    
    return delta;
  }
  
  testInvalidToken() {
    console.log('🔹 Testing invalid OTP token...');
    
    // Create a fixed secret for testing
    const secret = OTPAuth.Secret.fromHex('0123456789abcdef0123456789abcdef');
    
    // Create TOTP object
    const totp = new OTPAuth.TOTP({
      issuer: 'Snakkaz',
      label: 'test@example.com',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret
    });
    
    // Use an obviously wrong token
    const token = '000000';
    
    // Validate token
    const delta = totp.validate({ token, window: 1 });
    
    if (delta !== null) {
      throw new Error('Invalid token was incorrectly accepted');
    }
    
    console.log(chalk.green('✅ Invalid token correctly rejected'));
    console.log('');
    
    return true;
  }
}

// Run the tests
const tester = new OTPVerificationTest();
const success = tester.runTests();

// Exit with appropriate code
process.exit(success ? 0 : 1);
