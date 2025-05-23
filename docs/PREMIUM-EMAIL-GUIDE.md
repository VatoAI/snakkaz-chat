# Premium Email Feature Implementation Guide

This guide explains how the @snakkaz.com premium email feature has been implemented and how to test it properly.

## Overview

The premium email feature allows users with Pro subscription to create and manage their own @snakkaz.com email addresses. These can be used with any standard email client (Gmail, Outlook, etc.) or webmail.

## Technical Implementation

The feature consists of several components:

1. **Frontend**: 
   - `PremiumEmailManager.jsx` - UI component for managing email accounts
   - User-friendly interface to create, delete, and manage email accounts
   - Enhanced information about the feature in the Info page

2. **Backend**: 
   - API routes in `emailRoutes.js` accessible via `/api/premium/emails`
   - Email service layer in `emailService.js` for cPanel API interaction
   - Database integration with Supabase `premium_emails` table

3. **Client Service**:
   - `PremiumEmailService.ts` - service for communicating with the email API

## Setup Steps

The following steps have been completed to implement the feature:

1. **API Route Configuration**:
   - Updated `server.js` to register routes at `/api/premium/emails`

2. **Database Setup**:
   - Created migration file for `premium_emails` table in Supabase
   - Migration path: `/supabase/migrations/20250519_add_premium_emails_table.sql`

3. **Environment Variables**:
   - Added required cPanel API configuration to environment files:
     ```
     CPANEL_USERNAME=SnakkaZ
     CPANEL_API_TOKEN=xxxx
     CPANEL_DOMAIN=premium123.web-hosting.com
     EMAIL_API_URL=https://premium123.web-hosting.com:2083/execute
     EMAIL_API_KEY=xxxx
     ```

4. **User Interface Enhancement**:
   - Added dedicated section for premium email in the Info page
   - Enhanced login page to highlight the premium email feature

## Testing

### Prerequisites

Before testing, ensure you have:

1. A valid cPanel API token (obtain from the hosting provider)
2. An active premium subscription in the app
3. Completed database migration using `./setup-premium-email-feature.sh`

### Test Procedure

1. **Environment Check**:
   ```bash
   ./test-premium-email-feature.sh
   ```
   This script verifies environment variables, database setup, and API routes.

2. **Functional Testing**:
   - Login as a premium user
   - Navigate to Premium Settings > Email Management
   - Create a new email account
   - Verify account appears in the list
   - Test email capabilities using webmail or external email client

### Email Client Configuration

**IMAP Settings (Incoming Mail)**:
- Server: premium123.web-hosting.com
- Port: 993
- Security: SSL/TLS
- Username: [username]@snakkaz.com
- Password: [your chosen password]

**SMTP Settings (Outgoing Mail)**:
- Server: premium123.web-hosting.com
- Port: 465
- Security: SSL/TLS
- Username: [username]@snakkaz.com
- Password: [your chosen password]

## Known Issues

1. The cPanel API token needs to be manually set up by the administrator
2. Email migration from other providers is not yet supported

## Troubleshooting

If you encounter issues with the premium email feature:

1. Check server logs for API errors
2. Verify environment variables are correctly set
3. Confirm the user has an active premium subscription
4. Validate cPanel API token is valid and has appropriate permissions
