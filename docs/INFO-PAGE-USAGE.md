# Informasjonsside for Snakkaz Chat

Dette dokumentet beskriver hvordan informasjonssiden for Snakkaz Chat er implementert og hvordan den kan tilpasses eller utvides.

## Oversikt

Informasjonssiden (`/info`) gir brukerne en oversikt over Snakkaz Chat-applikasjonens funksjoner, fordeler og abonnementsalternativer. Siden er tilgjengelig for både innloggede og uinnloggede brukere, slik at potensielle nye brukere kan lære mer om tjenesten.

## Tilgang til informasjonssiden

Det er lagt til lenker til informasjonssiden fra følgende steder:

1. **Påloggingssiden** - Lenke i bunnteksten: "Mer om Snakkaz Chat"
2. **Registreringssiden** - Lenke i bunnteksten: "Mer om Snakkaz Chat"
3. **Hovednavigasjonen** - For innloggede brukere (via Layout.tsx)

## Innhold på informasjonssiden

Informasjonssiden inneholder følgende seksjoner:

1. **Om Snakkaz** - En generell introduksjon til Snakkaz Chat med fokus på sikkerhet og personvern
2. **Premium abonnement** - Beskrivelse av abonnementsalternativene (Basis, Pro og Business)
3. **Nye forbedringer** - De nyeste funksjonene og forbedringene som er lagt til
4. **Hvorfor velge oss** - Unike salgsargumenter for tjenesten

## Vedlikehold og oppdatering

### For å oppdatere innhold

Endre innholdet direkte i `/src/pages/Info.tsx`. Siden er bygget med en komponentbasert struktur, så det er enkelt å legge til, fjerne eller endre seksjoner.

### For å legge til nye seksjoner

1. Kopier en eksisterende seksjonskomponent
2. Endre overskrift, stil og innhold
3. Legg den til i den relevante rekkefølgen i komponenten

### For å endre design

De fleste stilelementer er definert direkte i Info.tsx-filen med Tailwind CSS-klasser og inline-stil. Nøkkelelementer inkluderer:

- Gradientbakgrunner for seksjoner
- Tekstfarger og -størrelser
- Ikoner fra Lucide React

## Abonnementsinformasjon

Abonnementsinformasjonen viser de ulike abonnementsalternativene:

- **Basis** - 99 kr/mnd - Grunnleggende funksjoner for enkeltbrukere
- **Pro** - 199 kr/mnd - Utvidede funksjoner inkludert @snakkaz.com-adresser
- **Business** - Kontakt salg - Enterprise-funksjoner for organisasjoner

Hvis abonnementsprisene eller -funksjonene endres, må dette oppdateres i Info.tsx.

## Knapper og navigasjon

Informasjonssiden inkluderer knapper for:

- Registrering
- Innlogging
- Oppgradering til premium (lenker til /subscription)

Sørg for at disse lenkene forblir oppdaterte hvis URL-ene endres.

## Tilpasning for markedsføringskampanjer

Ved spesielle kampanjer eller lanseringer kan informasjonssiden tilpasses for å fremheve nye funksjoner eller tilbud:

1. Legg til en ny seksjon øverst på siden
2. Bruk fremtredende farger og ikoner for å tiltrekke oppmerksomhet
3. Inkluder tydelige handlingsoppfordringer

## Språk og lokalisering

For å støtte flere språk, se mekanismene for lokalisering i prosjektet. I utgangspunktet er informasjonssiden på norsk, men kan enkelt oversettes ved hjelp av prosjektets lokaliseringsrammeverk.
