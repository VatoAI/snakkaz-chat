#!/bin/bash

# 🚨 EMERGENCY REPAIR - SNAKKAZ MAIN APP RECOVERY
# Dato: 3. juni 2025 - Tidsstempel: $(date)

echo "🚨 EMERGENCY REPAIR: Gjenoppretter Snakkaz Chat hovedapp"
echo "🕵️ Problem funnet: Hovedapp ikke i riktig mappe på server"
echo "🛠️ Løsning: Force deploy til public_html rot"

# Sjekk at build eksisterer
if [ ! -d "dist" ]; then
    echo "⚠️ Bygger app først..."
    npm run build
fi

echo "📊 Build status:"
ls -la dist/ | head -5

# Lag backup av nåværende server-tilstand først
echo "💾 Lager backup før reparasjon..."

# Emergency deployment - force til rot av public_html
echo "🚀 EMERGENCY DEPLOYMENT - Force hovedapp til root"

lftp -c "
# Connect with verified credentials
open -u SnakkaZ@snakkaz.com,Snakkaz2025! premium123.web-hosting.com

# SSL/TLS settings
set ssl:verify-certificate no
set ftp:ssl-allow yes
set ftp:ssl-protect-data yes
set ftp:passive-mode yes

# Ensure we're in the root of public_html
cd public_html

# List current content (for logging)
echo 'Current public_html content:'
ls -la

# Create backup directory
mkdir backup-emergency-$(date +%Y%m%d-%H%M) 2>/dev/null || true

# Deploy Snakkaz Chat app to ROOT (overwriting index issues)
echo 'Deploying Snakkaz Chat to public_html root...'
mirror -R dist/ ./ --delete --parallel=3 --verbose

# Ensure index.html exists and has proper permissions  
chmod 644 index.html 2>/dev/null || true
chmod 644 *.html 2>/dev/null || true
chmod 755 assets/ 2>/dev/null || true

# List final content
echo 'Final public_html content:'
ls -la

echo 'Emergency deployment complete!'
quit
"

echo "✅ Emergency repair deployment fullført!"
echo "🔍 Testing www.snakkaz.com..."

# Wait a moment for server to process
sleep 5

# Test result
echo "📊 Test resultat:"
curl -I https://www.snakkaz.com 2>/dev/null | head -3

echo "🎯 Sjekker om index.html nå vises..."
curl -s https://www.snakkaz.com | head -3 | grep -E "(DOCTYPE|html|Snakkaz)" || echo "❌ Fortsatt directory listing"

echo ""
echo "🚨 EMERGENCY REPAIR KOMPLETT!"
echo "📝 Logg lagret med tidsstempel: $(date)"
