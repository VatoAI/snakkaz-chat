#!/bin/bash

echo "🚀 SnakkaZ Deployment Script v2.0"
echo "=================================="

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Stopping deployment."
    exit 1
fi

echo "✅ Build successful"

# Deploy to server
echo "🌐 Deploying to server..."

# Create LFTP script
cat > .deploy.lftp << 'LFTPEOF'
set ssl:verify-certificate no
set xfer:clobber on

open -u SnakkaZ@snakkaz.com,Eplekake123! ftp://snakkaz.com
cd public_html

# Upload CSS first
echo "Uploading CSS..."
lcd dist/assets/css
mput -c *.css

# Upload JavaScript files in dependency order
echo "Uploading JavaScript files..."
cd assets/js
lcd ../../js

# Upload React dependencies first
put -c vendor-react-core-*.js
put -c vendor-react-core-*.js.map
put -c vendor-react-dom-*.js  
put -c vendor-react-dom-*.js.map

# Upload other vendor files
put -c vendor-*.js
put -c vendor-*.js.map

# Upload app files
put -c app-*.js
put -c app-*.js.map
put -c components-*.js
put -c components-*.js.map
put -c pages-*.js
put -c pages-*.js.map

# Upload main entry point last
put -c index-*.js
put -c index-*.js.map

# Upload index.html last to prevent loading broken state
echo "Uploading index.html..."
cd ../..
lcd ../..
put -c index.html

echo "✅ Deployment complete"
quit
LFTPEOF

# Run deployment
lftp -f .deploy.lftp

# Cleanup
rm -f .deploy.lftp

echo "🎉 Deployment completed successfully!"
echo "🌐 Visit: https://snakkaz.com"
