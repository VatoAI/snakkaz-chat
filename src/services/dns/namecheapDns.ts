/**
 * Namecheap DNS Management
 * 
 * This module provides utilities for managing DNS records using Namecheap's API.
 * Replaces Cloudflare DNS functionality.
 */

interface NamecheapApiConfig {
  apiUser: string;
  apiKey: string;
  username: string;
  clientIp: string;
}

interface DnsRecord {
  type: 'A' | 'CNAME' | 'MX' | 'TXT' | 'SRV' | 'AAAA';
  host: string;
  value: string;
  ttl?: number;
  priority?: number;
}

/**
 * Namecheap DNS Manager class
 */
export class NamecheapDnsManager {
  private apiUser: string;
  private apiKey: string;
  private username: string;
  private clientIp: string;
  private baseUrl: string = 'https://api.namecheap.com/xml.response';

  /**
   * Create a new Namecheap DNS Manager instance
   */
  constructor(config: NamecheapApiConfig) {
    this.apiUser = config.apiUser;
    this.apiKey = config.apiKey;
    this.username = config.username;
    this.clientIp = config.clientIp;
  }

  /**
   * Get all DNS records for a domain
   */
  async getDnsRecords(domain: string): Promise<DnsRecord[]> {
    try {
      // Split domain into SLD (second-level domain) and TLD (top-level domain)
      const domainParts = domain.split('.');
      const tld = domainParts.pop() || '';
      const sld = domainParts.join('.');

      // Build the API request URL
      const url = new URL(this.baseUrl);
      url.searchParams.append('ApiUser', this.apiUser);
      url.searchParams.append('ApiKey', this.apiKey);
      url.searchParams.append('UserName', this.username);
      url.searchParams.append('ClientIp', this.clientIp);
      url.searchParams.append('Command', 'namecheap.domains.dns.getHosts');
      url.searchParams.append('SLD', sld);
      url.searchParams.append('TLD', tld);

      // Make the API request
      const response = await fetch(url.toString());
      const xmlText = await response.text();

      // Parse XML response
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

      // Check for errors
      const errorElements = xmlDoc.getElementsByTagName('Error');
      if (errorElements.length > 0) {
        throw new Error(`Namecheap API error: ${errorElements[0].textContent}`);
      }

      // Extract DNS records
      const hostRecords = xmlDoc.getElementsByTagName('host');
      const records: DnsRecord[] = [];

      for (let i = 0; i < hostRecords.length; i++) {
        const record = hostRecords[i];
        
        records.push({
          type: record.getAttribute('type') as DnsRecord['type'],
          host: record.getAttribute('name') || '',
          value: record.getAttribute('address') || '',
          ttl: parseInt(record.getAttribute('ttl') || '1800', 10),
          priority: parseInt(record.getAttribute('mxpref') || '0', 10)
        });
      }

      return records;
    } catch (error) {
      console.error('Failed to get DNS records:', error);
      throw error;
    }
  }

  /**
   * Set DNS records for a domain
   */
  async setDnsRecords(domain: string, records: DnsRecord[]): Promise<boolean> {
    try {
      // Split domain into SLD (second-level domain) and TLD (top-level domain)
      const domainParts = domain.split('.');
      const tld = domainParts.pop() || '';
      const sld = domainParts.join('.');

      // Build the API request URL
      const url = new URL(this.baseUrl);
      url.searchParams.append('ApiUser', this.apiUser);
      url.searchParams.append('ApiKey', this.apiKey);
      url.searchParams.append('UserName', this.username);
      url.searchParams.append('ClientIp', this.clientIp);
      url.searchParams.append('Command', 'namecheap.domains.dns.setHosts');
      url.searchParams.append('SLD', sld);
      url.searchParams.append('TLD', tld);
      
      // Add record parameters
      records.forEach((record, index) => {
        url.searchParams.append(`HostName${index + 1}`, record.host);
        url.searchParams.append(`RecordType${index + 1}`, record.type);
        url.searchParams.append(`Address${index + 1}`, record.value);
        url.searchParams.append(`TTL${index + 1}`, (record.ttl || 1800).toString());
        
        if (record.type === 'MX') {
          url.searchParams.append(`MXPref${index + 1}`, (record.priority || 10).toString());
        }
      });

      // Make the API request
      const response = await fetch(url.toString());
      const xmlText = await response.text();

      // Parse XML response
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

      // Check for errors
      const errorElements = xmlDoc.getElementsByTagName('Error');
      if (errorElements.length > 0) {
        throw new Error(`Namecheap API error: ${errorElements[0].textContent}`);
      }

      // Check for success
      const resultElement = xmlDoc.getElementsByTagName('CommandResponse')[0];
      const isSuccess = resultElement && resultElement.getAttribute('Success') === 'true';
      
      return isSuccess;
    } catch (error) {
      console.error('Failed to set DNS records:', error);
      throw error;
    }
  }

  /**
   * Check if a domain is registered and active
   */
  async checkDomainStatus(domain: string): Promise<boolean> {
    try {
      // Split domain into SLD (second-level domain) and TLD (top-level domain)
      const domainParts = domain.split('.');
      const tld = domainParts.pop() || '';
      const sld = domainParts.join('.');

      // Build the API request URL
      const url = new URL(this.baseUrl);
      url.searchParams.append('ApiUser', this.apiUser);
      url.searchParams.append('ApiKey', this.apiKey);
      url.searchParams.append('UserName', this.username);
      url.searchParams.append('ClientIp', this.clientIp);
      url.searchParams.append('Command', 'namecheap.domains.getinfo');
      url.searchParams.append('DomainName', `${sld}.${tld}`);

      // Make the API request
      const response = await fetch(url.toString());
      const xmlText = await response.text();

      // Parse XML response
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

      // Check for errors
      const errorElements = xmlDoc.getElementsByTagName('Error');
      if (errorElements.length > 0) {
        throw new Error(`Namecheap API error: ${errorElements[0].textContent}`);
      }

      // Check domain status
      const statusElement = xmlDoc.querySelector('DomainGetInfoResult');
      const isActive = statusElement && statusElement.getAttribute('Status') === 'Ok';
      
      return isActive;
    } catch (error) {
      console.error('Failed to check domain status:', error);
      throw error;
    }
  }
}

/**
 * Create a Namecheap DNS Manager with configuration
 */
export function createNamecheapDnsManager(config: NamecheapApiConfig): NamecheapDnsManager {
  return new NamecheapDnsManager(config);
}

/**
 * Create and format a DNS record object
 */
export function createDnsRecord(type: DnsRecord['type'], host: string, value: string, ttl?: number, priority?: number): DnsRecord {
  return { type, host, value, ttl, priority };
}
