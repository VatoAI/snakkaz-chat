/**
 * DNS Management Integration for Snakkaz Chat
 * 
 * This module provides a unified interface for managing DNS settings
 * for Snakkaz Chat, integrating both Namecheap and Cloudflare APIs.
 */

import { cfTools, cloudflareConfig } from './configure-cloudflare.js';
import { NamecheapApi, createNamecheapApi, getClientIp } from './namecheapApi';
import { namecheapConfig, getNamecheapConfig, isNamecheapConfigValid } from './namecheapConfig';

/**
 * Result of a DNS health check
 */
interface DnsHealthCheckResult {
  status: 'healthy' | 'issues' | 'critical';
  cloudflare: {
    nameserversConfigured: boolean;
    zoneActive: boolean;
    wwwRecordExists: boolean;
    sslConfigured: boolean;
  };
  namecheap: {
    usingCloudflareNameservers: boolean;
    nameservers: string[];
  };
  issues: string[];
  recommendations: string[];
}

/**
 * DNS Manager for Snakkaz Chat
 * Handles integration between Namecheap and Cloudflare
 */
export class DnsManager {
  private namecheapApi: NamecheapApi | null = null;
  private cloudflareApiToken: string | null = null;
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
   * @param cloudflareApiToken Cloudflare API token
   */
  async initialize(namecheapApiKey: string, cloudflareApiToken: string): Promise<boolean> {
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
      
      // Initialize Cloudflare API
      this.cloudflareApiToken = cloudflareApiToken;
      if (this.cloudflareApiToken) {
        cfTools.setApiToken(this.cloudflareApiToken);
      }
      
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
      throw new Error("DNS Manager not initialized. Call initialize() first.");
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
      cloudflare: {
        nameserversConfigured: false,
        zoneActive: false,
        wwwRecordExists: false,
        sslConfigured: false
      },
      namecheap: {
        usingCloudflareNameservers: false,
        nameservers: []
      },
      issues: [],
      recommendations: []
    };
    
