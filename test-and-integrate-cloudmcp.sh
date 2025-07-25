#!/bin/bash

# Integration and testing script for CloudMCP-styled components

echo "=== CloudMCP UI Integration and Testing ==="
echo ""

# Check if the required files exist
echo "Checking for required files..."
if [ -f "/workspaces/snakkaz-chat/src/styles/cloudmcp-liquid-glass.css" ] && 
   [ -f "/workspaces/snakkaz-chat/src/pages/ProfilePageCloudMCP.jsx" ] && 
   [ -f "/workspaces/snakkaz-chat/src/pages/ChatPageCloudMCP.jsx" ]; then
    echo "✓ All required component files found."
else
    echo "✗ Missing component files. Please ensure all files are created."
    exit 1
fi

# Check if database fix scripts are available
echo "Checking for database fix scripts..."
if [ -f "/workspaces/snakkaz-chat/scripts/fix-database-schema.sh" ] && 
   [ -f "/workspaces/snakkaz-chat/scripts/fix-database-schema.sql" ]; then
    echo "✓ Database fix scripts found."
else
    echo "⚠ Database fix scripts not found. You may encounter database errors."
    echo "  See docs/CLOUDMCP-UI-INTEGRATION.md for troubleshooting."
fi

# Check for main.tsx modifications (React fix)
echo "Checking React initialization..."
if grep -q "Starting SnakkaZ app initialization" "/workspaces/snakkaz-chat/src/main.tsx"; then
    echo "✓ React initialization looks good."
else
    echo "⚠ React initialization may have issues. Check main.tsx if you see createRoot warnings."
fi

# Check if the routes are added to App.tsx
echo "Checking for route configuration..."
if grep -q "cloudmcp-profile" "/workspaces/snakkaz-chat/src/App.tsx" && 
   grep -q "cloudmcp-chat" "/workspaces/snakkaz-chat/src/App.tsx"; then
    echo "✓ Routes configured correctly."
else
    echo "✗ Routes not found in App.tsx. Please check route configuration."
    exit 1
fi

# Check if CSS is imported in index.css
echo "Checking for CSS imports..."
if grep -q "cloudmcp-liquid-glass.css" "/workspaces/snakkaz-chat/src/index.css"; then
    echo "✓ CSS imported correctly."
else
    echo "✗ CSS import not found in index.css. Please check CSS configuration."
    exit 1
fi

echo ""
echo "All checks passed. Your CloudMCP UI components are integrated correctly."
echo ""
echo "To test the components:"
echo "1. Run the application: npm run dev"
echo "2. Open the following URLs in your browser:"
echo "   - http://localhost:5175/cloudmcp-profile"
echo "   - http://localhost:5175/cloudmcp-chat"
echo ""
echo "To integrate these components into other parts of the application:"
echo "1. Import the components where needed:"
echo "   import ProfilePageCloudMCP from '@/pages/ProfilePageCloudMCP';"
echo "   import ChatPageCloudMCP from '@/pages/ChatPageCloudMCP';"
echo ""
echo "2. Use the components in your JSX:"
echo "   <ProfilePageCloudMCP />"
echo "   <ChatPageCloudMCP />"
echo ""
echo "=== End of Integration Guide ==="
