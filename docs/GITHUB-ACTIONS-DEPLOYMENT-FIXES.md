# GitHub Actions Deployment Fixes

This document details the changes made to fix the GitHub Actions deployment issues for the Snakkaz Chat project.

## Problem Description

The GitHub Actions deployment workflow was failing with a "530 Login authentication failed" error when attempting to connect to the Namecheap FTP server, despite the same credentials working correctly from the development environment. This suggested either:

1. IP restrictions on the Namecheap server blocking GitHub Actions IPs
2. Protocol issues (FTP vs FTPS)
3. Authentication method differences

## Solution Implementation

### 1. Non-FTP Deployment via cPanel API (Recommended)

After discovering that FTP-based methods can be problematic with Namecheap hosting, we've created an entirely new workflow that uses the cPanel API instead of FTP:

```yaml
name: Deploy Snakkaz Chat via cPanel (No FTP)

jobs:
  build-and-deploy:
    # ... [Build steps remain the same] ...
    
    steps:
      # ... [Other steps] ...
      
      # Deploy via cPanel API instead of FTP
      - name: Deploy .htaccess via cPanel API
        id: deploy-htaccess
        run: |
          echo "Uploading .htaccess file via cPanel API..."
          # Uses HTTP POST to upload directly to cPanel
      
      - name: Create ZIP archive of the dist directory
        run: |
          echo "Creating ZIP archive of the dist directory..."
          cd dist
          zip -r ../snakkaz-dist.zip .
      
      - name: Upload ZIP via cPanel API
        id: deploy-zip
        run: |
          echo "Uploading ZIP file via cPanel API..."
          curl -k -w "\nHTTP Status: %{http_code}\n" \
            -u "${{ secrets.CPANEL_USERNAME }}:${{ secrets.CPANEL_PASSWORD }}" \
            -F "file=@snakkaz-dist.zip" \
            "https://${{ secrets.CPANEL_URL }}/execute/Fileman/upload_files?dir=/public_html"
```

This approach has several advantages:
- Uses HTTP/HTTPS instead of FTP (less likely to be blocked by firewalls)
- More reliable as it uses standard web protocols
- Handles larger files better through ZIP compression
- Includes server-side extraction

### 2. LFTP for More Robust FTP/FTPS Connections (Alternative)

We modified the GitHub Actions workflow to use `lftp` instead of the standard FTP Deploy Action. LFTP provides better support for:
- Explicit SSL/TLS connections
- Connection retry capabilities 
- More flexible authentication options

```yaml
- name: Install lftp
  run: sudo apt-get update && sudo apt-get install -y lftp

- name: Create LFTP script
  run: |
    cat > upload.lftp << EOF
    open -u ${{ secrets.FTP_USERNAME }},${{ secrets.FTP_PASSWORD }} ${{ secrets.FTP_SERVER }}
    set ssl:verify-certificate no
    set ftp:ssl-allow yes
    set ftp:ssl-protect-data yes
    set ftp:ssl-protect-list yes
    # Additional LFTP configuration...
    mirror -R dist/ ${{ secrets.SERVER_DIR || 'public_html' }} --no-perms --parallel=3
    bye
    EOF
```

### 2. Enhanced .htaccess Configuration

We improved the `.htaccess` file to properly handle:
- HTTPS redirection
- SPA routing for React/Vue applications
- Correct MIME type definitions (fixing the previous MIME type issues)
- CORS configuration

### 3. Fallback Mechanisms

We implemented fallback options in case the primary deployment method fails:
- Direct curl upload for critical files like `.htaccess`
- Diagnostic tests to check connectivity
- Detailed reporting to identify specific failure points

### 4. Comprehensive Deployment Reporting

Added detailed deployment reports that:
- Show whether primary or fallback methods succeeded
- Provide diagnostic information
- Offer troubleshooting guidance when failures occur

## Alternative Deployment Options

If GitHub Actions continues to have issues connecting to the Namecheap FTP server, consider:

1. **Manual Deployment**: Use the `better-ftp-upload.sh` script from a trusted IP address
2. **HTTP-based Upload**: Use the `curl-upload-no-ftp.sh` script which uses the cPanel API instead of FTP
3. **Contact Namecheap Support**: Ask about IP restrictions and whether GitHub Actions IPs can be whitelisted

## Verifying Deployment

After deployment, always verify:
1. The site loads correctly at https://www.snakkaz.com
2. CSS and JavaScript files load with the correct MIME types
3. SPA routing works correctly (no 404s when navigating)
4. HTTPS is enforced

## Troubleshooting

If issues persist, check:
1. GitHub Actions logs for specific error messages
2. Namecheap cPanel logs for rejected connections
3. Whether FTP credentials have been updated recently
4. If IP restrictions have been enabled on the hosting account
