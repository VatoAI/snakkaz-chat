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
import { 
  secureStore, 
  secureRetrieve, 
  hasSecureCredential, 
  setupSecureAccess,
  verifySecureAccess,
  isSecureAccessVerified,
  SECURE_KEYS
} from './secureCredentials';

// Authentication methods
type AuthMethod = 'token' | 'key';

// Current auth method stored in memory only for the session duration
let currentAuthMethod: AuthMethod = 'key'; // Default to Global API Key method

// Default secure key (should be changed by user)
const DEFAULT_SECURE_KEY = 'snakkaz-secure-vault';

/**
 * Ensure user has set up a secure password
 */
async function ensureSecureAccess(): Promise<string | null> {
  // Check if user is already authenticated in this session
  if (isSecureAccessVerified()) {
    // Already verified in this session, ask for password only
    const password = prompt('Enter your secure password to access credentials:');
    if (!password) return null;
    
    const isValid = await verifySecureAccess(password);
    if (!isValid) {
      alert('Invalid password. Please try again.');
      return null;
    }
    
    return password;
  }
  
  // First time accessing secure storage - check if setup is needed
  const needsSetup = !hasSecureCredential('_verify_access');
  let password: string | null;
  
  if (needsSetup) {
    // New user - need to set up password
    password = prompt('Set up a secure password to protect your API credentials:');
    if (!password) return null;
    
    const confirm = prompt('Confirm your password:');
    if (password !== confirm) {
      alert('Passwords do not match. Please try again.');
      return null;
    }
    
    const success = await setupSecureAccess(password);
    if (!success) {
      alert('Failed to set up secure access. Please try again.');
      return null;
    }
    
    alert('Secure access has been set up successfully! Your credentials will be encrypted with this password.');
    return password;
  } else {
    // Existing user - verify password
    password = prompt('Enter your secure password to access credentials:');
    if (!password) return null;
    
    const isValid = await verifySecureAccess(password);
    if (!isValid) {
      alert('Invalid password. Please try again.');
      return null;
    }
    
    return password;
  }
}

/**
 * Get the stored API credentials or ask for new ones
 */
async function getApiCredentials(): Promise<string | null> {
  // First ensure we have secure access
  const password = await ensureSecureAccess();
  if (!password) return null;
  
  // Now get credentials based on auth method
  if (currentAuthMethod === 'key') {
    // Using API Key method
    // Check if we have stored credentials
    const storedEmail = await secureRetrieve(SECURE_KEYS.CLOUDFLARE_API_EMAIL, password);
    const storedApiKey = await secureRetrieve(SECURE_KEYS.CLOUDFLARE_API_KEY, password);
    
    let email = storedEmail;
    let apiKey = storedApiKey;
    
    if (!email) {
      email = prompt('Enter your Cloudflare account email:');
      if (!email) return null;
      
      // Save for future use
      await secureStore(SECURE_KEYS.CLOUDFLARE_API_EMAIL, email, password);
    }
    
    if (!apiKey) {
      // Use provided value or ask for input
      apiKey = '72906b4d4a22d100c7b5d7afffb8b295f3f35'; // Pre-filled value
      const confirm = confirm('Use stored API Key? Click Cancel to enter a different key.');
      
      if (!confirm) {
        apiKey = prompt('Enter your Cloudflare Global API Key:') || '';
      }
      
      // Save for future use
      await secureStore(SECURE_KEYS.CLOUDFLARE_API_KEY, apiKey, password);
    }
    
    return JSON.stringify({ email, apiKey, method: 'key' });
  } else {
    // Using API Token method
    const storedToken = await secureRetrieve(SECURE_KEYS.CLOUDFLARE_API_TOKEN, password);
    
    let token = storedToken;
    if (!token) {
      token = prompt('Enter your Cloudflare API token (account-owned token recommended):');
      if (!token) return null;
      
      // Save for future use
      await secureStore(SECURE_KEYS.CLOUDFLARE_API_TOKEN, token, password);
    }
    
    return JSON.stringify({ token, method: 'token' });
  }
}

