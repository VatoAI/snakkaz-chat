# CUSTOM EMOJI SYSTEM FOR SNAKKAZ CHAT

## OVERSIKT
Dette dokumentet beskriver det implementerte systemet for egendefinerte emojier (custom emojis) i Snakkaz Chat-applikasjonen. Systemet muliggjør opplasting, administrering og bruk av brukerdefinerte emojier i chat-meldinger og reaksjoner.

## KOMPONENTER OG ARKITEKTUR

### Datamodell
```typescript
// CustomEmoji interface (fra useCustomEmojis.ts)
export interface CustomEmoji {
  id: string;
  shortcode: string;
  name: string;
  url: string;
  category: string;
  isAnimated: boolean;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  usage: number;
  isFavorite: boolean;
}
```

### Database-tabeller
1. **`custom_emojis`**: Lagrer metadata om egendefinerte emojier
   - `id`: Unik identifikator
   - `shortcode`: Emoji-kode (f.eks. `:party:`)
   - `name`: Visningsnavn
   - `url`: URL til emoji-bildet
   - `category`: Emoji-kategori
   - `is_animated`: Om emojien er animert
   - `is_public`: Om emojien er tilgjengelig for alle
   - `created_by`: Bruker-ID til skaperen
   - `created_at`: Tidsstempel for opprettelse
   - `usage`: Antall ganger emojien er brukt
   - `is_favorite`: Om emojien er lagt til favoritter

2. **`message_reactions`**: Kobler emojier til meldinger som reaksjoner
   - `id`: Unik identifikator
   - `message_id`: ID til meldingen
   - `emoji`: Emoji eller shortcode
   - `user_id`: Bruker-ID til den som reagerte
   - `is_custom`: Om det er en egendefinert emoji
   - `created_at`: Tidsstempel for reaksjonen

### React Hooks
1. **`useCustomEmojis`**: Hovedhook for administrering av egendefinerte emojier
   - Henter egendefinerte emojier fra databasen
   - Funksjonalitet for å legge til nye emojier
   - Slette egendefinerte emojier
   - Favorittmerking av emojier
   - Sporing av bruksstatistikk

2. **`useEmojiReactions`**: Hook for håndtering av emoji-reaksjoner
   - Legge til reaksjoner på meldinger
   - Fjerne reaksjoner
   - Håndtering av både standard og egendefinerte emojier

### Utility-funksjoner
Filsti: `/src/utils/customEmojiUtils.ts`

Inneholder hjelpefunksjoner for:
- Prosessering av emoji-koder i tekst
- Konvertering mellom emoji-formater
- Søk og filtrering av emojier
- Rendering av egendefinerte emojier
- Formattering av reaksjonsdata for API

### React-komponenter
1. **`CustomEmojiDisplay`**: Komponent for visning av individuelle egendefinerte emojier
   - Støtter forskjellige størrelser
   - Håndterer animerte emojier
   - Fallback når emojier ikke finnes

2. **`MessageTextWithEmojis`**: Komponent for visning av tekst med egendefinerte emojier
   - Parser tekst for å finne emoji-koder (`:kode:`)
   - Erstatter emoji-koder med emoji-bilder

3. **`MessageReactions`**: Viser og håndterer reaksjoner på meldinger
   - Visning av eksisterende reaksjoner med antall
   - Grensesnitt for å legge til og fjerne reaksjoner
   - Støtter både standard og egendefinerte emojier

4. **`CustomEmojiManager`**: Administrasjonsgrensesnitt for egendefinerte emojier
   - Opplasting av nye emojier
   - Redigering av eksisterende emojier
   - Kategorisering og favorittmerking
   - Håndtering av private vs. offentlige emojier

## BRUKERVEILEDNING

### Bruk i meldinger
1. Brukere kan skrive emoji-koder i teksten, f.eks. `:party:`
2. `MessageTextWithEmojis`-komponenten vil automatisk erstatte disse kodene med emoji-bilder
3. Animerte emojier vil animeres når de vises

### Reaksjoner på meldinger
1. Hver melding viser eksisterende reaksjoner med antall
2. Brukere kan legge til reaksjoner via quick-reaction menyen eller emoji-pickeren
3. Egendefinerte emojier er tilgjengelige i en egen fane i emoji-pickeren
4. Brukere kan fjerne sine egne reaksjoner ved å klikke på dem

