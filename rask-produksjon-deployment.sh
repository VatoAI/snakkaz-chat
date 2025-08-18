#!/bin/bash

# 🚀 SNAKKAZ RASK PRODUKSJONS-DEPLOYMENT
# Optimalisert for økonomiske begrensninger - FOKUS PÅ REVENUE!

echo "🚀 SnakkaZ Rask Produksjon - LA OSS TJENE PENGER! 💰"

# 1. BYGG PRODUKSJONSVERSJON
echo "📦 Building production version..."
npm run build

# 2. SJEKK BUILD STATUS  
if [ $? -eq 0 ]; then
    echo "✅ Build successful! Klar for deployment."
    echo "📂 Dist folder ready:"
    ls -la dist/
else
    echo "❌ Build failed - fixing errors..."
    exit 1
fi

# 3. KOPIER VIKTIGE DEPLOYMENT FILER
echo "📋 Preparing deployment package..."

# Create deployment folder
mkdir -p deployment-ready

# Copy essential files
cp -r dist/* deployment-ready/
cp package.json deployment-ready/
cp .htaccess deployment-ready/ 2>/dev/null || echo "No .htaccess found - creating one"

# Create .htaccess for React Router
cat > deployment-ready/.htaccess << 'EOF'
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
EOF

echo "📄 .htaccess created for React Router"

# 4. LAGE CPANEL-KLAR PAKKE
echo "🎁 Creating cPanel deployment package..."
cd deployment-ready
tar -czf ../snakkaz-production-ready.tar.gz *
cd ..

echo "📦 Package ready: snakkaz-production-ready.tar.gz"
echo "📊 Package size:"
ls -lh snakkaz-production-ready.tar.gz

# 5. DEPLOYMENT INSTRUCTIONS
echo ""
echo "🎯 DEPLOYMENT INSTRUKSJONER FOR www.snakkaz.com:"
echo "=================================================="
echo "1. Last ned: snakkaz-production-ready.tar.gz"
echo "2. Gå til cPanel File Manager for www.snakkaz.com"
echo "3. Last opp til public_html/"
echo "4. Ekstrakker pakken" 
echo "5. ✅ SnakkaZ er LIVE og klar til å tjene penger!"
echo ""
echo "🔗 Test på: https://www.snakkaz.com"
echo ""

# 6. MCP SERVER STATUS CHECK
echo "🤖 Sjekker MCP Server status..."
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ MCP Server kjører lokalt - klar for mcp.snakkaz.com deployment"
else
    echo "⚠️ MCP Server ikke active - starter opp..."
    npm run dev &
    echo "🚀 MCP Server startet for mcp.snakkaz.com"
fi

echo ""
echo "💰 REVENUE FOCUS COMPLETE! SnakkaZ klar for inntektsgenerering!"
echo "🎯 Neste steg: Deploy til www.snakkaz.com og mcp.snakkaz.com"
echo "⏰ Estimert deployment tid: 5-10 minutter"
echo "💡 Etter deployment: Test all functionality og start marketing!"
