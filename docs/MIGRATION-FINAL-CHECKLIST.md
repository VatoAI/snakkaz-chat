# Cloudflare to Namecheap Migration: Final Checklist

Use this checklist to ensure that all aspects of the migration from Cloudflare to Namecheap have been completed successfully.

## DNS Configuration

- [ ] All required DNS records are configured in Namecheap
  - [ ] A record for @ pointing to 185.158.133.1
  - [ ] A record for mcp pointing to 185.158.133.1
  - [ ] CNAME record for www pointing to snakkaz.com
  - [ ] CNAME record for dash pointing to snakkaz.com
  - [ ] CNAME record for business pointing to snakkaz.com
  - [ ] CNAME record for docs pointing to snakkaz.com
  - [ ] CNAME record for analytics pointing to snakkaz.com
  - [ ] CNAME record for help pointing to snakkaz.com
- [ ] DNS propagation is complete (check using [dnschecker.org](https://dnschecker.org))
- [ ] Removed any unnecessary DNS records related to Cloudflare

## Web Server Configuration

- [ ] Main .htaccess file is correctly deployed with subdomain routing rules
- [ ] Subdomain directories are created on the server
- [ ] Each subdomain has its own .htaccess file
- [ ] File permissions are set correctly:
  - [ ] 755 for directories
  - [ ] 644 for files
  - [ ] 755 for executable scripts
- [ ] Placeholder pages are deployed for all subdomains

## SSL Certificates

- [ ] SSL certificate for main domain is valid and properly installed
- [ ] SSL certificate for www subdomain is valid and properly installed
- [ ] SSL certificates for all other subdomains are valid
- [ ] No mixed content warnings appear in the browser console
- [ ] All certificates have at least 30 days before expiration

## Application Configuration

- [ ] Updated environment.ts with correct domain settings
- [ ] Removed any Cloudflare-specific code or references
- [ ] CSP policy is updated to work without Cloudflare
- [ ] Supabase integration is correctly configured for new hosting
- [ ] Applied all database optimizations:
  - [ ] Fixed function search path security issues
  - [ ] Optimized RLS policies
  - [ ] Added missing indexes
  - [ ] Enabled leaked password protection

## Deployment Pipeline

- [ ] GitHub Actions deployment workflow is updated for Namecheap
- [ ] FTP credentials are correctly configured in GitHub Secrets
- [ ] Deployment completes successfully without errors
- [ ] Build process includes all subdomain files

## Testing

- [ ] Main website (snakkaz.com) loads correctly
- [ ] www.snakkaz.com loads correctly
- [ ] All subdomains are accessible:
  - [ ] dash.snakkaz.com
  - [ ] business.snakkaz.com
  - [ ] docs.snakkaz.com
  - [ ] analytics.snakkaz.com
  - [ ] help.snakkaz.com
  - [ ] mcp.snakkaz.com
- [ ] Authentication works correctly
- [ ] Chat features work correctly
- [ ] No console errors appear in the browser

## Cleanup

- [ ] Cloudflare account settings are documented and backed up
- [ ] Cloudflare account is deactivated or subscription downgraded
- [ ] Old DNS settings are documented for reference
- [ ] Migration status is updated to "Completed"

## Documentation

- [ ] DEPLOYMENT-STATUS.md is updated with complete migration details
- [ ] CLOUDFLARE-TO-NAMECHEAP-MIGRATION-STATUS.md is marked as completed
- [ ] SUBDOMAIN-SETUP-GUIDE.md is finalized
- [ ] SUPABASE-PERFORMANCE-OPTIMIZATIONS.md is complete
- [ ] Readme files are updated with new hosting information
