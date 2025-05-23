#!/bin/bash
# Dette skriptet genererer GitHub Secrets for Snakkaz Chat FTP-konfigurasjon

echo "🔑 GitHub Secrets Generator for Snakkaz FTP-oppsett 🔑"
echo "======================================================"

# Last inn miljøvariabler fra .env-filen
if [ -f .env ]; then
  source <(grep -v '^#' .env | sed -E 's/(.*)=(.*)/export \1="\2"/')
  echo "✅ Lastet inn miljøvariabler fra .env"
else 
  echo "❌ Finner ikke .env-fil. Vennligst opprett den med FTP-innloggingsinfo."
  exit 1
fi

# Sjekk om nødvendige variabler er satt
if [ -z "$FTP_SERVER" ] || [ -z "$FTP_USERNAME" ] || [ -z "$FTP_PASSWORD" ]; then
  echo "❌ Mangler FTP-innloggingsdetaljer i .env-filen."
  exit 1
fi

echo ""
echo "📋 GitHub Repository Secrets for Actions"
echo "----------------------------------------"
echo "FTP_SERVER=$FTP_SERVER"
echo "FTP_USERNAME=$FTP_USERNAME"
echo "FTP_PASSWORD=$FTP_PASSWORD"
echo "SERVER_DIR=$SERVER_DIR"
echo ""
echo "👉 Legg til disse secretsene i GitHub-repositoriet under:"
echo "   Settings > Secrets and variables > Actions"
echo ""
echo "✅ Dette vil tillate GitHub Actions å deploye til din Namecheap-hosting!"
