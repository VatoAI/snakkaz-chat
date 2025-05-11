/**
 * Cloudflare Configuration Helper
 * 
 * This script provides utilities to configure Cloudflare for a correct deployment
 * of Snakkaz Chat on www.snakkaz.com
 */

// Config 
const config = {
  // Zone ID for the domain in Cloudflare
  zoneId: 'bba5fb2c80aede33ac2c22f8f99110d3',
  
  // Cloudflare account ID
  accountId: '0785388bb3883d3a10ab7f60a7a4968a',
  
  // Domain name
  domain: 'snakkaz.com',
  
  // API endpoints
  apiBase: 'https://api.cloudflare.com/client/v4'
};

/**
 * Main configuration tool for Cloudflare
 */
const cfTools = {
  apiToken: null,
  
  /**
   * Set the API token for future operations
   * @param {string} token - Cloudflare API token
   */
  setApiToken(token) {
    this.apiToken = token;
    console.log('API token set successfully');
  },
  
  /**
   * Get headers for Cloudflare API requests
   * @returns {object} Headers object
   */
  getHeaders() {
    if (!this.apiToken) {
      throw new Error('API token not set. Use cfTools.setApiToken() first.');
    }
    
    return {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    };
  },
  
  /**
   * Check if the Cloudflare API token is valid
   * @returns {Promise<boolean>} Whether the token is valid
   */
  async verifyApiToken() {
    try {
      const response = await fetch(`${config.apiBase}/user/tokens/verify`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await response.json();
      if (data.success) {
        console.log('✅ API token is valid');
        return true;
      } else {
        console.error('❌ API token is invalid:', data.errors);
        return false;
      }
    } catch (error) {
      console.error('❌ Error verifying API token:', error);
      return false;
    }
  },
  
  /**
   * Check the current DNS settings
   * @returns {Promise<object>} DNS records
   */
  async checkDnsSettings() {
    try {
      const response = await fetch(`${config.apiBase}/zones/${config.zoneId}/dns_records`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await response.json();
      if (data.success) {
        console.log('✅ DNS records retrieved successfully');
        // Print out the www record specifically
        const wwwRecord = data.result.find(record => 
          record.type === 'A' && record.name === 'www.snakkaz.com'
        );
        
        if (wwwRecord) {
          console.log('Current www record:', {
            name: wwwRecord.name,
            type: wwwRecord.type,
            content: wwwRecord.content,
            proxied: wwwRecord.proxied
          });
        } else {
          console.log('⚠️ No www record found for www.snakkaz.com');
        }
        
        return data.result;
      } else {
        console.error('❌ Error retrieving DNS records:', data.errors);
        return [];
      }
    } catch (error) {
      console.error('❌ Error checking DNS settings:', error);
      return [];
    }
  },
  
  /**
   * Create or update the DNS record for www.snakkaz.com
   * @param {string} ipAddress - The server IP address
   * @returns {Promise<boolean>} Success status
   */
  async updateWwwRecord(ipAddress) {
    if (!ipAddress) {
      console.error('❌ IP address is required');
      return false;
    }
    
    try {
      // First check if the record already exists
      const records = await this.checkDnsSettings();
      const wwwRecord = records.find(record => 
        record.type === 'A' && record.name === 'www.snakkaz.com'
      );
      
      let response;
      
      if (wwwRecord) {
        // Update existing record
        response = await fetch(`${config.apiBase}/zones/${config.zoneId}/dns_records/${wwwRecord.id}`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify({
            type: 'A',
            name: 'www',
            content: ipAddress,
            ttl: 1, // Auto TTL
            proxied: true // Enable Cloudflare proxy
          })
        });
      } else {
        // Create new record
        response = await fetch(`${config.apiBase}/zones/${config.zoneId}/dns_records`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({
            type: 'A',
            name: 'www',
            content: ipAddress,
            ttl: 1, // Auto TTL
            proxied: true // Enable Cloudflare proxy
          })
        });
      }
      
      const data = await response.json();
      if (data.success) {
        console.log(`✅ Successfully ${wwwRecord ? 'updated' : 'created'} www record`);
        return true;
      } else {
        console.error(`❌ Error ${wwwRecord ? 'updating' : 'creating'} www record:`, data.errors);
        return false;
      }
    } catch (error) {
      console.error('❌ Error updating www record:', error);
      return false;
    }
  },
  
  /**
   * Configure SSL/TLS settings for the domain
   * @returns {Promise<boolean>} Success status
   */
  async configureSsl() {
    try {
      const response = await fetch(`${config.apiBase}/zones/${config.zoneId}/settings/ssl`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({
          value: 'flexible' // Start with flexible, then upgrade to full once deployed
        })
      });
      
      const data = await response.json();
      if (data.success) {
        console.log('✅ SSL/TLS settings updated successfully');
        return true;
      } else {
        console.error('❌ Error updating SSL/TLS settings:', data.errors);
        return false;
      }
    } catch (error) {
      console.error('❌ Error configuring SSL:', error);
      return false;
    }
  },
  
  /**
   * Configure Always Use HTTPS
   * @returns {Promise<boolean>} Success status
   */
  async configureAlwaysUseHttps() {
    try {
      const response = await fetch(`${config.apiBase}/zones/${config.zoneId}/settings/always_use_https`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({
          value: 'on'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        console.log('✅ Always Use HTTPS setting updated successfully');
        return true;
      } else {
        console.error('❌ Error updating Always Use HTTPS setting:', data.errors);
        return false;
      }
    } catch (error) {
      console.error('❌ Error configuring Always Use HTTPS:', error);
      return false;
    }
  },
  
  /**
   * Check Cloudflare zone activation status
   * @returns {Promise<object>} Zone details
   */
  async checkZoneStatus() {
    try {
      const response = await fetch(`${config.apiBase}/zones/${config.zoneId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await response.json();
      if (data.success) {
        console.log('✅ Zone status retrieved successfully');
        console.log('Zone status:', data.result.status);
        console.log('Name servers:', data.result.name_servers);
        return data.result;
      } else {
        console.error('❌ Error retrieving zone status:', data.errors);
        return null;
      }
    } catch (error) {
      console.error('❌ Error checking zone status:', error);
      return null;
    }
  },
  
  /**
   * Run a comprehensive check of Cloudflare setup
   * @param {string} serverIp - The server IP address
   * @returns {Promise<object>} Status report
   */
  async checkSetup(serverIp) {
    const report = {
      tokenValid: false,
      zoneActive: false,
      wwwRecordExists: false,
      sslConfigured: false,
      alwaysHttps: false
    };
    
    // Verify token
    report.tokenValid = await this.verifyApiToken();
    if (!report.tokenValid) return report;
    
    // Check zone status
    const zoneStatus = await this.checkZoneStatus();
    report.zoneActive = zoneStatus && zoneStatus.status === 'active';
    
    // Check DNS records
    const dnsRecords = await this.checkDnsSettings();
    const wwwRecord = dnsRecords.find(record => 
      record.type === 'A' && record.name === 'www.snakkaz.com'
    );
    report.wwwRecordExists = !!wwwRecord;
    
    if (serverIp && (!wwwRecord || wwwRecord.content !== serverIp)) {
      console.log(`Updating www record to point to ${serverIp}...`);
      await this.updateWwwRecord(serverIp);
    }
    
    // Check SSL settings
    try {
      const sslResponse = await fetch(`${config.apiBase}/zones/${config.zoneId}/settings/ssl`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const sslData = await sslResponse.json();
      report.sslConfigured = sslData.success && 
                             (sslData.result.value === 'flexible' || 
                              sslData.result.value === 'full' || 
                              sslData.result.value === 'strict');
    } catch (error) {
      console.error('Error checking SSL settings:', error);
    }
    
    // Check Always Use HTTPS
    try {
      const httpsResponse = await fetch(`${config.apiBase}/zones/${config.zoneId}/settings/always_use_https`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const httpsData = await httpsResponse.json();
      report.alwaysHttps = httpsData.success && httpsData.result.value === 'on';
    } catch (error) {
      console.error('Error checking Always Use HTTPS setting:', error);
    }
    
    console.log('Cloudflare Setup Report:', report);
    return report;
  },
  
  /**
   * Display help information
   */
  help() {
    console.log(`
Cloudflare Configuration Tool for Snakkaz Chat

Available commands:
- cfTools.setApiToken('your-api-token') - Set the Cloudflare API token
- cfTools.verifyApiToken() - Check if the API token is valid
- cfTools.checkDnsSettings() - Check current DNS records
- cfTools.updateWwwRecord('server-ip') - Update the www record
- cfTools.configureSsl() - Configure SSL/TLS settings
- cfTools.configureAlwaysUseHttps() - Enable Always Use HTTPS
- cfTools.checkZoneStatus() - Check zone activation status
- cfTools.checkSetup('server-ip') - Run a comprehensive check of Cloudflare setup
- cfTools.help() - Display this help information

Example usage:
1. cfTools.setApiToken('your-api-token')
2. cfTools.checkSetup('123.45.67.89')
    `);
  }
};

// Export the tools
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { cfTools, config };
} else if (typeof window !== 'undefined') {
  window.cfTools = cfTools;
}

// Automatically show help when loaded directly
if (typeof window !== 'undefined') {
  console.log('Cloudflare configuration tools loaded. Use cfTools.help() for usage information.');
}
