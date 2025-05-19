# FTP Deployment Issue Resolution

## Current Status

- **Issue**: GitHub Actions FTP deployment failing with "530 Login authentication failed"
- **New Solution**: cPanel API-based deployment method (HTTP instead of FTP)
- **Implementation Date**: May 19, 2025

## Problem Background

Despite having correct FTP credentials that work from development environments, GitHub Actions has been unable to deploy successfully to Namecheap hosting. This is likely due to:

1. IP restrictions on Namecheap's FTP servers blocking GitHub Actions' IP addresses
2. Protocol compatibility issues between GitHub Actions' FTP client and Namecheap's FTP server
3. Authentication method differences that don't manifest when using FTP clients locally

## New Solution: cPanel API Deployment

We've created a new GitHub Actions workflow that completely bypasses FTP by using the cPanel API:

1. **Workflow File**: `.github/workflows/deploy-cpanel.yml`
2. **Documentation**: `docs/CPANEL-API-DEPLOYMENT.md`

### How It Works

1. The application is built as normal
2. Instead of using FTP to upload files:
   - The entire `dist` folder is compressed into a ZIP file
   - The ZIP file is uploaded via HTTP to cPanel
   - A PHP script is uploaded and executed to extract the files on the server

### Required GitHub Secrets

For this approach to work, you need to add these secrets to GitHub:

- `CPANEL_USERNAME`: Your cPanel username
- `CPANEL_PASSWORD`: Your cPanel password
- `CPANEL_URL`: Your cPanel URL with port (e.g., `premium123.web-hosting.com:2083`)

## Alternative Solutions

If the cPanel API approach doesn't work, consider:

### 1. Manual Deployment

Use the `better-ftp-upload.sh` script from a trusted IP address:

```bash
./better-ftp-upload.sh
```

### 2. Self-Hosted GitHub Runner

Set up a self-hosted GitHub Runner on a server with a trusted IP address that has been whitelisted by Namecheap.

### 3. Contact Namecheap Support

Request Namecheap to whitelist GitHub Actions IP addresses or relax IP restrictions for your FTP account.

## Next Steps

1. Add cPanel credentials to GitHub repository secrets
2. Test the new cPanel API deployment workflow
3. Update documentation if successful
4. Consider removing the old FTP-based workflow if the new method proves reliable
