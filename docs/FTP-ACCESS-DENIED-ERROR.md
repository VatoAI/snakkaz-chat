# FTP Access Denied (530) Problem

## Problemidentifikasjon

Når vi analyserer GitHub Actions loggen, ser vi at FTP-tilkoblingen faktisk etableres men feiler med en "530 Access denied" feil:

```
* Connected to *** (162.0.229.214) port 21
< 220---------- Welcome to Pure-FTPd [privsep] [TLS] ----------
...
< 331 User *** OK. Password required
> PASS ***
...
* Access denied: 530
curl: (67) Access denied: 530
```

Dette indikerer at brukernavnet og passordet blir godkjent, men serveren nekter tilgang av en annen grunn, mest sannsynlig på grunn av IP-restriksjoner.

## Analyse

Feilen "530 Access denied" (i motsetning til "530 Login authentication failed") betyr at:

1. Brukernavn og passord er korrekt
2. Serveren godkjenner autentiseringen
3. Men serveren nekter tilgang på grunn av enten:
   - IP-restriksjoner
   - Kontoresktriksjoner
   - Tilgangskontroll-konfigurasjon

GitHub Actions kjører på Microsoft-eide servere med IP-adresser som kan være utenfor tillatte IP-områder på din Namecheap FTP-konto.

## Løsninger

### 1. Fjerne IP-restriksjoner i cPanel

1. Logg inn på Namecheap cPanel
2. Gå til "FTP Accounts" eller "Security"
3. Finn "IP Restrictions" eller lignende instilling
4. Fjern eller modifiser IP-restriksjonene for å tillate GitHub Actions IPs
   (Du kan eventuelt kontakte Namecheap support for hjelp med dette)

### 2. Bruk den forbedrede FTP-scriptet

Bruk det nyopprettede `enhanced-ftp-deploy.sh`-scriptet som:
- Forsøker forskjellige FTP-tilkoblingsmoduser
- Prøver både FTP og FTPS
- Håndterer feil med alternative metoder
- Gir detaljert feilsøkingsinformasjon

### 3. Fortsett med cPanel API-tilnærmingen

Den beste langsiktige løsningen er å bruke cPanel API-tilnærmingen vi allerede har implementert:
- Denn bruker HTTP/HTTPS i stedet for FTP
- Er mindre påvirket av IP-restriksjoner
- Overfører mindre data gjennom ZIP-komprimering

For å bruke denne:
1. Kjør `setup-cpanel-deployment.sh` for å konfigurere
2. Legg til cPanel hemmeligheter på GitHub
3. Bruk GitHub Actions workflow `deploy-cpanel.yml`

### 4. Manuell Deployment

Hvis alt annet feiler, bruk manuell deployment:
1. Bygg prosjektet lokalt: `npm run build`
2. Logg inn på Namecheap cPanel
3. Gå til File Manager
4. Last opp filene fra `dist`-mappen til `public_html`
5. Sørg for å inkludere `.htaccess`-filen

## Feilsøkingsverktøy

Bruk scriptet `analyze-ftp-error.sh` for å:
- Diagnostisere nøyaktig hva som forårsaker FTP-feil
- Teste ulike aspekter ved FTP-tilkoblingen
- Få detaljerte feilmeldinger og mulige løsninger

## Kontakte Namecheap Support

Hvis du fortsatt har problemer, bør du kontakte Namecheap support og spør om:
1. IP-restriksjoner på din FTP-konto
2. Hvilke IP-adresser som er tillatt
3. Hvordan du kan konfigurere tilgang for automatiserte deployment-systemer som GitHub Actions
4. Om de kan gi mer detaljerte feillogger for «530 Access denied» feilene
