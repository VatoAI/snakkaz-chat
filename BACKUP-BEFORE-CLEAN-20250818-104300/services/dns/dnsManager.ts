/**
 * DNS Management for Snakkaz Chat
 * 
 * This module provides a unified interface for managing DNS settings
 * for Snakkaz Chat using the Namecheap API.
 */

import { NamecheapApi, createNamecheapApi, getClientIp } from './namecheapApi';
import { namecheapConfig, getNamecheapConfig } from './namecheapConfig';

/**
 * Result of a DNS health check
 */
interface DnsHealthCheckResult {
  status: 'healthy' | 'warning' | 'critical';
  namecheap: {
    nameservers: string[];
    recordsConfigured: boolean;
  };
  issues: string[];
  recommendations: string[];
}

/**
 * DNS Manager for Snakkaz Chat
 * Handles Namecheap DNS configuration
 */
export class DnsManager {
  private namecheapApi: NamecheapApi | null = null;
  private isProduction: boolean;

  /**
   * Create a new DNS manager
   * @param useProduction Whether to use production APIs
   */
  constructor(useProduction: boolean = true) {
    this.isProduction = useProduction;
  }

  /**
   * Initialize the DNS manager with required API credentials
   * @param namecheapApiKey Namecheap API key
   */
  async initialize(namecheapApiKey: string): Promise<boolean> {
    try {
      // Initialize Namecheap API
      const config = getNamecheapConfig(this.isProduction);
      
      // Get current client IP for Namecheap API whitelist
      const clientIp = await getClientIp();
      
      this.namecheapApi = createNamecheapApi(
        config.apiUser,
        namecheapApiKey || config.apiKey,
        config.username,
        clientIp,
        this.isProduction
      );
      
      return true;
    } catch (error) {
      console.error("Error initializing DNS manager:", error);
      return false;
    }
  }

  /**
   * Check if the manager is properly initialized
   */
  private ensureInitialized(): void {
    if (!this.namecheapApi) {
      throw new Error("DNS manager is not initialized. Call initialize() first.");
    }
  }

  /**
   * Perform a comprehensive health check of DNS settings
   * @returns Health check results
   */
  async performHealthCheck(): Promise<DnsHealthCheckResult> {
    this.ensureInitialized();
    
    const result: DnsHealthCheckResult = {
      status: 'healthy',
      namecheap: {
        nameservers: [],
        recordsConfigured: false
      },
      issues: [],
      recommendations: []
    };
    
    try {
      // Check Namecheap configuration
      const nameservers = await this.namecheapApi!.getDnsList();
      result.namecheap.nameservers = nameservers;
      
      // Check required DNS records
      const hostRecords = await this.namecheapApi!.getHostRecords();
      
      // Check for basic required records
      const hasARecords = hostRecords.some(r => r.type === 'A' && r.hostname === '@');
      const hasWww = hostRecords.some(r => 
        (r.type === 'CNAME' && r.hostname === 'www') || 
        (r.type === 'A' && r.hostname === 'www')
      );
      const hasMcp = hostRecords.some(r => r.hostname === 'mcp');
      const hasSupabase = hostRecords.some(r => r.hostname.includes('supabase'));
      
      result.namecheap.recordsConfigured = hasARecords && hasWww;
      
      if (!hasARecords) {
        result.issues.push("Missing root A record for domain");
        result.recommendations.push("Add an A record for @ pointing to your server IP");
        result.status = 'critical';
      }
      
      if (!hasWww) {
        result.issues.push("Missing www record");
        result.recommendations.push("Add a CNAME record for www pointing to the root domain");
        result.status = result.status === 'critical' ? 'critical' : 'warning';
      }
      
      if (!hasMcp) {
        result.issues.push("Missing MCP subdomain");
        result.recommendations.push("Add an A record for mcp pointing to your server IP");
        result.status = result.status === 'critical' ? 'critical' : 'warning';
      }
      
      if (!hasSupabase) {
        result.issues.push("Missing Supabase verification records");
        result.recommendations.push("Add required verification records for Supabase integration");
        result.status = result.status === 'critical' ? 'critical' : 'warning';
      }
      
      return result;
    } catch (error) {
      console.error("Error performing DNS health check:", error);
      result.status = 'critical';
      result.issues.push(`DNS health check error: ${error.message}`);
      result.recommendations.push("Check your Namecheap API credentials and try again");
      return result;
    }
  }

