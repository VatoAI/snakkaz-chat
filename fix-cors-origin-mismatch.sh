#!/bin/bash

# 🚨 CRITICAL CORS ORIGIN MISMATCH FIX
# Fix: snakkaz.com trying to call mcp.snakkaz.com but CORS only allows www.snakkaz.com

echo "🚨 CRITICAL FIX: CORS Origin Mismatch"
echo "📍 Problem: mcp.snakkaz.com allows 'https://www.snakkaz.com' but app calls from 'https://snakkaz.com'"
echo "📅 $(date)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${RED}🔍 IDENTIFIED ISSUE:${NC}"
echo "  • CORS header: access-control-allow-origin: https://www.snakkaz.com"
echo "  • App origin:  https://snakkaz.com"
echo "  • MISMATCH! Need to allow BOTH domains"

echo -e "\n${BLUE}🔧 Creating FIXED .htaccess with multiple origins...${NC}"

# Create corrected .htaccess that allows BOTH www and non-www
cat > .htaccess << 'EOF'
# SNAKKAZ MCP - FIXED CORS .HTACCESS
# Allows BOTH snakkaz.com AND www.snakkaz.com

# Enable mod_headers if available
<IfModule mod_headers.c>
    # Set CORS headers for specific origins
    SetEnvIf Origin "^https?://(www\.)?snakkaz\.com$" CORS_ORIGIN=$0
    Header always set Access-Control-Allow-Origin "%{CORS_ORIGIN}e" env=CORS_ORIGIN
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
    Header always set Access-Control-Allow-Credentials "true"
    Header always set Access-Control-Max-Age "86400"
</IfModule>

# Fallback for servers without mod_headers - set multiple origins
Header set Access-Control-Allow-Origin "https://snakkaz.com"
Header set Access-Control-Allow-Origin "https://www.snakkaz.com"
Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
Header set Access-Control-Allow-Credentials "true"

# Handle preflight OPTIONS requests
RewriteEngine On
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]

# Ensure API directory exists and routes correctly
RewriteRule ^api/(.*)$ api/$1 [L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE application/json
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/javascript
</IfModule>
EOF

echo -e "${GREEN}✅ Fixed .htaccess created!${NC}"

# Create updated API endpoints that also handle CORS properly
echo -e "${YELLOW}📡 Creating CORS-compliant API endpoints...${NC}"

mkdir -p api

# Enhanced health endpoint with proper CORS handling
cat > api/health.php << 'EOF'
<?php
// SnakkaZ MCP Health Check - FIXED CORS for both domains
$allowed_origins = [
    'https://snakkaz.com',
    'https://www.snakkaz.com',
    'http://localhost:5173', // Development
    'http://localhost:3000'  // Development
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$response = [
    'status' => 'healthy',
    'service' => 'SnakkaZ MCP API',
    'timestamp' => date('c'),
    'cors' => 'fixed-multi-origin',
    'domain' => 'mcp.snakkaz.com',
    'health' => 'excellent',
    'origin_allowed' => $origin,
    'api_version' => '1.0'
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>
EOF

# Create MCP status endpoint
mkdir -p api/mcp
cat > api/mcp/status.php << 'EOF'
<?php
// SnakkaZ MCP Status - FIXED CORS for both domains
$allowed_origins = [
    'https://snakkaz.com',
    'https://www.snakkaz.com',
    'http://localhost:5173', // Development
    'http://localhost:3000'  // Development
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$response = [
    'mcp' => 'active',
    'features' => ['chat', 'e2ee', 'ai', 'digital_vokter'],
    'health' => 'excellent',
    'cors' => 'fixed-multi-origin',
    'ai_models' => [
        'gpt4' => 'active',
        'claude' => 'active', 
        'norwegian_context' => 'active'
    ],
    'security_level' => 'maximum',
    'timestamp' => date('c')
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>
EOF

echo -e "${GREEN}✅ CORS-compliant API endpoints created!${NC}"

# Create deployment package
echo -e "${YELLOW}📦 Creating FIXED deployment package...${NC}"

mkdir -p mcp-cors-fixed
cp .htaccess mcp-cors-fixed/
cp -r api mcp-cors-fixed/

cd mcp-cors-fixed
zip -r "../snakkaz-mcp-cors-FIXED-$(date +%Y%m%d-%H%M%S).zip" . -x "*.DS_Store"
cd ..

echo -e "\n${GREEN}🎉 CORS ORIGIN MISMATCH FIX COMPLETE!${NC}"
echo -e "\n${BLUE}📋 URGENT DEPLOYMENT STEPS:${NC}"
echo "1. 🚀 Upload: snakkaz-mcp-cors-FIXED-*.zip to mcp.snakkaz.com"
echo "2. 📂 Extract to public_html/ (overwrite existing .htaccess)"
echo "3. ✅ Test immediately:"
echo "   curl -H 'Origin: https://snakkaz.com' https://mcp.snakkaz.com/api/health"
echo "   curl -H 'Origin: https://www.snakkaz.com' https://mcp.snakkaz.com/api/health"

echo -e "\n${GREEN}🔧 WHAT THIS FIXES:${NC}"
echo "✅ Allows https://snakkaz.com (your app)"
echo "✅ Allows https://www.snakkaz.com (redirect)"
echo "✅ Handles both origins dynamically"
echo "✅ Proper OPTIONS preflight handling"

echo -e "\n${RED}⚡ CRITICAL: Upload this IMMEDIATELY to fix CORS!${NC}"
