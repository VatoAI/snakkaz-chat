#!/bin/bash
#
# Deploy Snakkaz Chat til www.snakkaz.com med DNS sjekk
#
# Dette skriptet hjelper med å utføre en enkel deploy av Snakkaz Chat til snakkaz.com
# gjennom å bruke GitHub Actions workflow som er definert i `.github/workflows/deploy.yml`.
# Inkluderer DNS-sjekk for Namecheap integrasjon.
#

echo "🚀 Snakkaz Chat Deployment Tool 🚀"
echo "======================================"
echo

# Sjekk om vi er i riktig mappe
if [ ! -f "package.json" ]; then
  echo "❌ Feil: Du må kjøre dette skriptet fra prosjektets rotmappe!"
  echo "   Naviger til rotmappen og prøv igjen."
  exit 1
fi

# Sjekk om git er konfigurert
if [ -z "$(git config --get user.name)" ] || [ -z "$(git config --get user.email)" ]; then
  echo "❓ Git er ikke konfigurert med brukernavn og e-post."
  echo "   Vil du konfigurere git nå? (y/n)"
  read -r configure_git
  
  if [[ $configure_git == "y" ]]; then
    echo "Skriv inn ditt navn:"
    read -r git_name
    git config --global user.name "$git_name"
    
    echo "Skriv inn din e-post:"
    read -r git_email
    git config --global user.email "$git_email"
    
    echo "✅ Git konfigurert."
  else
    echo "❌ Du må konfigurere git før du kan deploye."
    exit 1
  fi
fi

# Sjekk om det er endringer i repository
git status

echo
echo "⚠️  ADVARSEL: Dette vil committe alle endringer og starte deploy til snakkaz.com"
echo "   Er du sikker på at du vil fortsette? (y/n)"
read -r continue_deploy

if [[ $continue_deploy != "y" ]]; then
  echo "Deployment avbrutt."
  exit 0
fi

# Kjør DNS sikkerhetssjekker først
echo
echo "🔒 Kjører DNS sikkerhetskontroll..."

# Verify CSP configuration
echo "🔒 Sjekker Content Security Policy (CSP) konfigurasjon..."

# Check if index.html has CSP meta tag
if grep -q "Content-Security-Policy" index.html; then
  echo "✅ CSP meta tag funnet i index.html"
else
  echo "⚠️ ADVARSEL: CSP meta tag mangler i index.html!"
  echo "   Dette kan forårsake CORS-feil."
  echo "   Vil du fortsette likevel? (y/n)"
  read -r continue_without_csp
  if [[ $continue_without_csp != "y" ]]; then
    echo "Deployment avbrutt. Legg til CSP meta tag i index.html først."
    exit 1
  fi
fi

# Check if Cloudflare Analytics script is included with correct URL
if grep -q "static.cloudflareinsights.com/beacon.min.js/" index.html; then
  echo "✅ Cloudflare Analytics script funnet i index.html"
else
  echo "⚠️ ADVARSEL: Cloudflare Analytics script mangler eller har feil URL i index.html!"
  echo "   Dette kan forårsake analytics tracking problemer."
fi

# Check if CSP allows connections to Snakkaz subdomains
if grep -q "dash.snakkaz.com" index.html && grep -q "business.snakkaz.com" index.html; then
  echo "✅ CSP tillater tilkobling til Snakkaz subdomener"
else
  echo "⚠️ ADVARSEL: CSP konfigurasjon mangler tillatelser for Snakkaz subdomener!"
  echo "   Dette kan blokkere kommunikasjon med dash.snakkaz.com og business.snakkaz.com"
fi

# Sjekk Namecheap DNS konfigurasjon
echo "Vil du sjekke Namecheap DNS konfigurasjon? (y/n)"
read -r check_namecheap

if [[ $check_namecheap == "y" ]]; then
  echo "Skriv inn Namecheap API key for å sjekke DNS konfigurasjon:"
  read -r namecheap_key
else
  namecheap_key=""
fi

