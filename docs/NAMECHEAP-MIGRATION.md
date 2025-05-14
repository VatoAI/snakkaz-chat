# SnakkaZ Chat Migration from Cloudflare to Namecheap

This document outlines the migration process from Cloudflare dependencies to Namecheap for the SnakkaZ Chat application.

## Changes Made

### 1. File Reorganization
Files have been moved from `/services/encryption` to more logical locations:

- UI Components → `/components/chat/`
  - ChatInterface.tsx
  - GroupList.tsx
  - LoginButton.tsx
  - NewConversation.tsx
  - PrivateChat.tsx
  - PrivateChatContainer.tsx
  - PrivateConversations.tsx
  - SecureMessageViewer.tsx
  - SecureShareComponent.tsx

- Contexts → `/contexts/`
  - ChatContext.tsx

- Encryption Utilities → `/utils/encryption/`
  - encryptionService.ts
  - keyStorageService.ts
  - simpleEncryption.ts

- API Services → `/services/api/`
  - privateChatService.ts
  - groupChatService.ts
  - mediaUploadService.ts

- Theme Service → `/utils/`
  - themeService.ts

- Security Services → `/services/security/`
  - cspConfig.ts
  - cspFixes.ts
  - cspReporting.ts
  - diagnosticTest.ts
  - securityEnhancements.ts

- DNS Services → `/services/dns/`
  - namecheapDns.ts
  - namecheapConfig.ts

- Scripts → `/scripts/`
  - inject-csp.sh

### 2. Cloudflare Dependency Removal
The following Cloudflare-specific files/code have been removed:

- Cloudflare Analytics in `analyticsLoader.ts`
- Cloudflare domains from CSP in `snakkazCspPlugin.ts`
- Cloudflare Analytics script injection from `inject-csp.sh`
- Cloudflare-specific reporting in `cspReporting.ts`
- Various Cloudflare helper functions and fixes:
  - cloudflareApi.ts
  - cloudflareConfig.ts
  - cloudflareHelper.ts
  - cloudflareManagement.ts
  - cloudflareSecurityCheck.ts
  - configure-cloudflare.js
  - setup-cloudflare.sh
  - validate-cloudflare.js

### 3. CSP Configuration Updates
Content Security Policy has been updated to work with Namecheap instead of Cloudflare:

- Removed Cloudflare-specific domains from CSP directives
- Updated CSP reporting endpoints to use our own analytics server
- Simplified CSP configuration with updated directives
- Improved CSP enforcement with better reporting

### 4. Import Path Updates
All files that referenced the old structure have been updated to use the new import paths:

- Updated all imports in `AppRouter.tsx`
- Updated all imports in `SecureChatPage.tsx` 
- Updated all imports in `ThemeProvider.tsx`
- Updated all imports in component files
- Updated initialization imports in `main.tsx`

### 5. New Features

- Added Namecheap DNS API integration to replace Cloudflare functionality
- Created improved security enhancements module
- Simplified application initialization process
- Added browser compatibility fixes
- Improved error handling and diagnostics

## Migration Process

1. Created backup of original files
2. Reorganized file structure into logical categories
3. Created new service modules for security and DNS management
4. Updated all import paths
5. Removed Cloudflare-specific code
6. Added Namecheap API integration
7. Updated CSP configuration
8. Created migration documentation

## Using the Namecheap API

To use the Namecheap API, you need to:

1. Set the following environment variables:
   - `NAMECHEAP_API_USER`: Your Namecheap API user
   - `NAMECHEAP_API_KEY`: Your Namecheap API key
   - `NAMECHEAP_USERNAME`: Your Namecheap username
   - `NAMECHEAP_CLIENT_IP`: The whitelisted IP for API access

2. Use the `namecheapDns.ts` module to manage DNS records:
   ```typescript
   import { createNamecheapDnsManager, createDnsRecord } from '../services/dns/namecheapDns';
   import { getSecureNamecheapConfig } from '../services/dns/namecheapConfig';

   // Initialize the DNS manager
   const config = await getSecureNamecheapConfig();
   const dnsManager = createNamecheapDnsManager(config);

   // Get current records
   const records = await dnsManager.getDnsRecords('snakkaz.com');

   // Add a new record
   const newRecord = createDnsRecord('A', '@', '123.123.123.123');
   await dnsManager.setDnsRecords('snakkaz.com', [...records, newRecord]);
   ```

## Remaining Tasks

- Set up proper DNS monitoring
- Implement automated DNS health checks
- Update documentation and code references to Cloudflare
- Add a DNS management UI to replace Cloudflare dashboard functionality
- Test the application thoroughly with the new Namecheap configuration
