#!/bin/bash

echo "🚀 UPLOADING ALL REACT ASSETS - Batch deployment"

# Create a temporary script for batch upload
cat > /tmp/ftp_commands.txt << 'EOF'
open ftp://admin@snakkaz.com:Rompetroll123!@snakkaz.com
set ftps:initial-prot ""
set ftp:ssl-force false
set ftp:ssl-protect-data false
set ssl:verify-certificate false

# Create directory structure
mkdir -f assets
mkdir -f assets/js  
mkdir -f assets/css

# Upload all JS files
lcd /workspaces/snakkaz-chat/dist/assets/js
cd assets/js
mput vendor-react-core-Cvl4dr7Y.js
mput vendor-react-dom-BCUID_Kj.js  
mput vendor-router-CuBeC0PK.js
mput vendor-database-Hixw_8oQ.js
mput index-CVhcb9nv.js

# Upload CSS files
lcd /workspaces/snakkaz-chat/dist/assets/css
cd /assets/css
mput index-C0s8nMya.css

quit
EOF

# Execute the upload
lftp -f /tmp/ftp_commands.txt

echo "✅ Batch upload complete!"

# Test critical files
echo "🧪 Testing uploads..."
curl -I https://www.snakkaz.com/assets/js/vendor-react-core-Cvl4dr7Y.js
curl -I https://www.snakkaz.com/assets/css/index-C0s8nMya.css

echo "🎉 Done!"
