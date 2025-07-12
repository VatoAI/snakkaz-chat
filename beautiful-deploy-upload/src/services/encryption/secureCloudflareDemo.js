/**
 * Cloudflare Secure API Demo
 * 
 * This script showcases how to set up and test the secure Cloudflare
 * API integration with encrypted credentials storage.
 */

import { cfTools } from './cloudflareManagement';

/**
 * Set up the Cloudflare secure API credentials
 */
export async function setupCloudflareApi() {
  console.log('Setting up secure Cloudflare API access...');
  
  // Perform initial setup
  await cfTools.testConnection();
  
  // Show the current configuration
  await cfTools.showConfig();
  
  // List the available commands
  cfTools.help();
  
  console.log('Secure setup complete! You can now use cfTools to manage Cloudflare.');
}

/**
 * Run a simple test of the Cloudflare API
 */
export async function testCloudflareApi() {
  console.log('Testing Cloudflare API with secure credentials...');
  
  try {
    // List DNS records
    await cfTools.listDnsRecords();
    
    // Display status
    console.log('API test completed successfully.');
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Export for easy browser console use
window.setupCloudflareApi = setupCloudflareApi;
window.testCloudflareApi = testCloudflareApi;
window.cfTools = cfTools;

// Welcome message 
console.log('%c Cloudflare Secure API Demo ', 'background: #f6821f; color: white; font-size: 16px; padding: 5px;');
console.log('Functions available:');
console.log('- setupCloudflareApi() - Set up secure API access');
console.log('- testCloudflareApi() - Test the API');
console.log('- cfTools - Direct access to the API management tools');
