#!/bin/bash

# 🇳🇴 SNAKKAZ CPANEL QUICK DEPLOY REFERENCE
echo "🚀 SNAKKAZ CPANEL DEPLOYMENT - QUICK REFERENCE"
echo "=============================================="

echo "📋 CRITICAL CPANEL SETTINGS:"
echo ""
echo "🌐 WEB APPLICATIONS - Node.js Setup:"
echo "   Application URL: mcp.snakkaz.com"
echo "   Application startup file: simplified-server.js"
echo "   Domain: mcp.snakkaz.com"
echo "   Node Environment: production"
echo "   Port: 3000"
echo ""

echo "📦 UPLOAD STEPS:"
echo "1. Upload snakkaz-mcp-subdomain-CORS-FIX.zip to /mcp.snakkaz.com/"
echo "2. Extract ZIP files in cPanel File Manager"
echo "3. Set Application startup file: simplified-server.js"
echo "4. Click 'SAVE' in Node.js App"
echo "5. Upload live-status-checker.html to /public_html/"
echo ""

echo "🧪 TEST LIVE STATUS:"
echo "   → https://snakkaz.com/live-status-checker.html"
echo "   → https://mcp.snakkaz.com/api/health"
echo ""

echo "🔧 TROUBLESHOOTING:"
echo "   → Check Application startup file is simplified-server.js"
echo "   → Ensure Node Environment is set to 'production'"
echo "   → Verify PORT environment variable is 3000"
echo "   → Check file permissions (755 for folders, 644 for files)"
echo ""

echo "🇳🇴 Norwegian Tech Excellence - SnakkaZ Live!"
