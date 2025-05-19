#!/usr/bin/env node

/**
 * Very simple security check for Cloudflare integration
 */
const fs = require('fs');
const path = require('path');

console.log('Running Cloudflare security check...');

// Check if files exist
try {
  const securityEnhancementsContent = fs.readFileSync(
    path.join(__dirname, 'securityEnhancements.ts'), 
    'utf8'
  );
  
  console.log('Found securityEnhancements.ts');
  
  // Check for key security features
  if (securityEnhancementsContent.includes('setupSessionTimeout')) {
    console.log('✓ Session timeout feature implemented');
  }
  
  if (securityEnhancementsContent.includes('recordFailedAuthAttempt')) {
    console.log('✓ Authentication rate limiting implemented');
  }
  
  if (securityEnhancementsContent.includes('enhancedEncrypt')) {
    console.log('✓ Enhanced encryption implemented');
  }
  
  // Read secure credentials file
  const secureCredentialsContent = fs.readFileSync(
    path.join(__dirname, 'secureCredentials.ts'), 
    'utf8'
  );
  
  console.log('Found secureCredentials.ts');
  
  // Check for integration with security enhancements
  if (secureCredentialsContent.includes('setupSessionTimeout') &&
      secureCredentialsContent.includes('checkSessionTimeout')) {
    console.log('✓ Session timeout integrated with credential system');
  }
  
  if (secureCredentialsContent.includes('recordFailedAuthAttempt')) {
    console.log('✓ Rate limiting integrated with authentication');
  }
  
  // Check encryption quality
  const encryptionContent = fs.readFileSync(
    path.join(__dirname, 'simpleEncryption.ts'), 
    'utf8'
  );
  
  console.log('Found simpleEncryption.ts');
  
  if (encryptionContent.includes('AES-GCM')) {
    console.log('✓ Using AES-GCM for authenticated encryption');
  }
  
  // Extract iteration count
  const iterationMatch = encryptionContent.match(/iterations:\s*(\d+)/);
  if (iterationMatch && parseInt(iterationMatch[1]) >= 10000) {
    console.log(`✓ Using strong PBKDF2 with ${iterationMatch[1]} iterations`);
  }
  
  console.log('\nSecurity check completed.');
  
} catch (err) {
  console.error('Error during security check:', err);
}
