#!/bin/bash

# 🚀 SnakkaZ Beta Mobile Launch Script
# Optimal production deployment med PWA support

echo "🚀 Starting SnakkaZ Beta Mobile Launch Deployment..."

# Configuration
PROJECT_NAME="snakkaz-beta"
DOMAIN="snakkaz.com"
BUILD_DIR="dist"
DATE=$(date +"%Y%m%d_%H%M%S")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    print_warning "Build directory not found. Creating production build..."
    npm run build
    if [ $? -ne 0 ]; then
        print_error "Build failed! Exiting..."
        exit 1
    fi
fi

# Check PWA manifest
if [ ! -f "public/manifest.json" ]; then
    print_error "PWA manifest not found!"
    exit 1
fi

# Check service worker
if [ ! -f "public/sw.js" ]; then
    print_error "Service worker not found!"
    exit 1
fi

print_success "Pre-deployment checks passed!"

# Step 2: Environment validation
print_status "Validating environment variables..."

if [ -z "$VITE_SUPABASE_URL" ]; then
    print_warning "VITE_SUPABASE_URL not set in environment"
fi

if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    print_warning "VITE_SUPABASE_ANON_KEY not set in environment"
fi

# Step 3: Build optimization for mobile
print_status "Optimizing build for mobile deployment..."

# Create mobile-optimized build
export VITE_MOBILE_OPTIMIZED=true
export VITE_PWA_ENABLED=true
export VITE_BUILD_TARGET=production

npm run build -- --mode=production

if [ $? -ne 0 ]; then
    print_error "Mobile-optimized build failed!"
    exit 1
fi

print_success "Mobile-optimized build created!"

# Step 4: PWA Asset Generation
print_status "Generating PWA assets..."

# Create icons directory if it doesn't exist
mkdir -p public/icons

# Copy favicon to icons (if source exists)
if [ -f "public/favicon.ico" ]; then
    cp public/favicon.ico public/icons/
fi

print_success "PWA assets ready!"

# Step 5: Security headers setup
print_status "Setting up security headers..."

# Create .htaccess for Apache servers
cat > $BUILD_DIR/.htaccess << 'EOF'
# SnakkaZ Beta - Security Headers and PWA Support

# Security Headers
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"

# PWA Support
Header always set Service-Worker-Allowed "/"

# HTTPS Redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Cache Control for PWA
<IfModule mod_expires.c>
    ExpiresActive On
    
    # Cache static assets
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
    
    # Cache manifest and service worker for shorter time
    ExpiresByType application/manifest+json "access plus 1 day"
    ExpiresByType text/javascript "access plus 1 day"
</IfModule>

# Gzip Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
    AddOutputFilterByType DEFLATE application/manifest+json
</IfModule>

# SPA Routing Support
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
EOF

print_success "Security headers configured!"

# Step 6: Performance optimization
print_status "Optimizing for mobile performance..."

# Minify critical CSS if available
if command -v cssnano &> /dev/null; then
    find $BUILD_DIR -name "*.css" -exec cssnano {} {} \;
fi

# Optimize images if available
if command -v imagemin &> /dev/null; then
    imagemin "$BUILD_DIR/assets/images/*" --out-dir="$BUILD_DIR/assets/images/"
fi

print_success "Performance optimization complete!"

# Step 7: Mobile app manifest validation
print_status "Validating PWA manifest..."

# Check if manifest has required fields
if command -v jq &> /dev/null; then
    MANIFEST_VALID=$(jq 'has("name") and has("short_name") and has("start_url") and has("display") and has("icons")' public/manifest.json)
    if [ "$MANIFEST_VALID" = "true" ]; then
        print_success "PWA manifest is valid!"
    else
        print_warning "PWA manifest may be incomplete"
    fi
fi

# Step 8: Deployment methods
print_status "Choosing deployment method..."

echo "Available deployment options:"
echo "1. Manual FTP/SFTP upload"
echo "2. cPanel File Manager upload"
echo "3. Git deployment"
echo "4. CDN deployment (Netlify/Vercel)"

read -p "Choose deployment method (1-4): " DEPLOY_METHOD

