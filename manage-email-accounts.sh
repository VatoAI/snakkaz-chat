#!/bin/bash
# manage-email-accounts.sh
#
# Dette skriptet hjelper med å administrere e-postkontoer for premium
# medlemmer av Snakkaz Chat via cPanel API

# Fargedefinisjoner
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    SNAKKAZ CHAT: PREMIUM E-POST ADMINISTRASJON       ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Leser inn miljøvariabler fra .env hvis den eksisterer
if [ -f ".env" ]; then
    echo -e "${YELLOW}Leser inn variabler fra .env fil...${NC}"
    source .env
fi

# Sett opp cPanel API token detaljer
if [ -z "$CPANEL_USERNAME" ] || [ -z "$CPANEL_API_TOKEN" ] || [ -z "$CPANEL_DOMAIN" ]; then
    echo -e "${YELLOW}Trenger cPanel API token detaljer:${NC}"
    read -p "cPanel brukernavn (f.eks. SnakkaZ): " CPANEL_USERNAME
    read -s -p "cPanel API token: " CPANEL_API_TOKEN
    echo
    read -p "cPanel domene (f.eks. premium123.web-hosting.com): " CPANEL_DOMAIN

    # Lagre til .env for fremtidig bruk
    if [ -f ".env" ]; then
        echo "CPANEL_USERNAME=$CPANEL_USERNAME" >> .env
        echo "CPANEL_API_TOKEN=$CPANEL_API_TOKEN" >> .env
        echo "CPANEL_DOMAIN=$CPANEL_DOMAIN" >> .env
    else
        echo "CPANEL_USERNAME=$CPANEL_USERNAME" > .env
        echo "CPANEL_API_TOKEN=$CPANEL_API_TOKEN" >> .env
        echo "CPANEL_DOMAIN=$CPANEL_DOMAIN" >> .env
    fi
fi

# Test API token tilkobling
echo -e "${YELLOW}Tester cPanel API token tilkobling...${NC}"

# Test API token ved å liste eksisterende e-postkontoer
TEST_RESPONSE=$(curl -s -H "Authorization: cpanel $CPANEL_USERNAME:$CPANEL_API_TOKEN" \
                 "https://$CPANEL_DOMAIN:2083/execute/Email/list_pops")