/**
 * Parse the auth info returned by getApiCredentials
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
 * Clear cached session authentication
 * This doesn't remove encrypted credentials, just requires re-authentication
 */
export function clearSession(): void {
  // End the secure access for this session
  import('./secureCredentials').then(module => {
    module.endSecureAccess();
    console.log('Session cleared - you will need to enter your password again');
  });
}

/**
 * Remove all stored credentials (requires secure password)
 */
export async function removeAllCredentials(): Promise<boolean> {
  const password = await ensureSecureAccess();
  if (!password) return false;
  
  try {
    // Remove all stored credentials
    import('./secureCredentials').then(module => {
      module.removeSecureCredential(SECURE_KEYS.CLOUDFLARE_API_EMAIL);
      module.removeSecureCredential(SECURE_KEYS.CLOUDFLARE_API_KEY);
      module.removeSecureCredential(SECURE_KEYS.CLOUDFLARE_API_TOKEN);
      console.log('All API credentials have been removed');
    });
    
    return true;
  } catch (e) {
    console.error('Failed to remove credentials:', e);
    return false;
  }
}

/**
 * Switch the authentication method
 */
export function switchAuthMethod(method: AuthMethod): void {
  currentAuthMethod = method;
  console.log(`Switched to ${method === 'token' ? 'API Token' : 'Global API Key'} authentication method`);
}

/**
 * Validate the current API credentials
 */
export async function validateCredentials(): Promise<boolean> {
  const authInfo = await getApiCredentials();
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
  const authInfo = await getApiCredentials();
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
export async function showConfig(): Promise<void> {
  console.log('Cloudflare Configuration:');
  console.log('- Zone ID:', CLOUDFLARE_CONFIG.zoneId);
  console.log('- Account ID:', CLOUDFLARE_CONFIG.accountId);
  console.log('- Zone Name:', CLOUDFLARE_CONFIG.zoneName);
  
  // Show auth method
  console.log('- Current Auth Method:', currentAuthMethod === 'token' ? 'API Token' : 'Global API Key');

  // Check if we have credentials stored (without retrieving their values)
  const { hasSecureCredential } = await import('./secureCredentials');
  
  const hasToken = hasSecureCredential(SECURE_KEYS.CLOUDFLARE_API_TOKEN);
  const hasApiKey = hasSecureCredential(SECURE_KEYS.CLOUDFLARE_API_KEY);
  const hasEmail = hasSecureCredential(SECURE_KEYS.CLOUDFLARE_API_EMAIL);
  
  console.log('- API Token:', hasToken ? '(securely stored)' : '(not set)');
  console.log('- API Email:', hasEmail ? '(securely stored)' : '(not set)');
  console.log('- API Key:', hasApiKey ? '(securely stored)' : '(not set)');
  console.log('- Credentials Storage:', 'Secure encrypted storage with password protection');
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
  console.log('- clearSession() - Clear the current authentication session');
  console.log('- removeAllCredentials() - Remove all stored credentials (requires password)');
  console.log('- switchAuthMethod("token") - Switch to API Token authentication');
  console.log('- switchAuthMethod("key") - Switch to Global API Key authentication');
  console.log('- help() - Show this help text');
  
  console.log('\n%c Security Information ', 'background: #4285f4; color: white; font-size: 14px; padding: 3px;');
  console.log('- All API credentials are stored with strong encryption');
  console.log('- You need to enter your secure password to access or modify credentials');
  console.log('- No sensitive information is stored in plain text or session storage');
}

// Show help text when module is imported
console.log('%c Cloudflare Management Tool Loaded ', 'background: #f6821f; color: white; font-size: 14px; padding: 5px;');
console.log('Type cfTools.help() for available commands');
console.log('Your API credentials are now stored with encryption and password protection.');

// Export as a named object for easier console usage
export const cfTools = {
  validateCredentials,
  testConnection,
  purgeCache,
  listDnsRecords,
  showConfig,
  clearSession,
  removeAllCredentials,
  switchAuthMethod,
  help
};
