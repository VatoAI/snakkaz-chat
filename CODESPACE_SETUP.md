# Snakkaz Chat - Codespace Setup Guide

## Quick Start for Codespace Environment

### 1. Environment Variables Setup
The project includes a `.env` file with default values for AI configuration:

```env
VITE_AI_ENABLED=true
VITE_AI_DEFAULT_PROVIDER=anthropic
VITE_AI_DEFAULT_MODEL=claude-3-5-sonnet-20241022
VITE_AI_MAX_TOKENS=4000
VITE_AI_TEMPERATURE=0.7
VITE_DEBUG_MODE=true
```

### 2. DevContainer Configuration
The `.devcontainer/devcontainer.json` is configured with:
- Node.js 18 environment
- Proper port forwarding (3000, 5173)
- Required VS Code extensions including GitHub Copilot
- Environment variables for AI configuration

### 3. Running the Project
```bash
# Install dependencies (automatically done in devcontainer)
npm install

# Start development server
npm run dev

# Build project
npm run build
```

### 4. VS Code Copilot Usage
With the fixes applied, VS Code Copilot should work properly in codespaces:
- The AI chat feature uses `import.meta.env` for environment variables
- Debug logging helps identify any configuration issues
- Environment variables are properly configured in the devcontainer

### 5. Troubleshooting
If you encounter issues:
1. Check browser console for debug messages
2. Verify environment variables are loaded: `console.log(import.meta.env)`
3. Ensure you're logged in to use AI features
4. Check network connectivity for API calls

### 6. Testing AI Features
1. Navigate to the AI chat page
2. Send a test message
3. Check browser console for debug information
4. Verify response is generated properly

## Common Issues and Solutions

### Issue: AI Chat Not Responding
**Solution**: Check that `VITE_AI_ENABLED=true` and other environment variables are properly set.

### Issue: Environment Variables Not Loading
**Solution**: Restart the codespace or rebuild the devcontainer.

### Issue: Network Errors
**Solution**: Verify codespace has internet access and API endpoints are reachable.

For more detailed troubleshooting, see: `docs/troubleshooting/VS_CODE_COPILOT_CODESPACE_FIX.md`