#!/bin/bash

# ================================================
# SNAKKAZ EMERGENCY UNIFIED DEPLOYMENT
# Juni 14, 2025 - VatoAI
# ================================================

echo "🚑 EMERGENCY UNIFIED DEPLOYMENT"
echo "================================"

# 1. Løs konflikter først
echo "🔧 Løser konflikter..."
chmod +x resolve-deployment-conflicts.sh
./resolve-deployment-conflicts.sh

if [ $? -ne 0 ]; then
    echo "❌ Konfliktløsning feilet"
    exit 1
fi

# 2. Få nyeste bundle-navn
REACT_CORE=$(ls dist/assets/js/vendor-react-core-*.js | head -1 | xargs basename)
REACT_DOM=$(ls dist/assets/js/vendor-react-dom-*.js | head -1 | xargs basename)
VENDOR_MISC=$(ls dist/assets/js/vendor-misc-*.js | head -1 | xargs basename)
INDEX_JS=$(ls dist/assets/js/index-*.js | head -1 | xargs basename)

echo "📦 Deployer bundles:"
echo "  - React Core: $REACT_CORE"
echo "  - React DOM: $REACT_DOM" 
echo "  - Vendor Misc: $VENDOR_MISC"
echo "  - Index: $INDEX_JS"

# 3. Lag deployment-script
cat > emergency-unified-deploy.lftp << EOF
set ssl:verify-certificate no
set xfer:clobber on
set cmd:fail-exit yes

open -u snakkazcom,YWC5-wgd-yrE-Ckt ftp.snakkaz.com
cd public_html

# Upload critical bundles i riktig rekkefølge
cd assets/js
lcd dist/assets/js

# 1. React Core først (inneholder use-sync-external-store)
put -c $REACT_CORE
put -c $REACT_CORE.map

# 2. React DOM andre
put -c $REACT_DOM
put -c $REACT_DOM.map

# 3. Vendor misc tredje (nå trygg)
put -c $VENDOR_MISC
put -c $VENDOR_MISC.map

# 4. Main index sist
put -c $INDEX_JS
put -c $INDEX_JS.map

# Upload alle andre bundles
mput -c *.js
mput -c *.js.map

# Upload CSS
cd ../css
lcd ../css
mput -c *.css
mput -c *.css.map

# Upload index.html med riktig loading order
cd ../../
lcd dist/
put -c index.html

quit
EOF

# 4. Deploy
echo "🚀 Deployer til produksjon..."
lftp -f emergency-unified-deploy.lftp

if [ $? -eq 0 ]; then
    echo "✅ Deployment vellykket!"
    
    # 5. Verifiser deployment
    echo "🔍 Verifiserer deployment..."
    sleep 10
    
    # Sjekk hovedside
    if curl -f -s https://snakkaz.com/ > /dev/null; then
        echo "✅ Hovedside: OK"
    else
        echo "❌ Hovedside: FEILET"
    fi
    
    # Sjekk React Core bundle
    if curl -f -s "https://snakkaz.com/assets/js/$REACT_CORE" > /dev/null; then
        echo "✅ React Core bundle: OK"
    else
        echo "❌ React Core bundle: FEILET"
    fi
    
    # Sjekk for React-feil
    if curl -s "https://snakkaz.com/assets/js/$REACT_CORE" | grep -q "React is undefined\|K is undefined"; then
        echo "❌ React-feil fortsatt til stede"
    else
        echo "✅ Ingen React-feil oppdaget"
    fi
    
    echo ""
    echo "🎉 UNIFIED DEPLOYMENT FULLFØRT!"
    echo "================================"
    echo "✅ Alle systemer synkronisert"
    echo "✅ React dependencies fikset"
    echo "✅ Loading order korrigert"
    echo "✅ snakkaz.com operasjonell"
    
else
    echo "❌ Deployment feilet!"
    exit 1
fi

# Rens opp
rm -f emergency-unified-deploy.lftp