if echo "$TEST_RESPONSE" | grep -q "error"; then
    echo -e "${RED}✗ API token test feilet!${NC}"
    echo "Feilmelding: $(echo "$TEST_RESPONSE" | grep -o '"error":"[^"]*"')"
    echo -e "${YELLOW}Sjekk at API token er gyldig og har riktige tilganger.${NC}"
    exit 1
else
    echo -e "${GREEN}✓ API token test vellykket!${NC}"
    echo -e "${GREEN}E-postkontoer funnet: $(echo "$TEST_RESPONSE" | grep -o '"email"' | wc -l)${NC}"
fi

# Funksjon for å vise meny
show_menu() {
    echo
    echo -e "${BLUE}=====================================================${NC}"
    echo -e "${BLUE}    SNAKKAZ PREMIUM E-POST ADMINISTRASJON             ${NC}"
    echo -e "${BLUE}=====================================================${NC}"
    echo
    echo "1. List alle e-postkontoer"
    echo "2. Opprett ny e-postkonto for premium medlem"
    echo "3. Slett e-postkonto"
    echo "4. Endre passord for e-postkonto"
    echo "5. Sjekk kvote for en e-postkonto"
    echo "6. Avslutt"
    echo
    echo -n "Velg en handling (1-6): "
}

# Funksjon for å liste alle e-postkontoer
list_email_accounts() {
    echo -e "${YELLOW}Henter liste over e-postkontoer...${NC}"
    
    RESPONSE=$(curl -s -H "Authorization: cpanel $CPANEL_USERNAME:$CPANEL_API_TOKEN" \
              "https://$CPANEL_DOMAIN:2083/execute/Email/list_pops")
    
    if echo "$RESPONSE" | grep -q "error"; then
        echo -e "${RED}✗ Kunne ikke hente e-postkontoer!${NC}"
        echo "Feilmelding: $(echo "$RESPONSE" | grep -o '"error":"[^"]*"')"
        return
    fi
    
    echo -e "${GREEN}=====================================================${NC}"
    echo -e "${GREEN}    EKSISTERENDE E-POSTKONTOER                       ${NC}"
    echo -e "${GREEN}=====================================================${NC}"
    echo
    
    # Parse og vis e-postkontoer
    echo "$RESPONSE" | grep -o '"email":"[^"]*"' | cut -d'"' -f4 | while read -r email; do
        echo -e "- ${BLUE}$email${NC}"
    done
    
    echo
    echo -e "${YELLOW}Totalt $(echo "$RESPONSE" | grep -o '"email"' | wc -l) e-postkontoer${NC}"
}

# Funksjon for å opprette ny e-postkonto
create_email_account() {
    echo -e "${YELLOW}Opprett ny e-postkonto for premium medlem${NC}"
    echo
    
    read -p "Brukernavn (del før @snakkaz.com): " EMAIL_USER
    read -s -p "Passord for e-postkontoen: " EMAIL_PASSWORD
    echo
    read -s -p "Bekreft passord: " EMAIL_PASSWORD_CONFIRM
    echo
    
    if [ "$EMAIL_PASSWORD" != "$EMAIL_PASSWORD_CONFIRM" ]; then
        echo -e "${RED}✗ Passordene stemmer ikke overens!${NC}"
        return
    fi
    
    read -p "Kvote i MB (f.eks. 250): " EMAIL_QUOTA
    
    echo -e "${YELLOW}Oppretter e-postkonto ${EMAIL_USER}@snakkaz.com...${NC}"
    
    RESPONSE=$(curl -s -H "Authorization: cpanel $CPANEL_USERNAME:$CPANEL_API_TOKEN" \
              "https://$CPANEL_DOMAIN:2083/execute/Email/add_pop?email=$EMAIL_USER&password=$EMAIL_PASSWORD&quota=$EMAIL_QUOTA&domain=snakkaz.com")
    
    if echo "$RESPONSE" | grep -q "error"; then
        echo -e "${RED}✗ Kunne ikke opprette e-postkonto!${NC}"
        echo "Feilmelding: $(echo "$RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)"
    else
        echo -e "${GREEN}✓ E-postkonto ${EMAIL_USER}@snakkaz.com opprettet!${NC}"
        echo -e "${YELLOW}Merk: Det kan ta noen minutter før kontoen er fullt aktiv.${NC}"
        echo
        echo -e "${BLUE}E-postkonto detaljer:${NC}"
        echo "E-post adresse: ${EMAIL_USER}@snakkaz.com"
        echo "Webmail URL: https://premium123.web-hosting.com:2096"
        echo
        echo -e "${YELLOW}SMTP-innstillinger:${NC}"
        echo "SMTP Server: premium123.web-hosting.com"
        echo "SMTP Port: 465 (SSL/TLS) eller 587 (STARTTLS)"
        echo "Brukernavn: ${EMAIL_USER}@snakkaz.com"
        echo "Passord: (angitt passord)"
        echo
        echo -e "${YELLOW}IMAP-innstillinger:${NC}"
        echo "IMAP Server: premium123.web-hosting.com"
        echo "IMAP Port: 993 (SSL/TLS)"
        echo "Brukernavn: ${EMAIL_USER}@snakkaz.com"
        echo "Passord: (angitt passord)"
    fi
}

# Funksjon for å slette e-postkonto
delete_email_account() {
    echo -e "${YELLOW}Slett e-postkonto${NC}"
    echo
    
    read -p "E-post brukernavn (del før @snakkaz.com): " EMAIL_USER
    echo -e "${RED}ADVARSEL: Dette vil permanent slette e-postkontoen og alt innhold!${NC}"
    read -p "Er du sikker på at du vil slette ${EMAIL_USER}@snakkaz.com? (ja/nei): " CONFIRM
    
    if [ "$CONFIRM" != "ja" ]; then
        echo -e "${YELLOW}Sletting avbrutt.${NC}"
        return
    fi
    
    echo -e "${YELLOW}Sletter e-postkonto ${EMAIL_USER}@snakkaz.com...${NC}"
    
    RESPONSE=$(curl -s -H "Authorization: cpanel $CPANEL_USERNAME:$CPANEL_API_TOKEN" \
              "https://$CPANEL_DOMAIN:2083/execute/Email/delete_pop?email=$EMAIL_USER&domain=snakkaz.com")
    
    if echo "$RESPONSE" | grep -q "error"; then
        echo -e "${RED}✗ Kunne ikke slette e-postkonto!${NC}"
        echo "Feilmelding: $(echo "$RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)"
    else
        echo -e "${GREEN}✓ E-postkonto ${EMAIL_USER}@snakkaz.com er slettet.${NC}"
    fi
}

