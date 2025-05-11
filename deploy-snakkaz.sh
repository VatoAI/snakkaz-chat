#!/bin/bash
#
# Deploy Snakkaz Chat til www.snakkaz.com
#
# Dette skriptet hjelper med å utføre en enkel deploy av Snakkaz Chat til snakkaz.com
# gjennom å bruke GitHub Actions workflow som er definert i `.github/workflows/deploy.yml`.
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

# Kjør Cloudflare sikkerhetssjekker først
echo
echo "🔒 Kjører Cloudflare sikkerhetskontroll..."

# Spør om Cloudflare API token for å kunne kjøre avanserte sjekker
echo "Skriv inn Cloudflare API token for å sjekke DNS og konfigurasjon"
echo "(Du kan hoppe over dette ved å trykke Enter):"
read -r cloudflare_token

if [ -n "$cloudflare_token" ]; then
  # Lag midlertidig script for å sjekke Cloudflare konfigurasjon med API token
  cat > check-cloudflare-temp.js <<EOF
import { cfTools } from './src/services/encryption/configure-cloudflare.js';

// Wrap in an async function to use top-level await
async function checkCloudflare() {
  try {
    cfTools.setApiToken('$cloudflare_token');
    const report = await cfTools.checkSetup();
    
    console.log("\n===== Cloudflare Status Report =====");
    
    if (report.tokenValid) {
      console.log('✅ API token er gyldig');
    } else {
      console.log('❌ API token er ugyldig');
      return false;
    }
    
    if (report.zoneActive) {
      console.log('✅ Zone er aktiv');
    } else {
      console.log('⚠️ Zone er ikke aktiv. Sjekk nameservers i Namecheap');
    }
    
    if (report.wwwRecordExists) {
      console.log('✅ www record finnes');
    } else {
      console.log('⚠️ www record eksisterer ikke');
    }
    
    if (report.sslConfigured) {
      console.log('✅ SSL er konfigurert');
    } else {
      console.log('⚠️ SSL er ikke korrekt konfigurert');
    }
    
    if (report.alwaysHttps) {
      console.log('✅ Always Use HTTPS er aktivert');
    } else {
      console.log('⚠️ Always Use HTTPS er ikke aktivert');
    }
    
    return report.tokenValid;
  } catch (error) {
    console.error('Feil ved sjekk av Cloudflare konfigurasjon:', error);
    return false;
  }
}

checkCloudflare().then(success => {
  process.exit(success ? 0 : 1);
});
EOF

  # Kjør sjekk
  echo "Sjekker Cloudflare konfigurasjon..."
  if node --experimental-json-modules check-cloudflare-temp.js; then
    echo "✅ Cloudflare konfigurasjon er OK."
  else
    echo "⚠️ Det er problemer med Cloudflare konfigurasjonen."
    echo "   Vil du fortsette likevel? (y/n)"
    read -r continue_anyway
    
    if [[ $continue_anyway != "y" ]]; then
      echo "Deployment avbrutt."
      rm check-cloudflare-temp.js
      exit 1
    fi
  fi
  
  # Rydd opp midlertidig fil
  rm check-cloudflare-temp.js
else
  echo "⚠️ Hopper over detaljert Cloudflare-sjekk."
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
echo "Skriv en commit-melding (f.eks. 'Oppdatert Cloudflare-sikkerhet'):"
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
