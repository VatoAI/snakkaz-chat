#!/bin/bash
# CSP-injector: Injiserer Content Security Policy og Cloudflare Analytics etter bygging
# Kjøres etter 'npm run build' for å sikre at CSP blir lagt til i det endelige bygget

DIST_DIR="/workspaces/snakkaz-chat/dist"
CSP_POLICY="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.gpteng.co *.cloudflareinsights.com static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: *.amazonaws.com storage.googleapis.com *.supabase.co *.supabase.in; font-src 'self' data:; connect-src 'self' *.supabase.co *.supabase.in wss://*.supabase.co *.amazonaws.com storage.googleapis.com *.snakkaz.com dash.snakkaz.com business.snakkaz.com docs.snakkaz.com analytics.snakkaz.com static.cloudflareinsights.com cloudflareinsights.com *.cloudflareinsights.com cdn.gpteng.co https://cdn.gpteng.co; media-src 'self' blob:; object-src 'none'; frame-src 'self'; worker-src 'self' blob:;"
CF_ANALYTICS_SCRIPT='<script defer crossorigin="anonymous" referrerpolicy="no-referrer-when-downgrade" src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015" data-cf-beacon=\'{"token":"c5bd7bbfe41c47c2a5ec","version":"2023.10.0","spa":true,"spaMode":"auto","cookieDomain":"snakkaz.com","referrerPolicy":"no-referrer-when-downgrade"}\'></script>'

echo "🔒 Injiserer CSP og Cloudflare Analytics i dist/index.html"

if [ ! -d "$DIST_DIR" ]; then
  echo "❌ Feil: dist-katalog ikke funnet. Har du kjørt 'npm run build' først?"
  exit 1
fi

if [ ! -f "$DIST_DIR/index.html" ]; then
  echo "❌ Feil: index.html ikke funnet i dist-katalogen"
  exit 1
fi

# Ta backup av opprinnelig fil
cp "$DIST_DIR/index.html" "$DIST_DIR/index.html.bak"

# Legg til CSP meta tag i head
sed -i 's/<head>/<head>\n    <meta http-equiv="Content-Security-Policy" content="'"$CSP_POLICY"'">/' "$DIST_DIR/index.html"

# Legg til Cloudflare Analytics script rett før </head>
sed -i "s|</head>|    $CF_ANALYTICS_SCRIPT\n  </head>|" "$DIST_DIR/index.html"

echo "✅ CSP og Cloudflare Analytics injisert i dist/index.html"
echo "   Original fil er lagret som index.html.bak"

# Verifiser at CSP ble lagt til
if grep -q "Content-Security-Policy" "$DIST_DIR/index.html"; then
  echo "✅ CSP meta tag verifisert"
else
  echo "❌ Feil: CSP meta tag ikke funnet etter injisering"
  exit 1
fi

# Verifiser at Cloudflare Analytics ble lagt til
if grep -q "cloudflareinsights" "$DIST_DIR/index.html"; then
  echo "✅ Cloudflare Analytics script verifisert"
else
  echo "❌ Feil: Cloudflare Analytics script ikke funnet etter injisering"
  exit 1
fi

echo "🚀 Bygget er klart for deployment med CSP og Cloudflare Analytics"