# Funksjon for å endre passord
change_password() {
    echo -e "${YELLOW}Endre passord for e-postkonto${NC}"
    echo
    
    read -p "E-post brukernavn (del før @snakkaz.com): " EMAIL_USER
    read -s -p "Nytt passord: " EMAIL_PASSWORD
    echo
    read -s -p "Bekreft nytt passord: " EMAIL_PASSWORD_CONFIRM
    echo
    
    if [ "$EMAIL_PASSWORD" != "$EMAIL_PASSWORD_CONFIRM" ]; then
        echo -e "${RED}✗ Passordene stemmer ikke overens!${NC}"
        return
    fi
    
    echo -e "${YELLOW}Endrer passord for ${EMAIL_USER}@snakkaz.com...${NC}"
    
    RESPONSE=$(curl -s -H "Authorization: cpanel $CPANEL_USERNAME:$CPANEL_API_TOKEN" \
              "https://$CPANEL_DOMAIN:2083/execute/Email/passwd_pop?email=$EMAIL_USER&password=$EMAIL_PASSWORD&domain=snakkaz.com")
    
    if echo "$RESPONSE" | grep -q "error"; then
        echo -e "${RED}✗ Kunne ikke endre passord!${NC}"
        echo "Feilmelding: $(echo "$RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)"
    else
        echo -e "${GREEN}✓ Passordet for ${EMAIL_USER}@snakkaz.com er endret.${NC}"
    fi
}

# Funksjon for å sjekke kvote
check_quota() {
    echo -e "${YELLOW}Sjekk kvote for e-postkonto${NC}"
    echo
    
    read -p "E-post brukernavn (del før @snakkaz.com): " EMAIL_USER
    
    echo -e "${YELLOW}Henter kvoteinformasjon for ${EMAIL_USER}@snakkaz.com...${NC}"
    
    RESPONSE=$(curl -s -H "Authorization: cpanel $CPANEL_USERNAME:$CPANEL_API_TOKEN" \
              "https://$CPANEL_DOMAIN:2083/execute/Email/get_pop_quota?email=$EMAIL_USER&domain=snakkaz.com")
    
    if echo "$RESPONSE" | grep -q "error"; then
        echo -e "${RED}✗ Kunne ikke hente kvoteinformasjon!${NC}"
        echo "Feilmelding: $(echo "$RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)"
    else
        DISK_USED=$(echo "$RESPONSE" | grep -o '"diskused":[0-9]*' | cut -d':' -f2)
        DISK_LIMIT=$(echo "$RESPONSE" | grep -o '"disklimit":[0-9]*' | cut -d':' -f2)
        
        # Konverter til MB hvis nødvendig
        DISK_USED_MB=$(echo "scale=2; $DISK_USED/1024/1024" | bc)
        
        if [ "$DISK_LIMIT" -eq 0 ]; then
            DISK_LIMIT_TEXT="Ubegrenset"
            PERCENT_USED="N/A"
        else
            DISK_LIMIT_MB=$(echo "scale=2; $DISK_LIMIT/1024/1024" | bc)
            DISK_LIMIT_TEXT="${DISK_LIMIT_MB} MB"
            PERCENT_USED=$(echo "scale=2; ($DISK_USED/$DISK_LIMIT)*100" | bc)
            PERCENT_USED="${PERCENT_USED}%"
        fi
        
        echo -e "${GREEN}=====================================================${NC}"
        echo -e "${GREEN}    KVOTEINFORMASJON FOR ${EMAIL_USER}@snakkaz.com    ${NC}"
        echo -e "${GREEN}=====================================================${NC}"
        echo
        echo -e "Brukt plass: ${BLUE}${DISK_USED_MB} MB${NC}"
        echo -e "Total kvote: ${BLUE}${DISK_LIMIT_TEXT}${NC}"
        
        if [ "$DISK_LIMIT" -ne 0 ]; then
            echo -e "Prosentvis brukt: ${BLUE}${PERCENT_USED}${NC}"
        fi
    fi
}

# Hovedløkke
while true; do
    show_menu
    read choice
    
    case $choice in
        1) list_email_accounts ;;
        2) create_email_account ;;
        3) delete_email_account ;;
        4) change_password ;;
        5) check_quota ;;
        6) echo "Avslutter program."; exit 0 ;;
        *) echo -e "${RED}Ugyldig valg. Prøv igjen.${NC}" ;;
    esac
    
    echo
    read -p "Trykk Enter for å fortsette..."
done
