# Premium Email Configuration Guide

## Environment Variables

The premium email functionality requires the following environment variables:

```bash
# cPanel API configuration
CPANEL_USERNAME=SnakkaZ
CPANEL_API_TOKEN=your_api_token_here
CPANEL_DOMAIN=snakkaz.com

# Email API configuration
EMAIL_API_URL=https://cpanel.snakkaz.com:2083/execute
EMAIL_API_KEY=your_api_key_here
```

## Email Server Configuration

### Mail Servers

- **IMAP Server:** mail.snakkaz.com (Port: 993, SSL/TLS)
- **SMTP Server:** mail.snakkaz.com (Port: 465, SSL/TLS)

### Webmail Access

Premium users can access their email via webmail at:
https://webmail.snakkaz.com

## API Endpoints

All premium email API endpoints are available at:

```
/api/premium/emails
```

### Available Endpoints

1. **GET /api/premium/emails**  
   Get all email accounts for the authenticated user

2. **POST /api/premium/emails**  
   Create a new email account
   ```json
   {
     "username": "username",
     "password": "password",
     "quota": 250
   }
   ```

3. **DELETE /api/premium/emails/:username**  
   Delete an email account

4. **PATCH /api/premium/emails/:username/password**  
   Change an email account password
   ```json
   {
     "password": "newpassword"
   }
   ```

## Testing Email Functionality

Before deploying to production, test the following:

1. Creating a new email account
2. Checking email delivery
3. Changing password
4. Deleting an email account

All tests should be performed with actual premium users in the Supabase database.

## Troubleshooting

Common errors:

1. **502 Bad Gateway**: Check if the cPanel API is accessible
2. **401 Unauthorized**: Check cPanel API token
3. **404 Not Found**: Ensure email routes are properly registered in server.js

For detailed API reference, see the [cPanel Email API Documentation](https://api.docs.cpanel.net/openapi/cpanel/operation/Email-list_pops/).
