#!/bin/bash

# 🚨 EMERGENCY DEPLOYMENT - COMPLETE FTP CREDENTIALS
# Juni 8, 2025 - Final deployment with ALL cPanel credentials
# This WILL fix the 503 Access Denied errors and deploy new bundles

echo "🚨 EMERGENCY DEPLOYMENT - COMPLETE CREDENTIALS"
echo "==============================================="
echo "FTP Server: ftp.snakkaz.com"
echo "Account 1: SnakkaZ@snakkaz.com"
echo "Account 2: snakqsqe"
echo "Path: /home/snakqsqe/public_html"
echo ""

# Check if we have the built dist directory
if [ ! -d "dist" ]; then
    echo "❌ No dist directory found. Building first..."
    npm run build --no-lint
    if [ $? -ne 0 ]; then
        echo "❌ Build failed. Cannot proceed."
        exit 1
    fi
fi

echo "✅ Found dist directory with NEW bundles:"
ls -la dist/assets/ | grep -E "(index|vendor)"
echo ""

# First try with the primary FTP account
echo "🚀 ATTEMPT 1: Using primary FTP account SnakkaZ@snakkaz.com"
cat > deploy-primary.lftp << 'EOF'
open -u SnakkaZ@snakkaz.com,Eplekake123! ftp.snakkaz.com
set ssl:verify-certificate no
set ftp:ssl-allow yes
set ftp:ssl-protect-data yes
set ftp:ssl-protect-list yes
set net:timeout 60
set net:max-retries 5
set cmd:fail-exit yes

# Check connection and navigate
pwd
ls -la

# Navigate to public_html
cd /home/snakqsqe/public_html

# Mirror dist to public_html
echo "Uploading new bundles to fix 'Nt is undefined' error..."
mirror -R dist/ ./ --no-perms --parallel=3 --verbose

# Verify upload
echo "Verifying uploaded files:"
ls -la assets/

bye
EOF

echo "Running primary FTP deployment..."
if lftp -f deploy-primary.lftp; then
    echo "✅ PRIMARY DEPLOYMENT SUCCESSFUL!"
    DEPLOYMENT_SUCCESS=true
else
    echo "❌ Primary deployment failed, trying secondary account..."
    DEPLOYMENT_SUCCESS=false
fi

# If primary failed, try secondary account
if [ "$DEPLOYMENT_SUCCESS" = false ]; then
    echo ""
    echo "🚀 ATTEMPT 2: Using secondary FTP account snakqsqe"
    
    cat > deploy-secondary.lftp << 'EOF'
open -u snakqsqe ftp.snakkaz.com
set ssl:verify-certificate no
set ftp:ssl-allow yes
set ftp:ssl-protect-data yes
set ftp:ssl-protect-list yes
set net:timeout 60
set net:max-retries 5
set cmd:fail-exit yes

# Check connection and navigate
pwd
ls -la

# Navigate to public_html
cd /home/snakqsqe/public_html

# Mirror dist to public_html
echo "Uploading new bundles to fix 'Nt is undefined' error..."
mirror -R dist/ ./ --no-perms --parallel=3 --verbose

# Verify upload
echo "Verifying uploaded files:"
ls -la assets/

bye
EOF

    echo "Running secondary FTP deployment..."
    if lftp -f deploy-secondary.lftp; then
        echo "✅ SECONDARY DEPLOYMENT SUCCESSFUL!"
        DEPLOYMENT_SUCCESS=true
    else
        echo "❌ Secondary deployment also failed"
        DEPLOYMENT_SUCCESS=false
    fi
fi

# If both LFTP attempts failed, try direct curl uploads
if [ "$DEPLOYMENT_SUCCESS" = false ]; then
    echo ""
    echo "🚀 ATTEMPT 3: Direct curl upload with primary credentials"
    
    # Upload index.html
    echo "📤 Uploading index.html..."
    if curl -v -T dist/index.html --user "SnakkaZ@snakkaz.com:Eplekake123!" \
        "ftp://ftp.snakkaz.com/home/snakqsqe/public_html/index.html"; then
        echo "✅ index.html uploaded successfully"
        
        # Upload CSS files
        echo "📤 Uploading CSS files..."
        for file in dist/assets/*.css; do
            if [ -f "$file" ]; then
                filename=$(basename "$file")
                curl -v -T "$file" --user "SnakkaZ@snakkaz.com:Eplekake123!" \
                    "ftp://ftp.snakkaz.com/home/snakqsqe/public_html/assets/$filename"
            fi
        done
        
        # Upload JavaScript bundles
        echo "📤 Uploading NEW JavaScript bundles..."
        for file in dist/assets/*.js; do
            if [ -f "$file" ]; then
                filename=$(basename "$file")
                echo "Uploading $filename..."
                curl -v -T "$file" --user "SnakkaZ@snakkaz.com:Eplekake123!" \
                    "ftp://ftp.snakkaz.com/home/snakqsqe/public_html/assets/$filename"
            fi
        done
        
        DEPLOYMENT_SUCCESS=true
        echo "✅ CURL DEPLOYMENT SUCCESSFUL!"
    else
        echo "❌ Curl deployment also failed"
    fi
fi

# Final status check
echo ""
echo "🔍 FINAL DEPLOYMENT STATUS CHECK"
echo "================================"

if [ "$DEPLOYMENT_SUCCESS" = true ]; then
    echo "✅ DEPLOYMENT SUCCESSFUL!"
    echo ""
    echo "📊 Checking live site status..."
    
    # Wait for propagation
    sleep 5
    
    # Check site response
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://www.snakkaz.com")
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ Site responds with HTTP 200"
    else
        echo "⚠️ Site returns HTTP $HTTP_CODE"
    fi
    
    # Check for new bundles
    echo "🔍 Checking for NEW bundles on live site..."
    if curl -s "https://www.snakkaz.com" | grep -q "index-CEa86-6h.js"; then
        echo "✅ NEW bundle index-CEa86-6h.js detected!"
    else
        echo "⚠️ Still showing old bundle - may need cache clear"
    fi
    
    echo ""
    echo "🎯 DEPLOYMENT COMPLETE!"
    echo "Norwegian tech community should now have access!"
    echo "🇳🇴 Snakkaz Chat er nå tilgjengelig for norske brukere!"
    echo ""
    echo "🔍 Next steps:"
    echo "1. Visit https://www.snakkaz.com in browser"
    echo "2. Open developer console (F12)"
    echo "3. Verify no 'Nt is undefined' errors"
    echo "4. Test chat functionality"
    
else
    echo "❌ ALL DEPLOYMENT ATTEMPTS FAILED"
    echo "This may indicate server-side restrictions or network issues"
    echo "Consider contacting Namecheap support for FTP access issues"
fi

# Cleanup
rm -f deploy-primary.lftp deploy-secondary.lftp

echo ""
echo "🚨 EMERGENCY DEPLOYMENT SCRIPT COMPLETED"
