# Snakkaz Chat - Testing Guide
#### FASE 1: Sikkerhet & Stabilitet - May 23, 2025

This guide outlines how to test the completed features for the Snakkaz chat application.

## 1. Database Schema Fix Testing

### Step 1: Apply the Database Schema Fix
Run the following command in your terminal:

```bash
node apply-database-fix.js
```

This script will:
- Check if the required tables exist in the Supabase database
- If not, provide instructions for applying the SQL fix

### Step 2: Manual SQL Application (if needed)
If the script indicates you need to apply the SQL manually:
1. Open the Supabase SQL Editor: https://supabase.com/dashboard/project/wqpoozpbceucynsojmbk/sql/new
2. Copy and paste the entire contents of `CRITICAL-DATABASE-FIX.sql`
3. Click the "Run" button to execute the SQL

### Step 3: Verify Database Schema Fix
After applying the SQL:
1. Run the verification again:
```bash
node apply-database-fix.js
```
2. It should indicate that the database schema is correctly set up

## 2. Testing Two-Factor Authentication (2FA)

### Step 1: Register/Login Flow
1. Register a new user or log in with an existing account
2. If 2FA isn't set up yet, go to settings to enable it

### Step 2: Enable 2FA for Testing
1. Navigate to user settings
2. Find the 2FA security section
3. Follow the setup instructions:
   - Scan QR code with an authenticator app (Google Authenticator, Authy, etc.)
   - Enter the verification code
   - Note down backup codes

> **Note:** We've updated the 2FA implementation to use a browser-compatible OTP library (`otpauth`) instead of the Node.js specific `speakeasy`. This resolves the `util.deprecate is not a function` error that was preventing 2FA from working properly in the browser environment.

### Step 3: Test 2FA Flow
1. Log out of your account
2. Log in again with your credentials
3. You should be redirected to the 2FA verification screen
4. Enter a valid code from your authenticator app
5. You should be successfully logged in and redirected to the protected area

### Step 4: Test Backup Codes
1. Log out of your account
2. Log in again with your credentials
3. On the 2FA verification screen, switch to "Backup Code" tab
4. Enter one of your backup codes
5. Verify that you're successfully logged in
6. Check that the used backup code is no longer valid

## 3. Testing Subscription Functionality

### Step 1: Access Subscription Page
1. Log in to your account (completing 2FA if required)
2. Navigate to the subscription page

### Step 2: Verify Plan Display
1. Check that subscription plans are displayed correctly
2. Verify pricing information is accurate
3. Confirm that the subscriptions page loads without 406 errors

### Step 3: Test Plan Selection
1. Select a different subscription plan
2. Verify that the subscription details update correctly
3. Check that the selection is maintained if you navigate away and back

## 4. Testing Chat System Functionality

### Step 1: Access Chat
1. Log in to your account (completing 2FA if required)
2. Navigate to the chat section

### Step 2: Send and Receive Messages
1. Create or select a chat conversation
2. Send test messages
3. Verify that messages appear correctly
4. Check that there are no 406 errors in the console

### Step 3: Test Chat Features
1. Try sending different message types (text, emoji)
2. Test message receipt confirmation
3. Verify message timestamps
4. Check encryption indicators if applicable

## Troubleshooting

### 406 Errors Still Occurring
If subscription-related 406 errors persist:
1. Verify the SQL was applied correctly
2. Check browser console for specific error messages
3. Try clearing browser cache and local storage
4. Restart the development server

### 2FA Issues
If 2FA verification isn't working:
1. Check that TOTP secrets are stored correctly in user metadata
2. Ensure the time on your device and server are synchronized
3. Verify backup codes are properly stored and can be used only once

### Database Connection Issues
If you encounter database connection problems:
1. Verify your Supabase credentials
2. Check network connectivity to Supabase
3. Ensure you have appropriate permissions in Supabase

## Next Steps
With these fixes implemented, the application should now have:
1. ✅ Complete 2FA implementation (100%)
2. ✅ Proper database schema for subscriptions
3. ✅ Functioning chat system without 406 errors

Proceed to FASE 2 development after verifying all functionality.
