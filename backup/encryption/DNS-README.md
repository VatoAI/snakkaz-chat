# Snakkaz DNS and Cloudflare Integration

This directory contains tools for managing DNS configuration for the Snakkaz Chat application, integrating with both Namecheap and Cloudflare APIs.

## Key Files

- `namecheapApi.ts` - Namecheap API integration for DNS management
- `namecheapConfig.ts` - Configuration settings for Namecheap API
- `dnsManager.ts` - Unified DNS management tool integrating both Namecheap and Cloudflare
- `manage-dns.js` - Command line tool for DNS management
- `DNS-MANAGEMENT-GUIDE.md` - Comprehensive guide on using DNS management tools
- `deploy-snakkaz-with-dns-check.sh` - Deployment script with integrated DNS checks

## Quick Start

### Using the CLI Tool

```bash
# Make the script executable
chmod +x manage-dns.js

# Run the CLI tool
node manage-dns.js
```

### Using the DNS Manager in Your Code

```typescript
import { getDnsManager } from './dnsManager';

async function checkDnsHealth() {
  const manager = getDnsManager();
  await manager.initialize('your-namecheap-api-key', 'your-cloudflare-api-token');
  
  const healthStatus = await manager.performHealthCheck();
  console.log('DNS Health:', healthStatus);
  
  if (healthStatus.status !== 'healthy') {
    const fixResult = await manager.autoFix();
    console.log('Auto-fix result:', fixResult);
  }
}
```

### Adding the DNS Status Widget to Your Dashboard

```typescript
import { createDnsStatusWidget } from './dnsManager';

// In your dashboard initialization code:
async function initDashboard() {
  // Create a container for the widget
  const container = document.createElement('div');
  container.id = 'dns-status-widget';
  document.body.appendChild(container);
  
  // Initialize the widget with API keys
  await createDnsStatusWidget(
    'dns-status-widget',
    'your-namecheap-api-key',
    'your-cloudflare-api-token'
  );
}
```

## Deployment with DNS Check

Use the enhanced deployment script to check and fix DNS issues during deployment:

```bash
# Make the script executable
chmod +x deploy-snakkaz-with-dns-check.sh

# Run the deployment script
./deploy-snakkaz-with-dns-check.sh
```

## Required API Credentials

To use these tools, you'll need:

1. **Namecheap API Key** - Get this from your Namecheap account under Profile > Tools > API Access
2. **Cloudflare API Token** - Create this in your Cloudflare dashboard under User Profile > API Tokens

For detailed instructions on obtaining these credentials and using the tools, please see the [DNS Management Guide](./DNS-MANAGEMENT-GUIDE.md).

## Features

- Automatic DNS health checks
- Verification of Cloudflare nameserver configuration
- Auto-fix for common DNS issues
- Dashboard widget for monitoring DNS status
- CLI tool for DNS management
- Integration with deployment process