### Administrering av egendefinerte emojier
1. Åpne "Custom Emoji Manager" fra emoji-pickeren
2. Last opp nye emojier (støtter PNG, GIF for animerte emojier)
3. Definere shortcode, navn og kategori
4. Sette om emojien skal være offentlig eller privat
5. Favorittmerke emojier for rask tilgang

## TEKNISKE DETALJER

### Støttede filformater
- PNG: Statiske emojier
- GIF: Animerte emojier
- JPEG: Støttes, men anbefales ikke på grunn av tap av transparens
- WebP: Støttes for moderne nettlesere

### Størrelsesbegrensninger
- Maksimal filstørrelse: 5MB
- Anbefalt størrelse: 128x128 piksler

### Shortcode-konvensjoner
- Må være minst 2 tegn
- Kan kun inneholde små bokstaver, tall og understrek
- Eksempel: `:party_time:`, `:snakkaz:`, `:thumbs_up2:`

### Lagring
- Emoji-bilder lagres i Supabase Storage bucket: `custom-emojis`
- Bilder får et unikt filnavn basert på bruker-ID, shortcode og tidsstempel

### Caching
- Emojier caches på klientsiden for å redusere nettverkstrafikk
- Bruk av browser caching for emoji-bilder

## SIKKERHET OG YTELSE

### Sikkerhetshensyn
- Filvalidering ved opplasting
- Kun autentiserte brukere kan laste opp emojier
- Brukere kan kun slette egne emojier (med mindre de er administratorer)
- Content Security Policy tillater kun bilder fra pålitelige kilder

### Ytelsesoptimalisering
- Lazy loading av emoji-bilder
- Størrelsesoptimalisering av opplastede bilder
- Caching av emoji-data i React state
- Bruk av IndexedDB for offline støtte (planlagt feature)

## IMPLEMENTERTE FORBEDRINGER

### Emoji-søk og kategorisering
Avansert søkefunksjonalitet for emojis er nå implementert med følgende egenskaper:
- Søk basert på shortcode, navn og kategori
- Relevans-baserte søkeresultater
- Tabber for favoritter, nylig brukte og kategorier
- Automatisk vekting av søkeresultater basert på bruksmønster

### Emoji-analytics
Systemet sporer nå detaljert bruksstatistikk for emojis:
- Antall ganger en emoji er brukt i meldinger vs. reaksjoner
- Antall unike brukere som har brukt en emoji
- Tidsbasert analyse av emoji-bruk
- Populære emojis over tid
- Lagring av bruksdata i egne `emoji_analytics`-tabell

## IMPLEMENTERTE FORBEDRINGER (OPPDATERING)

### Emoji-pakker
Systemet støtter nå emoji-pakker som lar brukere:
- Utforske tilgjengelige emoji-pakker i en pakke-browser
- Installere flere emojier samtidig fra en pakke
- Lage egne pakker fra sine egendefinerte emojier
- Dele emojier med andre brukere via pakker

Emoji-pakkesystemet inneholder:
- Databasetabeller for pakker og emoji-referanser
- API for å behandle pakke-administrasjon
- Brukergrensesnitt for utforsking og installasjon
- Integrering med det eksisterende emoji-systemet

### Emoji Analytics
Det fullstendige analytics-systemet tilbyr nå:
- Visualisering av emoji-brukstrender over tid
- Dashboard for å vise mest brukte emojier
- Statistikk over bruk i meldinger vs. reaksjoner
- Sporing av unike brukere per emoji

### Emoji-søk og kategorisering
- Avansert søkefunksjonalitet med relevansrangering
- Kategorisert visning av emojier
- Separate visninger for favoritter og nylig brukte
- Visuell indikasjon på bruksmønster

## FREMTIDIGE FORBEDRINGER

1. **Animasjonskontroll**: Mulighet for å deaktivere animerte emojier
2. **Offline-støtte**: Caching av ofte brukte emojier for offline bruk
3. **Administrasjonsverktøy**: Utvidede verktøy for administratorer for å moderere egendefinerte emojier
4. **Emoji-forslag**: AI-drevet forslag av relevante emojier basert på meldingstekst

---

_Dokumentasjon sist oppdatert: 25. mai 2025_
