# Snakkaz Chat Bitcoin/Electrum Payment Integration

Dette dokumentet beskriver Bitcoin/Electrum-integrasjonen som er lagt til i Snakkaz Chat for å støtte kryptovalutabetalinger i monetiseringsstrategien.

## Oversikt

Snakkaz Chat støtter nå Bitcoin-betalinger gjennom integrasjon med Electrum Bitcoin Wallet. Dette lar brukere betale for premium-tjenester med Bitcoin, inkludert:

- Premium e-postkonto og webmail
- Ekstra lagringskapasitet
- API-tilgang og andre betalte tjenester

## Funksjonalitet

- **Generering av betalingsadresser**: Automatisk generering av unike Bitcoin-adresser for hver betaling
- **Betalingsverifisering**: Automatisk verifisering av Bitcoin-transaksjoner
- **Abonnementshåndtering**: Aktivering av tjenester når betaling er bekreftet
- **Administratorpanel**: Oversikt og administrasjon av Bitcoin-transaksjoner
- **Sikkerhetskopi**: Automatisk backup av wallet og transaksjonscache

## Teknisk implementasjon

### Komponenter

1. **ElectrumConnector**: Håndterer kommunikasjon med Electrum wallet-serveren
2. **BitcoinElectrumAdapter**: Adapter mellom betalingssystemet og Electrum
3. **ElectrumPaymentProcessor**: Bakgrunnstjeneste som sjekker betalinger
4. **API-endepunkter**: For betalingshåndtering og administrasjon

### Konfigurasjon

Før du kan bruke Bitcoin-betalinger, må du sette opp følgende:

1. Installer Electrum Bitcoin Wallet på serveren
2. Kopier `electrum.config.sample` til `.env.local` og juster verdiene
3. Sørg for at databasen har riktige skjemaer (kjør `database/electrum_integration.sql`)
4. Start serveren med `ENABLE_ELECTRUM_PAYMENTS=true`

## Bruk

### For brukere

1. Velg Bitcoin som betalingsmetode ved kjøp av premium-tjenester
2. Scan QR-kode eller bruk Bitcoin-adressen til å sende betaling
3. Vent på bekreftelser (vanligvis 3-6 minutter)
4. Tjenesten aktiveres automatisk når betalingen er bekreftet

### For administratorer

1. Gå til adminpanelet under `/admin/electrum`
2. Sjekk wallet-status og saldo
3. Se oversikt over transaksjoner og betalinger
4. Håndter eventuelle problemer med transaksjoner manuelt om nødvendig

## Sikkerhet

Bitcoin-integrasjonen benytter følgende sikkerhetsprinsipper:

- **Unik adresse** for hver betaling
- **Minimum 3 bekreftelser** før en betaling aksepteres
- **Kun motta-funksjonalitet** (ingen utgående transaksjoner fra UI)
- **Tilgangskontroll** på alle administrative funksjoner

## Fremtidig utvikling

- Støtte for Lightning Network
- Automatisk konvertering til fiat-valuta
- Flere kryptovalutaer (Ethereum, Monero, etc.)
- Forbedret rapportering og statistikk

## Referanser

- [Komplett implementasjonsguide](./docs/Premium/ELECTRUM-BITCOIN-INTEGRATION-GUIDE.md)
- [Betalingstjeneste API-dokumentasjon](./docs/API/payment-service-api.md)
- [Electrum dokumentasjon](https://electrum.readthedocs.io/)
