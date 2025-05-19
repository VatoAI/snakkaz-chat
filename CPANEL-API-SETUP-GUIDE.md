# cPanel API Token Setup & Security Guide for Snakkaz Chat

This guide provides a comprehensive walkthrough of the secure implementation of cPanel API tokens for premium email functionality in Snakkaz Chat.

## Overview

**Key Problem**: cPanel API tokens inherently have full access to all cPanel functions, creating a security risk.

**Our Solution**: A multi-layered security approach that restricts operations at the application level:
1. Operation allowlist
2. Role-based access control
3. Secure API wrapper
4. Comprehensive logging

## Setup Process

### Step 1: Create and Deploy the Security Layer

1. **Clone and verify the codebase**
   ```bash
   git clone https://github.com/your-org/snakkaz-chat.git
   cd snakkaz-chat
   ./verify-email-security.sh
   ```

2. **Install dependencies**
   ```bash
   ./update-dependencies-for-email.sh
   ```

3. **Run security tests**
   ```bash
   node test-security-implementation.js
   ```

### Step 2: Create a cPanel API Token

1. **Log in to your cPanel account** (usually at https://yourdomain:2083)

2. **Go to Security > Manage API Tokens**

3. **Create a new token with these settings**:
   - Name: `SnakkazEmailAPI-May2025` (include the date for tracking)
   - Expiration: Set to 90 days from now (August 17, 2025)
   - Note: Be sure to securely save the token when shown - you'll only see it once!

### Step 3: Configure the Application

1. **Set up GitHub Secrets**
   ```bash
   ./setup-github-secrets-for-email.sh
   ```
   
   This will guide you through adding these secrets:
   - `CPANEL_USERNAME`: Your cPanel username
   - `CPANEL_API_TOKEN`: The token you created in Step 2
   - `CPANEL_DOMAIN`: Your cPanel domain (e.g., premium123.web-hosting.com)
   - `ENABLE_PREMIUM_EMAIL`: Set to "true"

2. **For local development, create .env file**
   ```
   CPANEL_USERNAME=your_username
   CPANEL_API_TOKEN=your_token_value
   CPANEL_DOMAIN=your_cpanel_domain
   ENABLE_PREMIUM_EMAIL=true
   ```

### Step 4: Verify the Security Implementation

1. **Test API security layer**
   ```bash
   ./test-email-api-security.sh
   ```

2. **Test cPanel connectivity**
   ```bash
   ./test-cpanel-email-api.sh
   ```

3. **Verify all components are properly secured**
   ```bash
   ./verify-email-security.sh
   ```

### Step 5: Deploy to Production

1. **Make sure database tables are created**
   ```bash
   supabase db push ./supabase/migrations/20250519_add_premium_emails_table.sql
   ```

2. **Deploy with additional security checks**
   ```bash
   ./deploy-with-cpanel-api-token.sh
   ```

## Security Implementation Details

### 1. Operation Allowlist (apiSecurityMiddleware.js)

```javascript
const PERMITTED_OPERATIONS = {
  // Standard email operations - available to premium users
  'Email/list_pops': { adminOnly: false },
  'Email/add_pop': { adminOnly: false },
  'Email/delete_pop': { adminOnly: false },
  'Email/passwd_pop': { adminOnly: false },
  'Email/get_pop_quota': { adminOnly: false },
  
  // Admin-only operations
  'Email/list_mail_domains': { adminOnly: true },
  'Email/get_main_account_disk_usage': { adminOnly: true },
  'Email/validate_email_password': { adminOnly: true },
  'Email/set_pop_quota': { adminOnly: true },
};
```

This allowlist restricts which cPanel API operations can be performed - any operation not on this list is automatically rejected.

### 2. Role-Based Access Control (authMiddleware.js)

```javascript
// Admin checks
const checkAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'This operation requires administrator privileges'
    });
  }

  req.isAdmin = true;
  next();
};
```

This middleware ensures only administrators can access certain endpoints.

### 3. Secure API Wrapper (emailService.js)

```javascript
async function secureCpanelApiCall(operation, params, isAdmin = false) {
  // Security check: Only permit operations on the allowlist
  if (!isOperationPermitted(operation, isAdmin)) {
    throw new Error(`Operation ${operation} is not permitted`);
  }
  
  // Make the API call and return sanitized results
  // ...
}
```

All cPanel API calls must go through this wrapper, which enforces the operation allowlist.

### 4. Comprehensive Logging

```javascript
const logApiOperation = (req, res, next) => {
  const { operation } = req.body;
  const userId = req.user?.id || 'anonymous';
  const userIp = req.ip || req.connection.remoteAddress;
  
  console.log(`[${new Date().toISOString()}] API Operation: ${operation}, User: ${userId}, IP: ${userIp}`);
  
  next();
};
```

All API operations are logged for audit purposes.

## Security Maintenance

### Token Rotation Schedule

1. **Create a new token every 90 days**
   - Set a calendar reminder for August 17, 2025
   - Create a new token before the old one expires
   - Update GitHub Secrets with the new token
   - Revoke the old token after confirming the new one works

2. **Audit Security Logs Regularly**
   - Review application logs weekly for suspicious API operations
   - Watch for operations coming from unusual IP addresses
   - Monitor for repeated unsuccessful API attempts

### Token Revocation Procedure

If a token might be compromised:

1. **Immediately revoke the token** in cPanel
2. **Create a new token** with a different name
3. **Update GitHub Secrets** with the new token
4. **Review security logs** for any unauthorized use

## Additional Resources

- [cPanel API Token Technical Documentation](docs/CPANEL-API-TOKEN-SECURITY.md)
- [Secure Email API Implementation Details](docs/SECURE-EMAIL-API.md)
- [Premium Email Deployment Guide](docs/PREMIUM-EMAIL-DEPLOYMENT.md)

## Troubleshooting

### Common Issues

1. **"Operation not permitted" errors**
   - Check if the operation is in the allowlist
   - Verify user has correct role for admin-only operations
   
2. **Authentication failures**
   - Confirm token hasn't expired
   - Check if token was revoked in cPanel
   - Verify correct username and domain are used

3. **"Not enough memory" errors in cPanel**
   - Some operations might be resource-intensive
   - Contact hosting provider if this happens consistently

### Getting Help

For additional assistance, contact your designated security administrator or refer to the internal documentation at [docs/PREMIUM-EMAIL-DEPLOYMENT.md](docs/PREMIUM-EMAIL-DEPLOYMENT.md).
