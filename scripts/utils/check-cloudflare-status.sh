#!/bin/bash
#
# Cloudflare Status Checker for Snakkaz Chat
#
# Dette skriptet sjekker status på Cloudflare-integrasjonen for www.snakkaz.com
# og verifiserer at alle sikkerhetsmekanismer er på plass og fungerer som forventet.
#

echo "🔒 Snakkaz Cloudflare Status Checker 🔒"
echo "======================================"
echo

# Funksjon for å sjekke grunnleggende Cloudflare-status
check_cf_basic() {
  echo "📡 Sjekker grunnleggende Cloudflare-status..."
  
  # Gjør en HTTP-forespørsel og se etter CF-headers
  response=$(curl -s -I https://www.snakkaz.com)
  
  if echo "$response" | grep -q "CF-Ray:"; then
    cf_ray=$(echo "$response" | grep "CF-Ray:" | cut -d' ' -f2)
    echo "✅ Cloudflare er aktivt! (CF-Ray: $cf_ray)"
    return 0
  else
    echo "❌ Cloudflare ser ikke ut til å være aktivt."
    echo "   Ingen CF-Ray header funnet i responsen."
    
    # Sjekk om nameservere er satt riktig
    echo
    echo "🔍 Sjekker nameservere for snakkaz.com..."
    ns_result=$(dig NS snakkaz.com +short)
    
    if echo "$ns_result" | grep -q "cloudflare.com"; then
      echo "✅ Cloudflare nameservere er konfigurert korrekt:"
      echo "$ns_result"
      echo "   DNS-propagering kan ta opptil 48 timer."
    else
      echo "❌ Cloudflare nameservere er IKKE konfigurert korrekt."
      echo "   Fant følgende nameservere:"
      echo "$ns_result"
      echo
      echo "   Nameservere må endres til: kyle.ns.cloudflare.com og vita.ns.cloudflare.com"
      echo "   Følg instruksjonene i CLOUDFLARE-DNS-GUIDE.md"
    fi
    
    return 1
  fi
}

# Sjekk SSL/TLS-konfigurasjon
check_ssl_tls() {
  echo
  echo "🔐 Sjekker SSL/TLS-konfigurasjon..."
  
  ssl_info=$(curl -s -v https://www.snakkaz.com 2>&1 | grep "SSL connection\|TLS\|certificate\|cipher\|protocol")
  
  if echo "$ssl_info" | grep -q "TLSv1.3"; then
    echo "✅ TLSv1.3 er i bruk - bra!"
  elif echo "$ssl_info" | grep -q "TLSv1.2"; then
    echo "✓ TLSv1.2 er i bruk (TLSv1.3 anbefales)"
  else
    echo "❌ Bruker eldre TLS-versjon - bør oppdateres"
  fi
  
  # Sjekk HSTS-header
  hsts=$(curl -s -I https://www.snakkaz.com | grep -i "strict-transport-security")
  
  if [[ -n "$hsts" ]]; then
    echo "✅ HSTS er aktivert: $hsts"
  else
    echo "❌ HSTS er ikke aktivert. Dette anbefales for sikker HTTPS."
  fi
}

# Sjekk DNS-konfigurasjon
check_dns() {
  echo
  echo "🌐 Sjekker DNS-konfigurasjon..."
  
  # Sjekk A-records
  echo "A records:"
  host www.snakkaz.com | grep "has address"
  
  # Sjekk NS-records for å bekrefte Cloudflare DNS
  echo
  echo "Nameservers:"
  ns_records=$(host -t NS snakkaz.com | grep "name server")
  echo "$ns_records"
  
  if echo "$ns_records" | grep -q "cloudflare"; then
    echo "✅ Cloudflare nameservers er i bruk"
  else
    echo "❌ Cloudflare nameservers ser ikke ut til å være konfigurert"
  fi
}

# Sjekk Cloudflare CDN og cache
check_cdn_cache() {
  echo
  echo "📦 Sjekker CDN og cache..."
  
  # Sjekk CF-Cache-Status header
  cache_status=$(curl -s -I https://www.snakkaz.com | grep -i "CF-Cache-Status:")
  
  if [[ -n "$cache_status" ]]; then
    echo "✅ Cache-status: $cache_status"
  else
    echo "❓ Ingen cache-status funnet, CDN-konfigurasjon bør sjekkes"
  fi
}

# Sjekk sikkerhetsoverskrifter
check_security_headers() {
  echo
  echo "🛡️ Sjekker sikkerhetsoverskrifter..."
  
  headers=$(curl -s -I https://www.snakkaz.com)
  
  # Sjekk Content-Security-Policy
  if echo "$headers" | grep -q "Content-Security-Policy"; then
    echo "✅ Content-Security-Policy er konfigurert"
  else
    echo "❌ Content-Security-Policy mangler"
  fi
  
  # Sjekk X-Content-Type-Options
  if echo "$headers" | grep -q "X-Content-Type-Options: nosniff"; then
    echo "✅ X-Content-Type-Options er satt til nosniff"
  else
    echo "❌ X-Content-Type-Options mangler"
  fi
  
  # Sjekk X-Frame-Options
  if echo "$headers" | grep -q "X-Frame-Options"; then
    echo "✅ X-Frame-Options er konfigurert"
  else
    echo "❌ X-Frame-Options mangler"
  fi
}

# Sjekk Cloudflare Analytics
check_cf_analytics() {
  echo
  echo "📊 Sjekker Cloudflare Analytics..."
  
  # Sjekk etter Cloudflare Analytics beacon script
  analytics_content=$(curl -s https://www.snakkaz.com | grep -o 'cloudflareinsights.com/beacon')
  
  if [[ -n "$analytics_content" ]]; then
    echo "✅ Cloudflare Analytics script funnet på hjemmesiden"
  else
    echo "❌ Cloudflare Analytics script ikke funnet på hjemmesiden"
    echo "   Dette kan bety at Cloudflare Analytics ikke er konfigurert,"
    echo "   eller at det er blokkert av CSP-policyen."
    echo
    echo "   Løsning: Sjekk at disse endringene er implementert:"
    echo "   1. Oppdater analyticsLoader.ts"
    echo "   2. Oppdater cspConfig.ts for å tillate cloudflareinsights.com"
    echo "   3. Sjekk at fixCloudflareAnalyticsIntegration() kjøres"
  fi
}

# Kjør alle sjekker
run_all_checks() {
  check_cf_basic
  check_ssl_tls
  check_dns
  check_cdn_cache
  check_security_headers
  check_cf_analytics
  
  echo
  echo "======================================"
  echo "✨ Status-sjekk fullført! ✨"
}

# Kjør alle sjekker som standard
run_all_checks

# For mer detaljert sjekk kan du legge til, men disse krever Cloudflare API-token
# - Sjekk av WAF-konfigurasjon
# - Sjekk av Page Rules
# - Sjekk av DNS-oppføringer via API
# - Sjekk av Workers eller Edge Functions
