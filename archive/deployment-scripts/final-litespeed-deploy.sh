#!/bin/bash

echo "🚀 FINAL: Deploying React app with LiteSpeed-specific fixes"

# Deploy the new LiteSpeed .htaccess
echo "📁 Uploading LiteSpeed-optimized .htaccess..."
lftp -c "
set ftps:initial-prot '';
set ftp:ssl-force false;
set ftp:ssl-protect-data false;
set ssl:verify-certificate false;
open ftp://admin@snakkaz.com:Rompetroll123!@snakkaz.com;
put /workspaces/snakkaz-chat/.htaccess-litespeed-fix -o .htaccess;
quit;
"

# Upload ONLY the critical React files
echo "📦 Uploading React vendor files..."
lftp -c "
set ftps:initial-prot '';
set ftp:ssl-force false;
set ftp:ssl-protect-data false;
set ssl:verify-certificate false;
open ftp://admin@snakkaz.com:Rompetroll123!@snakkaz.com;

# Ensure directories exist
mkdir -f assets;
mkdir -f assets/js;
mkdir -f assets/css;

# Upload critical JS files
put /workspaces/snakkaz-chat/dist/assets/js/vendor-react-core-Cvl4dr7Y.js -o assets/js/vendor-react-core-Cvl4dr7Y.js;
put /workspaces/snakkaz-chat/dist/assets/js/vendor-react-dom-BCUID_Kj.js -o assets/js/vendor-react-dom-BCUID_Kj.js;
put /workspaces/snakkaz-chat/dist/assets/js/index-CVhcb9nv.js -o assets/js/index-CVhcb9nv.js;

# Upload CSS
put /workspaces/snakkaz-chat/dist/assets/css/index-C0s8nMya.css -o assets/css/index-C0s8nMya.css;

quit;
"

echo "🧪 Testing deployment..."

# Test if files are served with correct MIME types
echo "Testing JavaScript file:"
curl -I https://www.snakkaz.com/assets/js/vendor-react-core-Cvl4dr7Y.js

echo ""
echo "Testing CSS file:"
curl -I https://www.snakkaz.com/assets/css/index-C0s8nMya.css

echo ""
echo "🎉 Deployment and testing complete!"
