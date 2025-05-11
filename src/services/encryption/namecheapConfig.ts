/**
 * Namecheap API Configuration for Snakkaz Chat
 * 
 * This file contains the configuration settings for the Namecheap API integration.
 * IMPORTANT: This file is for development only. In production, these values should be 
 * loaded from environment variables or a secure vault.
 */

/**
 * Namecheap API Configuration
 */
export const namecheapConfig = {
  // Domain name to manage
  domain: 'snakkaz.com',
  
  // Sandbox environment (for testing)
  sandbox: {
    apiUrl: 'https://api.sandbox.namecheap.com/xml.response',
    apiUser: 'your-api-username', // Replace with your sandbox API username
    apiKey: '', // Add your sandbox API key here
    username: 'your-username', // Replace with your sandbox username
  },
  
  // Production environment
  production: {
    apiUrl: 'https://api.namecheap.com/xml.response',
    apiUser: process.env.NAMECHEAP_API_USER || '', 
    apiKey: process.env.NAMECHEAP_API_KEY || '',
    username: process.env.NAMECHEAP_USERNAME || '',
  },
  
  // Default Cloudflare nameservers to set for Snakkaz
  cloudflareNameservers: [
    'kyle.ns.cloudflare.com',
    'vita.ns.cloudflare.com'
  ],
  
  // DNS records to create when using Namecheap's default DNS
  // (Only used if not using Cloudflare as the DNS provider)
  defaultDnsRecords: [
    {
      hostname: '@',
      type: 'A' as const,
      address: '76.76.21.21', // Update with your actual server IP
      ttl: 300
    },
    {
      hostname: 'www',
      type: 'CNAME' as const,
      address: 'snakkaz.com.',
      ttl: 300
    },
    {
      hostname: 'api',
      type: 'A' as const,
      address: '76.76.21.21', // Update with your actual API server IP
      ttl: 300
    },
    {
      hostname: 'chat',
      type: 'A' as const,
      address: '76.76.21.21', // Update with your actual chat server IP
      ttl: 300
    }
  ]
};

/**
 * Get Namecheap configuration based on environment
 * @param useProduction Whether to use production or sandbox environment
 * @returns Namecheap API configuration
 */
export function getNamecheapConfig(useProduction = false) {
  return useProduction ? namecheapConfig.production : namecheapConfig.sandbox;
}

/**
 * Validates if the Namecheap configuration is complete
 * @param useProduction Whether to check production or sandbox configuration
 * @returns True if configuration is valid
 */
export function isNamecheapConfigValid(useProduction = false): boolean {
  const config = useProduction ? namecheapConfig.production : namecheapConfig.sandbox;
  return !!(config.apiUser && config.apiKey && config.username);
}