case $DEPLOY_METHOD in
    1)
        print_status "Preparing for FTP deployment..."
        echo "Upload the $BUILD_DIR directory contents to your web server"
        echo "Make sure to upload .htaccess file for proper PWA support"
        ;;
    2)
        print_status "Preparing for cPanel deployment..."
        # Create deployment archive
        tar -czf "snakkaz-beta-mobile-${DATE}.tar.gz" -C $BUILD_DIR .
        print_success "Created deployment archive: snakkaz-beta-mobile-${DATE}.tar.gz"
        echo "1. Log into cPanel File Manager"
        echo "2. Navigate to public_html"
        echo "3. Upload snakkaz-beta-mobile-${DATE}.tar.gz"
        echo "4. Extract the archive"
        ;;
    3)
        print_status "Preparing for Git deployment..."
        echo "Commit the build directory to your deployment branch"
        echo "git add $BUILD_DIR"
        echo "git commit -m 'Mobile PWA launch deployment $DATE'"
        echo "git push origin production"
        ;;
    4)
        print_status "Preparing for CDN deployment..."
        echo "For Netlify: Connect your repository and set build command to 'npm run build'"
        echo "For Vercel: Import project and deploy automatically"
        ;;
esac

# Step 9: Post-deployment verification
print_status "Creating verification checklist..."

cat > "mobile-launch-checklist.md" << EOF
# 📱 SnakkaZ Beta Mobile Launch Verification

## ✅ Pre-Launch Checklist

### PWA Functionality
- [ ] App installs correctly on mobile devices
- [ ] Service worker registers successfully
- [ ] Offline functionality works
- [ ] Push notifications work
- [ ] App manifest loads correctly

### Mobile Optimization
- [ ] Responsive design on all screen sizes
- [ ] Touch gestures work properly
- [ ] Loading times under 3 seconds
- [ ] Images are optimized
- [ ] Fonts load correctly

### Security
- [ ] HTTPS enabled
- [ ] Security headers in place
- [ ] CSP policy configured
- [ ] No mixed content warnings

### Performance
- [ ] Lighthouse PWA score > 90
- [ ] Lighthouse Performance score > 80
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 4s

### Functionality
- [ ] User registration works
- [ ] Chat functionality works
- [ ] File upload works
- [ ] Invitation system works
- [ ] Social sharing works

### Analytics
- [ ] Google Analytics tracking
- [ ] PWA install events tracked
- [ ] User engagement metrics
- [ ] Error tracking enabled

## 🚀 Launch Sequence

1. **Soft Launch** (Day 1-3)
   - [ ] Deploy to production
   - [ ] Test with beta users (50-100)
   - [ ] Monitor error rates
   - [ ] Collect feedback

2. **Public Launch** (Day 4-7)
   - [ ] Announce on social media
   - [ ] Send press release
   - [ ] Contact tech influencers
   - [ ] Monitor traffic and performance

3. **Growth Phase** (Week 2-4)
   - [ ] Optimize based on user data
   - [ ] A/B test improvements
   - [ ] Expand marketing efforts
   - [ ] Add new features based on feedback

## 📊 Success Metrics

- **Install Rate:** Target 15% of visitors
- **Retention:** 40% after 7 days
- **Viral Coefficient:** K > 1.0
- **Performance:** Core Web Vitals pass
- **User Satisfaction:** 4.5+ stars

Deployment Date: $(date)
Version: Beta 1.0.0
EOF

print_success "Mobile launch checklist created!"

# Step 10: Final instructions
print_status "🎉 SnakkaZ Beta Mobile Launch Preparation Complete!"

echo ""
echo "📋 Next Steps:"
echo "1. Review mobile-launch-checklist.md"
echo "2. Deploy using chosen method above"
echo "3. Run PWA validation tools"
echo "4. Test on real mobile devices"
echo "5. Monitor performance and user feedback"
echo ""
echo "🔗 Useful Tools:"
echo "• PWA Builder: https://www.pwabuilder.com/"
echo "• Lighthouse: Chrome DevTools > Lighthouse"
echo "• Real Device Testing: BrowserStack or LambdaTest"
echo "• PWA Analyzer: https://web.dev/measure/"
echo ""

print_success "SnakkaZ Beta is ready for mobile launch! 🚀📱"
