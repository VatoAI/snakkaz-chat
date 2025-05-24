# Electrum Bitcoin Integrasjon - Teststrategi

## Oversikt

Dette dokumentet beskriver teststrategi for Bitcoin/Electrum-integrasjonen i Snakkaz Chat. Målet er å sikre at betalingsløsningen er pålitelig, sikker og brukervennlig.

## Testmiljø

For testing skal vi bruke:
- Electrum testnet-modus
- Bitcoin testnet for reelle transaksjoner
- Isolert testkopi av databasen
- Separate testbrukere i Supabase

## Testtyper

### 1. Enhetstest

Fokus på å teste individuelle moduler i isolasjon:
- ElectrumConnector
- BitcoinElectrumAdapter
- ElectrumPaymentProcessor
- API-endepunkter

Kjør med:
```bash
npm run test:electrum
```

### 2. Integrasjonstest

Tester samspillet mellom modulene:
- Adressegenerering og betalingsverifisering
- Betalingsflyt fra start til slutt
- Kommunikasjon mellom Electrum og betalingstjenesten

### 3. End-to-End Test

Full betalingsflyt med reelle testnet-transaksjoner:
- Opprette betalingsforespørsel
- Sende Bitcoin-betaling på testnettet
- Verifisere mottak og bekreftelser
- Aktivering av premium-funksjoner

### 4. Feilinjektion

Test av feilhåndtering:
- Mislykkede tilkoblingsforsøk til Electrum
- Tapte transaksjoner
- Utilstrekkelige betalinger
- Nettverksproblemer

## Testscenarier

### Scenario 1: Normal betalingsflyt
1. Bruker velger å oppgradere til Premium
2. System genererer Bitcoin-adresse
3. Bruker sender Bitcoin (testnet)
4. System mottar og bekrefter transaksjonen
5. Premium-funksjoner aktiveres
6. Bruker mottar e-postbekreftelse

### Scenario 2: Delvis betaling
1. Bruker sender mindre Bitcoin enn påkrevd
2. System registrerer betalingen men markerer den som ufullstendig
3. Bruker varsles om utilstrekkelig betaling

### Scenario 3: Tilkoblingssvikt
1. Simuler at Electrum-serveren er utilgjengelig
2. Test automatisk gjenoppkobling
3. Verifiser at systemet fortsetter å fungere etter gjenoppkobling

### Scenario 4: Administratorfunksjoner
1. Admin-bruker logger inn på admin-panelet
2. Tester visning av transaksjoner og wallet-balanse
3. Tester manuell oppdatering av betalingsstatus

## Testdata

For testingen trenger vi:
- Testnet Bitcoin (kan fås fra testnet faucets)
- Testbrukere med ulike roller (normal bruker, admin)
- Testwallets for Electrum

## Verifikasjonspunkter

For hver test, verifiser:
1. Funksjonelt: Virker funksjonaliteten som forventet?
2. Ytelse: Responstider innenfor akseptable grenser?
3. Sikkerhet: Er sensitive data beskyttet?
4. Logging: Logges hendelser korrekt for debugging?
5. Brukervennlighet: Er grensesnittet intuitivt?

## Automatisering

Automatiser når mulig:
- Enhets- og integrasjonstester kjøres ved hver commit
- Daglig scheduled test av Electrum-tilkobling
- Automatisk verifisering av database-integritet

## Rapportering

Testresultater samles i:
- Daglige testrapporter
- Feillogg med reproduserbare steg
- Metrikker for betalingssuksess og systemtilgjengelighet
