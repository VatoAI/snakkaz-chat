#!/bin/bash
#
# Deploy Snakkaz Chat til www.snakkaz.com
#
# Dette skriptet hjelper med å utføre en enkel deploy av Snakkaz Chat til snakkaz.com
# og bekrafter at Cloudflare-integrasjon fungerer korrekt.
#

# Set colors for outputs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Snakkaz Chat Deployment Tool 🚀${NC}"
echo -e "${GREEN}======================================${NC}"
echo

# Sjekk om Git er konfigurert
if [ -z "$(git config --get user.name)" ] || [ -z "$(git config --get user.email)" ]; then
  echo -e "${YELLOW}❓ Git er ikke konfigurert med brukernavn og e-post.${NC}"
  echo -e "${YELLOW}   Vil du konfigurere git nå? (y/n)${NC}"
  read -r configure_git
  
  if [[ $configure_git == "y" ]]; then
    echo "Skriv inn ditt navn:"
    read -r git_name
    git config --global user.name "$git_name"
    
    echo "Skriv inn din e-post:"
    read -r git_email
    git config --global user.email "$git_email"
    
    echo -e "${GREEN}✅ Git konfigurert.${NC}"
  else
    echo -e "${RED}❌ Du må konfigurere git før du kan deploye.${NC}"
    exit 1
  fi
fi

# Verifiser Cloudflare-konfigurasjonen
echo -e "${GREEN}🔒 Cloudflare-konfigurasjon${NC}"
echo -e "${GREEN}------------------------${NC}"

# Spør om Cloudflare API-token
echo -e "${YELLOW}Skriv inn Cloudflare API-token for å verifisere konfigurasjon:${NC}"
echo -e "${YELLOW}(Trykk Enter for å hoppe over denne sjekken)${NC}"
read -r cf_token

if [ -n "$cf_token" ]; then
  echo -e "${GREEN}Verifiserer Cloudflare API-token...${NC}"
  
  # Lag en midlertidig JavaScript-fil for å teste API-token
  cat > /tmp/cf-check.js <<EOL
const cf_token = '$cf_token';
const zone_id = 'bba5fb2c80aede33ac2c22f8f99110d3';

async function checkToken() {
  try {
    const response = await fetch('https://api.cloudflare.com/client/v4/user/tokens/verify', {
      headers: {
        'Authorization': 'Bearer ' + cf_token,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ API-token er gyldig');
      return true;
    } else {
      console.log('❌ API-token er ugyldig:', data.errors);
      return false;
    }
  } catch (error) {
    console.log('❌ Feil ved token-verifisering:', error);
    return false;
  }
}

async function checkDNS() {
  try {
    const response = await fetch('https://api.cloudflare.com/client/v4/zones/' + zone_id + '/dns_records', {
      headers: {
        'Authorization': 'Bearer ' + cf_token,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      const www_record = data.result.find(r => r.name === 'www.snakkaz.com' && r.type === 'A');
      
      if (www_record) {
        console.log('✅ www.snakkaz.com peker til:', www_record.content);
        console.log('   Proxied status:', www_record.proxied ? 'Aktivert' : 'Deaktivert');
      } else {
        console.log('❌ Ingen A-record funnet for www.snakkaz.com');
      }
      
      return data.result;
    } else {
      console.log('❌ Feil ved henting av DNS-oppføringer:', data.errors);
      return [];
    }
  } catch (error) {
    console.log('❌ Feil ved DNS-sjekk:', error);
    return [];
  }
}

async function main() {
  const tokenValid = await checkToken();
  if (tokenValid) {
    console.log('\nSjekker DNS-oppføringer...');
    await checkDNS();
  }
}

main();
EOL

  # Kjør sjekken
  echo -e "${GREEN}Kjører Cloudflare-verifikasjon...${NC}"
  node /tmp/cf-check.js
  
  # Fjern midlertidig fil
  rm /tmp/cf-check.js
else
  echo -e "${YELLOW}Hopper over Cloudflare API-verifikasjon.${NC}"
fi

# Kjør grunnleggende Cloudflare-status sjekk
echo
echo -e "${GREEN}Sjekker DNS og Cloudflare-status...${NC}"

# Kjør enkle DNS-tester
echo -e "${YELLOW}DNS-oppløsning for www.snakkaz.com:${NC}"
host www.snakkaz.com || echo "Kunne ikke løse www.snakkaz.com"

echo
echo -e "${YELLOW}Nameservere for snakkaz.com:${NC}"
dig NS snakkaz.com +short || echo "Kunne ikke hente nameservere"

echo
echo -e "${GREEN}Sjekker om Cloudflare er aktiv...${NC}"
curl -s -I https://www.snakkaz.com | grep -i "CF-" || echo -e "${RED}Ingen Cloudflare-headere funnet!${NC}"

# Bekreft deployment
echo
echo -e "${YELLOW}⚠️ ADVARSEL: Dette vil starte deploy av Snakkaz Chat til www.snakkaz.com${NC}"
echo -e "${YELLOW}Vil du fortsette? (y/n)${NC}"
read -r continue_deploy

if [[ $continue_deploy != "y" ]]; then
  echo -e "${RED}Deployment avbrutt.${NC}"
  exit 0
fi

# Lag en commit for endringene
echo
echo -e "${YELLOW}Skriv inn en commit-melding (f.eks. 'Oppdatert Cloudflare-integrasjon'):${NC}"
read -r commit_message

# Commit og push endringene
git add .
git commit -m "$commit_message"
git push

echo
echo -e "${GREEN}✅ Endringer pushet til GitHub!${NC}"
echo -e "${GREEN}   GitHub Actions vil nå deploye endringene til www.snakkaz.com${NC}"

echo
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Post-deployment huskeliste:${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${YELLOW}1. Sjekk at Cloudflare Analytics fungerer${NC}"
echo -e "${YELLOW}2. Verifiser that chat-funksjonalitet fungerer${NC}"
echo -e "${YELLOW}3. Test at alle Snakkaz-subdomener er tilgjengelige${NC}"
echo -e "${YELLOW}4. Sjekk at end-to-end kryptering fungerer${NC}"
echo

exit 0
