# Premium Email Deployment Guide

This document provides detailed instructions for deploying the Snakkaz Chat premium email feature securely.

## Security Overview

The premium email feature uses cPanel API for email management, which requires special security considerations:

⚠️ **IMPORTANT:** cPanel API tokens have full access to all cPanel features. To mitigate this security risk, we've implemented an application-level security layer that restricts what operations can be performed.

## Prerequisites

Before deployment, ensure you have:

1. A cPanel account with email hosting capabilities
2. Admin access to create API tokens in cPanel
3. Access to your GitHub repository settings
4. The necessary security implementation in the codebase

## Step 1: Create a cPanel API Token

1. Log in to cPanel (usually at https://your-domain:2083)
2. Navigate to "Security" > "Manage API Tokens"
3. Click "Create" and enter a name like "SnakkazEmailAPI"
4. Set an expiration date (recommended: 90-180 days)
5. Copy the generated token - you'll only see it once!

## Step 2: Configure GitHub Secrets

Run the setup script to configure your GitHub secrets:

```bash
./setup-github-secrets-for-email.sh
```

This script will help you set up the following secrets:

- `CPANEL_USERNAME` - Your cPanel username
- `CPANEL_API_TOKEN` - The API token you created in Step 1
- `CPANEL_DOMAIN` - Your cPanel domain (e.g., premium123.web-hosting.com)
- `ENABLE_PREMIUM_EMAIL` - Set to "true" to enable the feature

## Step 3: Verify Security Implementation

Before deploying, verify that the security layer is properly implemented:

```bash
./test-email-api-security.sh
```

This script checks that:
- The operation allowlist is properly configured
- Role-based access controls work as expected
- Unauthorized operations are rejected
- Admin-only endpoints are protected

## Step 4: Deploy the Application

Deploy your application with the secure email API:

```bash
./deploy-with-cpanel-api-token.sh
```

The deployment script will:
1. Verify the security layer is in place
2. Test the cPanel API token access
3. Build and deploy the application
4. Apply the necessary configuration

## Step 5: Post-Deployment Verification

After deployment, verify that:

1. Premium users can create email accounts
2. Email accounts are properly created in cPanel
3. The security layer is filtering API operations correctly
4. Admin features are only accessible to administrators

## Security Best Practices

1. **Rotate API Tokens**: Create a new token every 90 days
2. **Monitor Logs**: Regularly check the API operation logs for unusual activity
3. **Limit Admin Access**: Only grant admin roles to trusted users
4. **Update the Allowlist**: Keep the operation allowlist as restrictive as possible

## Troubleshooting

If you encounter issues:

1. **API Connection Failures**
   - Verify your cPanel credentials are correct
   - Check that your API token has not expired
   - Ensure your cPanel domain is correct

2. **Security Layer Issues**
   - Verify the apiSecurityMiddleware.js file is properly implemented
   - Check that all required components are deployed
   - Review the operation allowlist for any missing operations

3. **Email Creation Failures**
   - Check the server logs for specific error messages
   - Verify the premium user has an active subscription
   - Ensure the username follows cPanel's email address requirements

## Additional Resources

- [cPanel API Documentation](https://api.docs.cpanel.net/)
- [Snakkaz Chat Premium Email Feature Documentation](./PREMIUM-EMAIL-FEATURE.md)
- [Secure Email API Implementation](./SECURE-EMAIL-API.md)
