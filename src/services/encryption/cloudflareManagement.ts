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

// Storage keys for API credentials (will be stored in sessionStorage for the duration of the session)
const API_TOKEN_STORAGE_KEY = 'cf_api_token_temp';
const API_KEY_STORAGE_KEY = 'cf_api_key_temp';
const API_EMAIL_STORAGE_KEY = 'cf_api_email_temp';
const AUTH_METHOD_STORAGE_KEY = 'cf_auth_method';

// Authentication methods
type AuthMethod = 'token' | 'key';

/**
 * Get the stored API token or ask for a new one
 */
function getApiToken(): string | null {
  // Check auth method
  const authMethod = sessionStorage.getItem(AUTH_METHOD_STORAGE_KEY) as AuthMethod || 'token';
  
  if (authMethod === 'key') {
    // Using API Key method
    const email = sessionStorage.getItem(API_EMAIL_STORAGE_KEY);
    const apiKey = sessionStorage.getItem(API_KEY_STORAGE_KEY);
    
    if (email && apiKey) {
      return JSON.stringify({ email, apiKey, method: 'key' });
    }
    
    // If no credentials in storage, ask for them
    const newEmail = prompt('Please enter your Cloudflare account email:');
    const newApiKey = prompt('Please enter your Cloudflare Global API Key:');
    
    if (newEmail && newApiKey) {
      sessionStorage.setItem(API_EMAIL_STORAGE_KEY, newEmail);
      sessionStorage.setItem(API_KEY_STORAGE_KEY, newApiKey);
      sessionStorage.setItem(AUTH_METHOD_STORAGE_KEY, 'key');
      return JSON.stringify({ email: newEmail, apiKey: newApiKey, method: 'key' });
    }
    
    return null;
  } else {
    // Using API Token method (default)
    // Check session storage first
    const storedToken = sessionStorage.getItem(API_TOKEN_STORAGE_KEY);
    if (storedToken) {
      return JSON.stringify({ token: storedToken, method: 'token' });
    }
    
    // If no token in storage, ask for it
    const newToken = prompt('Please enter your Cloudflare API token (account-owned token recommended):');
    if (newToken) {
      // Store token in session storage (will be cleared when browser session ends)
      sessionStorage.setItem(API_TOKEN_STORAGE_KEY, newToken);
      sessionStorage.setItem(AUTH_METHOD_STORAGE_KEY, 'token');
      return JSON.stringify({ token: newToken, method: 'token' });
    }
    
    return null;
  }
}

/**
 * Parse the auth info returned by getApiToken
 */
function parseAuthInfo(authInfo: string | null): { 
  headers: HeadersInit, 
  method: AuthMethod 
} | null {
  if (!authInfo) return null;
  
  try {
    const parsed = JSON.parse(authInfo);
    
    if (parsed.method === 'key') {
      return {
        headers: {
          'X-Auth-Email': parsed.email,
          'X-Auth-Key': parsed.apiKey,
          'Content-Type': 'application/json'
        },
        method: 'key'
      };
    } else {
      return {
        headers: {
          'Authorization': `Bearer ${parsed.token}`,
          'Content-Type': 'application/json'
        },
        method: 'token'
      };
    }
  } catch (e) {
    console.error('Failed to parse auth info:', e);
    return null;
  }
}

/**
 * Clear the stored API credentials
 */
export function clearApiCredentials(): void {
  sessionStorage.removeItem(API_TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(API_KEY_STORAGE_KEY);
  sessionStorage.removeItem(API_EMAIL_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_METHOD_STORAGE_KEY);
  console.log('API credentials cleared from session storage');
}

/**
 * Switch the authentication method
 */
export function switchAuthMethod(method: AuthMethod): void {
  sessionStorage.setItem(AUTH_METHOD_STORAGE_KEY, method);
  // Clear existing credentials
  sessionStorage.removeItem(method === 'token' ? API_TOKEN_STORAGE_KEY : API_KEY_STORAGE_KEY);
  console.log(`Switched to ${method === 'token' ? 'API Token' : 'Global API Key'} authentication method`);
}

/**
 * Validate the current API credentials
 */
export async function validateCredentials(): Promise<boolean> {
  const authInfo = getApiToken();
  if (!authInfo) {
    console.error('No API credentials provided');
    return false;
  }
  
  const auth = parseAuthInfo(authInfo);
  if (!auth) {
    console.error('Invalid API credentials format');
    return false;
  }
  
  console.log(`Validating Cloudflare ${auth.method === 'token' ? 'API Token' : 'API Key'}...`);
  
  try {
    // Make a simple request to verify the credentials
    const url = `${CLOUDFLARE_CONFIG.apiBaseUrl}/user/tokens/verify`;
    const response = await fetch(url, {
      method: 'GET',
      headers: auth.headers
    });
    
    const data = await response.json();
    const isValid = data.success === true;
    
    if (isValid) {
      console.log('✅ API credentials are valid');
    } else {
      console.error('❌ API credentials are invalid or have insufficient permissions');
      clearApiCredentials(); // Clear invalid credentials
    }
    
    return isValid;
  } catch (error) {
    console.error('Error validating API credentials:', error);
    return false;
  }
}

/**
 * Make an authenticated API request with current credentials
 */
async function makeRequest(url: string, options: RequestInit = {}): Promise<any> {
  const authInfo = getApiToken();
  if (!authInfo) {
    throw new Error('No API credentials provided');
  }
  
  const auth = parseAuthInfo(authInfo);
  if (!auth) {
    throw new Error('Invalid API credentials format');
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...auth.headers
    }
  });
  
  return response.json();
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
  
  // Validate credentials first
  const isValid = await validateCredentials();
  if (!isValid) return;
  
  // Get zone details
  console.log('Fetching zone details...');
  
  try {
    const zoneDetails = await makeRequest(
      `${CLOUDFLARE_CONFIG.apiBaseUrl}/zones/${CLOUDFLARE_CONFIG.zoneId}`,
      { method: 'GET' }
    );
    
    if (zoneDetails.success) {
      console.log('✅ Connected to Cloudflare API successfully');
      console.log('Zone details:', zoneDetails.result);
      
      // Show more info about the authentication method
      const authInfo = getApiToken();
      const auth = parseAuthInfo(authInfo);
      console.log(`Using ${auth?.method === 'token' ? 'API Token' : 'Global API Key'} authentication`);
    } else {
      console.error('❌ Failed to connect to Cloudflare API');
      console.error('Errors:', zoneDetails.errors);
    }
  } catch (error) {
    console.error('❌ Error connecting to Cloudflare API:', error);
  }
}

