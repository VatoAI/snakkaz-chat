# MCP (Model Context Protocol) Subdomain Configuration

## Overview

The `mcp.snakkaz.com` subdomain is designated for hosting the Model Context Protocol (MCP) server component of Snakkaz Chat. This subdomain provides a dedicated endpoint for AI model integration and context management functionalities.

## DNS Configuration

As part of the migration from Cloudflare to Namecheap DNS, the MCP subdomain has been configured as follows:

| Type  | Host/Name | Value/Target  | TTL      |
|-------|-----------|---------------|----------|
| CNAME | mcp       | snakkaz.com.  | Automatic |

Previously, this was configured as an A record pointing directly to the server IP (185.158.133.1). We've updated it to a CNAME record for more flexibility in infrastructure management.

## Purpose & Functionality

The MCP subdomain serves the following purposes:

1. **Model Context Protocol Server**: Hosts the server component that manages context for AI conversations
2. **API Endpoints**: Provides dedicated API endpoints for model inference and context management
3. **Resource Isolation**: Separates AI model traffic from the main application traffic for better resource management
4. **Security Compartmentalization**: Isolates AI model access from the main application domain

## Implementation Details

The MCP server implements the [Model Context Protocol](https://github.com/microsoft/model-context-protocol) specification, which defines standardized methods for:

- Managing conversation context
- Handling token limitations
- Structuring prompts and responses
- Processing embedding requests
- Managing AI model parameters

## Health Monitoring

To verify the MCP subdomain is functioning correctly, you can run the following test:

```bash
curl -I https://mcp.snakkaz.com/health
```

Expected response:
```
HTTP/2 200 
content-type: application/json
```

## Troubleshooting

If the MCP subdomain returns a 403 error, possible causes include:

1. **DNS Propagation**: DNS changes may take up to 48 hours to fully propagate
2. **SSL Certificate**: The SSL certificate may not include the MCP subdomain
3. **Server Configuration**: The web server may need configuration to recognize the subdomain
4. **Access Controls**: There might be restrictive access controls in place

## Related Components

The MCP functionality integrates with:

1. **Supabase**: For context storage and retrieval
2. **Main Chat Application**: For processing user messages
3. **Analytics**: For tracking model performance

## Next Steps

- Complete SSL configuration for the MCP subdomain
- Configure proper CORS headers for cross-subdomain communication
- Implement health checks for monitoring
- Update application code to use the dedicated MCP subdomain
