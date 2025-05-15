# GitHub Actions Workflow - Cloudflare to Namecheap Migration Changes

## Overview

This document summarizes the changes made to GitHub Actions workflow files as part of the migration from Cloudflare to Namecheap for DNS management of the Snakkaz Chat application.

## Changes Made

### 1. Main Workflow File (`/.github/workflows/deploy.yml`)

The primary GitHub Actions workflow file has been updated to:

- **Remove Cloudflare Secret Validations**
  - Removed `CF_ZONE_ID_CHECK` and `CF_API_TOKEN_CHECK` environment variables
  - Removed validation messages for Cloudflare-related secrets

- **Remove Cloudflare Cache Purging Step**
  - Removed the entire "Purge Cloudflare Cache" step that was using Cloudflare's API
  - Added a comment explaining that Namecheap doesn't have a cache purging API like Cloudflare

- **Update Deployment Summary**
  - Removed Cloudflare cache status from the deployment summary
  - Simplified the summary to focus only on relevant deployment information

### 2. Backup Workflow Files

Backup workflow files in the following locations were also updated:

1. `/src/services/encryption/.github/workflows/deploy.yml`
2. `/backup/encryption/.github/workflows/deploy.yml`

Changes to backup files include:

- Replacing "Configure Cloudflare settings" with "Configure DNS settings"
- Removing "Cloudflare Cache Purge" step
- Replacing "Verify Cloudflare DNS" step with "Verify Namecheap DNS"
- Adding appropriate environment variables for Namecheap API

## Required GitHub Secrets Changes

To complete the migration, the following GitHub repository secrets need to be updated:

1. **Remove**:
   - `CLOUDFLARE_ZONE_ID`
   - `CLOUDFLARE_API_TOKEN`

2. **Add** (if they will be used for DNS verification):
   - `NAMECHEAP_API_USER`: "SnakkaZ"
   - `NAMECHEAP_API_KEY`: "43cb18d3efb341258414943ce1549db7"
   - `NAMECHEAP_USERNAME`: Same as API user
   - `NAMECHEAP_CLIENT_IP`: Server IP (185.158.133.1)

3. **Verify**:
   - `FTP_SERVER`: Should be set to 185.158.133.1
   - `FTP_USERNAME`: Confirm correct value is set
   - `FTP_PASSWORD`: Confirm correct value is set
   - `SUPABASE_URL`: "https://wqpoozpbceucynsojmbk.supabase.co"
   - `SUPABASE_ANON_KEY`: Confirm correct value is set

## Next Steps

1. Update GitHub repository secrets as described above
2. Test the workflow by manually triggering it in GitHub Actions
3. Verify that the deployment completes successfully without errors
4. Confirm that the website is accessible and functioning properly after deployment
5. Update any remaining documentation that references Cloudflare

## References

- [Cloudflare to Namecheap Migration Log](/docs/CLOUDFLARE-TO-NAMECHEAP-MIGRATION-LOGG.md)
- [Namecheap Migration Documentation](/docs/NAMECHEAP-MIGRATION.md)
- [Migration Status Report](/docs/CLOUDFLARE-TO-NAMECHEAP-MIGRATION-STATUS.md)
