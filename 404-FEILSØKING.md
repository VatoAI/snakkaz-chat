# 404-feilsøkingsguide for Snakkaz Chat

Dette dokumentet gir en oversikt over hvordan du kan feilsøke og fikse 404-feil på www.snakkaz.com nettsiden.

## 404-feil årsaker

404-feil på en Single-Page Application (SPA) som Snakkaz Chat kan skyldes flere årsaker:

1. **Manglende .htaccess-konfigurasjon**: SPA-applikasjoner krever spesielle server-konfigurasjoner for å håndtere ruting.
2. **Filer ikke lastet opp**: Filer som index.html eller andre nødvendige filer kan mangle på serveren.
3. **Feil mappestruktur**: Filene kan være lastet opp til feil mappe.
4. **DNS-problemer**: Domenet peker ikke til riktig server eller mappe.
5. **Serverfeil**: Webserveren kan være feilkonfigurert.

## Løsning med fix-404-deploy-check.sh

Skriptet `fix-404-deploy-check.sh` er laget for å diagnostisere og løse 404-problemer automatisk gjennom følgende steg:

1. **Diagnostisering**: Sjekker HTTP-statuskode for å bekrefte 404-feilen.
2. **Serversjekk**: Undersøker mappestrukturen på serveren for å identifisere manglende filer.
3. **Byggvalidering**: Kontrollerer om prosjektet trenger å bygges på nytt.
4. **Bygging**: Bygger prosjektet på nytt hvis nødvendig.
5. **Klargjøring av .htaccess**: Oppretter en optimal .htaccess-fil med SPA-rutingskonfigurasjon.
6. **Opplasting**: Laster opp filene til serveren, enten alle filer eller kun kritiske filer.
7. **Verifisering**: Sjekker nettsiden etter endringer for å se om 404-feilen er løst.

## Hvordan bruke skriptet

1. Sørg for at du er i prosjektets rotmappe.
2. Kjør skriptet:
   ```
   ./fix-404-deploy-check.sh
   ```
3. Følg instruksjonene som vises i terminalen.
4. Velg om du vil laste opp alle filer på nytt eller bare kritiske filer.
5. Vent til skriptet er ferdig og sjekk nettsiden.

## Tilleggssteg ved vedvarende problemer

Hvis 404-feilen vedvarer etter å ha kjørt skriptet, bør du vurdere følgende tilleggssteg:

1. **Kontroller cache**: Tøm nettleserens cache eller bruk et privat nettleservindu.
2. **Sjekk DNS-propagering**: Bruk verktøy som `dnschecker.org` for å se om DNS-endringer er propagert.
3. **Kontakt hosting-leverandør**: Kontakt Namecheap support for å sjekke serverlogger eller konfigurasjoner.
4. **Sjekk manuelle FTP-opplastinger**: Logg inn via FTP-klient og verifiser at alle filer er lastet opp korrekt.
5. **Kontroller Cloudflare**: Hvis Cloudflare brukes, kontroller at cache er tømt og SSL/TLS-innstillingene er korrekte.

## Ofte stilte spørsmål

### Q: Hvorfor fungerer ikke ruting selv om index.html er tilgjengelig?
A: For SPA-applikasjoner kreves det en spesiell .htaccess-konfigurasjon som omdirigerer alle ruter til index.html. Skriptet sikrer at denne konfigurasjonen er på plass.

### Q: Hva gjør jeg hvis skriptet ikke løser problemet?
A: Prøv å laste opp filene manuelt via en FTP-klient og kontroller at .htaccess-filen har riktig innhold.

### Q: Hvorfor tar det tid før endringene trer i kraft?
A: Webservere kan ha caching på flere nivåer (server, DNS, Cloudflare), så det kan ta noen minutter før endringene er synlige.

## Vedlikehold av nettstedet

Etter at nettstedet er oppe og kjører igjen:

1. Dokumenter eventuelle endringer som ble gjort for fremtidig referanse.
2. Opprett en backup av fungerende konfigurasjoner og filer.
3. Sørg for at deploymentprosedyrer er oppdatert for å unngå lignende problemer i fremtiden.
