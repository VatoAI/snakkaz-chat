/**
 * Cloudflare Configuration
 * 
 * This file contains Cloudflare API configuration for the Snakkaz Chat application.
 * These credentials are used for programmatic access to Cloudflare API for tasks like:
 * - Purging cache
 * - Managing DNS records
 * - Checking zone status
 * - Analytics data retrieval
 */

export const CLOUDFLARE_CONFIG = {
  // Zone ID for snakkaz.com
  zoneId: 'bba5fb2c80aede33ac2c22f8f99110d3',
  
  // Account ID for the Cloudflare account
  accountId: '0785388bb3883d3a10ab7f60a7a4968a',
  
  // API base URL
  apiBaseUrl: 'https://api.cloudflare.com/client/v4',
  
  // Zone name (domain)
  zoneName: 'snakkaz.com'
};

/**
 * Create API headers with authentication token
 * @param apiToken The Cloudflare API token
 * @returns Headers object with proper authentication
 */
export function createCloudflareApiHeaders(apiToken: string): HeadersInit {
  return {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json'
  };
}

/**
 * Check if Cloudflare credentials are configured
 * @returns Boolean indicating if credentials are properly configured
 */
export function isCloudflareConfigured(): boolean {
  return !!CLOUDFLARE_CONFIG.zoneId && !!CLOUDFLARE_CONFIG.accountId;
}
