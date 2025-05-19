# Premium Email Feature for Snakkaz Chat

This document describes how to set up and use the Premium Email feature for Snakkaz Chat, which allows premium members to create and manage their own `@snakkaz.com` email addresses.

## Overview

The Premium Email feature enables users with premium subscriptions to:

- Create personalized `@snakkaz.com` email addresses
- Access their email through webmail or any standard email client (Gmail, Outlook, etc.)
- Manage their email accounts (password changes, storage quotas, etc.)
- Use these email addresses as their primary or secondary email

## Technical Implementation

The feature is implemented through several components:

1. **cPanel API Integration**: Uses cPanel API tokens to create and manage email accounts
2. **Premium Subscription Check**: Validates that only premium users can access this feature
3. **Database Storage**: Tracks which users own which email addresses
4. **Frontend Interface**: Allows users to manage their email accounts
5. **Server API**: Backend endpoints for email account management

## Required Setup

### 1. cPanel API Token

First, you need to create a cPanel API token:

1. Log in to cPanel (usually at https://premium123.web-hosting.com:2083)
2. Navigate to "Security" > "Manage API Tokens"
3. Click "Create" and enter a name like "SnakkazEmailAPI"
4. Choose expiration settings (optional)
5. Copy the generated token (you'll only see it once!)

### 2. Environment Variables

Add these variables to your server environment:

```
CPANEL_USERNAME=SnakkaZ
CPANEL_API_TOKEN=your_api_token_from_step_1
CPANEL_DOMAIN=premium123.web-hosting.com
```

### 3. Database Configuration

The required database tables should already be created by the migration:
- `premium_emails` - for tracking email accounts

If the table doesn't exist, run the migration script:
```
supabase/migrations/20250519_add_premium_emails_table.sql
```

## Integration with Snakkaz Chat

### Adding to User Interface

Add the Premium Email Manager component to your premium account section:

```jsx
import PremiumEmailManager from '@/components/Premium/PremiumEmailManager';

// In your premium account section:
<PremiumEmailManager />
```

### API Routes

The email management API is available at these endpoints:

- `GET /api/emails` - List all email accounts for the authenticated user
- `POST /api/emails` - Create a new email account
- `DELETE /api/emails/:username` - Delete an email account
- `PATCH /api/emails/:username/password` - Change email password

## Email Client Configuration

Premium members can configure their email clients with these settings:

### Incoming Mail (IMAP)
- **Server**: premium123.web-hosting.com
- **Port**: 993
- **Security**: SSL/TLS
- **Username**: [username]@snakkaz.com
- **Password**: [email password]

### Outgoing Mail (SMTP)
- **Server**: premium123.web-hosting.com
- **Port**: 465
- **Security**: SSL/TLS
- **Username**: [username]@snakkaz.com
- **Password**: [email password]

### Webmail Access
Users can access webmail directly at: https://premium123.web-hosting.com:2096

## Command-Line Management

You can manage email accounts using the provided command-line script:

```bash
./manage-email-accounts.sh
```

This script provides the following functions:
- List all email accounts
- Create new email accounts
- Delete email accounts
- Change email passwords
- View email account details

## Testing

To test if the setup is working correctly:

1. Create a test email account
2. Send an email to the new address from an external email provider
3. Check if the email is received (via webmail)
4. Test sending an email from the new account
5. Test email client configuration

## Troubleshooting

### Common Issues

1. **API Token Errors**:
   - Ensure the token has not expired
   - Verify proper authorization header format

2. **Email Creation Fails**:
   - Check username validity (no spaces/special chars)
   - Ensure password meets strength requirements
   - Verify the domain is properly configured

3. **Cannot Receive Email**:
   - Check MX records for snakkaz.com
   - Verify email server is running
   - Check spam/junk folders

### Logs and Debugging

Check these logs for troubleshooting:
- Server logs for API errors
- cPanel email logs (in cPanel > Email > Email Delivery Reports)

## Security Considerations

1. **API Token Protection**:
   - Store tokens securely
   - Use environment variables, not hardcoded values
   - Set appropriate expiration dates

2. **Password Requirements**:
   - Enforce strong passwords
   - Implement rate limiting for password attempts

3. **Access Control**:
   - Restrict to premium users only
   - Implement proper authentication checks

## Support Resources

- cPanel Email Documentation: https://docs.cpanel.net/cpanel/email/
- Email Client Setup Guides: https://docs.cpanel.net/cpanel/email/email-accounts/#set-up-mail-client
- cPanel API Documentation: https://api.docs.cpanel.net/
