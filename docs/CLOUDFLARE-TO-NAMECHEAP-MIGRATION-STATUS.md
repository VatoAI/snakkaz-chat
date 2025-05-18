# Cloudflare to Namecheap DNS Migration Status

## Migration Overview

This document tracks the progress of migrating Snakkaz Chat's DNS management from Cloudflare to Namecheap. The migration aims to simplify our technology stack, reduce dependencies, and resolve issues with Content Security Policy (CSP) implementation.

## Completed Tasks

1. ✅ Created backup of Cloudflare files in /backup/cloudflare-files/
2. ✅ Created new Namecheap DNS configuration files:
   - namecheapApi.ts (removed Cloudflare references)
   - namecheapConfig.ts (updated with correct DNS entries)
   - namecheapDns.ts (improved Supabase verification function)
   - dnsManager.ts (new DNS manager without Cloudflare dependencies)
3. ✅ Updated scripts:
   - Fixed test-dns-setup.sh to work in GitHub Codespaces
   - Enhanced update-namecheap-dns.js with .env support
4. ✅ Created documentation:
   - Added /docs/MCP-SUBDOMAIN.md
   - Created /docs/NAMECHEAP-DNS-ANALYSIS.md
   - Created /src/services/dns/README.md
   - Added .env.example
5. ✅ Verified domain is using Namecheap nameservers:
   - dns1.namecheaphosting.com
   - dns2.namecheaphosting.com
6. ✅ Documented complete DNS configuration in /docs/DNS-CONFIGURATION.md:
   - Server IP: 162.0.229.214
   - Hosting plan: Namecheap Stellar Plus (expires May 16, 2026)
   - All subdomains properly configured
5. ✅ Added all required DNS entries in Namecheap control panel:
   - A record for @ (root domain)
   - CNAME records for www, dash, business, docs, analytics
   - Additional CNAME records for help and mcp 
   - TXT records for verification
6. ✅ Ran tests verifying DNS configuration:
   - All DNS lookups succeeded
   - Main domain is accessible (200 response)
   - Subdomains (help and mcp) are correctly configured
   - Verified DNS propagation is complete
7. ✅ Updated GitHub Actions workflow:
   - Removed Cloudflare deployment steps
   - Updated deploy.yml to deploy to Namecheap hosting
8. ✅ Fixed CSP (Content Security Policy) related issues:
   - Fixed TypeScript errors in CSP configuration files
   - Added missing test functions for diagnostics
   - Added proper Node type checking in MutationObserver
9. ✅ Fixed import errors:
   - Updated incorrect function imports in initialize.ts
   - Fixed references to unblockRequests and fixCorsSecurity
   - Updated security enhancement imports
10. ✅ Fixed local development environment:
    - Created .env.local with Supabase credentials
    - Removed Cloudflare analytics script from index.html
    - Updated CSP policy in index.html to remove Cloudflare domains
11. ✅ Fixed GitHub Actions build failures:
    - Fixed syntax error in cspConfig.ts by simplifying domain structure
    - Verified successful build completion

## Pending Tasks

1. ✅ Complete DNS propagation (DNS should be fully propagated as of May 17, 2025)
2. 🔍 Investigate why subdomains return 403 errors:
   - ✅ Verified DNS settings for subdomains
   - ✅ Set up subdomain directories in cPanel (May 17, 2025)
   - ⬜ Check SSL certificate coverage for all subdomains (in progress)
   - ⬜ Test subdomains after configuration
3. ✅ Fix GitHub Actions build failures:
   - ✅ Fixed syntax error in cspConfig.ts by removing template literals and restructuring code
   - ✅ Fixed potential character encoding issues in the file
   - ✅ Verified successful local build
4. 🔍 Fix GitHub Actions deployment failures:
   - ✅ Identified FTP timeout issue during deployment
   - ✅ Modified GitHub Actions workflow with increased timeout and verbose logging
   - ✅ Purchased and set up Namecheap Stellar Plus hosting package (May 17, 2025)
   - ⬜ Configure FTP access in cPanel
   - ⬜ Add FTP credentials to GitHub repository secrets
   - ⬜ Test deployment after hosting setup
5. 🔍 Fix remaining Cloudflare script references:
   - ✅ Removed Cloudflare analytics script from index.html
   - ✅ Removed Cloudflare domains from CSP policy
   - ✅ Added local environment variables for Supabase
   - ⬜ Check for additional Cloudflare references in build output
6. 📝 Update final documentation:
   - Add performance metrics comparing before/after migration
   - Document any remaining issues or quirks
   - Create runbooks for common DNS management tasks
7. 🧪 Conduct final testing:
   - Load testing on new DNS configuration
   - Security testing without Cloudflare WAF
   - Cross-browser compatibility testing

## DNS Configuration Matrix