/**
 * Purge entire cache for snakkaz.com
 */
export async function purgeCache(): Promise<void> {
  // Validate credentials first
  const isValid = await validateCredentials();
  if (!isValid) return;
  
  console.log('Purging Cloudflare cache for snakkaz.com...');
  
  try {
    const result = await makeRequest(
      `${CLOUDFLARE_CONFIG.apiBaseUrl}/zones/${CLOUDFLARE_CONFIG.zoneId}/purge_cache`, 
      {
        method: 'POST',
        body: JSON.stringify({ purge_everything: true })
      }
    );
    
    if (result.success) {
      console.log('✅ Cache purged successfully');
    } else {
      console.error('❌ Failed to purge cache');
      console.error('Errors:', result.errors);
    }
  } catch (error) {
    console.error('❌ Error purging cache:', error);
  }
}

/**
 * Get DNS records for snakkaz.com
 */
export async function listDnsRecords(): Promise<void> {
  // Validate credentials first
  const isValid = await validateCredentials();
  if (!isValid) return;
  
  console.log('Fetching DNS records for snakkaz.com...');
  
  try {
    const result = await makeRequest(
      `${CLOUDFLARE_CONFIG.apiBaseUrl}/zones/${CLOUDFLARE_CONFIG.zoneId}/dns_records`,
      { method: 'GET' }
    );
    
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
  } catch (error) {
    console.error('❌ Error fetching DNS records:', error);
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
  
  // Show auth method
  const authMethod = sessionStorage.getItem(AUTH_METHOD_STORAGE_KEY) as AuthMethod || 'token';
  console.log('- Auth Method:', authMethod === 'token' ? 'API Token' : 'Global API Key');
  
  if (authMethod === 'token') {
    console.log('- API Token:', sessionStorage.getItem(API_TOKEN_STORAGE_KEY) ? '(stored in session)' : '(not set)');
  } else {
    console.log('- API Email:', sessionStorage.getItem(API_EMAIL_STORAGE_KEY) ? '(stored in session)' : '(not set)');
    console.log('- API Key:', sessionStorage.getItem(API_KEY_STORAGE_KEY) ? '(stored in session)' : '(not set)');
  }
}

/**
 * Help text for available commands
 */
export function help(): void {
  console.log('%c Cloudflare Management Tool ', 'background: #f6821f; color: white; font-size: 16px; padding: 5px;');
  console.log('\nAvailable commands:');
  console.log('- validateCredentials() - Validate your Cloudflare API credentials');
  console.log('- testConnection() - Test Cloudflare connectivity and get zone details');
  console.log('- purgeCache() - Purge the entire cache for snakkaz.com');
  console.log('- listDnsRecords() - List all DNS records for snakkaz.com');
  console.log('- showConfig() - Show current Cloudflare configuration');
  console.log('- clearApiCredentials() - Clear the stored API credentials');
  console.log('- switchAuthMethod("token") - Switch to API Token authentication');
  console.log('- switchAuthMethod("key") - Switch to Global API Key authentication');
  console.log('- help() - Show this help text');
}

// Show help text when module is imported
console.log('%c Cloudflare Management Tool Loaded ', 'background: #f6821f; color: white; font-size: 14px; padding: 5px;');
console.log('Type cfTools.help() for available commands');
console.log('You can use either API Token or Global API Key authentication.');

// Export as a named object for easier console usage
export const cfTools = {
  validateCredentials,
  testConnection,
  purgeCache,
  listDnsRecords,
  showConfig,
  clearApiCredentials,
  switchAuthMethod,
  help
};