    try {
      // Check Namecheap configuration
      const nameservers = await this.namecheapApi!.getDnsList();
      result.namecheap.nameservers = nameservers;
      result.namecheap.usingCloudflareNameservers = nameservers.some(ns => 
        ns.includes('cloudflare.com')
      );
      
      if (!result.namecheap.usingCloudflareNameservers) {
        result.issues.push("Namecheap is not using Cloudflare nameservers");
        result.recommendations.push("Configure Namecheap to use Cloudflare nameservers");
        result.status = 'critical';
      }
      
      // Check Cloudflare configuration if we have an API token
      if (this.cloudflareApiToken) {
        // Verify token
        const tokenValid = await cfTools.verifyApiToken();
        if (!tokenValid) {
          result.issues.push("Cloudflare API token is invalid");
          result.recommendations.push("Provide a valid Cloudflare API token");
          result.status = 'critical';
          return result;
        }
        
        // Check zone status
        const zoneStatus = await cfTools.checkZoneStatus();
        result.cloudflare.zoneActive = zoneStatus && zoneStatus.status === 'active';
        
        if (!result.cloudflare.zoneActive) {
          result.issues.push("Cloudflare zone is not active");
          result.recommendations.push("Verify Cloudflare zone configuration and nameserver setup");
          result.status = 'critical';
        }
        
        // Check if using Cloudflare nameservers
        result.cloudflare.nameserversConfigured = zoneStatus && 
          zoneStatus.name_servers && 
          zoneStatus.name_servers.every(ns => ns.includes('cloudflare.com'));
        
        // Check for www record
        const dnsRecords = await cfTools.checkDnsSettings();
        const wwwRecord = dnsRecords.find(record => 
          record.type === 'A' && record.name === 'www.snakkaz.com'
        );
        result.cloudflare.wwwRecordExists = !!wwwRecord;
        
        if (!result.cloudflare.wwwRecordExists) {
          result.issues.push("www subdomain not configured in Cloudflare");
          result.recommendations.push("Add www subdomain to Cloudflare DNS");
          result.status = result.status === 'healthy' ? 'issues' : result.status;
        }
        
        // Check SSL config
        try {
          const sslResponse = await fetch(`${cloudflareConfig.apiBase}/zones/${cloudflareConfig.zoneId}/settings/ssl`, {
            method: 'GET',
            headers: cfTools.getHeaders()
          });
          const sslData = await sslResponse.json();
          result.cloudflare.sslConfigured = sslData.success && 
                                          (sslData.result.value === 'flexible' || 
                                           sslData.result.value === 'full' || 
                                           sslData.result.value === 'strict');
          
          if (!result.cloudflare.sslConfigured) {
            result.issues.push("SSL not properly configured in Cloudflare");
            result.recommendations.push("Configure SSL in Cloudflare to at least 'Flexible' mode");
            result.status = result.status === 'healthy' ? 'issues' : result.status;
          }
        } catch (error) {
          console.error("Error checking SSL settings:", error);
          result.issues.push("Could not check SSL configuration");
        }
      } else {
        result.issues.push("No Cloudflare API token provided");
        result.recommendations.push("Provide a Cloudflare API token for complete health check");
        result.status = 'issues';
      }
      
      return result;
    } catch (error) {
      console.error("Error performing health check:", error);
      result.status = 'critical';
      result.issues.push(`Error during health check: ${error.message}`);
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
      
      // Fix Namecheap nameservers if not using Cloudflare
      if (!healthCheck.namecheap.usingCloudflareNameservers) {
        try {
          const success = await this.namecheapApi!.setCloudflareNameservers();
          if (success) {
            fixes.push("Configured Namecheap to use Cloudflare nameservers");
          } else {
            failures.push("Failed to configure Namecheap to use Cloudflare nameservers");
          }
        } catch (error) {
          console.error("Error setting Cloudflare nameservers:", error);
          failures.push(`Failed to set Cloudflare nameservers: ${error.message}`);
        }
      }
      
      // Fix Cloudflare configuration if we have an API token
      if (this.cloudflareApiToken) {
        // Ensure www record exists
        if (!healthCheck.cloudflare.wwwRecordExists) {
          try {
            // Use default IP or get from config
            const serverIp = namecheapConfig.defaultDnsRecords.find(
              r => r.hostname === 'www'
            )?.address || '76.76.21.21';
            
            const success = await cfTools.updateWwwRecord(serverIp);
            if (success) {
              fixes.push("Created www DNS record in Cloudflare");
            } else {
              failures.push("Failed to create www DNS record in Cloudflare");
            }
          } catch (error) {
            console.error("Error creating www record:", error);
            failures.push(`Failed to create www record: ${error.message}`);
          }
        }
        
        // Configure SSL if not already configured
        if (!healthCheck.cloudflare.sslConfigured) {
          try {
            const success = await cfTools.configureSsl();
            if (success) {
              fixes.push("Configured SSL settings in Cloudflare");
            } else {
              failures.push("Failed to configure SSL settings in Cloudflare");
            }
          } catch (error) {
            console.error("Error configuring SSL:", error);
            failures.push(`Failed to configure SSL: ${error.message}`);
          }
        }
        
        // Ensure Always Use HTTPS is enabled
        try {
          const success = await cfTools.configureAlwaysUseHttps();
          if (success) {
            fixes.push("Enabled Always Use HTTPS in Cloudflare");
          } else {
            failures.push("Failed to enable Always Use HTTPS in Cloudflare");
          }
        } catch (error) {
          console.error("Error configuring Always Use HTTPS:", error);
          failures.push(`Failed to configure Always Use HTTPS: ${error.message}`);
        }
      }
      
      return {
        success: failures.length === 0 && fixes.length > 0,
        fixes,
        failures
      };
    } catch (error) {
      console.error("Error auto-fixing DNS issues:", error);
      return {
        success: false,
        fixes,
        failures: [...failures, `General error during auto-fix: ${error.message}`]
      };
    }
  }

  /**
   * Create a dashboard widget with DNS status information
   * @param elementId ID of the HTML element to place the widget
   * @returns The created HTML element
   */
  async createDashboardWidget(elementId: string): Promise<HTMLElement> {
    const container = document.getElementById(elementId);
    if (!container) {
      throw new Error(`Element with ID ${elementId} not found`);
    }
    
    // Create widget structure
    container.innerHTML = `
      <div class="dns-status-widget">
        <h3>DNS & Cloudflare Status</h3>
        <div class="loading-indicator">Checking DNS status...</div>
        <div class="status-container" style="display: none;">
          <div class="status-summary">
            <div class="status-indicator"></div>
            <div class="status-text"></div>
          </div>
          <div class="details">
            <h4>Namecheap</h4>
            <ul class="namecheap-details"></ul>
            
            <h4>Cloudflare</h4>
            <ul class="cloudflare-details"></ul>
          </div>
          <div class="issues-container" style="display: none;">
            <h4>Issues</h4>
            <ul class="issues-list"></ul>
          </div>
          <div class="actions">
            <button class="refresh-btn">Refresh Status</button>
            <button class="autofix-btn" style="display: none;">Auto-Fix Issues</button>
          </div>
        </div>
      </div>
    `;
    
    // Add basic styling
    const style = document.createElement('style');
    style.textContent = `
      .dns-status-widget {
        background: #f5f5f5;
        border-radius: 8px;
        padding: 16px;
        font-family: sans-serif;
      }
      .status-indicator {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 8px;
      }
      .status-healthy { background-color: #4CAF50; }
      .status-issues { background-color: #FF9800; }
      .status-critical { background-color: #F44336; }
      .status-summary {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
      }
      .details h4 {
        margin: 16px 0 8px;
      }
      .actions {
        margin-top: 16px;
      }
      .actions button {
        padding: 8px 16px;
        margin-right: 8px;
        cursor: pointer;
      }
      .autofix-btn {
        background-color: #2196F3;
        color: white;
        border: none;
        border-radius: 4px;
      }
      .refresh-btn {
        background-color: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
    `;
    document.head.appendChild(style);
    
    // Set up event handlers
    const refreshBtn = container.querySelector('.refresh-btn') as HTMLButtonElement;
    const autofixBtn = container.querySelector('.autofix-btn') as HTMLButtonElement;
    
    refreshBtn.addEventListener('click', () => this.updateDashboardWidget(container));
    autofixBtn.addEventListener('click', () => this.handleAutoFix(container));
    
    // Initial update
    await this.updateDashboardWidget(container);
    
    return container;
  }

  /**
   * Update the DNS dashboard widget with current status
   * @param container Widget container element
   */
  private async updateDashboardWidget(container: HTMLElement): Promise<void> {
    const loadingIndicator = container.querySelector('.loading-indicator') as HTMLElement;
    const statusContainer = container.querySelector('.status-container') as HTMLElement;
    
    loadingIndicator.style.display = 'block';
    statusContainer.style.display = 'none';
    
    try {
      // Check if APIs are initialized
      this.ensureInitialized();
      
      // Get health check
      const healthCheck = await this.performHealthCheck();
      
      // Update status indicator
      const statusIndicator = container.querySelector('.status-indicator') as HTMLElement;
      const statusText = container.querySelector('.status-text') as HTMLElement;
      
      statusIndicator.className = 'status-indicator';
      statusIndicator.classList.add(`status-${healthCheck.status}`);
      
      // Set status text
      switch (healthCheck.status) {
        case 'healthy':
          statusText.textContent = 'DNS configuration is healthy';
          break;
        case 'issues':
          statusText.textContent = 'DNS configuration has some issues';
          break;
        case 'critical':
          statusText.textContent = 'DNS configuration has critical issues';
          break;
      }
      
      // Update Namecheap details
      const namecheapList = container.querySelector('.namecheap-details') as HTMLElement;
      namecheapList.innerHTML = `
        <li>Using Cloudflare nameservers: <strong>${healthCheck.namecheap.usingCloudflareNameservers ? 'Yes ✅' : 'No ❌'}</strong></li>
        <li>Current nameservers: <strong>${healthCheck.namecheap.nameservers.join(', ') || 'None found'}</strong></li>
      `;
      
      // Update Cloudflare details
      const cloudflareList = container.querySelector('.cloudflare-details') as HTMLElement;
      cloudflareList.innerHTML = `
        <li>Zone active: <strong>${healthCheck.cloudflare.zoneActive ? 'Yes ✅' : 'No ❌'}</strong></li>
        <li>www record exists: <strong>${healthCheck.cloudflare.wwwRecordExists ? 'Yes ✅' : 'No ❌'}</strong></li>
        <li>SSL configured: <strong>${healthCheck.cloudflare.sslConfigured ? 'Yes ✅' : 'No ❌'}</strong></li>
      `;
      
      // Update issues
      const issuesContainer = container.querySelector('.issues-container') as HTMLElement;
      const issuesList = container.querySelector('.issues-list') as HTMLElement;
      
      if (healthCheck.issues.length > 0) {
        issuesContainer.style.display = 'block';
        issuesList.innerHTML = healthCheck.issues.map(issue => `<li>${issue}</li>`).join('');
        
        // Show autofix button if there are issues
        const autofixBtn = container.querySelector('.autofix-btn') as HTMLElement;
        autofixBtn.style.display = 'inline-block';
      } else {
        issuesContainer.style.display = 'none';
        const autofixBtn = container.querySelector('.autofix-btn') as HTMLElement;
        autofixBtn.style.display = 'none';
      }
      
      // Show status container
      loadingIndicator.style.display = 'none';
      statusContainer.style.display = 'block';
    } catch (error) {
      console.error("Error updating widget:", error);
      
      // Show error in widget
      loadingIndicator.style.display = 'none';
      statusContainer.style.display = 'block';
      
      const statusIndicator = container.querySelector('.status-indicator') as HTMLElement;
      const statusText = container.querySelector('.status-text') as HTMLElement;
      
      statusIndicator.className = 'status-indicator status-critical';
      statusText.textContent = `Error: ${error.message}`;
    }
  }

  /**
   * Handle auto-fix button click in dashboard widget
   * @param container Widget container element
   */
  private async handleAutoFix(container: HTMLElement): Promise<void> {
    const autofixBtn = container.querySelector('.autofix-btn') as HTMLButtonElement;
    
    // Disable button and change text
    autofixBtn.disabled = true;
    autofixBtn.textContent = 'Fixing issues...';
    
    try {
      // Run auto-fix
      const result = await this.autoFix();
      
      // Show results
      const issuesList = container.querySelector('.issues-list') as HTMLElement;
      
      if (result.success) {
        issuesList.innerHTML = `<li class="success">✅ Auto-fix successful!</li>`;
        result.fixes.forEach(fix => {
          issuesList.innerHTML += `<li class="success">✅ ${fix}</li>`;
        });
      } else {
        issuesList.innerHTML = `<li class="error">❌ Some issues could not be fixed</li>`;
        result.fixes.forEach(fix => {
          issuesList.innerHTML += `<li class="success">✅ ${fix}</li>`;
        });
        result.failures.forEach(failure => {
          issuesList.innerHTML += `<li class="error">❌ ${failure}</li>`;
        });
      }
      
      // Update status after a short delay
      setTimeout(() => {
        this.updateDashboardWidget(container);
        
        // Re-enable button
        autofixBtn.disabled = false;
        autofixBtn.textContent = 'Auto-Fix Issues';
      }, 3000);
    } catch (error) {
      console.error("Error during auto-fix:", error);
      
      // Show error
      const issuesList = container.querySelector('.issues-list') as HTMLElement;
      issuesList.innerHTML = `<li class="error">❌ Error during auto-fix: ${error.message}</li>`;
      
      // Re-enable button
      autofixBtn.disabled = false;
      autofixBtn.textContent = 'Auto-Fix Issues';
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
 * @param elementId ID of the container element
 * @param namecheapApiKey Namecheap API key
 * @param cloudflareApiToken Cloudflare API token
 * @returns The created widget element
 */
export async function createDnsStatusWidget(
  elementId: string,
  namecheapApiKey: string,
  cloudflareApiToken: string
): Promise<HTMLElement> {
  const manager = getDnsManager();
  await manager.initialize(namecheapApiKey, cloudflareApiToken);
  return manager.createDashboardWidget(elementId);
}
