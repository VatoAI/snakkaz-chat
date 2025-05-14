# Cloudflare API Integration Guide

## Configuration

The Snakkaz Chat application has been integrated with Cloudflare API using the following credentials:

- **Zone ID**: bba5fb2c80aede33ac2c22f8f99110d3
- **Account ID**: 0785388bb3883d3a10ab7f60a7a4968a

These credentials are stored in `cloudflareConfig.ts`.

## Creating an API Token

Before using the Cloudflare management tools, you need to create an API token:

1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to User Profile > API Tokens
3. Click "Create Token"
4. Either use a template or create a custom token with these permissions:
   - Zone - Cache Purge - Purge
   - Zone - DNS - Edit
   - Zone - Analytics - Read
   - Include the zone: snakkaz.com
5. Set an appropriate expiration time and description
6. Create the token and save it securely

## Using the Management Tool

The Cloudflare management tool provides browser console functions to interact with Cloudflare:

### Import the tool in browser console:

```javascript
import("/src/services/encryption/cloudflareManagement.js")
  .then(m => {
    window.cfTools = m.cfTools;
    cfTools.help();
  });
```

### Available Commands

- `cfTools.validateToken()` - Validate your Cloudflare API token
- `cfTools.testConnection()` - Test Cloudflare connectivity and get zone details
- `cfTools.purgeCache()` - Purge the entire cache for snakkaz.com
- `cfTools.listDnsRecords()` - List all DNS records for snakkaz.com
- `cfTools.showConfig()` - Show current Cloudflare configuration
- `cfTools.clearApiToken()` - Clear the stored API token
- `cfTools.help()` - Show command list

### Example: Purge Cache

```javascript
// Import the tool
import("/src/services/encryption/cloudflareManagement.js")
  .then(m => window.cfTools = m.cfTools);

// Purge cache (will prompt for API token if not already stored)
cfTools.purgeCache();
```

## Security Notes

- API tokens are only stored in browser session storage and cleared when the session ends
- Tokens can be manually cleared with `cfTools.clearApiToken()`
- Never commit API tokens to the repository or share them in public channels
- Create tokens with the minimum necessary permissions and appropriate expirations

## Programmatic Usage

The Cloudflare API utilities can also be used programmatically in your application:

```typescript
import { purgeCache, getZoneDetails } from './cloudflareApi';

// Example: Purging specific files from cache
async function purgeSomeFiles(apiToken: string) {
  const files = [
    'https://www.snakkaz.com/assets/main.js',
    'https://www.snakkaz.com/assets/style.css'
  ];
  
  const result = await purgeCache(apiToken, files);
  console.log('Cache purge result:', result);
}
```

## API Documentation

For detailed Cloudflare API documentation, visit:
https://api.cloudflare.com/

The Zone ID and Account ID have been extracted from the Cloudflare Dashboard and securely stored in the application's configuration.
