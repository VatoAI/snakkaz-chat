/**
 * Namecheap API Integration for Snakkaz Chat
 * 
 * This module provides integration with Namecheap's API to automate DNS management.
 * Updated version without Cloudflare dependencies.
 */

interface NamecheapConfig {
  apiUser: string;
  apiKey: string;
  username: string; 
  clientIp: string;
  useProduction: boolean;
}

interface NamecheapDnsRecord {
  hostname: string;
  type: 'A' | 'CNAME' | 'MX' | 'TXT' | 'REDIRECT' | 'URL_FORWARD';
  address: string;
  ttl?: number;
  mxPref?: number;
}

/**
 * Main class for Namecheap API operations
 */
export class NamecheapApi {
  private config: NamecheapConfig;
  private domain: string = 'snakkaz.com';
  private apiBaseUrl: string;

  /**
   * Create a new Namecheap API instance
   * @param config Configuration for Namecheap API
   */
  constructor(config: NamecheapConfig) {
    this.config = config;
    this.apiBaseUrl = config.useProduction 
      ? 'https://api.namecheap.com/xml.response'
      : 'https://api.sandbox.namecheap.com/xml.response';
  }

  /**
   * Build a URL for a Namecheap API request
   * @param command API command to execute
   * @param params Additional parameters for the command
   * @returns Complete URL for the API request
   */
  private buildApiUrl(command: string, params: Record<string, string> = {}): string {
    const baseParams = {
      ApiUser: this.config.apiUser,
      ApiKey: this.config.apiKey,
      UserName: this.config.username,
      ClientIp: this.config.clientIp,
      Command: command,
    };

    const searchParams = new URLSearchParams({
      ...baseParams,
      ...params
    });

    return `${this.apiBaseUrl}?${searchParams.toString()}`;
  }

