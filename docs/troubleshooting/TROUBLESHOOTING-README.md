# Snakkaz Chat - Secure Messaging App

## Quick Start Guide

### Getting Started
1. Run the diagnostic tool to check for issues:
   ```bash
   ./diagnose-snakkaz.sh
   ```

2. Apply fixes and rebuild the application:
   ```bash
   ./fix-and-rebuild.sh
   ```

3. For just fixing subscription issues:
   ```bash
   ./fix-subscription-schema.sh
   ```

## Common Issues and Solutions

### 1. Subscription Database Error
**Symptom**: Error in console: `Object { code: "PGRST200", details: "...subscription_plans..."`

**Solution**: 
- Run `./fix-subscription-schema.sh` to create the missing database tables
- Rebuild the application with `npm run build`

### 2. Multiple Supabase Clients
**Symptom**: Warning in console about multiple GoTrue clients

**Solution**:
- Always import the Supabase client from the correct location:
  ```typescript
  // Correct way to import
  import { supabase } from '@/lib/supabaseClient';
  ```
- Never create new clients with createClient()

### 3. Chat Functionality Not Working
If the chat, groups, or friends functionality is not working:

1. Check that your Supabase connection is working
2. Ensure user authentication is working correctly
3. Run the diagnostic tool: `./diagnose-snakkaz.sh`
4. Apply all fixes: `./fix-and-rebuild.sh`

## Database Schema
The application relies on several tables in Supabase:

- `profiles` - User profile information
- `groups` - Chat groups
- `messages` - Encrypted messages
- `group_members` - Group membership information
- `subscription_plans` - Available subscription plans
- `subscriptions` - User subscriptions

If any of these tables are missing, you may experience issues with different parts of the application.

## Architecture Overview

Snakkaz Chat uses:
- React and Vite for the frontend
- Supabase for backend services
- End-to-end encryption for secure messaging
- Tailwind CSS for styling
- Bitcoin payments for premium subscriptions

## Premium Features

Premium subscription enables:
- Advanced encryption features
- Group chat with more members
- Extended message storage
- Priority support
- File sharing capabilities
- Electrum integration for Bitcoin payments

## Troubleshooting Development Issues

### Import Errors
If you see import errors, check:
1. Path aliases in `vite.config.ts` and `tsconfig.json`
2. Ensure dependencies are installed: `npm install`

### Build Errors
For build errors:
1. Run `npm run lint` to check for code issues
2. Check for TypeScript errors with `npx tsc --noEmit`

### Database Issues
For database issues:
1. Check Supabase connection in `.env` or `environment.ts`
2. Run `./fix-subscription-schema.sh` for schema fixes
3. Use Supabase dashboard to verify table structure

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build:prod

# Run linting
npm run lint:fix

# Preview production build
npm run preview
```

## Security Notes

- Store your API keys securely
- Never commit `.env` files to version control
- Use the singleton pattern for Supabase client to avoid authentication issues
- Always encrypt sensitive user data with proper key management

## Support

If you need help, contact the development team or refer to the documentation in the `/docs` folder.
