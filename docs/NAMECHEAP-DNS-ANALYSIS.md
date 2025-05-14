# Eksisterende Namecheap DNS-oppføringer for snakkaz.com

Fra skjermbildet av Namecheap Advanced DNS-panelet ser jeg følgende oppføringer:

| Type  | Vertsnavn | Verdi                           | TTL      |
|-------|-----------|--------------------------------|----------|
| A     | @         | 185.158.133.1                  | 5 min    |
| A     | mcp       | 185.158.133.1                  | 5 min    |
| CNAME | _cf-custom-hostname-verification.supabase  | _cf-custom-hostname-verification.supabase.co | Automatic |
| CNAME | www       | project-wqpoozpbceucynsojmbk.supabase.co | Automatic |
| TXT   | _acme-challenge | 9_BtdmyAE5edIukfTcGeY32FhOZCJ4TThuHA1xN_MVM | Automatic |

## Vurdering av eksisterende oppføringer

### A-oppføringer
- `@` (roten av domenet) peker til IP-adressen 185.158.133.1
- `mcp` subdomene peker også til samme IP-adresse

### CNAME-oppføringer
- `_cf-custom-hostname-verification.supabase` er en verifikasjonsoppføring for Supabase som fortsatt refererer til Cloudflare
- `www` peker til Supabase-prosjektet

### TXT-oppføringer
- `_acme-challenge` brukes for SSL-sertifikatvalidering

## Endringer som bør gjøres

1. Beholde A-oppføringene siden de peker til server-IP
2. Oppdatere eller fjerne `_cf-custom-hostname-verification.supabase` siden den er Cloudflare-spesifikk
3. Legge til manglende CNAME-oppføringer for:
   - dash.snakkaz.com
   - business.snakkaz.com
   - docs.snakkaz.com
   - analytics.snakkaz.com

4. Sjekke med Supabase om det er behov for nye verifikasjonsoppføringer når Cloudflare-integrasjonen fjernes