if [ -n "$cloudflare_token" ]; then
  # Lag midlertidig script for å sjekke DNS konfigurasjon
  cat > check-dns-temp.js <<EOF
// Script for å sjekke DNS konfigurasjon
import dns from 'dns';
import { promisify } from 'util';

const lookupAsync = promisify(dns.lookup);
const resolveCnameAsync = promisify(dns.resolveCname);

async function checkDnsConfiguration() {
  try {
    console.log("\n===== Namecheap DNS Status Sjekk =====");
    
    // Sjekk hoveddomenet
    console.log("\nSjekker snakkaz.com...");
    try {
      const mainResult = await lookupAsync('snakkaz.com');
      console.log(`✅ snakkaz.com resolver til IP: ${mainResult.address}`);
    } catch (err) {
      console.log(`❌ Kunne ikke løse snakkaz.com: ${err.message}`);
    }
    
    // Sjekk www subdomene
    console.log("\nSjekker www.snakkaz.com...");
    try {
      const wwwCname = await resolveCnameAsync('www.snakkaz.com');
      console.log(`✅ www.snakkaz.com har CNAME: ${wwwCname[0]}`);
    } catch (err) {
      try {
        const wwwResult = await lookupAsync('www.snakkaz.com');
        console.log(`✅ www.snakkaz.com resolver til IP: ${wwwResult.address}`);
      } catch (err2) {
        console.log(`❌ Kunne ikke løse www.snakkaz.com: ${err2.message}`);
      }
    }
    
    // Sjekk subdomener
    const subdomains = ['dash', 'business', 'docs', 'analytics', 'help', 'mcp'];
    
    console.log("\nSjekker subdomener...");
    for (const sub of subdomains) {
      const subdomain = `${sub}.snakkaz.com`;
      console.log(`\nSjekker ${subdomain}...`);
      
      try {
        const cnameResult = await resolveCnameAsync(subdomain);
        console.log(`✅ ${subdomain} har CNAME: ${cnameResult[0]}`);
      } catch (err) {
        try {
          const ipResult = await lookupAsync(subdomain);
          console.log(`✅ ${subdomain} resolver til IP: ${ipResult.address}`);
        } catch (err2) {
          console.log(`❌ Kunne ikke løse ${subdomain}: ${err2.message}`);
          console.log('   Dette subdomenet kan kreve DNS-konfigurasjon i Namecheap.');
        }
      }
    }
    
    console.log("\n===== DNS Sjekk Oppsummering =====");
    console.log("Anbefalt DNS konfigurasjon i Namecheap:");
    console.log("1. A record for @ -> 185.158.133.1");
    console.log("2. A record for mcp -> 185.158.133.1");
    console.log("3. CNAME for www -> snakkaz.com");
    console.log("4. CNAME for dash -> snakkaz.com");
    console.log("5. CNAME for business -> snakkaz.com");
    console.log("6. CNAME for docs -> snakkaz.com");
    console.log("7. CNAME for analytics -> snakkaz.com");
    console.log("8. CNAME for help -> snakkaz.com");
    
    console.log("\nMerk: DNS endringer kan ta 15 minutter til 48 timer å propagere fullt ut.");
    
    return true;
  } catch (error) {
    console.error('Error checking DNS configuration:', error);
    return false;
  }
}

// Kjør DNS sjekk
checkDnsConfiguration();
EOF

  # Kjør DNS sjekk script
  echo "🔍 Kjører DNS sjekk..."
  node --input-type=module check-dns-temp.js
  
  # Spør brukeren om de vil fortsette
  echo
  echo "📋 Vil du fortsette med deployment basert på DNS-sjekken ovenfor? (y/n)"
  read -r continue_after_dns_check
  
  if [[ $continue_after_dns_check != "y" ]]; then
    echo "Deployment avbrutt etter DNS-sjekk."
    rm check-dns-temp.js
    exit 0
  fi
  
  # Fjern midlertidig script
  rm check-dns-temp.js
fi

