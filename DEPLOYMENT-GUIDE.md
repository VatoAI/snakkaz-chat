# Hurtigguide for Deployment av Snakkaz Chat til www.snakkaz.com

Dette dokumentet gir en enkel trinn-for-trinn guide til å deploye Snakkaz Chat til produksjon.

## Forutsetninger

1. Du har tilgang til GitHub-repositoriet for Snakkaz Chat
2. Du har konfigurert nødvendige hemmeligheter i GitHub:
   - `SUPABASE_URL` og `SUPABASE_ANON_KEY`
   - `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `SERVER_DIR`
   
   > **Merk:** Etter migreringen fra Cloudflare til Namecheap trenger du ikke lenger:
   > - `CLOUDFLARE_ZONE_ID` og `CLOUDFLARE_API_TOKEN`

## Namecheap FTP-konfigurasjon

Etter migreringen til Namecheap hosting, skal følgende FTP-informasjon brukes:

- **FTP Server**: `premium123.web-hosting.com`
- **FTP Username**: `SnakkaZ@snakkaz.com` (eller annen FTP-konto du har opprettet)
- **FTP Password**: Passordet du satte ved oppretting av FTP-kontoen
- **Server Directory**: `/home/snakqsqe/`

For å generere GitHub Secrets for FTP-oppsett, kan du kjøre:
```bash
./generate-github-secrets.sh
```

## Deployment-prosess

### Metode 1: Automatisert Deployment

1. Naviger til prosjektets rotmappe i terminalen
   ```bash
   cd /sti/til/snakkaz-chat
   ```

2. Kjør deploymentskriptet
   ```bash
   ./deploy-snakkaz.sh
   ```

3. Følg instruksjonene i skriptet. Det vil:
   - Kjøre Cloudflare-sikkerhetssjekker
   - Spørre om commit-melding
   - Committe og pushe endringene 
   - Starte GitHub Actions workflow

4. Når GitHub Actions er ferdig, verifiser at siden fungerer på www.snakkaz.com

5. Kjør statuskontroll for å verifisere Cloudflare-integrasjonen
   ```bash
   ./check-cloudflare-status.sh
   ```

### Metode 2: Manuell Deployment

1. Commit og push endringer til main-branch
   ```bash
   git add .
   git commit -m "Din beskrivelse av endringene"
   git push origin main
   ```

2. GitHub Actions vil automatisk starte deployment-prosessen

3. Gå til GitHub Actions-fanen for å følge med på status:
   https://github.com/[din-bruker]/snakkaz-chat/actions

4. Når deploymentet er ferdig, verifiser at www.snakkaz.com fungerer korrekt

5. Kjør statuskontroll for Cloudflare-integrasjonen
   ```bash
   ./check-cloudflare-status.sh
   ```

## Feilsøking

### Hvis GitHub Actions-workflow feiler:

1. Sjekk loggen i GitHub Actions for detaljer om feilen

2. Vanlige problemer:
   - Manglende hemmeligheter i GitHub-repositoriet
   - FTP-tilkoblingsfeil (sjekk påloggingsinformasjon)
   - Byggefeil (sjekk at koden bygger lokalt med `npm run build`)

3. Rett feilen og kjør workflow på nytt

### Hvis nettsiden ikke lastes etter deployment:

1. Sjekk om filene er lastet opp korrekt til webserveren

2. Kontroller at Cloudflare-cache er tømt:
   ```bash
   curl -X POST "https://api.cloudflare.com/client/v4/zones/[ZONE_ID]/purge_cache" \
     -H "Authorization: Bearer [API_TOKEN]" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'
   ```

3. Verifiser SSL/TLS-konfigurasjonen med check-cloudflare-status.sh

## Viktige filer og ressurser

- `/.github/workflows/deploy.yml` - GitHub Actions workflow for deployment
- `/src/services/encryption/cloudflareSecurityCheck.ts` - Cloudflare-validering
- `/src/services/encryption/securityEnhancements.ts` - Sikkerhetsforbedringer
- `/deploy-snakkaz.sh` - Automatisert deploymentskript
- `/check-cloudflare-status.sh` - Verifikasjon av Cloudflare-integrasjon

## Kontakt

Ved problemer med deployment, kontakt systemadministrator eller utviklingsteamet.
