#!/bin/bash
#
# Fikser CSP (Content Security Policy) problemer i Snakkaz Chat
#

echo "🔒 Starter CSP-fiksing for Snakkaz Chat 🔒"
echo "=========================================="
echo

# Finn alle filer som setter Content-Security-Policy meta tags
echo "Søker etter filer som inneholder CSP-konfigurasjoner..."
csp_files=$(grep -l "Content-Security-Policy" --include="*.html" --include="*.ts" --include="*.js" -r /workspaces/snakkaz-chat || echo "")

if [ -z "$csp_files" ]; then
  echo "Ingen CSP-konfigurasjonsfiler funnet med direkte grep, prøver bredere søk..."
  csp_files=$(grep -l "Content-Security-Policy\|CSP\|csp" --include="*.html" --include="*.ts" --include="*.js" --include="*.tsx" -r /workspaces/snakkaz-chat/src || echo "")
fi

# Sjekk om vi fant noen filer
if [ -z "$csp_files" ]; then
  echo "❌ Ingen CSP-konfigurasjonsfiler funnet."
else
  echo "Fant følgende CSP-relaterte filer:"
  echo "$csp_files" | tr ' ' '\n'
fi

# Sjekk index.html for CSP meta tag
if [ -f "/workspaces/snakkaz-chat/index.html" ]; then
  echo ""
  echo "Sjekker index.html for CSP meta tag..."
  grep -o '<meta.*Content-Security-Policy.*>' /workspaces/snakkaz-chat/index.html || echo "Ingen CSP meta tag funnet i index.html."
fi

# Sjekk dist/index.html for CSP meta tag
if [ -f "/workspaces/snakkaz-chat/dist/index.html" ]; then
  echo ""
  echo "Sjekker dist/index.html for CSP meta tag..."
  grep -o '<meta.*Content-Security-Policy.*>' /workspaces/snakkaz-chat/dist/index.html || echo "Ingen CSP meta tag funnet i dist/index.html."
fi

# Fikser CSP report-uri-advarselen ved å erstatte den med report-to
echo ""
echo "🛠️ Fikser CSP report-uri advarsel ved å konvertere til report-to..."

# Behandler index.html først
if [ -f "/workspaces/snakkaz-chat/index.html" ]; then
  echo "Oppdaterer index.html..."
  cp "/workspaces/snakkaz-chat/index.html" "/workspaces/snakkaz-chat/index.html.bak"
  
  # Erstatt report-uri med report-to
  sed -i 's/report-uri/report-to/g' "/workspaces/snakkaz-chat/index.html"
  
  # Legg til report-to direktiv hvis det ikke finnes, men report-uri finnes
  if grep -q "report-uri" "/workspaces/snakkaz-chat/index.html"; then
    sed -i 's/<meta http-equiv="Content-Security-Policy" content="/<meta http-equiv="Content-Security-Policy" content="report-to analytics.snakkaz.com\/csp-report; /g' "/workspaces/snakkaz-chat/index.html"
  fi
  
  echo "✅ index.html oppdatert"
fi

# Behandler dist/index.html deretter
if [ -f "/workspaces/snakkaz-chat/dist/index.html" ]; then
  echo "Oppdaterer dist/index.html..."
  cp "/workspaces/snakkaz-chat/dist/index.html" "/workspaces/snakkaz-chat/dist/index.html.bak"
  
  # Erstatt report-uri med report-to
  sed -i 's/report-uri/report-to/g' "/workspaces/snakkaz-chat/dist/index.html"
  
  # Legg til report-to direktiv hvis det ikke finnes, men report-uri finnes
  if grep -q "report-uri" "/workspaces/snakkaz-chat/dist/index.html"; then
    sed -i 's/<meta http-equiv="Content-Security-Policy" content="/<meta http-equiv="Content-Security-Policy" content="report-to analytics.snakkaz.com\/csp-report; /g' "/workspaces/snakkaz-chat/dist/index.html"
  fi
  
  echo "✅ dist/index.html oppdatert"
fi

# Sjekk for cspConfig.ts fil
if [ "$(find /workspaces/snakkaz-chat/src -name "cspConfig.ts" -type f | wc -l)" -gt 0 ]; then
  echo ""
  echo "Fant cspConfig.ts fil, oppdaterer CSP-konfigurasjonen..."
  
  csp_file=$(find /workspaces/snakkaz-chat/src -name "cspConfig.ts" -type f | head -n 1)
  cp "$csp_file" "$csp_file.bak"
  
  # Erstatt report-uri med report-to i cspConfig.ts
  sed -i 's/report-uri/report-to/g' "$csp_file"
  
  echo "✅ $csp_file oppdatert med report-to istedenfor report-uri"
fi

echo ""
echo "🔒 CSP-fikser fullført! 🔒"
echo ""
echo "Følgende fikser ble utført:"
echo "1. report-uri direktiver ble erstattet med report-to direktiver"
echo "2. Backupfiler ble opprettet for alle endrede filer"
echo ""
echo "Neste steg:"
echo "1. Kjør 'npm run build' for å bygge prosjektet med de nye CSP-innstillingene"
echo "2. Test applikasjonen for å verifisere at CSP-advarsler er løst"
echo "3. Hvis du trenger ytterligere CSP-justeringer, kan du redigere cspConfig.ts direkte"
echo ""
