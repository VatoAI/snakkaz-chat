# Namecheap API Configurasjon Guide

## Problemet identifisert
Vi får følgende feilmelding når vi tester API-en:
```
API Key is invalid or API access has not been enabled
```

## Løsning
For å løse dette problemet, følg denne steg-for-steg guiden:

### 1. Sjekk at API er aktivert
1. Logg inn på Namecheap med brukernavn **SnakkaZ**
2. Gå til Profile > Tools > API Access
3. Sørg for at API Access er satt til "On" (sjekk at bryteren er aktivert)

### 2. Verifiser API-nøkkelen
1. Den nåværende API-nøkkelen vi prøver å bruke er: `43cb18d3efb341258414943ce1549db7`
2. Sjekk at denne nøyaktig matcher det som vises på API Access-siden
3. Hvis nøkkelen er feil, oppdater filen `namecheapConfig.ts`

### 3. Legg til IP-adresser på whitelist
Namecheap tillater maks 20 IP-adresser i whitelist. Du bør legge til følgende IP-adresser:

#### Supabase-servere:
1. **172.64.149.246** (Supabase-server 1)
2. **104.18.38.10** (Supabase-server 2)

#### Snakkaz-server:
3. **185.158.133.1** (Hovedserver for Snakkaz)

#### MCP-server:
4. **185.158.133.1** (Samme IP som hovedserveren, men for MCP-subdomenet)

#### Din nåværende utviklingsmiljø:
5. **20.61.126.209** (Din gjeldende IP-adresse)

På API Access-siden, klikk på "EDIT" ved siden av "Whitelisted IPs", legg til IP-adressene over, og klikk "Done".

### 4. Test API-tilgangen på nytt
Etter å ha gjort endringene over, kjør følgende kommando for å teste tilkoblingen:

```bash
IP=$(curl -s https://api.ipify.org?format=json | jq -r '.ip') && \
curl -s "https://api.sandbox.namecheap.com/xml.response?ApiUser=SnakkaZ&ApiKey=43cb18d3efb341258414943ce1549db7&UserName=SnakkaZ&ClientIp=$IP&Command=namecheap.domains.getInfo&DomainName=snakkaz.com"
```

### 5. Sjekk om respons indikerer suksess
En vellykket respons vil inneholde `Status="OK"` og informasjon om domenet.

## Vanlige problemer
1. **API ikke aktivert**: Sørg for at bryteren er "On"
2. **Feil API-nøkkel**: Dobbeltsjekk nøkkelen mot det som vises i Namecheap
3. **IP ikke whitelistet**: Sjekk at alle nødvendige IP-adresser er lagt til i whitelisten
4. **Sandbox vs. Production**: Vi bruker sandbox-miljøet for testing
5. **Begrensning på 20 IP-adresser**: Namecheap tillater kun 20 IP-adresser på whitelist

## Teknisk informasjon
- API-bruker: **SnakkaZ**
- API-nøkkel: **43cb18d3efb341258414943ce1549db7**
- Domene: **snakkaz.com**
- Supabase-prosjekt-ID: **wqpoozpbceucynsojmbk**
