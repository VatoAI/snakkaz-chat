/**
 * Namecheap API Configuration
 * 
 * This module provides configuration settings for the Namecheap API.
 * Replaces Cloudflare configuration.
 */

interface NamecheapConfig {
  /**
   * Namecheap API User (usually the same as username)
   */
  apiUser: string;
  
  /**
   * Namecheap API Key from account settings
   */
  apiKey: string;
  
  /**
   * Namecheap account username
   */
  username: string;
  
  /**
   * Client IP address (must be whitelisted in Namecheap API settings)
   */
  clientIp: string;
  
  /**
   * Default TTL (Time To Live) for DNS records in seconds
   */
  defaultTtl: number;
  
  /**
   * Whether to use the Namecheap sandbox/test environment
   */
  useSandbox: boolean;
  
  /**
   * Domains managed through this API
   */
  managedDomains: string[];
}

/**
 * Default configuration for Namecheap API
 * 
 * Note: You must set apiUser, apiKey, username, and clientIp
 * in a secure manner, not directly in code.
 */
export const namecheapConfig: NamecheapConfig = {
  apiUser: process.env.NAMECHEAP_API_USER || '',
  apiKey: process.env.NAMECHEAP_API_KEY || '',
  username: process.env.NAMECHEAP_USERNAME || '',
  clientIp: process.env.NAMECHEAP_CLIENT_IP || '',
  defaultTtl: 1800, // 30 minutes
  useSandbox: process.env.NODE_ENV !== 'production',
  managedDomains: [
    'snakkaz.com',
    'dash.snakkaz.com',
    'business.snakkaz.com',
    'docs.snakkaz.com',
    'analytics.snakkaz.com'
  ]
};

/**
 * Configure the Namecheap API with environment variables or settings
 */
export function configureNamecheapApi(config: Partial<NamecheapConfig> = {}): NamecheapConfig {
  // Combine default config with provided config
  const mergedConfig = {
    ...namecheapConfig,
    ...config
  };
  
  // Validate the configuration
  const requiredFields = ['apiUser', 'apiKey', 'username', 'clientIp'];
  const missingFields = requiredFields.filter(field => !mergedConfig[field as keyof NamecheapConfig]);
  
  if (missingFields.length > 0) {
    console.warn(`Namecheap API configuration missing required fields: ${missingFields.join(', ')}`);
    console.warn('Please set these values through environment variables or configuration');
  }
  
  return mergedConfig;
}

/**
 * Get a secure configuration for Namecheap API from environment or secure storage
 */
export async function getSecureNamecheapConfig(): Promise<NamecheapConfig> {
  try {
    // Try to load from secure storage if available
    let secureConfig = namecheapConfig;
    
    // If process.env is available (Node.js environment)
    if (typeof process !== 'undefined' && process.env) {
      secureConfig = {
        ...secureConfig,
        apiUser: process.env.NAMECHEAP_API_USER || secureConfig.apiUser,
        apiKey: process.env.NAMECHEAP_API_KEY || secureConfig.apiKey,
        username: process.env.NAMECHEAP_USERNAME || secureConfig.username,
        clientIp: process.env.NAMECHEAP_CLIENT_IP || secureConfig.clientIp
      };
    }
    
    return secureConfig;
  } catch (error) {
    console.error('Failed to load secure Namecheap configuration:', error);
    
    // Return default config as fallback
    return namecheapConfig;
  }
}
