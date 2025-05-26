# Snakkaz DNS Management Guide

## Introduction

This guide explains how to use the integrated DNS management tools for Snakkaz Chat. These tools help ensure proper configuration of DNS settings for the www.snakkaz.com domain by providing:

1. Automated configuration of Cloudflare nameservers in Namecheap
2. DNS health checks to identify configuration issues
3. Auto-fix capabilities for common DNS problems
4. Integration with both Namecheap API and Cloudflare API
5. Dashboard widget for real-time DNS status monitoring

## Prerequisites

1. Namecheap account with API access enabled
2. Cloudflare account with API token
3. Domain registered with Namecheap
4. Cloudflare zone set up for the domain

### Getting API Credentials

#### Namecheap API

1. Log into your Namecheap account
2. Navigate to Profile > Tools
3. Scroll down to "Business & Dev Tools" section
4. Click "Manage" next to "Namecheap API Access"
5. Enable API access if not already enabled
6. Note your API key
7. Whitelist your IP address in the API settings

#### Cloudflare API

1. Log into Cloudflare dashboard
2. Navigate to User Profile > API Tokens
3. Click "Create Token"
4. Select "Edit zone DNS" template or create a custom token with these permissions:
   - Zone.DNS.Edit
   - Zone.Settings.Edit
   - Zone.Cache.Purge
5. Restrict the token to the snakkaz.com zone
6. Create the token and save it securely

## Using the Command Line Tool

The command line tool provides an easy way to manage DNS settings:

```bash
# Navigate to the project directory
cd /workspaces/snakkaz-chat

# Make the script executable (if needed)
chmod +x src/services/encryption/manage-dns.js

# Run the tool
node src/services/encryption/manage-dns.js
```

### Available Commands

The CLI tool offers the following options:

1. **Check DNS health** - Verifies the current DNS configuration
2. **Auto-fix DNS issues** - Automatically fixes common DNS problems
3. **Set Cloudflare nameservers in Namecheap** - Configures Namecheap to use Cloudflare DNS
4. **Exit** - Quit the tool

### Expected Results

When properly configured:

- Namecheap should use Cloudflare nameservers (kyle.ns.cloudflare.com and vita.ns.cloudflare.com)
- Cloudflare zone should be active
- www record should be configured in Cloudflare
- SSL should be enabled in Cloudflare
- "Always use HTTPS" should be enabled in Cloudflare

## Using the Dashboard Widget

For web-based monitoring, add the DNS status widget to your dashboard:

```javascript
// In your dashboard code:
import { createDnsStatusWidget } from './services/encryption/dnsManager';

// When the dashboard loads:
async function initDashboard() {
  // Create container element
  const dnsWidgetContainer = document.createElement('div');
  dnsWidgetContainer.id = 'dns-status-widget';
  document.querySelector('.dashboard-container').appendChild(dnsWidgetContainer);
  
  // Configure the widget (replace with your actual API keys)
  const namecheapApiKey = 'your-namecheap-api-key';
  const cloudflareApiToken = 'your-cloudflare-api-token';
  
  // Initialize the widget
  await createDnsStatusWidget('dns-status-widget', namecheapApiKey, cloudflareApiToken);
}
```

### Widget Features

The widget provides:

- Real-time DNS health status
- Overview of Namecheap and Cloudflare configurations
- List of detected issues
- Auto-fix button for one-click problem resolution
- Manual refresh button

## Common Issues and Solutions

### Cloudflare Not Detecting the Domain

**Issue**: Cloudflare zone is not active.
**Solution**: Ensure Namecheap is using Cloudflare nameservers (kyle.ns.cloudflare.com and vita.ns.cloudflare.com).

### SSL Not Working

**Issue**: SSL configuration is not set correctly in Cloudflare.
**Solution**: Use the auto-fix feature to configure SSL to at least "Flexible" mode.

### Subdomains Not Working

**Issue**: DNS records for subdomains are missing in Cloudflare.
**Solution**: Add the necessary DNS records in Cloudflare dashboard or use the API tools.

### DNS Propagation Delays

**Issue**: Changes to DNS can take time to propagate globally.
**Solution**: Wait up to 48 hours for changes to fully propagate. The widget and CLI tool will show the current status.

## Advanced Configuration

For more advanced configurations or custom DNS records:

1. Directly use the `DnsManager` class in your code:

```typescript
import { getDnsManager } from './services/encryption/dnsManager';

async function configureDns() {
  const manager = getDnsManager(true); // true = use production
  await manager.initialize('namecheap-api-key', 'cloudflare-api-token');
  
  // Check current health
  const health = await manager.performHealthCheck();
  console.log('DNS Health:', health);
  
  // Auto-fix if needed
  if (health.status !== 'healthy') {
    const fixResult = await manager.autoFix();
    console.log('Fix result:', fixResult);
  }
}
```

2. Use the Namecheap and Cloudflare APIs directly for custom operations:

```typescript
import { createNamecheapApi, getClientIp } from './services/encryption/namecheapApi';
import { cfTools } from './configure-cloudflare.js';

async function customDnsOperations() {
  // Setup Namecheap API
  const clientIp = await getClientIp();
  const namecheapApi = createNamecheapApi('api-user', 'api-key', 'username', clientIp, true);
  
  // Setup Cloudflare API
  cfTools.setApiToken('cloudflare-token');
  
  // Custom operations
  const hostRecords = await namecheapApi.getHostRecords();
  const dnsRecords = await cfTools.checkDnsSettings();
  
  // Implement your custom logic here
}
```

## Troubleshooting

If you encounter issues with the DNS management tools:

1. Verify your API credentials are correct and not expired
2. Ensure your IP is whitelisted in Namecheap API settings
3. Check that the Cloudflare API token has the correct permissions
4. Verify the domain is registered and active in Namecheap
5. Confirm the zone is created in Cloudflare
6. Check network connectivity to both API endpoints

## Reference

For more information, refer to the official documentation:

- [Namecheap API Documentation](https://www.namecheap.com/support/api/intro/)
- [Cloudflare API Documentation](https://api.cloudflare.com/)
