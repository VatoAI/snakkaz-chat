# Secure cPanel Email API Implementation

This document explains how we implemented a secure layer on top of the cPanel API for email management in Snakkaz Chat.

## Problem: cPanel API Tokens Have Full Access

cPanel API tokens are "all or nothing" - they can't have limited permissions. Any token can access all APIs available to the cPanel user account. This is a security risk since:

1. If the token is compromised, an attacker gains full access to the cPanel account
2. There's no built-in way to restrict what operations an application can perform
3. Different user roles can't have different levels of access to cPanel functions

## Solution: Application-Level Security Layer

We've implemented a multi-layered security approach:

### 1. Operation Allowlist

We maintain an explicit allowlist of permitted cPanel API operations in `apiSecurityMiddleware.js`:

```javascript
const PERMITTED_OPERATIONS = {
  'Email/list_pops': { adminOnly: false },
  'Email/add_pop': { adminOnly: false },
  'Email/delete_pop': { adminOnly: false },
  'Email/passwd_pop': { adminOnly: false },
  'Email/get_pop_quota': { adminOnly: false },
  // Additional operations can be added with admin-only flags
};
```

Any API operation not in this list will be rejected, even if the cPanel token would allow it.

### 2. Role-Based Access Control

We've added role checks that determine what operations users can perform:

- Regular premium users can only manage their own email accounts
- Admin users have additional capabilities through special endpoints

### 3. Secure API Wrapper

All cPanel API calls go through our secure wrapper function that enforces permissions:

```javascript
async function secureCpanelApiCall(operation, params, isAdmin = false) {
  // Security check: Only permit operations on the allowlist
  if (!isOperationPermitted(operation, isAdmin)) {
    throw new Error(`Operation ${operation} is not permitted`);
  }
  
  // Perform the API call and return sanitized results
  // ...
}
```

### 4. Comprehensive Logging

All API operations are logged for audit purposes:

```javascript
const logApiOperation = (req, res, next) => {
  const { operation } = req.body;
  const userId = req.user?.id || 'anonymous';
  
  console.log(`[${new Date().toISOString()}] User ${userId} performed ${operation}`);
  
  next();
};
```

## Implementation Components

1. **apiSecurityMiddleware.js** - Contains the operation allowlist and security checks
2. **authMiddleware.js** - Handles authentication and role checking
3. **emailService.js** - Implements the secure API wrapper and email functions
4. **emailRoutes.js** - Defines API endpoints with proper security middleware

## Best Practices

1. **Principle of Least Privilege**: Users can only perform the minimum operations necessary
2. **Defense in Depth**: Multiple security layers prevent a single failure from compromising security
3. **Separation of Concerns**: Security checks are separate from business logic
4. **Audit Trails**: All operations are logged for security monitoring

## Admin-Only Features

Some operations are restricted to administrators:

1. Listing all email accounts on the domain
2. Force-deleting email accounts (bypassing ownership checks)
3. Executing raw API operations (still restricted by the operation allowlist)

## Security Considerations

1. Store the cPanel API token securely using GitHub Secrets
2. Regularly rotate the API token (recommended every 90 days)
3. Monitor the audit logs for suspicious activity
4. Keep the operation allowlist as restrictive as possible

By implementing these security measures, we've created a much more secure solution than using the cPanel API token directly, despite cPanel's lack of built-in permission restrictions.
