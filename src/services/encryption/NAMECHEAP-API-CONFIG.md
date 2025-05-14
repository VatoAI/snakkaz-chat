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

### 3. Legg til din IP-adresse på whitelist
1. Din nåværende IP er: **20.61.126.209**
2. På API Access-siden, klikk på "EDIT" ved siden av "Whitelisted IPs"
3. Legg til IP-adressen din og klikk "Done"

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
3. **IP ikke whitelistet**: Sjekk at riktig IP er lagt til i whitelisten
4. **Sandbox vs. Production**: Vi bruker sandbox-miljøet for testing

## Teknisk informasjon
- Din IP-adresse: **20.61.126.209**
- API-bruker: **SnakkaZ**
- API-nøkkel: **43cb18d3efb341258414943ce1549db7**
- Domene: **snakkaz.com**
