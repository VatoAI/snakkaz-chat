#!/bin/bash
# prepare-assets-for-cpanel.sh
# Dette skriptet oppretter en ZIP-fil med assets som kan lastes opp via cPanel File Manager

# Fargedefinisjoner
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Ingen farge

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}   FORBERED ASSETS FOR CPANEL OPPLASTING               ${NC}"
echo -e "${BLUE}======================================================${NC}"

# Sjekk om dist/assets finnes
if [ ! -d "dist/assets" ]; then
    echo -e "${RED}FEIL: dist/assets-mappen finnes ikke!${NC}"
    echo -e "${YELLOW}Bygger applikasjonen...${NC}"
    npm run build
    
    if [ ! -d "dist/assets" ]; then
        echo -e "${RED}FEIL: Kunne ikke bygge applikasjonen!${NC}"
        exit 1
    fi
fi

# Opprette en ZIP-fil med assets
echo -e "${YELLOW}Oppretter ZIP-fil med assets...${NC}"
cd dist
zip -r ../assets.zip assets/
cd ..

if [ -f "assets.zip" ]; then
    echo -e "${GREEN}✓ Assets ZIP-fil opprettet: assets.zip${NC}"
    echo -e "${YELLOW}Filstørrelse: $(du -h assets.zip | cut -f1)${NC}"
else
    echo -e "${RED}✗ Kunne ikke opprette ZIP-fil!${NC}"
    exit 1
fi

echo -e "${BLUE}======================================================${NC}"
echo -e "${YELLOW}INSTRUKSJONER FOR CPANEL OPPLASTING:${NC}"
echo -e "${BLUE}======================================================${NC}"
echo -e "1. Last ned assets.zip-filen til din lokale maskin"
echo -e "2. Logg inn på cPanel for snakkaz.com"
echo -e "3. Gå til File Manager"
echo -e "4. Naviger til public_html mappen"
echo -e "5. Last opp assets.zip-filen"
echo -e "6. Velg 'Extract' fra høyreklikksmenyen"
echo -e "7. Sørg for at filene ekstraheres til public_html/"
echo -e "8. Bekreft at assets-mappen er opprettet med alle filene"
echo -e "${BLUE}======================================================${NC}"
echo -e "${YELLOW}Vil du generere en sjekkliste for å verifisere opplastingen? (y/n)${NC}"
read generate_checklist

if [[ $generate_checklist == "y" ]]; then
    echo -e "${YELLOW}Genererer ASSETS-VERIFICATION-CHECKLIST.md...${NC}"
    
    # Opprett en sjekkliste for verifisering
    cat > ASSETS-VERIFICATION-CHECKLIST.md << 'EOF'
# Sjekkliste for verifisering av assets-opplasting

## Kritiske filer å sjekke
Sjekk at følgende filer er tilgjengelige på serveren:

- [ ] index-GRqizV24.css
- [ ] index-DQJNfLon.js
- [ ] vendor-react-CkjGjP8g.js
- [ ] vendor-supabase-0rZ8WFOd.js
- [ ] Subscription-DWohK-WG.js (kritisk for abonnementsfunksjonalitet)

## Sjekk med nettleser
1. Besøk https://www.snakkaz.com
2. Trykk CTRL+F5 for å tømme cachen
3. Åpne utviklerverktøy (F12)
4. Sjekk Console-tabben for feilmeldinger
5. Sjekk Network-tabben og filtrer for JS/CSS filer

## Sjekk med curl
```bash
# Kjør disse kommandoene for å sjekke om filene er tilgjengelige
curl -I https://www.snakkaz.com/assets/index-GRqizV24.css
curl -I https://www.snakkaz.com/assets/index-DQJNfLon.js
curl -I https://www.snakkaz.com/assets/vendor-react-CkjGjP8g.js
curl -I https://www.snakkaz.com/assets/Subscription-DWohK-WG.js
```

Sjekk at response-koden er 200 OK og at Content-Type er korrekt:
- For JS-filer bør Content-Type være: application/javascript eller text/javascript
- For CSS-filer bør Content-Type være: text/css

## Feilsøkingstrinn
Hvis filene ikke lastes korrekt:

1. Sjekk .htaccess-filen for MIME-type konfigurasjoner
2. Verifiser at assets-mappen har korrekte rettigheter (755)
3. Prøv å laste ned en fil direkte for å sjekke innholdet
4. Sammenlign filstørrelsen på serveren med lokal kopi
EOF

    echo -e "${GREEN}✓ ASSETS-VERIFICATION-CHECKLIST.md opprettet!${NC}"
fi

echo -e "${BLUE}======================================================${NC}"
echo -e "${GREEN}Ferdig! Du kan nå laste opp assets.zip til cPanel.${NC}"
echo -e "${BLUE}======================================================${NC}"
