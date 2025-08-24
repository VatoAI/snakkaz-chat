#!/bin/bash
# Deploy Enhanced MCP API Server to production

echo "🚀 Deploying SnakkaZ Enhanced MCP API Server"
echo "============================================="

# Create deployment package
echo "📦 Creating deployment package..."
cd /workspaces/snakkaz-chat/mcp-api-server-enhanced/

# Create .htaccess for cPanel
cat > .htaccess << 'EOF'
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security Headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"

# CORS Headers
Header set Access-Control-Allow-Origin "https://snakkaz.com"
Header set Access-Control-Allow-Origin "https://www.snakkaz.com" 
Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-API-Key"
Header set Access-Control-Allow-Credentials "true"

# Handle preflight requests
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]

# API Routes - Forward to Node.js
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
ProxyPreserveHost On

# Cache Control
<filesMatch "\.(json)$">
Header set Cache-Control "no-cache, no-store, must-revalidate"
</filesMatch>

# Gzip Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE application/json text/plain
</IfModule>
EOF

# Create production environment file
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=3000
ADMIN_API_KEY=snakkaz-admin-2025-enhanced
API_RATE_LIMIT=1000
GENERAL_RATE_LIMIT=100
EOF

# Create startup script for cPanel
cat > start.sh << 'EOF'
#!/bin/bash
# Start SnakkaZ Enhanced MCP API Server

cd /var/www/mcp-api/
echo "Starting SnakkaZ Enhanced MCP API Server..."

# Install dependencies
npm install --production

# Start with PM2 (recommended) or fallback to node
if command -v pm2 &> /dev/null; then
    echo "Starting with PM2..."
    pm2 delete snakkaz-mcp-enhanced 2>/dev/null
    pm2 start server.js --name snakkaz-mcp-enhanced --env production
    pm2 save
    echo "✅ Started with PM2"
else
    echo "Starting with Node.js..."
    nohup node server.js > logs/server.log 2>&1 &
    echo $! > server.pid
    echo "✅ Started with Node.js (PID: $(cat server.pid))"
fi

echo "🎉 SnakkaZ Enhanced MCP API Server is running!"
echo "🌐 Access: https://mcp.snakkaz.com/api/health"
EOF

chmod +x start.sh

# Create logs directory
mkdir -p logs

# Create deployment zip
echo "🗜️ Creating deployment zip..."
zip -r ../snakkaz-mcp-enhanced-deploy.zip . \
  -x "*.git*" "node_modules/*" "*.log" "*.pid" "*.DS_Store"

echo "✅ Deployment package created: snakkaz-mcp-enhanced-deploy.zip"
echo ""
echo "📋 Deployment Instructions:"
echo "=========================="
echo "1. Upload snakkaz-mcp-enhanced-deploy.zip to your cPanel File Manager"
echo "2. Extract to /public_html/api/ (or wherever you want the API)"
echo "3. In cPanel Terminal, run: bash start.sh"
echo "4. Test: curl https://mcp.snakkaz.com/api/health"
echo ""
echo "🔑 API Key Management:"
echo "===================="
echo "1. First startup creates admin key automatically"
echo "2. Generate new keys: POST /api/keys/generate (with admin key)"
echo "3. List keys: GET /api/keys/list (with admin key)"
echo ""
echo "🔗 Third-party Integration:"
echo "=========================="
echo "1. Give API key to third-party developers"
echo "2. They use: X-API-Key header in requests"
echo "3. Rate limited: 1000 requests/15 minutes"
echo "4. Monitor usage in API response headers"
echo ""
echo "🎯 Available Endpoints:"
echo "======================"
echo "Public:"
echo "  GET  /api/health"
echo "  GET  /api/mcp/info" 
echo "  POST /api/beta-signup"
echo ""
echo "Protected (API key required):"
echo "  POST /api/mcp/chat"
echo "  GET  /api/mcp/tools"
echo "  GET  /api/mcp/status"
echo "  GET  /api/stats"
echo ""
echo "Admin (admin API key required):"
echo "  POST /api/keys/generate"
echo "  GET  /api/keys/list"
echo "  GET  /api/export"
echo ""
echo "🎉 Ready to deploy!"
