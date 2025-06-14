#!/bin/bash

# ================================================
# SNAKKAZ CORRECTED FTP DEPLOYMENT
# Juni 14, 2025 - Med korrekte cPanel FTP-opplysninger
# ================================================

echo "🚀 DEPLOYER MED KORREKTE FTP-OPPLYSNINGER"
echo "=========================================="

# FTP-opplysninger fra cPanel
FTP_SERVER="ftp.snakkaz.com"
FTP_USER="SnakkaZ@snakkaz.com"
FTP_PORT="21"

# Få nyeste bundle-navn
REACT_CORE=$(ls dist/assets/js/vendor-react-core-*.js | head -1 | xargs basename)
REACT_DOM=$(ls dist/assets/js/vendor-react-dom-*.js | head -1 | xargs basename)
VENDOR_MISC=$(ls dist/assets/js/vendor-misc-*.js | head -1 | xargs basename)
INDEX_JS=$(ls dist/assets/js/index-*.js | head -1 | xargs basename)

echo "📦 Deployer bundles:"
echo "  - React Core: $REACT_CORE"
echo "  - React DOM: $REACT_DOM" 
echo "  - Vendor Misc: $VENDOR_MISC"
echo "  - Index: $INDEX_JS"

# Lag deployment-script med korrekte FTP-opplysninger
cat > corrected-ftp-deploy.lftp << EOF
set ssl:verify-certificate no
set xfer:clobber on
set cmd:fail-exit yes
set ftp:passive-mode yes

# Koble til med korrekte opplysninger
open -u SnakkaZ@snakkaz.com,YWC5-wgd-yrE-Ckt ftp://ftp.snakkaz.com:21

# Naviger til public_html (web root)
cd public_html

# Upload critical bundles i riktig rekkefølge
cd assets/js
lcd dist/assets/js

# 1. React Core først (inneholder use-sync-external-store)
echo "📤 Uploader React Core..."
put -c $REACT_CORE
put -c $REACT_CORE.map

# 2. React DOM andre
echo "📤 Uploader React DOM..."
put -c $REACT_DOM
put -c $REACT_DOM.map

# 3. Vendor misc tredje (nå trygg)
echo "📤 Uploader Vendor Misc..."
put -c $VENDOR_MISC
put -c $VENDOR_MISC.map

# 4. Main index sist
echo "📤 Uploader Index..."
put -c $INDEX_JS
put -c $INDEX_JS.map

# Upload alle andre bundles
echo "📤 Uploader resterende bundles..."
mput -c *.js
mput -c *.js.map

# Upload CSS
cd ../css
lcd ../css
echo "📤 Uploader CSS..."
mput -c *.css
mput -c *.css.map

# Upload index.html med riktig loading order
cd ../../
lcd dist/
echo "📤 Uploader index.html..."
put -c index.html

echo "✅ Alle filer uploaded!"
quit
EOF

# Deploy
echo "🚀 Deployer til produksjon med korrekte FTP-opplysninger..."
lftp -f corrected-ftp-deploy.lftp

if [ $? -eq 0 ]; then
    echo "✅ Deployment vellykket!"
    
    # Verifiser deployment
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
        
        # Sjekk for React-feil
        if curl -s "https://snakkaz.com/assets/js/$REACT_CORE" | grep -q "React is undefined\|K is undefined"; then
            echo "❌ React-feil fortsatt til stede"
        else
            echo "✅ Ingen React-feil oppdaget"
        fi
    else
        echo "❌ React Core bundle: FEILET"
    fi
    
    echo ""
    echo "🎉 DEPLOYMENT MED KORREKTE FTP-OPPLYSNINGER FULLFØRT!"
    echo "====================================================="
    echo "✅ FTP Server: ftp.snakkaz.com:21"
    echo "✅ FTP User: SnakkaZ@snakkaz.com"
    echo "✅ React dependencies fikset"
    echo "✅ Loading order korrigert"
    echo "✅ snakkaz.com operasjonell"
    
else
    echo "❌ Deployment feilet!"
    exit 1
fi

# Rens opp
rm -f corrected-ftp-deploy.lftp
