/**
 * Cloudflare Management Tool
 * 
 * This utility provides browser-console friendly functions for managing Cloudflare
 * integration with snakkaz.com. It can be used to perform common operations like
 * purging cache, checking zone status, and testing connectivity.
 * 
 * NOTE: You'll need to create an API token in the Cloudflare dashboard with appropriate
 * permissions before using these functions.
 */

import { CLOUDFLARE_CONFIG, isCloudflareConfigured } from './cloudflareConfig';
import * as CloudflareApi from './cloudflareApi';
import { checkCloudflareStatus } from './systemHealthCheck';

// Storage key for API token (will be stored in sessionStorage for the duration of the session)
const API_TOKEN_STORAGE_KEY = 'cf_api_token_temp';

/**
 * Get the stored API token or ask for a new one
 */
function getApiToken(): string | null {
  // Check session storage first
  const storedToken = sessionStorage.getItem(API_TOKEN_STORAGE_KEY);
  if (storedToken) {
    return storedToken;
  }
  
  // If no token in storage, ask for it
  const token = prompt('Please enter your Cloudflare API token:');
  if (token) {
    // Store token in session storage (will be cleared when browser session ends)
    sessionStorage.setItem(API_TOKEN_STORAGE_KEY, token);
    return token;
  }
  
  return null;
}

/**
 * Clear the stored API token
 */
export function clearApiToken(): void {
  sessionStorage.removeItem(API_TOKEN_STORAGE_KEY);
  console.log('API token cleared from session storage');
}

/**
 * Validate the current API token
 */
export async function validateToken(): Promise<boolean> {
  const token = getApiToken();
  if (!token) {
    console.error('No API token provided');
    return false;
  }
  
  console.log('Validating API token...');
  const isValid = await CloudflareApi.validateApiToken(token);
  
  if (isValid) {
    console.log('✅ API token is valid');
  } else {
    console.error('❌ API token is invalid or has insufficient permissions');
    clearApiToken(); // Clear invalid token
  }
  
  return isValid;
}

/**
 * Test Cloudflare connection and show zone details
 */
export async function testConnection(): Promise<void> {
  // First check if Cloudflare DNS is active
  const dnsStatus = await checkCloudflareStatus();
  
  if (!dnsStatus.success) {
    console.error('❌ Cloudflare DNS is not active for snakkaz.com');
    console.log('Details:', dnsStatus.details);
    return;
  }
  
  console.log('✅ Cloudflare DNS is active for snakkaz.com');
  
  // Then check API connectivity if configured
  if (!isCloudflareConfigured()) {
    console.error('❌ Cloudflare API is not configured');
    return;
  }
  
  const token = getApiToken();
  if (!token) {
    console.error('❌ No API token provided');
    return;
  }
  
  // Validate token first
  const isValid = await validateToken();
  if (!isValid) return;
  
  // Get zone details
  console.log('Fetching zone details...');
  const zoneDetails = await CloudflareApi.getZoneDetails(token);
  
  if (zoneDetails.success) {
    console.log('✅ Connected to Cloudflare API successfully');
    console.log('Zone details:', zoneDetails.result);
  } else {
    console.error('❌ Failed to connect to Cloudflare API');
    console.error('Errors:', zoneDetails.errors);
  }
}

/**
 * Purge entire cache for snakkaz.com
 */
export async function purgeCache(): Promise<void> {
  const token = getApiToken();
  if (!token) {
    console.error('❌ No API token provided');
    return;
  }
  
  // Validate token first
  const isValid = await validateToken();
  if (!isValid) return;
  
  console.log('Purging Cloudflare cache for snakkaz.com...');
  const result = await CloudflareApi.purgeEverything(token);
  
  if (result.success) {
    console.log('✅ Cache purged successfully');
  } else {
    console.error('❌ Failed to purge cache');
    console.error('Errors:', result.errors);
  }
}

/**
 * Get DNS records for snakkaz.com
 */
export async function listDnsRecords(): Promise<void> {
  const token = getApiToken();
  if (!token) {
    console.error('❌ No API token provided');
    return;
  }
  
  // Validate token first
  const isValid = await validateToken();
  if (!isValid) return;
  
  console.log('Fetching DNS records for snakkaz.com...');
  const result = await CloudflareApi.getDnsRecords(token);
  
  if (result.success) {
    console.log('✅ DNS records retrieved successfully');
    console.table(result.result.map((record: any) => ({
      name: record.name,
      type: record.type,
      content: record.content,
      proxied: record.proxied
    })));
  } else {
    console.error('❌ Failed to retrieve DNS records');
    console.error('Errors:', result.errors);
  }
}

/**
 * Show configuration info
 */
export function showConfig(): void {
  console.log('Cloudflare Configuration:');
  console.log('- Zone ID:', CLOUDFLARE_CONFIG.zoneId);
  console.log('- Account ID:', CLOUDFLARE_CONFIG.accountId);
  console.log('- Zone Name:', CLOUDFLARE_CONFIG.zoneName);
  console.log('- API Token:', sessionStorage.getItem(API_TOKEN_STORAGE_KEY) ? '(stored in session)' : '(not set)');
}

/**
 * Help text for available commands
 */
export function help(): void {
  console.log('%c Cloudflare Management Tool ', 'background: #f6821f; color: white; font-size: 16px; padding: 5px;');
  console.log('\nAvailable commands:');
  console.log('- validateToken() - Validate your Cloudflare API token');
  console.log('- testConnection() - Test Cloudflare connectivity and get zone details');
  console.log('- purgeCache() - Purge the entire cache for snakkaz.com');
  console.log('- listDnsRecords() - List all DNS records for snakkaz.com');
  console.log('- showConfig() - Show current Cloudflare configuration');
  console.log('- clearApiToken() - Clear the stored API token');
  console.log('- help() - Show this help text');
}

// Show help text when module is imported
console.log('%c Cloudflare Management Tool Loaded ', 'background: #f6821f; color: white; font-size: 14px; padding: 5px;');
console.log('Type cfTools.help() for available commands');

// Export as a named object for easier console usage
export const cfTools = {
  validateToken,
  testConnection,
  purgeCache,
  listDnsRecords,
  showConfig,
  clearApiToken,
  help
};
