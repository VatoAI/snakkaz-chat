# Cloudflare to Namecheap Migration: Subdomain Setup Guide

## Overview

This document provides instructions for setting up and configuring subdomains for Snakkaz Chat after migrating from Cloudflare to Namecheap hosting. Proper subdomain configuration ensures that all parts of the application are accessible to users.

## Required DNS Configuration

The following DNS records should be configured in your Namecheap account:

| Type  | Host       | Value           | TTL       |
|-------|------------|-----------------|-----------|
| A     | @          | 185.158.133.1   | 5 min     |
| A     | mcp        | 185.158.133.1   | 5 min     |
| CNAME | www        | snakkaz.com     | Automatic |
| CNAME | dash       | snakkaz.com     | Automatic |
| CNAME | business   | snakkaz.com     | Automatic |
| CNAME | docs       | snakkaz.com     | Automatic |
| CNAME | analytics  | snakkaz.com     | Automatic |
| CNAME | help       | snakkaz.com     | Automatic |

## Server Configuration

### .htaccess Setup

The following `.htaccess` configuration has been created for the main domain and all subdomains:

1. **Main .htaccess (root directory)**
   - Handles routing for all subdomains
   - Configures proper CORS headers
   - Implements gzip compression and browser caching

2. **Subdomain .htaccess Files**
   - Each subdomain has its own .htaccess file
   - Configured to route SPA (Single Page Application) requests properly
   - Located in the corresponding subdomain directory

### Directory Structure

```
/home/snakqsqe/
├── index.html            # Main application entry point
├── .htaccess             # Main .htaccess file
├── dash/                 # Dashboard subdomain
│   ├── index.html        # Dashboard entry point
│   └── .htaccess         # Dashboard specific rules
├── business/             # Business subdomain
│   ├── index.html
│   └── .htaccess
├── docs/                 # Documentation subdomain
│   ├── index.html
│   └── .htaccess
├── analytics/            # Analytics subdomain
│   ├── index.html
│   └── .htaccess
├── help/                 # Help center subdomain
│   ├── index.html
│   └── .htaccess
└── mcp/                  # MCP subdomain
    ├── index.html
    └── .htaccess
```

## SSL Certificate Setup

For optimal security, SSL certificates should be configured for all subdomains. With Namecheap hosting, you can use:

1. **Namecheap PositiveSSL**
   - Included with premium hosting plans
   - Supports multiple subdomains
   - Managed through Namecheap control panel

2. **Let's Encrypt** (Alternative)
   - Free SSL certificates
   - Can be automatically renewed
   - Requires server-side configuration

Current SSL status:
- ✅ Main domain (snakkaz.com)
- ✅ www subdomain
- ❌ Other subdomains (pending configuration)

## Troubleshooting

If subdomains return 403 Forbidden errors:
1. Verify that the subdomain directories exist on the server
2. Check that .htaccess files are properly uploaded
3. Ensure proper file permissions (755 for directories, 644 for files)
4. Confirm that the hosting plan supports multiple subdomains

If SSL warnings appear:
1. Verify that SSL certificates cover all required subdomains
2. Check SSL certificate expiration dates
3. Ensure proper SSL certificate installation

## Verification Steps

After configuring subdomains, verify the setup by:
1. Accessing each subdomain in a browser (https://subdomain.snakkaz.com)
2. Testing SSL certificate validation
3. Confirming that page content loads correctly
4. Checking for any console errors or mixed content warnings

## Help and Support

For assistance with subdomain configuration:
1. Contact Namecheap support: support@namecheap.com
2. Check Namecheap knowledge base: https://www.namecheap.com/support/knowledgebase/
3. Consult with the development team for application-specific issues
