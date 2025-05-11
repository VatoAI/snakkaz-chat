#!/bin/bash
#
# Deploy Snakkaz Chat til www.snakkaz.com med DNS og Cloudflare sjekk
#
# Dette skriptet hjelper med å utføre en enkel deploy av Snakkaz Chat til snakkaz.com
# gjennom å bruke GitHub Actions workflow som er definert i `.github/workflows/deploy.yml`.
# Inkluderer DNS-sjekk for Namecheap og Cloudflare integrasjon.
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

# Kjør DNS og Cloudflare sikkerhetssjekker først
echo
echo "🔒 Kjører DNS og Cloudflare sikkerhetskontroll..."

# Verify CSP configuration
echo "🔒 Sjekker Content Security Policy (CSP) konfigurasjon..."

# Check if index.html has CSP meta tag
if grep -q "Content-Security-Policy" index.html; then
  echo "✅ CSP meta tag funnet i index.html"
else
  echo "⚠️ ADVARSEL: CSP meta tag mangler i index.html!"
  echo "   Dette kan forårsake CORS-feil og blokkere Cloudflare Analytics."
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

# Spør om API tokens for å kunne kjøre avanserte sjekker
echo "Skriv inn Cloudflare API token for å sjekke DNS og konfigurasjon"
echo "(Du kan hoppe over dette ved å trykke Enter):"
read -r cloudflare_token

echo "Vil du også sjekke Namecheap DNS konfigurasjon? (y/n)"
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
import { getDnsManager } from './src/services/encryption/dnsManager.js';

// Wrap in an async function to use top-level await
async function checkDnsAndCloudflare() {
  try {
    const dnsManager = getDnsManager(true);
    
    // Initialize with API keys
    await dnsManager.initialize('${namecheap_key}', '${cloudflare_token}');
    
    // Run health check
    const health = await dnsManager.performHealthCheck();
    
    console.log("\n===== DNS & Cloudflare Status Report =====");
    
    // Overall status
    switch (health.status) {
      case 'healthy':
        console.log('✅ DNS STATUS: HEALTHY');
        break;
      case 'issues':
        console.log('⚠️ DNS STATUS: ISSUES DETECTED');
        break;
      case 'critical':
        console.log('❌ DNS STATUS: CRITICAL ISSUES');
        break;
    }
    
    console.log('\nNAMECHEAP CONFIGURATION:');
    console.log(\`Using Cloudflare nameservers: \${health.namecheap.usingCloudflareNameservers ? 'Yes ✅' : 'No ❌'}\`);
    console.log(\`Current nameservers: \${health.namecheap.nameservers.join(', ')}\`);
    
    console.log('\nCLOUDFLARE CONFIGURATION:');
    console.log(\`Zone active: \${health.cloudflare.zoneActive ? 'Yes ✅' : 'No ❌'}\`);
    console.log(\`www record exists: \${health.cloudflare.wwwRecordExists ? 'Yes ✅' : 'No ❌'}\`);
    console.log(\`SSL configured: \${health.cloudflare.sslConfigured ? 'Yes ✅' : 'No ❌'}\`);
    
    // Issues
    if (health.issues.length > 0) {
      console.log('\nISSUES DETECTED:');
      health.issues.forEach((issue, index) => {
        console.log(\`\${index + 1}. \${issue}\`);
      });
    }
    
    // Auto-fix option if issues detected
    if (health.status !== 'healthy') {
      console.log("\nWould you like to attempt to automatically fix these issues? (y/n)");
      
      // This is just a placeholder - user will need to respond to the prompt in terminal
      return false; // Let the shell script handle the decision
    }
    
    return health.status === 'healthy';
  } catch (error) {
    console.error('Error checking DNS and Cloudflare configuration:', error);
    return false;
  }
}

checkDnsAndCloudflare().then(isHealthy => {
  process.exit(isHealthy ? 0 : 1);
});
EOF

  # Kjør sjekk
  echo "Sjekker DNS og Cloudflare konfigurasjon..."
  if node --experimental-modules check-dns-temp.js; then
    echo "✅ DNS og Cloudflare konfigurasjon er OK."
  else
    echo "⚠️ Det er problemer med DNS eller Cloudflare konfigurasjonen."
    echo "   Vil du prøve å fikse problemene automatisk? (y/n)"
    read -r fix_problems
    
    if [[ $fix_problems == "y" ]]; then
      echo "Forsøker å fikse DNS og Cloudflare problemer..."
      
      # Lag midlertidig script for å fikse problemer
      cat > fix-dns-temp.js <<EOF
import { getDnsManager } from './src/services/encryption/dnsManager.js';

async function fixDnsAndCloudflare() {
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
