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
node -e "
  const { checkCloudflareIntegration } = require('./src/services/encryption/cloudflareSecurityCheck');
  
  async function runCheck() {
    try {
      console.log('Starter sjekk av Cloudflare-integrasjon...');
      const result = await checkCloudflareIntegration();
      console.log('Resultat:', JSON.stringify(result, null, 2));
      
      if (result.success) {
        console.log('✅ Cloudflare-integrasjon er vellykket!');
      } else {
        console.log('⚠️  OBS: Cloudflare-integrasjon har problemer.');
        console.log('   Du kan fortsette deploymentet, men sjekk loggene for detaljer.');
      }
    } catch (error) {
      console.error('❌ Cloudflare-sjekk feilet:', error);
    }
  }
  
  runCheck();
"

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
