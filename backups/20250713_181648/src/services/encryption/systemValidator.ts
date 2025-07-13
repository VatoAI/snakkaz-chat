/**
 * Snakkaz System Validator
 * 
 * This script provides comprehensive validation of the Snakkaz Chat system,
 * focusing on DNS propagation, Cloudflare status, and feature health.
 * 
 * Run this script periodically to monitor the status of your system,
 * especially during the DNS propagation period.
 */

import { 
  checkHealth, 
  checkCloudflareDnsStatus, 
  verifyCspConfiguration, 
  checkSriRemoval 
} from './systemHealthCheck';

import { loadCloudflareAnalytics } from './analyticsLoader';

/**
 * Run a visualization of the current system status
 */
export async function visualizeSystemStatus() {
  console.clear();
  console.log('%c SNAKKAZ SYSTEM STATUS ', 'background: #4285f4; color: white; font-size: 20px; padding: 10px;');
  console.log('%c Running system validation... ', 'color: #4285f4; font-size: 14px;');
  
  try {
    // First check Cloudflare DNS status
    const cfStatus = await checkCloudflareDnsStatus();
    
    // Then run full health check
    const healthStatus = await checkHealth();
    
    // Output summarized status with timestamps
    console.log('\n%c STATUS SUMMARY ', 'background: #0f9d58; color: white; font-size: 16px; padding: 5px;');
    console.log(`Timestamp: ${new Date().toLocaleString()}`);
    console.log(`Overall Health: ${healthStatus.healthy ? '✅ HEALTHY' : '⚠️ ISSUES DETECTED'}`);
    console.log(`Cloudflare DNS: ${cfStatus.success ? '✅ ACTIVE' : '⏳ PROPAGATING'}`);
    console.log(`CSP Config: ${healthStatus.details.csp ? '✅ OK' : '❌ ERROR'}`);
    console.log(`SRI Handling: ${healthStatus.details.sri ? '✅ OK' : '❌ ERROR'}`);
    console.log(`Meta Tags: ${healthStatus.details.metaTags ? '✅ OK' : '❌ ERROR'}`);
    console.log(`Ping Blocking: ${healthStatus.details.pingBlocking ? '✅ OK' : '❌ ERROR'}`);
    console.log(`CF Analytics: ${healthStatus.details.cloudflareAnalytics ? '✅ LOADED' : '⏳ WAITING'}`);
    
    // Provide recommendations
    console.log('\n%c RECOMMENDATIONS ', 'background: #f4b400; color: black; font-size: 16px; padding: 5px;');
    
    if (!cfStatus.success) {
      console.log('• DNS propagation is still in progress. This typically takes 24-48 hours from configuration time.');
      console.log('• Try running this check again in a few hours.');
    } else {
      console.log('• Cloudflare DNS is active! Your site is now being served through Cloudflare.');
      if (!healthStatus.details.cloudflareAnalytics) {
        console.log('• Cloudflare Analytics is not loading. Try running loadCloudflareAnalytics() to force a reload.');
      }
    }
    
    // If there are any issues, attempt fixes
    if (!healthStatus.healthy || !healthStatus.details.cloudflareAnalytics) {
      console.log('\n%c ATTEMPTING FIXES ', 'background: #db4437; color: white; font-size: 16px; padding: 5px;');
      
      if (!healthStatus.details.cloudflareAnalytics) {
        console.log('• Attempting to reload Cloudflare Analytics...');
        loadCloudflareAnalytics();
      }
    }
    
    return {
      timestamp: new Date().toISOString(),
      cloudflare: cfStatus,
      health: healthStatus
    };
  } catch (error) {
    console.error('Error during system validation:', error);
    return {
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
}

// Export easy-to-use alias
export const validateSystem = visualizeSystemStatus;

// Provide help info in console when imported
console.log(
  '%c SNAKKAZ SYSTEM VALIDATOR LOADED ',
  'background: #4285f4; color: white; font-size: 14px; padding: 5px;'
);
console.log(
  'Use validateSystem() to run a comprehensive validation of your Snakkaz Chat system'
);
