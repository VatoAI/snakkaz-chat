#!/bin/bash
# Test FTP connection and upload critical files

echo "🚀 Testing FTP connection to snakkaz.com..."

# Test connection first
lftp -e "set ssl:verify-certificate no; open -u admin@snakkaz.com,Rompetroll123! ftp://ftp.snakkaz.com; pwd; ls -la; quit" 2>&1

if [ $? -eq 0 ]; then
    echo "✅ FTP connection successful!"
    echo ""
    echo "🚀 Deploying emergency fixes..."
    
    # Run the deployment
    lftp -f emergency-deploy.lftp
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 DEPLOYMENT SUCCESS!"
        echo "✅ CAPTCHA multi-digit fix deployed"
        echo "✅ New asset hashes deployed" 
        echo "✅ MIME type fixes deployed"
        echo ""
        echo "🧪 Test at: https://www.snakkaz.com"
    else
        echo "❌ Deployment failed during file transfer"
    fi
else
    echo "❌ FTP connection failed"
    echo "💡 Manual upload may be needed via cPanel"
fi