  /**
   * Make a request to the Namecheap API
   * @param url API URL to fetch
   * @returns Parsed XML response as JSON
   */
  private async makeApiRequest(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      const text = await response.text();
      
      // Parse XML response to JSON
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");
      
      // Check for API errors
      const apiResponse = xmlDoc.getElementsByTagName("ApiResponse")[0];
      const status = apiResponse.getAttribute("Status");
      
      if (status === "ERROR") {
        const errors = apiResponse.getElementsByTagName("Error");
        const errorMsgs = Array.from(errors).map(error => error.textContent);
        throw new Error(`Namecheap API error: ${errorMsgs.join(', ')}`);
      }
      
      return this.xmlToJson(xmlDoc);
    } catch (error) {
      console.error("Error making Namecheap API request:", error);
      throw error;
    }
  }

  /**
   * Simple XML to JSON converter for Namecheap API responses
   * @param xml DOM Document to convert
   * @returns JSON representation of the XML
   */
  private xmlToJson(xml: Document): any {
    // This is a simplified converter for demonstration
    const result: any = {};
    
    function processNode(node: Element, obj: any) {
      // Process attributes
      Array.from(node.attributes).forEach(attr => {
        obj[attr.name] = attr.value;
      });
      
      // Process child elements
      Array.from(node.children).forEach(child => {
        const childName = child.nodeName;
        
        // Skip if it's a text node
        if (childName === "#text") return;
        
        if (!obj[childName]) {
          obj[childName] = {};
        }
        
        // If there are multiple elements with the same name, convert to array
        if (Array.isArray(obj[childName])) {
          const newObj = {};
          processNode(child, newObj);
          obj[childName].push(newObj);
        } else if (Object.keys(obj[childName]).length > 0) {
          // Convert to array if we already have an object
          const existingObj = obj[childName];
          obj[childName] = [existingObj, {}];
          processNode(child, obj[childName][1]);
        } else {
          processNode(child, obj[childName]);
        }
      });
      
      // If the node has no children but has text content
      if (node.children.length === 0 && node.textContent) {
        return node.textContent.trim();
      }
    }
    
    const rootElement = xml.documentElement;
    processNode(rootElement, result);
    
    return result;
  }

  /**
   * Get the DNS servers for a domain
   * @returns List of nameservers
   */
  async getDnsList(): Promise<string[]> {
    const url = this.buildApiUrl("namecheap.domains.dns.getList", {
      SLD: this.domain.split('.')[0],
      TLD: this.domain.split('.')[1]
    });
    
    try {
      const response = await this.makeApiRequest(url);
      const dnsServers = response.ApiResponse.CommandResponse.DomainDNSGetListResult.Nameserver;
      
      return Array.isArray(dnsServers) ? dnsServers : [dnsServers];
    } catch (error) {
      console.error("Error fetching DNS servers:", error);
      throw error;
    }
  }

  /**
   * Set custom DNS servers for the domain
   * @param nameservers List of nameservers to set
   * @returns Success status
   */
  async setCustomDns(nameservers: string[]): Promise<boolean> {
    if (!nameservers || nameservers.length < 2) {
      throw new Error("At least two nameservers are required");
    }
    
    const params: Record<string, string> = {
      SLD: this.domain.split('.')[0],
      TLD: this.domain.split('.')[1],
    };
    
    // Add nameservers to params
    nameservers.forEach((ns, index) => {
      params[`Nameserver${index + 1}`] = ns;
    });
    
    const url = this.buildApiUrl("namecheap.domains.dns.setCustom", params);
    
    try {
      const response = await this.makeApiRequest(url);
      const result = response.ApiResponse.CommandResponse.DomainDNSSetCustomResult;
      return result.getAttribute("Updated") === "true";
    } catch (error) {
      console.error("Error setting custom DNS:", error);
      throw error;
    }
  }

  /**
   * Set the domain to use Namecheap's default DNS servers
   * @returns Success status
   */
  async setDefaultDns(): Promise<boolean> {
    const url = this.buildApiUrl("namecheap.domains.dns.setDefault", {
      SLD: this.domain.split('.')[0],
      TLD: this.domain.split('.')[1]
    });
    
    try {
      const response = await this.makeApiRequest(url);
      const result = response.ApiResponse.CommandResponse.DomainDNSSetDefaultResult;
      return result.getAttribute("Updated") === "true";
    } catch (error) {
      console.error("Error setting default DNS:", error);
      throw error;
    }
  }

  /**
   * Get DNS host records for the domain
   * @returns List of DNS records
   */
  async getHostRecords(): Promise<NamecheapDnsRecord[]> {
    const url = this.buildApiUrl("namecheap.domains.dns.getHosts", {
      SLD: this.domain.split('.')[0],
      TLD: this.domain.split('.')[1]
    });
    
    try {
      const response = await this.makeApiRequest(url);
      const hosts = response.ApiResponse.CommandResponse.DomainDNSGetHostsResult.host;
      
      // Convert to consistent format
      if (!hosts) return [];
      
      const hostRecords = Array.isArray(hosts) ? hosts : [hosts];
      return hostRecords.map(host => ({
        hostname: host.HostName,
        type: host.Type,
        address: host.Address,
        ttl: parseInt(host.TTL, 10),
        mxPref: host.MXPref ? parseInt(host.MXPref, 10) : undefined
      }));
    } catch (error) {
      console.error("Error getting host records:", error);
      throw error;
    }
  }

  /**
   * Set DNS host records for the domain
   * @param records DNS records to set
   * @returns Success status
   */
  async setHostRecords(records: NamecheapDnsRecord[]): Promise<boolean> {
    if (!records || records.length === 0) {
      throw new Error("At least one record is required");
    }
    
    const params: Record<string, string> = {
      SLD: this.domain.split('.')[0],
      TLD: this.domain.split('.')[1],
    };
    
    // Add records to params
    records.forEach((record, index) => {
      params[`HostName${index + 1}`] = record.hostname;
      params[`RecordType${index + 1}`] = record.type;
      params[`Address${index + 1}`] = record.address;
      params[`TTL${index + 1}`] = String(record.ttl || 1800);
      
      if (record.type === 'MX' && record.mxPref !== undefined) {
        params[`MXPref${index + 1}`] = String(record.mxPref);
      }
    });
    
    const url = this.buildApiUrl("namecheap.domains.dns.setHosts", params);
    
    try {
      const response = await this.makeApiRequest(url);
      const result = response.ApiResponse.CommandResponse.DomainDNSSetHostsResult;
      return result.getAttribute("IsSuccess") === "true";
    } catch (error) {
      console.error("Error setting host records:", error);
      throw error;
    }
  }
  
  /**
   * Check if the domain is using Namecheap default nameservers
   * @returns True if using Namecheap default nameservers
   */
  async isUsingDefaultNameservers(): Promise<boolean> {
    try {
      const nameservers = await this.getDnsList();
      // Check if using default Namecheap nameservers
      return nameservers.some(ns => ns.includes('registrar-servers.com'));
    } catch (error) {
      console.error("Error checking nameservers:", error);
      return false;
    }
  }
  
  /**
   * Set the domain to use Namecheap default nameservers
   * @returns Success status
   */
  async resetToDefaultNameservers(): Promise<boolean> {
    try {
      return await this.setDefaultDns();
    } catch (error) {
      console.error("Error resetting to default nameservers:", error);
      throw error;
    }
  }
}

/**
 * Create a new Namecheap API instance with configuration
 * @param apiUser Namecheap API user (usually your Namecheap username)
 * @param apiKey API key from Namecheap account
 * @param username Namecheap username
 * @param clientIp IP address that will be making API requests
 * @param useProduction Whether to use production API (default: false for sandbox)
 * @returns Configured NamecheapApi instance
 */
export function createNamecheapApi(
  apiUser: string, 
  apiKey: string, 
  username: string, 
  clientIp: string,
  useProduction: boolean = false
): NamecheapApi {
  return new NamecheapApi({
    apiUser,
    apiKey,
    username,
    clientIp,
    useProduction
  });
}

/**
 * Utility function to get client IP address
 * Uses ipify.org API to retrieve the current public IP
 * @returns Client IP address
 */
export async function getClientIp(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error getting client IP:", error);
    throw error;
  }
}
