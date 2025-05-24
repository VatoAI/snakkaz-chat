# Webmail og E-post Installasjonsveiledning for Snakkaz Chat

## Oversikt

Dette dokumentet beskriver hvordan man setter opp en komplett webmail-løsning for premium brukere av Snakkaz Chat, integrert med eksisterende cPanel-infrastruktur.

## Domener og Subdomener

| Subdomain | Formål | Status |
|-----------|--------|--------|
| mail.snakkaz.com | Webmail-portal (Roundcube) | 🟡 Under oppsett |
| smtp.snakkaz.com | SMTP-server for utgående e-post | ✅ Konfigurert |
| imap.snakkaz.com | IMAP-server for innkommende e-post | ✅ Konfigurert |
| mcp.snakkaz.com | Model Context Protocol server | 🟡 Under utvikling |

## Installasjonsguide for Roundcube på mail.snakkaz.com

### Forutsetninger
- cPanel-tilgang
- DNS-kontroll for snakkaz.com
- SSL-sertifikat for *.snakkaz.com

### Trinn 1: Sett opp DNS
1. Logg inn på DNS-leverandøren for snakkaz.com
2. Opprett A-oppføring for mail.snakkaz.com som peker til samme IP som hoveddomenet
3. Verifiser DNS-propagering før du fortsetter (`dig mail.snakkaz.com`)

### Trinn 2: Installer Roundcube via cPanel
1. Logg inn på cPanel (https://cpanel.snakkaz.com:2083)
2. Naviger til "Softaculous Apps Installer" 
3. Finn og velg "Roundcube" fra e-postkategorien
4. Konfigurasjon:
   - Choose Installation URL: http://mail.snakkaz.com
   - Choose Domain: snakkaz.com
   - In Directory: (tom)
   - Site Settings: "My Roundcube Mail" (eller annet ønsket navn)
   - IMAP Settings:
     - Server Address: imap.snakkaz.com
     - Port: 993
     - Connection Type: SSL
   - SMTP Settings:
     - Server Address: smtp.snakkaz.com
     - Port: 465
     - Connection Type: SSL
5. Klikk på "Quick Install"

### Trinn 3: Konfigurer SSL
1. Gå til cPanel > SSL/TLS Status
2. Sørg for at SSL er aktivert for mail.snakkaz.com
3. Hvis ikke, bruk "Install SSL on Domain" verktøyet

### Trinn 4: Konfigurer Roundcube ytterligere
1. Logg inn på Roundcube admin panel
2. Konfigurer følgende:
   - Maksimal vedleggsstørrelse
   - Tema og utseende
   - Sørg for at SMTP-autentisering bruker riktig port og kryptering

### Trinn 5: Integrer med Snakkaz Chat
1. Oppdater alle referanser i koden til å bruke mail.snakkaz.com
2. Test pålogging fra både appen og direkte via webmail

## Sikkerhetshensyn

### E-post Sikkerhet
- Aktiver SPF-oppføringer i DNS
- Konfigurer DKIM for forbedret e-postautentisering
- Sett opp DMARC-policy
- Implementer anti-spam og antivirus

### Webmail Sikkerhet
- Konfigurer riktig HTTP-headere (inkludert Content-Security-Policy)
- Aktiver brute-force beskyttelse
- Sett opp automatisk utlogging etter inaktivitet
- Implementer 2FA hvis tilgjengelig

## Monitorering og Vedlikehold

### Overvåking
- Sett opp diskbruk-varsler (80% kapasitet)
- Overvåk feilede påloggingsforsøk
- Sjekk e-postleveringsrate

### Vedlikehold
- Planlegg regelmessige sikkerhetsoppdateringer
- Utfør månedlige backups av e-postdatabaser
- Rens gamle e-poster for inaktive kontoer etter 12 måneder

## MCP Integrasjon (Fremtidig)

Når mcp.snakkaz.com er ferdig utviklet, vurder følgende integrasjonsmuligheter:

1. E-post analysering og kategorisering ved hjelp av MCP
2. Smart svarhjelp i webmail-grensesnittet
3. Automatisk tekst-til-tale konvertering av e-poster
4. Sentimentanalyse av innkommende e-poster

## Feilsøking

### Vanlige problemer og løsninger

1. **Problem**: Kan ikke logge inn via webmail
   **Løsning**: Verifiser IMAP-innstillinger og brukerlegitimasjon

2. **Problem**: E-post sendes ikke
   **Løsning**: Sjekk SMTP-innstillinger og porttilgjengelighet

3. **Problem**: SSL-sertifikat feil
   **Løsning**: Forny SSL-sertifikatet via cPanel eller Let's Encrypt

4. **Problem**: Stor forsinkelse i e-postlevering
   **Løsning**: Sjekk e-postkø og serverbelastning
