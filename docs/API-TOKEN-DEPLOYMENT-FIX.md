# API Token Deployment Fix

This document explains how to fix the Snakkaz Chat deployment using cPanel API tokens instead of traditional FTP or cPanel password authentication.

## Summary of Issues

The GitHub Actions deployment workflow was failing with a "530 Access denied" error, indicating that:

1. FTP credentials were correct, but IP restrictions were likely in place
2. GitHub Actions servers were being blocked by the hosting provider's firewall/IP filtering rules

## Solution: cPanel API Token Deployment

We've implemented a more reliable deployment solution using cPanel API tokens that:

1. Uses HTTP/HTTPS requests instead of FTP protocol
2. Is less likely to be affected by IP restrictions
3. Provides better security by using revocable API tokens instead of passwords
4. Includes detailed error reporting and diagnostic information

## Files Created/Modified

1. **New GitHub Actions Workflow**:
   - `.github/workflows/deploy-cpanel-token.yml` - New workflow using cPanel API tokens

2. **Setup and Helper Scripts**:
   - `setup-cpanel-token-deployment.sh` - Script to help configure cPanel API tokens
   - `generate-github-api-token-secrets.sh` - Script to automatically set GitHub secrets

3. **Documentation**:
   - `docs/CPANEL-API-TOKEN-DEPLOYMENT.md` - Detailed guide for cPanel API token usage
   - Updated `DEPLOYMENT-GUIDE.md` to recommend cPanel API tokens

## How to Fix Current GitHub Actions

1. **Create a cPanel API Token**:
   - Log in to cPanel (https://premium123.web-hosting.com:2083)
   - Go to Security > Manage API Tokens
   - Create a new token with a descriptive name (e.g., "GithubActionsDeployment")
   - Copy the token value (it will only be shown once)

2. **Update GitHub Secrets**:
   - Go to your GitHub repository > Settings > Secrets and variables > Actions
   - Add the following new secrets:
     - `CPANEL_USERNAME`: Your cPanel username (e.g., "SnakkaZ")
     - `CPANEL_API_TOKEN`: The API token you just created
     - `CPANEL_DOMAIN`: Your cPanel domain (e.g., "premium123.web-hosting.com")

3. **Use the New Workflow**:
   - The new workflow is in `.github/workflows/deploy-cpanel-token.yml`
   - You can trigger it manually from the Actions tab or by pushing to the main branch

## Automated Setup

For convenience, we've provided two scripts:

1. **Local Testing and Configuration**:
   ```bash
   ./setup-cpanel-token-deployment.sh
   ```
   This script helps create and test cPanel API tokens locally.

2. **GitHub Secrets Setup** (requires GitHub CLI):
   ```bash
   ./generate-github-api-token-secrets.sh
   ```
   This script automates adding the secrets to your GitHub repository.

## Validation

After setting up the new deployment method:

1. Push a small change to the main branch or manually trigger the workflow
2. Monitor the GitHub Actions logs for detailed deployment information
3. Verify the website is properly deployed at https://www.snakkaz.com
4. Check that CSS/JavaScript files load correctly and SPA routing works

## If Problems Persist

If you continue to encounter deployment issues:

1. Check the deployment logs in GitHub Actions for specific error messages
2. Verify your cPanel API token has not expired
3. Ensure your hosting account allows API access
4. Contact Namecheap support for assistance with API access if needed

## Additional Resources

- [cPanel API Token Documentation](https://docs.cpanel.net/knowledge-base/security/how-to-use-cpanel-api-tokens/)
- [Managing API Tokens in cPanel](https://docs.cpanel.net/cpanel/security/manage-api-tokens-in-cpanel/)
- [GitHub Actions Deployment Troubleshooting](./docs/GITHUB-ACTIONS-DEPLOYMENT-FIXES.md)
