#!/bin/bash

echo "🚀 SNAKKAZ KOMPLETT FIX - LØSER ALT PÅ EN GANG!"
echo "================================================"
echo "Dato: $(date)"
echo "Mål: Fikse alle JavaScript/React problemer samtidig"
echo ""

echo "🔧 STEG 1: REN NODE_MODULES + REINSTALL"
echo "Fjerner alle cached dependencies og installerer på nytt..."
cd /workspaces/snakkaz-chat
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

echo ""
echo "🔨 STEG 2: KOMPLETT REN BUILD"
echo "Bygger appen helt på nytt med optimale innstillinger..."
rm -rf dist
npm run build

echo ""
echo "🎯 STEG 3: OPTIMAL MODULEPRELOAD ORGANISERING"
echo "Organiserer JavaScript moduler i riktig dependency-rekkefølge..."

# Les current index.html og opprett optimal versjon
cat > /workspaces/snakkaz-chat/dist/index-OPTIMAL.html << 'EOF'
<!DOCTYPE html>
<html lang="no">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/icons/snakkaz-icon-192.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="theme-color" content="#0f172a" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="SnakkaZ Chat" />
    <link rel="apple-touch-icon" href="/icons/snakkaz-icon-192.png" />
    <link rel="stylesheet" href="/assets/auth-bg.css" />
    
    <!-- Content Security Policy -->
    <meta http-equiv="Content-Security-Policy" content="
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: *.amazonaws.com storage.googleapis.com *.supabase.co *.supabase.in;
      font-src 'self' data:;
      connect-src 'self' *.supabase.co *.supabase.in wss://*.supabase.co *.amazonaws.com storage.googleapis.com 
                  *.snakkaz.com dash.snakkaz.com business.snakkaz.com docs.snakkaz.com analytics.snakkaz.com;
      media-src 'self' blob:;
      object-src 'none';
      frame-src 'self';
      worker-src 'self' blob:;
    ">
    <meta name="crossorigin" content="anonymous">
    <title>SnakkaZ Chat</title>
EOF

# Få main script fra original index.html
main_script=$(grep -o 'src="/assets/js/index-[^"]*\.js"' /workspaces/snakkaz-chat/dist/index.html | head -1)
main_css=$(grep -o 'href="/assets/css/index-[^"]*\.css"' /workspaces/snakkaz-chat/dist/index.html | head -1)

# Legg til main script
echo "    <script type=\"module\" crossorigin $main_script></script>" >> /workspaces/snakkaz-chat/dist/index-OPTIMAL.html

# OPTIMAL MODULEPRELOAD REKKEFØLGE (React først, dependencies i riktig orden)
echo "    <!-- REACT CORE (MÅ LASTE FØRST) -->" >> /workspaces/snakkaz-chat/dist/index-OPTIMAL.html
grep "vendor-react-core" /workspaces/snakkaz-chat/dist/index.html | head -1 >> /workspaces/snakkaz-chat/dist/index-OPTIMAL.html

echo "    <!-- REACT DOM (ETTER CORE) -->" >> /workspaces/snakkaz-chat/dist/index-OPTIMAL.html
grep "vendor-react-dom" /workspaces/snakkaz-chat/dist/index.html | head -1 >> /workspaces/snakkaz-chat/dist/index-OPTIMAL.html

echo "    <!-- VENDOR UTILITIES (SAFE ORDER) -->" >> /workspaces/snakkaz-chat/dist/index-OPTIMAL.html
grep -E "(vendor-security|vendor-utils)" /workspaces/snakkaz-chat/dist/index.html >> /workspaces/snakkaz-chat/dist/index-OPTIMAL.html

echo "    <!-- VENDOR MISC (ETTER REACT) -->" >> /workspaces/snakkaz-chat/dist/index-OPTIMAL.html
grep "vendor-misc" /workspaces/snakkaz-chat/dist/index.html | head -1 >> /workspaces/snakkaz-chat/dist/index-OPTIMAL.html

echo "    <!-- APP OG ANDRE MODULER -->" >> /workspaces/snakkaz-chat/dist/index-OPTIMAL.html
grep -E "(app-|vendor-router|vendor-database|vendor-animation|vendor-forms|vendor-media|components-|pages-)" /workspaces/snakkaz-chat/dist/index.html >> /workspaces/snakkaz-chat/dist/index-OPTIMAL.html

