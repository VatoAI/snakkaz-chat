#!/bin/bash
# update-dependencies-for-email.sh
#
# Dette skriptet oppdaterer package.json med nødvendige avhengigheter
# for e-postfunksjonaliteten

# Fargedefinisjoner
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    INSTALLERER AVHENGIGHETER FOR PREMIUM E-POST      ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Sjekk om npm er installert
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Feil: npm er ikke installert${NC}"
    echo "Vennligst installer Node.js og npm først"
    exit 1
fi

echo -e "${YELLOW}Installerer nødvendige npm-pakker...${NC}"

# Liste over pakker vi trenger
PACKAGES=(
    "axios"
    "express"
    "body-parser"
    "cors"
    "@supabase/supabase-js"
    "dotenv"
    "check-password-strength"
)

# Installer hver pakke
for package in "${PACKAGES[@]}"; do
    echo -n "Installerer $package... "
    
    if npm list "$package" &> /dev/null; then
        echo -e "${GREEN}Allerede installert!${NC}"
    else
        npm install "$package" --save
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}Installert!${NC}"
        else
            echo -e "${RED}Feilet!${NC}"
            exit 1
        fi
    fi
done

# Oppdater server.js hvis den mangler Express-implementasjonen
if ! grep -q "emailRoutes" server.js; then
    echo -e "\n${YELLOW}Oppdaterer server.js med e-post API endepunkter...${NC}"
    
    # Backup original server.js
    cp server.js server.js.bak
    
    # Legg til emailRoutes
    if grep -q "express()" server.js; then
        # Server bruker allerede Express
        sed -i '/app.use(/a \
// Email API routes\
const emailRoutes = require("./src/server/api/emailRoutes");\
app.use("/api/emails", emailRoutes);' server.js
    else
        # Server bruker kanskje ikke Express
        echo -e "${YELLOW}⚠️ server.js bruker ikke Express. Vennligst integrer e-post API manuelt.${NC}"
        echo "Se eksempelimplementasjon i docs/PREMIUM-EMAIL-DEPLOYMENT.md"
    fi
fi

# Lag .env fil hvis den ikke eksisterer
if [ ! -f ".env" ]; then
    echo -e "\n${YELLOW}Oppretter .env-fil for miljøvariabler...${NC}"
    
    cat > .env << EOL
# cPanel API-konfigurasjon
CPANEL_USERNAME=
CPANEL_API_TOKEN=
CPANEL_DOMAIN=
ENABLE_PREMIUM_EMAIL=true

# Supabase-konfigurasjon
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
EOL
    
    echo -e "${GREEN}✓ .env-fil opprettet${NC}"
    echo -e "${YELLOW}Husk å fylle ut API-detaljer i .env-filen${NC}"
fi

echo
echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    FERDIG!                                           ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

echo -e "${GREEN}✓ Alle avhengigheter for premium e-post er installert!${NC}"
echo -e "\nNeste steg:"
echo "1. Fyll ut .env med dine cPanel API-detaljer"
echo "2. Kjør 'supabase db push ./supabase/migrations/20250519_add_premium_emails_table.sql'"
echo "3. Start serveren med 'npm run dev' eller 'node server.js'"
echo "4. Test e-postfunksjonaliteten"

echo
