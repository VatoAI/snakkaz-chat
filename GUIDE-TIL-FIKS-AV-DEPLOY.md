# 🛠️ Trinn-for-Trinn Løsning for Snakkaz Deploy-Problemer

Dette dokumentet gir en konkret, trinnvis veiledning for å løse deployment-problemene med Snakkaz-appen.

## 🔍 Identifiserte problemer
1. FTP-opplasting feiler for assets-filer
2. Feil MIME-typer på serveren
3. Abonnementsfunksjonalitet og andre nye funksjoner virker ikke

## 📋 Løsningstrinn

### Trinn 1: Forbered assets-filer for manuell opplasting
```bash
# Kjør skriptet som pakker alle assets i en ZIP-fil
./prepare-assets-for-cpanel.sh

# Dette oppretter assets.zip som inneholder alle nødvendige filer
```

### Trinn 2: Last opp assets.zip til serveren
1. Last ned assets.zip til din lokale maskin
2. Logg inn på cPanel for snakkaz.com
3. Gå til File Manager
4. Naviger til public_html-mappen
5. Last opp assets.zip
6. Høyreklikk på filen og velg "Extract"
7. Sørg for at innholdet ekstraheres til public_html/

### Trinn 3: Oppdater .htaccess-filen
```bash
# Opprett en korrekt konfigurert .htaccess-fil
./check-mime-types.sh
```

1. Sjekk den genererte .htaccess-filen for å bekrefte at den inneholder riktige MIME-type definisjoner
2. Last opp .htaccess-filen til public_html/ på serveren via cPanel
3. Verifiser at filen har rettigheter 644 (rw-r--r--)

### Trinn 4: Verifiser assets-filene
```bash
# Last opp og besøk mime-test.html
# Eller bruk curl for å sjekke at filene er tilgjengelige
curl -I https://www.snakkaz.com/assets/index-DQJNfLon.js
curl -I https://www.snakkaz.com/assets/index-GRqizV24.css
```

Sjekk at:
- HTTP-statuskode er 200
- Content-Type er riktig (application/javascript for JS, text/css for CSS)

### Trinn 5: Test nettsiden
1. Åpne en ny fane i nettleseren
2. Besøk https://www.snakkaz.com
3. Trykk CTRL+F5 for å tømme cache
4. Åpne utviklerverktøyet (F12) og sjekk konsollen for feil
5. Test abonnementsfunksjonaliteten og andre nye funksjoner

### Trinn 6: Hvis problemer vedvarer, sjekk mappetillatelser
```bash
# Via cPanel File Manager
# 1. Høyreklikk på assets-mappen
# 2. Velg "Change Permissions"
# 3. Sett til 755 (drwxr-xr-x)
```

### Trinn 7: Sjekk DNS og serverstatus
```bash
# Sjekk at DNS er korrekt konfigurert
nslookup www.snakkaz.com

# Verifiser at siden laster uten andre feil
curl -I https://www.snakkaz.com
```

## 📋 Sjekkpunktliste

Når du har fullført alle trinnene, gå gjennom denne sjekklisten:

- [ ] assets-mappen finnes på serveren med alle JS og CSS-filer
- [ ] .htaccess-filen er oppdatert med riktige MIME-typer
- [ ] Assets-filer returnerer HTTP 200 og riktig Content-Type
- [ ] Nettlesercachen er tømt med CTRL+F5
- [ ] Ingen konsollfeil relatert til manglende ressurser
- [ ] Abonnementsfunksjonaliteten fungerer som forventet
- [ ] Andre nye funksjoner fungerer som forventet

## 🆘 Hvis alt feiler

Hvis alle ovenstående trinn ikke løser problemet:

1. Kontakt Namecheap support og spør spesifikt om FTP-tilgang og MIME-type konfigurasjoner
2. Sjekk om det er IP-blokkeringer som hindrer tilgang fra din lokasjon
3. Vurder en annen hosting-løsning som støtter mer moderne deployment-metoder

## 📊 Suksessindikatorer

Du vil vite at problemet er løst når:

1. Alle assets-filer er tilgjengelige med riktige MIME-typer
2. Nettsiden laster uten konsollfeil
3. Abonnementsfunksjonaliteten fungerer som forventet
4. Alle brukere kan se og bruke de nye funksjonene
