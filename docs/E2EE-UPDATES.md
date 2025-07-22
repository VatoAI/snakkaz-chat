# SnakkaZ E2EE-oppdateringer

## Oversikt over forbedringer

Dette dokumentet beskriver forbedringene som er implementert for ende-til-ende-kryptering (E2EE) i SnakkaZ-appen, med fokus på utvidet støtte for gruppesamtaler og robust testing.

## 1. Utvidet gruppekrypteringsfunksjonalitet

Vi har utvidet e2ee.ts med omfattende støtte for gruppekryptering:

- **Nøkkelhåndtering for grupper**: Funksjoner for å generere, eksportere og importere gruppenøkler.
- **Gruppemeldingskryptering**: Dedikerte funksjoner for kryptering og dekryptering av gruppemeldinger.
- **Nøkkeldistribusjon**: Mekanisme for sikker distribusjon av gruppenøkler til alle gruppemedlemmer.
- **Lokal nøkkellagring**: Metoder for å lagre og hente gruppenøkler sikkert.

## 2. Forbedret testfunksjonalitet

Vi har implementert omfattende testing for krypteringsfunksjonene:

- **Ende-til-ende tester**: Automatiserte tester for både peer-to-peer og gruppekryptering.
- **Ytelsesmåling**: Måling av krypterings- og dekrypteringstider for å overvåke ytelse.
- **Nettleserkompabilitetssjekk**: Verifikasjon av støtte for nødvendige Web Crypto API-funksjoner.
- **Testwebside**: Grafisk grensesnitt for å kjøre tester og inspisere resultater (tilgjengelig på `/e2ee-test`).
- **Kommandolinjeverktøy**: Shell-skript (`test-e2ee.sh`) for å kjøre tester fra terminalen eller i CI/CD.

## 3. Utvidelse for produksjonsbruk

- **Bedre feilhåndtering**: Omfattende feilhåndtering og feilrapportering i alle krypteringsfunksjoner.
- **Nøkkelcaching**: Optimalisert ytelse med cachelagring av krypteringsnøkler.
- **Standardisert API**: Konsistent API på tvers av peer-to-peer og gruppekrypteringsfunksjoner.
- **Omfattende dokumentasjon**: Detaljerte JSDoc-kommentarer for alle funksjoner.

## 4. Teknisk implementasjon

Alle krypteringsfunksjoner bruker Web Crypto API med følgende spesifikasjoner:

- **Algoritme**: AES-GCM med 256-bit nøkler
- **Nøkkelderivasjon**: SHA-256 for sikker derivasjon av nøkler fra bruker-ID-er
- **IV (Initialization Vector)**: Unik 96-bit IV for hver krypterte melding
- **Nøkkellagring**: Sikker lokal lagring med `localStorage` (kan utvides med mer sikre alternativer)

## 5. Testing

For å teste krypteringsfunksjonaliteten:

1. Naviger til `/e2ee-test` i SnakkaZ-appen
2. Klikk på "Kjør E2EE-tester" for å starte automatiserte tester
3. Inspiser resultater og ytelsesdata i brukergrensesnittet

Alternativt kan testene kjøres fra kommandolinjen:

```bash
./test-e2ee.sh
```

## Neste steg

- Integrere gruppekryptering i chatService.ts for å støtte krypterte gruppesamtaler
- Implementere mer sikker nøkkellagring (f.eks. IndexedDB med krypterte containere)
- Utvide testene til å inkludere flere edge cases og feilsituasjoner
- Legge til støtte for nøkkelrotasjon i grupper for forbedret sikkerhet