  /**
   * Fix common DNS issues automatically
   * @returns Object with status of fixes applied
   */
  async autoFix(): Promise<{success: boolean, fixes: string[], failures: string[]}> {
    this.ensureInitialized();
    
    const fixes: string[] = [];
    const failures: string[] = [];
    
    try {
      // Check current health to identify issues
      const healthCheck = await this.performHealthCheck();
      
      // Fix DNS records if required
      if (!healthCheck.namecheap.recordsConfigured) {
        try {
          // Ensure required records exist
          const records = namecheapConfig.defaultDnsRecords;
          const success = await this.namecheapApi!.setHostRecords(records);
          
          if (success) {
            fixes.push("Configured required Namecheap DNS records");
          } else {
            failures.push("Failed to configure DNS records in Namecheap");
          }
        } catch (error) {
          console.error("Error configuring DNS records:", error);
          failures.push(`Failed to configure DNS records: ${error.message}`);
        }
      }
      
      return {
        success: failures.length === 0,
        fixes,
        failures
      };
    } catch (error) {
      console.error("Error in autoFix:", error);
      return {
        success: false,
        fixes,
        failures: [...failures, `Unexpected error: ${error.message}`]
      };
    }
  }
}

// Singleton instance for convenience
let dnsManagerInstance: DnsManager | null = null;

/**
 * Get or create the DNS manager instance
 * @param useProduction Whether to use production APIs
 * @returns DNS manager instance
 */
export function getDnsManager(useProduction: boolean = true): DnsManager {
  if (!dnsManagerInstance) {
    dnsManagerInstance = new DnsManager(useProduction);
  }
  return dnsManagerInstance;
}

/**
 * Create a DNS status dashboard widget
 * @returns HTML element for the dashboard
 */
export function createDnsDashboard(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'dns-dashboard';
  
  const header = document.createElement('h3');
  header.textContent = 'DNS Status';
  container.appendChild(header);
  
  const statusElement = document.createElement('div');
  statusElement.className = 'dns-status';
  statusElement.innerHTML = '<p>Loading DNS status...</p>';
  container.appendChild(statusElement);
  
  // Add a refresh button
  const refreshButton = document.createElement('button');
  refreshButton.textContent = 'Refresh DNS Status';
  refreshButton.addEventListener('click', () => {
    statusElement.innerHTML = '<p>Checking DNS status...</p>';
    updateDnsStatus();
  });
  container.appendChild(refreshButton);
  
  // Function to update the status display
  async function updateDnsStatus() {
    try {
      const dnsManager = getDnsManager();
      
      // Try to initialize with stored API key if available
      const apiKey = localStorage.getItem('namecheap_api_key');
      if (apiKey) {
        await dnsManager.initialize(apiKey);
        const healthCheck = await dnsManager.performHealthCheck();
        
        let statusClass = '';
        switch (healthCheck.status) {
          case 'healthy':
            statusClass = 'status-healthy';
            break;
          case 'warning':
            statusClass = 'status-warning';
            break;
          case 'critical':
            statusClass = 'status-critical';
            break;
        }
        
        let html = `<div class="status ${statusClass}">
          <h4>Status: ${healthCheck.status}</h4>
          <p>Nameservers: ${healthCheck.namecheap.nameservers.join(', ')}</p>
        `;
        
        if (healthCheck.issues.length > 0) {
          html += '<h4>Issues</h4><ul>';
          healthCheck.issues.forEach(issue => {
            html += `<li>${issue}</li>`;
          });
          html += '</ul>';
        }
        
        if (healthCheck.recommendations.length > 0) {
          html += '<h4>Recommendations</h4><ul>';
          healthCheck.recommendations.forEach(rec => {
            html += `<li>${rec}</li>`;
          });
          html += '</ul>';
        }
        
        html += '</div>';
        
        statusElement.innerHTML = html;
      } else {
        statusElement.innerHTML = `
          <p>Please enter your Namecheap API key to check DNS status:</p>
          <input type="password" id="apiKeyInput" placeholder="API Key">
          <button id="saveApiKey">Save & Check</button>
        `;
        
        const saveButton = statusElement.querySelector('#saveApiKey');
        if (saveButton) {
          saveButton.addEventListener('click', async () => {
            const input = statusElement.querySelector('#apiKeyInput') as HTMLInputElement;
            const apiKey = input?.value;
            
            if (apiKey) {
              localStorage.setItem('namecheap_api_key', apiKey);
              statusElement.innerHTML = '<p>Checking DNS status...</p>';
              updateDnsStatus();
            }
          });
        }
      }
    } catch (error) {
      statusElement.innerHTML = `<p class="error">Error checking DNS status: ${error.message}</p>`;
    }
  }
  
  // Initial status update
  updateDnsStatus();
  
  return container;
}
