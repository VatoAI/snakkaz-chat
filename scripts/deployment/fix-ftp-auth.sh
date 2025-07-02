#!/bin/bash

# ALTERNATIVE DEPLOYMENT METHODS FOR SNAKKAZ
# When FTP fails, use these backup methods

echo "🚨 FTP AUTHENTICATION FAILED - ALTERNATIVE METHODS"
echo "================================================="
echo ""

echo "🔍 DIAGNOSING FTP ISSUE..."
echo "Error: 530 Login authentication failed"
echo "Possible causes:"
echo "1. Password changed"
echo "2. Username format incorrect" 
echo "3. FTP server settings changed"
echo "4. Account suspended/locked"
echo ""

echo "📋 IMMEDIATE SOLUTIONS:"
echo ""

echo "🔧 SOLUTION 1: MANUAL CPANEL UPLOAD (FASTEST)"
echo "============================================="
echo "1. Go to: https://snakkaz.com:2083"
echo "2. Login with: admin@snakkaz.com"
echo "3. Open: File Manager"
echo "4. Navigate to root directory"
echo "5. Upload file: $(pwd)/emergency-index.html"
echo "6. Rename to: index.html (overwrite existing)"
echo ""

echo "🔧 SOLUTION 2: VERIFY FTP CREDENTIALS"
echo "====================================="
echo "Test different login formats:"

# Try different FTP login methods
echo ""
echo "Testing FTP connections..."

# Method 1: Plain username
cat > test-ftp-1.lftp << 'EOF'
set ssl:verify-certificate no
set ftp:passive-mode on
set net:timeout 10
open -u admin@snakkaz.com,Rompetroll123! ftp.snakkaz.com
pwd
quit
EOF

echo "🔍 Testing Method 1: admin@snakkaz.com"
timeout 15 lftp -f test-ftp-1.lftp 2>&1 | head -5

# Method 2: Without domain
cat > test-ftp-2.lftp << 'EOF'
set ssl:verify-certificate no
set ftp:passive-mode on  
set net:timeout 10
open -u admin,Rompetroll123! ftp.snakkaz.com
pwd
quit
EOF

echo ""
echo "🔍 Testing Method 2: admin (without domain)"
timeout 15 lftp -f test-ftp-2.lftp 2>&1 | head -5

# Method 3: Different server
cat > test-ftp-3.lftp << 'EOF'
set ssl:verify-certificate no
set ftp:passive-mode on
set net:timeout 10
open -u admin@snakkaz.com,Rompetroll123! snakkaz.com
pwd
quit
EOF

echo ""
echo "🔍 Testing Method 3: snakkaz.com (no ftp. prefix)"
timeout 15 lftp -f test-ftp-3.lftp 2>&1 | head -5

echo ""
echo "🔧 SOLUTION 3: GENERATE CORRECTED FILES"
echo "======================================="

# Ensure we have the correct files
if [ -f "emergency-index.html" ]; then
    echo "✅ emergency-index.html exists ($(du -h emergency-index.html | cut -f1))"
    
    # Verify it has correct content
    if grep -q "index-C8UgCmie.js" emergency-index.html; then
        echo "✅ File has correct production bundle reference"
    else
        echo "❌ File missing production bundle reference"
    fi
else
    echo "❌ emergency-index.html not found - creating now..."
    
    # Create the correct index.html
    cp dist/index.html emergency-index.html
    echo "✅ Created emergency-index.html from dist/"
fi

echo ""
echo "🔧 SOLUTION 4: ALTERNATIVE HOSTING CHECK"
echo "======================================="
echo "If FTP continues to fail, consider:"
echo "1. Contact hosting provider about FTP access"
echo "2. Use SFTP instead of FTP"
echo "3. Use hosting control panel file manager"
echo "4. Check if IP is blocked"
echo ""

echo "📱 SOLUTION 5: QUICK HOSTING PROVIDER CHECK"
echo "==========================================="
echo "Check hosting provider dashboard:"
echo "1. Login to hosting control panel"
echo "2. Check FTP accounts status"
echo "3. Verify FTP is enabled"
echo "4. Check for any security blocks"
echo ""

# Cleanup test files
rm -f test-ftp-*.lftp

echo "🎯 RECOMMENDED IMMEDIATE ACTION:"
echo "==============================="
echo "Use cPanel File Manager (Solution 1) - it's fastest and most reliable"
echo ""
echo "📁 File to upload: $(pwd)/emergency-index.html"
echo "🌐 After upload, test: https://snakkaz.com"
echo ""
echo "⏰ Completed at: $(date)"
