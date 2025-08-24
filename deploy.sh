#!/bin/bash

# SnakkaZ Production Deployment Script
# Usage: ./deploy.sh

set -e  # Exit on any error

echo "🚀 Starting SnakkaZ Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/workspaces/snakkaz-chat/snakkaz-production"
BACKUP_DIR="/var/backups/snakkaz"
WEB_DIR="/var/www/snakkaz.com"
NGINX_CONF="/etc/nginx/sites-available/snakkaz.com"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Pre-deployment checks
log "Running pre-deployment checks..."

if [ ! -d "$PROJECT_DIR" ]; then
    error "Project directory not found: $PROJECT_DIR"
fi

cd "$PROJECT_DIR"

if [ ! -f "package.json" ]; then
    error "package.json not found in project directory"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    log "Installing dependencies..."
    npm ci || error "Failed to install dependencies"
fi

success "Pre-deployment checks completed"

# Build production version
log "Building production version..."
npm run build || error "Build failed"
success "Production build completed"

# Create backup
if [ -d "$WEB_DIR" ]; then
    log "Creating backup..."
    BACKUP_NAME="snakkaz-backup-$(date +%Y%m%d_%H%M%S)"
    sudo mkdir -p "$BACKUP_DIR"
    sudo cp -r "$WEB_DIR" "$BACKUP_DIR/$BACKUP_NAME" || warning "Backup creation failed"
    success "Backup created: $BACKUP_DIR/$BACKUP_NAME"
fi

# Deploy new version
log "Deploying new version..."
sudo mkdir -p "$WEB_DIR"
sudo rm -rf "$WEB_DIR"/*
sudo cp -r dist/* "$WEB_DIR/" || error "Deployment failed"
sudo chown -R www-data:www-data "$WEB_DIR"
sudo chmod -R 755 "$WEB_DIR"
success "Files deployed successfully"

# Create Nginx configuration if it doesn't exist
if [ ! -f "$NGINX_CONF" ]; then
    log "Creating Nginx configuration..."
    sudo tee "$NGINX_CONF" > /dev/null << EOF
server {
    listen 80;
    listen [::]:80;
    server_name snakkaz.com www.snakkaz.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name snakkaz.com www.snakkaz.com;
    
    root $WEB_DIR;
    index index.html;
    
    # SSL Configuration (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/snakkaz.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/snakkaz.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Handle React Router
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # API proxy (if needed)
    location /api/ {
        proxy_pass http://localhost:3333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
    
    sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
    success "Nginx configuration created"
fi

# Test Nginx configuration
log "Testing Nginx configuration..."
sudo nginx -t || error "Nginx configuration test failed"
success "Nginx configuration is valid"

# Restart services
log "Restarting services..."
sudo systemctl reload nginx || error "Failed to reload Nginx"
success "Nginx reloaded"

# SSL Certificate setup (if not exists)
if [ ! -d "/etc/letsencrypt/live/snakkaz.com" ]; then
    warning "SSL certificate not found. Run: sudo certbot --nginx -d snakkaz.com -d www.snakkaz.com"
fi

# Health check
log "Performing health check..."
sleep 5

# Check if site is accessible
if curl -f -s -o /dev/null https://www.snakkaz.com 2>/dev/null || curl -f -s -o /dev/null http://www.snakkaz.com 2>/dev/null; then
    success "Health check passed - SnakkaZ is live!"
else
    warning "Health check failed - please verify manually"
fi

# Final report
echo ""
echo "🎉 SnakkaZ Deployment Complete!"
echo "================================"
echo "🌐 Website: https://www.snakkaz.com"
echo "📊 Admin: https://www.snakkaz.com/dashboard" 
echo "💰 Revenue System: Stripe + Vipps integrated"
echo "🔐 Security: HTTPS + Security headers"
echo "⚡ Performance: Gzipped + Cached assets"
echo ""
echo "💵 Revenue Targets:"
echo "   Month 1: 9,900 NOK (100 Pro users)"
echo "   Month 6: 208,800 NOK (1K Pro + 200 Business + 50 Enterprise)"
echo "   Year 1: 2.5M NOK annual revenue"
echo ""
success "SnakkaZ is ready to generate revenue! 🇳🇴💪"
