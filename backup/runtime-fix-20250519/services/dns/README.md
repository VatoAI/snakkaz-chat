# Snakkaz Chat DNS Management

Dette repoet inneholder verktøy og konfigurasjoner for å administrere DNS-oppføringer for Snakkaz Chat-prosjektet.

## Oversikt

Snakkaz Chat bruker nå Namecheap direkte for DNS-administrasjon. Dette erstatter den tidligere Cloudflare-integrasjonen. Denne endringen ble gjort for å:

1. Forenkle teknologistacken
2. Redusere tredjepartsavhengigheter
3. Løse problemer med CSP (Content Security Policy) implementasjonen
4. Forbedre sikkerhet og ytelse

## DNS-oppføringer

For Snakkaz Chat trenger vi følgende DNS-oppføringer:

| Type  | Vertsnavn | Verdi                           | TTL      |
|-------|-----------|--------------------------------|----------|
| A     | @         | 185.158.133.1                  | 5 min    |
| A     | mcp       | 185.158.133.1                  | 5 min    |
| CNAME | www       | project-wqpoozpbceucynsojmbk.supabase.co | 30 min |
| CNAME | dash      | snakkaz.com                    | 30 min   |
| CNAME | business  | snakkaz.com                    | 30 min   |
| CNAME | docs      | snakkaz.com                    | 30 min   |
| CNAME | analytics | snakkaz.com                    | 30 min   |
| TXT   | _supabase-verification | verification=project-wqpoozpbceucynsojmbk | 30 min |

## Verktøy

Følgende verktøy er tilgjengelige for å administrere DNS:

1. **Programmatiske verktøy:**
   - `/src/services/dns/namecheapApi.ts` - API-klient for Namecheap
   - `/src/services/dns/namecheapConfig.ts` - Konfigurasjonsinnstillinger
   - `/src/services/dns/namecheapDns.ts` - Utility-funksjoner for DNS-oppføringer
   - `/src/services/dns/dnsManager.ts` - DNS-manager klasse

2. **Scripts:**
   - `/scripts/update-namecheap-dns.js` - Oppdater DNS-oppføringer
   - `/scripts/test-dns-setup.sh` - Test DNS-konfigurasjonen

## Bruk

### Oppdatere DNS-oppføringer

For å oppdatere DNS-oppføringer:

1. Kopier `.env.example` til `.env` og fyll inn API-kredentialer for Namecheap:
```
cp .env.example .env
nano .env
```

2. Kjør oppdateringsscriptet:
```
node scripts/update-namecheap-dns.js
```

### Teste DNS-konfigurasjonen

For å verifisere DNS-konfigurasjonen:

```
chmod +x scripts/test-dns-setup.sh
./scripts/test-dns-setup.sh
```

## Supabase-integrasjon

Snakkaz Chat bruker Supabase for backend-tjenester. Følgende DNS-konfigurasjoner er nødvendige for Supabase:

1. CNAME-oppføring for `www` som peker til Supabase-prosjektet
2. TXT-oppføring for `_supabase-verification` for domene-verifisering

## Feilsøking

Hvis det oppstår problemer med DNS-konfigurasjonen:

1. Verifiser Namecheap API-kredentialene
2. Sjekk at alle nødvendige DNS-oppføringer er korrekt konfigurert
3. Vent på DNS-propagering (kan ta opptil 24 timer)
4. Bruk `test-dns-setup.sh` for å diagnostisere problemer

## Dokumentasjon

For mer informasjon, se:

- `/docs/NAMECHEAP-DNS-ANALYSIS.md` - Analyse av eksisterende DNS-oppføringer
- `/docs/CLOUDFLARE-TO-NAMECHEAP-MIGRATION-LOGG.md` - Logg over migreringsprosessen