# Kjør setup-subdomain-htaccess.sh hvis den finnes
if [ -f "scripts/setup-subdomain-htaccess.sh" ]; then
  echo "🌐 Setter opp subdomene konfigurasjoner..."
  bash scripts/setup-subdomain-htaccess.sh
else
  echo "⚠️ scripts/setup-subdomain-htaccess.sh ikke funnet, hopper over subdomain setup."
fi
  try {
    const dnsManager = getDnsManager(true);
    
    // Initialize with API keys
    await dnsManager.initialize('${namecheap_key}', '${cloudflare_token}');
    
    // Run auto-fix
    const result = await dnsManager.autoFix();
    
    console.log("\n===== Auto-Fix Results =====");
    
    if (result.success) {
      console.log('✅ Auto-fix completed successfully!');
    } else {
      console.log('⚠️ Auto-fix completed with some issues.');
    }
    
    // Show fixes applied
    if (result.fixes.length > 0) {
      console.log('\nFIXES APPLIED:');
      result.fixes.forEach((fix, index) => {
        console.log(\`\${index + 1}. \${fix}\`);
      });
    }
    
    // Show failures
    if (result.failures.length > 0) {
      console.log('\nFAILURES:');
      result.failures.forEach((failure, index) => {
        console.log(\`\${index + 1}. \${failure}\`);
      });
    }
    
    return result.success;
  } catch (error) {
    console.error('Error auto-fixing DNS issues:', error);
    return false;
  }
}

fixDnsAndCloudflare().then(success => {
  process.exit(success ? 0 : 1);
});
EOF

      if node --experimental-modules fix-dns-temp.js; then
        echo "✅ Problemer fikset. Fortsetter med deployment."
        rm fix-dns-temp.js
      else
        echo "⚠️ Noen problemer kunne ikke fikses automatisk."
        echo "   Vil du fortsette likevel? (y/n)"
        read -r continue_anyway
        
        if [[ $continue_anyway != "y" ]]; then
          echo "Deployment avbrutt."
          rm check-dns-temp.js fix-dns-temp.js
          exit 1
        fi
        rm fix-dns-temp.js
      fi
    else
      echo "   Vil du fortsette likevel? (y/n)"
      read -r continue_anyway
      
      if [[ $continue_anyway != "y" ]]; then
        echo "Deployment avbrutt."
        rm check-dns-temp.js
        exit 1
      fi
    fi
  fi
  
  # Rydd opp midlertidig fil
  rm check-dns-temp.js
else
  echo "⚠️ Hopper over detaljert DNS og Cloudflare-sjekk."
  echo "   Fortsetter med enkel sjekk..."
  
  # Kjør enkel Cloudflare-sjekk
  if [ -f "check-cloudflare-status.sh" ]; then
    ./check-cloudflare-status.sh
  else
    echo "⚠️ check-cloudflare-status.sh ble ikke funnet."
    echo "   Fortsetter uten Cloudflare-sjekk..."
  fi
fi

echo
echo "Skriv en commit-melding (f.eks. 'Oppdatert DNS og Cloudflare-integrasjon'):"
read -r commit_message

# Add og commit alle endringer
git add .
git commit -m "$commit_message"

# Push til main branch
echo
echo "📤 Pusher endringer til main branch..."
git push origin main

echo
echo "🚀 Deployment startet!"
echo "   Gå til GitHub Actions for å se status på deploymentet:"
echo "   https://github.com/din-bruker/snakkaz-chat/actions"
echo
echo "   Når deploymentet er fullført, besøk:"
echo "   https://www.snakkaz.com"
echo
echo "   Husk å verifisere at nettsiden fungerer som forventet!"

# Åpne GitHub Actions i nettleseren (valgfritt)
echo
echo "❓ Vil du åpne GitHub Actions i nettleseren for å følge med på deploymentet? (y/n)"
read -r open_browser

if [[ $open_browser == "y" ]]; then
  # Åpne GitHub Actions URL (fungerer på de fleste Linux-systemer)
  xdg-open "https://github.com/din-bruker/snakkaz-chat/actions" || echo "Kunne ikke åpne nettleseren automatisk."
fi
