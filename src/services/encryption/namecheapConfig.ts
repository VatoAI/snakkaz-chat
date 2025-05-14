/**
 * Namecheap API Configuration for Snakkaz Chat
 * 
 * Dette filen inneholder konfigurasjonsinnstillingene for Namecheap API-integrasjonen.
 * VIKTIG: Denne filen er kun for utvikling. I produksjon bør disse verdiene
 * lastes fra miljøvariabler eller et sikkert hvelv.
 * 
 * Oppdatert: 14. mai 2025
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
    apiUser: 'SnakkaZ', // Replace with your sandbox API username
    apiKey: '43cb18d3efb3412584149435e1549db7', // Add your sandbox API key here
    username: 'SnakkaZ', // Replace with your sandbox username
  },
  
  // Production environment
  production: {
    apiUrl: 'https://api.namecheap.com/xml.response',
    apiUser: process.env.NAMECHEAP_API_USER || '', 
    apiKey: process.env.NAMECHEAP_API_KEY || '',
    username: process.env.NAMECHEAP_USERNAME || '',
  },
  
  // Namecheap's egne nameservere (ikke Cloudflare lenger)
  nameservers: [
    'dns1.registrar-servers.com',
    'dns2.registrar-servers.com'
  ],
  
  // DNS records konfigurert i Namecheap
  defaultDnsRecords: [
    {
      hostname: '@',
      type: 'A' as const,
      address: '185.158.133.1', // Basert på nåværende konfigurasjon
      ttl: 300
    },
    {
      hostname: 'www',
      type: 'CNAME' as const,
      address: 'snakkaz.com.',
      ttl: 300
    },
    {
      hostname: 'dash',
      type: 'CNAME' as const,
      address: 'snakkaz.com.',
      ttl: 300
    },
    {
      hostname: 'business',
      type: 'CNAME' as const,
      address: 'snakkaz.com.',
      ttl: 300
    },
    {
      hostname: 'docs',
      type: 'CNAME' as const,
      address: 'snakkaz.com.',
      ttl: 300
    },
    {
      hostname: 'analytics',
      type: 'CNAME' as const,
      address: 'snakkaz.com.',
      ttl: 300
    },
    {
      hostname: 'mcp',
      type: 'CNAME' as const,
      address: 'snakkaz.com.',
      ttl: 300
    },
    {
      hostname: 'help',
      type: 'CNAME' as const,
      address: 'snakkaz.com.',
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