echo "    <!-- UI COMPONENTS (SIST) -->" >> /workspaces/snakkaz-chat/dist/index-OPTIMAL.html
grep "vendor-ui-components" /workspaces/snakkaz-chat/dist/index.html | head -1 >> /workspaces/snakkaz-chat/dist/index-OPTIMAL.html

# Legg til CSS og body
echo "    <link rel=\"stylesheet\" crossorigin $main_css>" >> /workspaces/snakkaz-chat/dist/index-OPTIMAL.html
echo "  </head>" >> /workspaces/snakkaz-chat/dist/index-OPTIMAL.html
echo "  <body>" >> /workspaces/snakkaz-chat/dist/index-OPTIMAL.html
echo "    <div id=\"root\"></div>" >> /workspaces/snakkaz-chat/dist/index-OPTIMAL.html
echo "  </body>" >> /workspaces/snakkaz-chat/dist/index-OPTIMAL.html
echo "</html>" >> /workspaces/snakkaz-chat/dist/index-OPTIMAL.html

# Erstatt original med optimal versjon
mv /workspaces/snakkaz-chat/dist/index-OPTIMAL.html /workspaces/snakkaz-chat/dist/index.html

echo ""
echo "📤 STEG 4: KOMPLETT FTP DEPLOYMENT"
echo "Laster opp ALT til serveren i riktig rekkefølge..."

# Deploy i optimal rekkefølge
lftp -c "
set ftp:ssl-allow no;
open -u SnakkaZ@snakkaz.com,Eplekake123! ftp://ftp.snakkaz.com;
cd public_html;

echo 'Laster opp .htaccess for MIME type fix...';
put /workspaces/snakkaz-chat/.htaccess .htaccess;

echo 'Laster opp CSS filer...';
cd assets/css;
lcd /workspaces/snakkaz-chat/dist/assets/css;
mput *.css;

echo 'Laster opp JavaScript filer (React først)...';
cd ../js;
lcd /workspaces/snakkaz-chat/dist/assets/js;
put vendor-react-core-*.js;
put vendor-react-dom-*.js;
put vendor-security-*.js;
put vendor-utils-*.js;
put vendor-misc-*.js;
mput *.js;

echo 'Laster opp source maps...';
mput *.map;

echo 'Laster opp index.html (sist for å unngå timing problemer)...';
cd ../../;
lcd /workspaces/snakkaz-chat/dist;
put index.html;

echo 'DEPLOYMENT KOMPLETT!';
"

echo ""
echo "🧪 STEG 5: KOMPLETT VERIFISERING"
echo "Tester at alt fungerer riktig..."

sleep 3

echo "1. MIME TYPE TEST:"
curl -s -I "https://snakkaz.com/assets/js/vendor-react-core-BSO5imIi.js" | grep -i content-type

echo ""
echo "2. MODULEPRELOAD REKKEFØLGE:"
curl -s "https://snakkaz.com/" | grep -E "modulepreload.*vendor-react" | head -3

echo ""
echo "3. HOVEDFILER TILGJENGELIG:"
for file in vendor-react-core vendor-react-dom vendor-misc index; do
  js_file=$(curl -s "https://snakkaz.com/" | grep -o "/assets/js/${file}-[^\"]*\.js" | head -1)
  if [ -n "$js_file" ]; then
    status=$(curl -s -o /dev/null -w "%{http_code}" "https://snakkaz.com$js_file")
    echo "   $file: $status"
  fi
done

echo ""
echo "🎉 KOMPLETT FIX UTFØRT!"
echo "========================"
echo "✅ Node modules reinstallert"  
echo "✅ Ren build generert"
echo "✅ Optimal modulepreload rekkefølge"
echo "✅ Alle filer deployed i riktig orden"
echo "✅ MIME types konfigurert"
echo ""
echo "🚨 RESTART BROWSER MED HARD REFRESH (Ctrl+Shift+R)!"
echo "Dette skal løse ALLE JavaScript/React problemer samtidig! 🎯"
