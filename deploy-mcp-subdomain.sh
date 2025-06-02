#!/bin/bash

# MCP Subdomain Deployment Script
# Deploy MCP Dashboard to mcp.snakkaz.com
# Date: June 2, 2025

set -e

echo "🚀 Starting MCP Subdomain Deployment..."

# Configuration
MCP_SUBDOMAIN="mcp.snakkaz.com"
MAIN_DOMAIN="snakkaz.com"
BUILD_DIR="dist"
MCP_BUILD_DIR="mcp-dist"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

echo_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Verify existing infrastructure
echo_info "Verifying existing infrastructure..."

if [ ! -f "package.json" ]; then
    echo_error "Not in Snakkaz project root directory"
    exit 1
fi

if [ ! -d "src/pages" ]; then
    echo_error "Source directory not found"
    exit 1
fi

if [ ! -f "src/pages/MCPDashboard.tsx" ]; then
    echo_error "MCP Dashboard component not found"
    exit 1
fi

echo_success "Infrastructure verification complete"

# Step 2: Check if MCP Dashboard is ready
echo_info "Checking MCP Dashboard readiness..."

MCP_LINES=$(wc -l < src/pages/MCPDashboard.tsx)
if [ "$MCP_LINES" -lt 500 ]; then
    echo_warning "MCP Dashboard seems incomplete (${MCP_LINES} lines)"
else
    echo_success "MCP Dashboard ready (${MCP_LINES} lines)"
fi

# Step 3: Create MCP-specific build configuration
echo_info "Creating MCP-specific build configuration..."

cat > vite.config.mcp.ts << 'EOL'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'mcp-dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'mcp.html')
      }
    }
  },
  server: {
    port: 5174,
    host: true
  }
})
EOL

echo_success "MCP Vite config created"

# Step 4: Create MCP-specific HTML entry point
echo_info "Creating MCP-specific entry point..."

cat > mcp.html << 'EOL'
<!DOCTYPE html>
<html lang="no">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Snakkaz MCP Dashboard</title>
    <meta name="description" content="Model Context Protocol Dashboard for Snakkaz Chat" />
    <meta name="robots" content="noindex, nofollow" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/mcp-main.tsx"></script>
  </body>
</html>
EOL

echo_success "MCP HTML entry point created"

# Step 5: Create MCP-specific main component
echo_info "Creating MCP-specific main component..."

cat > src/mcp-main.tsx << 'EOL'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import MCPDashboard from './pages/MCPDashboard'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from './components/ui/toaster'
import './index.css'

// MCP-specific authentication check
const MCPApp = () => {
  return (
    <AuthProvider>
      <BrowserRouter basename="/">
        <div className="min-h-screen bg-cyberdark-950">
          <MCPDashboard />
          <Toaster />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MCPApp />
  </React.StrictMode>,
)
EOL

echo_success "MCP main component created"

# Step 6: Build MCP application
echo_info "Building MCP application..."

npm run build -- --config vite.config.mcp.ts

if [ $? -eq 0 ]; then
    echo_success "MCP build completed successfully"
else
    echo_error "MCP build failed"
    exit 1
fi

# Step 7: Create MCP .htaccess file
echo_info "Creating MCP .htaccess configuration..."

cat > ${MCP_BUILD_DIR}/.htaccess << 'EOL'
# MCP Subdomain Configuration
RewriteEngine On

# Security headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# CORS for MCP API
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"

# Handle preflight requests
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]

# React Router support
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
EOL

echo_success "MCP .htaccess created"

# Step 8: Create deployment package
echo_info "Creating MCP deployment package..."

mkdir -p deployment-packages/mcp-package
cp -r ${MCP_BUILD_DIR}/* deployment-packages/mcp-package/

echo_success "MCP deployment package created"

# Step 9: Check existing FTP deployment script
if [ -f "deploy-via-ftp.sh" ]; then
    echo_info "Creating MCP-specific FTP deployment..."
    
    # Create MCP-specific FTP script
    sed 's/dist\//deployment-packages\/mcp-package\//g' deploy-via-ftp.sh > deploy-mcp-ftp.sh
    sed -i 's/public_html/public_html\/mcp/g' deploy-mcp-ftp.sh
    chmod +x deploy-mcp-ftp.sh
    
    echo_success "MCP FTP deployment script created"
else
    echo_warning "Main FTP deployment script not found - manual upload required"
fi

# Step 10: Verify deployment readiness
echo_info "Verifying deployment readiness..."

REQUIRED_FILES=(
    "deployment-packages/mcp-package/index.html"
    "deployment-packages/mcp-package/.htaccess"
    "deployment-packages/mcp-package/assets"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -e "$file" ]; then
        echo_success "✓ $file exists"
    else
        echo_error "✗ $file missing"
        exit 1
    fi
done

# Step 11: Display deployment summary
echo ""
echo_success "🎉 MCP Deployment Package Ready!"
echo ""
echo_info "📁 Deployment Location: deployment-packages/mcp-package/"
echo_info "🌐 Target Subdomain: ${MCP_SUBDOMAIN}"
echo_info "📊 Dashboard Component: MCPDashboard.tsx ($(wc -l < src/pages/MCPDashboard.tsx) lines)"
echo ""

echo_warning "📋 Next Steps:"
echo "1. Upload deployment-packages/mcp-package/ to mcp.snakkaz.com"
echo "2. Configure SSL certificate for MCP subdomain"
echo "3. Test MCP dashboard functionality"
echo "4. Enable AI API integrations"
echo ""

if [ -f "deploy-mcp-ftp.sh" ]; then
    echo_info "🚀 Quick Deploy Command:"
    echo "   ./deploy-mcp-ftp.sh"
    echo ""
fi

echo_info "📖 Documentation: docs/MCP-SUBDOMAIN.md"
echo_info "🔧 Configuration: docs/INTELLIGENT-AGENT-CODING-PROMPT-JUNI2-2025.md"

# Step 12: Cleanup temporary files
echo_info "Cleaning up temporary files..."
rm -f vite.config.mcp.ts mcp.html src/mcp-main.tsx

echo_success "✨ MCP deployment preparation complete!"
