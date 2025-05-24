# Electrum Bitcoin Wallet Integration - Implementasjonsguide

## Oversikt

Denne dokumentasjonen beskriver hvordan Snakkaz Chat er integrert med Electrum Bitcoin Wallet for å støtte Bitcoin-betalinger som en del av vår monetiseringsstrategi. Integrasjonen lar brukere betale for premiumfunksjoner med Bitcoin, inkludert premium e-postkontoer, lagringsplass og andre tjenester.

## Arkitektur

Integrasjonen består av følgende komponenter:

1. **ElectrumConnector**: Håndterer kommunikasjon med Electrum wallet-serveren via JSON-RPC
2. **BitcoinElectrumAdapter**: Tilpasser generelle betalingsoperasjoner til Electrum-spesifikk funksjonalitet
3. **ElectrumPaymentProcessor**: Kjører periodevis for å sjekke nye betalinger og håndtere bekreftelser
4. **API-endepunkter**: For administrative funksjoner og statussjekk

## Konfigurasjon

Integrasjonen konfigureres via miljøvariabler:

```
# Aktiver/deaktiver Electrum-betalinger
ENABLE_ELECTRUM_PAYMENTS=true

# Electrum-serverinnstillinger
ELECTRUM_HOST=localhost
ELECTRUM_PORT=50001
ELECTRUM_PROTOCOL=tls
ELECTRUM_WALLET_PATH=/path/to/wallet/file
ELECTRUM_WALLET_PASSWORD=your-wallet-password

# Betalingsinnstillinger
ELECTRUM_MIN_CONFIRMATIONS=3
ELECTRUM_CHECK_INTERVAL=60000
ELECTRUM_RECONNECT_INTERVAL=30000

# Logging/Caching
ELECTRUM_TX_CACHE_PATH=data/tx-cache.json
```

## Betalingsprosess

1. **Betalingsforespørsel**:
   - Bruker starter en betaling gjennom brukergrensesnittet
   - Backend oppretter en ny Bitcoin-adresse via Electrum
   - Adresse og beløp vises til brukeren

2. **Betalingsovervåking**:
   - ElectrumPaymentProcessor sjekker periodisk for nye betalinger
   - Når en betaling oppdages, oppdateres betalingsstatus til "unconfirmed"
   - Når tilstrekkelig bekreftelser er mottatt, oppdateres status til "confirmed"

3. **Aktivering av tjenester**:
   - Bekreftede betalinger ferdigstilles automatisk
   - PaymentSubscriptionConnector aktiverer abonnementer eller tjenester
   - Bruker mottar e-postbekreftelse

## Administrasjonsfunksjoner

Administratorpanelet inkluderer:

- Sjekk av wallet-saldo og serverstatus
- Oversikt over transaksjonshistorikk
- Mulighet for å manuelt bekrefte/avvise betalinger
- Funksjon for å tilbakestille Electrum-tilkobling

## Sikkerhetshensyn

- Electrum-wallet bør kun brukes for å motta betalinger, ikke for å lagre større verdier
- Regelmessig sikkerhetskopiering av wallet-filene er nødvendig
- API-endepunkter er beskyttet med strenge autentiserings- og autorisasjonskrav

## Feilhåndtering

Systemet håndterer følgende feilsituasjoner:

- Tilkoblingstap til Electrum-server (automatisk gjenoppkobling)
- Tidsavbrudd for ubetalt betalingsforespørsel (24 timer)
- Feilaktige eller delvise betalinger (registreres i betalingsloggen)

## Testprosedyrer

For å teste integrasjonen:

1. Aktiver testmodus via `ELECTRUM_TEST_MODE=true`
2. Bruk Electrum i testnet-modus for å simulere betalinger
3. Kjør automatiserte tester med `npm run test:electrum`

## Fremtidige forbedringer

- Støtte for Lightning Network-betalinger
- Automatisk utbetaling til cold storage
- Forbedret betalingsverifisering med Merkle-bevis
- Mulighet for dynamisk justering av gebyrer
- Integrert veksling for automatisk konvertering til fiat-valuta

## Referanser

- [Electrum-dokumentasjon](https://electrum.readthedocs.io/en/latest/)
- [Bitcoin-betalingsbehandling](https://developer.bitcoin.org/devguide/payment_processing.html)
- [Supabase-dokumentasjon](https://supabase.io/docs/)
