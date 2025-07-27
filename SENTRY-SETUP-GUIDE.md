# SnakkaZ Sentry Setup Guide

## Quick Setup Instructions

### 1. Create Sentry Account
1. Go to [sentry.io](https://sentry.io) 
2. Sign up for a free account
3. Choose "React" as your platform

### 2. Create Project for SnakkaZ
1. In Sentry dashboard, click "Create Project"
2. Select **React** as the platform
3. Name your project: **"SnakkaZ Chat"**
4. Copy the DSN URL (looks like: `https://abc123@o123456.ingest.sentry.io/456789`)

### 3. Configure SnakkaZ
1. Open `.env.production.template`
2. Replace `VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id` with your actual DSN
3. Save the file

### 4. Optional: MCP Server Monitoring
If you want to monitor the MCP server separately:

1. Create another Sentry project
2. Select **Node.js** as the platform  
3. Name it: **"SnakkaZ MCP Server"**
4. Add the DSN to your MCP server environment

## Example Configuration

```env
# Frontend (React)
VITE_SENTRY_DSN=https://abc123def456@o123456.ingest.sentry.io/789012

# MCP Server (Node.js) - Optional
MCP_SENTRY_DSN=https://xyz789uvw456@o123456.ingest.sentry.io/345678
```

## Features You'll Get

✅ **Error Tracking** - Automatic error reporting  
✅ **Performance Monitoring** - Page load times, API calls  
✅ **Session Replay** - See exactly what users experienced  
✅ **Norwegian Context** - Location, timezone, language info  
✅ **User Journey** - Track user actions leading to errors  
✅ **Real-time Alerts** - Get notified of critical errors

## Testing Sentry

After setup, test error tracking:

1. Open browser console on SnakkaZ
2. Run: `throw new Error("Test Sentry Error")`
3. Check Sentry dashboard for the error report

## Cost

- **Free tier**: 5,000 errors/month + 10,000 performance transactions
- **Perfect for SnakkaZ Beta launch**
- Upgrade later if needed

## Privacy & Security

✅ All sensitive data is automatically filtered  
✅ Norwegian GDPR compliance built-in  
✅ User data is anonymized  
✅ Source code is not exposed  

---

**Need help?** The SnakkaZ team can assist with Sentry setup if needed.