| Subdomain | Record Type | Target/Value | Status |
|-----------|-------------|--------------|--------|
| @ (root)  | A           | 185.158.133.1 | ✅ Working |
| www       | CNAME       | snakkaz.com. | ✅ Working |
| dash      | CNAME       | snakkaz.com. | ⚠️ 403 Error |
| business  | CNAME       | snakkaz.com. | ⚠️ 403 Error |
| docs      | CNAME       | snakkaz.com. | ⚠️ 403 Error |
| analytics | CNAME       | snakkaz.com. | ⚠️ 403 Error |
| mcp       | CNAME       | snakkaz.com. | ⚠️ 403 Error |
| help      | CNAME       | snakkaz.com. | ⚠️ 403 Error |

## Namecheap Hosting Setup

This section tracks our Namecheap hosting setup progress:

1. **Purchase Hosting Package**:
   - ✅ Selected Stellar Plus plan ($34.88/year) - Completed May 17, 2025
   - ✅ Features: Unlimited storage, bandwidth, and subdomains
   - ✅ Hosting is now ACTIVE for snakkaz.com
   - Note: SSL and security services to be added after initial setup

2. **Access and Configure cPanel**:
   - ✅ Successfully purchased and activated Stellar Plus hosting
   - ✅ Hosting linked to snakkaz.com domain
   - ✅ Configured subdomain directories in cPanel (May 17, 2025)
   - ⬜ Set up SSL certificates for all subdomains (in progress - PositiveSSL being installed)
   - ⬜ Test web server configuration after setup

3. **Set Up FTP for GitHub Actions**:
   - ⬜ Access FTP Accounts section in cPanel
   - ⬜ Add the following secrets to GitHub repository:
     - FTP_SERVER: premium123.web-hosting.com (Server Hostname)
     - FTP_USERNAME: (create or find in cPanel > FTP Accounts)
     - FTP_PASSWORD: (create or find in cPanel > FTP Accounts)
     - SERVER_DIR: (typically "/")

4. **Configure Subdomains in cPanel**:
   - ✅ Created subdomain entries for: dash, business, docs, analytics, mcp, help (May 17, 2025)
   - ✅ Pointed each subdomain to appropriate directory under /subdomains/[name]
   - ⬜ Set up redirects if needed (may not be necessary)

5. **SSL Certificate Setup**:
   - ✅ Accessed cPanel > Security > SSL/TLS Status (May 17, 2025)
   - ✅ Found free PositiveSSL installation in progress by Namecheap
   - ⬜ Verify certificate coverage for all subdomains after installation completes
   - ⬜ Consider wildcard certificate (*.snakkaz.com) if needed for all subdomains
   
6. **Security Setup (Optional)**:
   - Add SiteLock protection after hosting is confirmed
   - Access via Namecheap dashboard > Manage Hosting > Security options
   - This replaces some security features previously handled by Cloudflare

## Troubleshooting 403 Errors

The 403 Forbidden errors on subdomains could be caused by:

1. **Server Configuration**: The web server may need to be configured to respond to these subdomains.
   - Check virtual host configurations in Apache/Nginx
   - Add appropriate ServerName/ServerAlias directives

2. **SSL Certificate**: The SSL certificate may not include these subdomains.
   - Verify the SSL certificate's Subject Alternative Name (SAN) coverage
   - Consider upgrading to a wildcard certificate (*.snakkaz.com)

3. **Access Control**: There may be restrictive access controls.
   - Check .htaccess files for restrictive rules
   - Verify IP-based access restrictions

4. **DNS Propagation**: DNS changes may not be fully propagated.
   - Use DNS propagation checkers to verify changes worldwide
   - Test from different geographic locations and ISPs

## Next Steps

1. Continue monitoring DNS propagation using:
   ```bash
   ./scripts/test-dns-setup.sh
   ```

2. Verify web server configuration for all subdomains:
   ```bash
   curl -I https://{subdomain}.snakkaz.com
   ```

3. If 403 errors persist after 48 hours, investigate server configuration:
   ```bash
   # Example for Apache
   grep -r "snakkaz.com" /etc/apache2/sites-enabled/
   
   # Example for Nginx
   grep -r "snakkaz.com" /etc/nginx/sites-enabled/
   ```

## Rollback Plan

If critical issues are encountered, a rollback plan is available:

1. Restore Cloudflare DNS configuration:
   ```bash
   node scripts/restore-cloudflare-backup.js
   ```

2. Revert code changes:
   ```bash
   git checkout [pre-migration-commit-hash] src/services/encryption/
   ```

3. Re-enable Cloudflare services in the Cloudflare dashboard

## Timeline

- Migration Start: May 14, 2025
- Expected DNS Propagation Completion: May 16, 2025
- Final Testing & Verification: May 17-18, 2025
- Migration Completion: May 19, 2025 (if all tests pass)
