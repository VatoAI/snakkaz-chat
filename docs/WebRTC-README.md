# WebRTC i SnakkaZ Chat

Dette prosjektet integrerer WebRTC-teknologi i SnakkaZ Chat-plattformen for å tilby ende-til-ende-kryptert direktemeldingsfunksjonalitet med lav latens.

## Funksjoner

- 🔒 **Ende-til-ende-kryptert kommunikasjon** - Alle meldinger er kryptert og kan kun leses av avsender og mottaker
- ⚡ **Lav latens** - Direkte bruker-til-bruker kommunikasjon uten server-mellomsteg
- 🔄 **Automatisk fallback** - Sømløs overgang til server når WebRTC ikke er tilgjengelig
- 📊 **Avansert monitorering** - Verktøy for overvåking og debugging av WebRTC-tilkoblinger
- 🧩 **Enkel integrering** - React hooks for enkel implementasjon i nye komponenter

## Komme i gang

### 1. Installer avhengigheter

```bash
npm install
```

### 2. Konfigurer miljøvariabler

Opprett en `.env.local` fil i prosjektets rotmappe med følgende innhold:

```env
# WebRTC config
VITE_ICE_SERVERS='[{"urls":"stun:stun.cloudflare.com:3478"},{"urls":"stun:stun.l.google.com:19302"}]'

# Supabase config for signalering
VITE_SUPABASE_URL=din-supabase-url
VITE_SUPABASE_ANON_KEY=din-supabase-anon-key
```

### 3. Kjør utviklingsserveren

```bash
npm run dev
```

## Mappestruktur

```plaintext
src/
├── components/
│   └── chat/
│       ├── WebRTCStatus.tsx     # Tilkoblingsstatusindikator
│       ├── WebRTCDirectChat.tsx # Direktemelding-komponent
│       ├── ChatContainer.tsx    # Container for integrert chat
│       └── WebRTCMonitor.tsx    # Overvåkingsverktøy
│
├── hooks/
│   ├── useWebRTC.ts             # Hovedhook for WebRTC-funksjonalitet
│   ├── useSignaling.ts          # Hook for WebRTC-signalering
│   ├── useWebRTCDirectMessaging.ts # Hook for direktemeldinger
│   ├── useIntegratedChat.ts     # Hook for integrert chat
│   ├── useWebRTCMonitoring.ts   # Hook for overvåking
│   └── webrtc-hooks.ts          # Hook-eksport fil
│
├── utils/
│   └── webrtc/
│       └── webrtc-manager.ts    # WebRTC kjernefunksjonalitet
│
└── docs/
    ├── WebRTC-Implementation.md # Implementasjonsdokumentasjon
    └── WebRTC-Integration-Guide.md # Integrasjonsguide
```

## Teknisk dokumentasjon

Se følgende filer for detaljert dokumentasjon:

- [WebRTC Implementasjon](./docs/WebRTC-Implementation.md)
- [WebRTC Integrasjonsguide](./docs/WebRTC-Integration-Guide.md)

## Implementasjonsdetaljer

### WebRTC-arkitektur

SnakkaZ Chat bruker en lagdelt arkitektur for WebRTC:

1. **Kjerne**: WebRTCManager-klassen håndterer alle WebRTC-tilkoblinger og datakanaler
2. **Signalering**: Supabase real-time kanaler brukes for signalering
3. **React Hooks**: Egne hooks tilbyr enkel tilgang til WebRTC-funksjonalitet
4. **UI-komponenter**: Status- og chatkomponenter for sluttbrukere
5. **Overvåking**: Verktøy for debugging og ytelsesovervåking

### Automatisk fallback

Systemet har en robust fallback-mekanisme:

1. Prøver først å etablere en WebRTC peer-to-peer tilkobling
2. Hvis tilkoblingen mislykkes etter X forsøk, går den over til server-basert kommunikasjon
3. Meldinger sendt mens brukeren er offline køes og sendes når tilkoblingen gjenopprettes
4. Systemet forsøker periodisk å gjenopprette WebRTC-tilkoblingen

### Kryptering

All WebRTC kommunikasjon er ende-til-ende-kryptert:

1. WebRTC DataChannel sikrer naturlig ende-til-ende-kryptering
2. Ekstra krypteringslag er implementert for å sikre meldingsinnhold
3. Krypteringsnøkler utveksles under signaleringsprosessen
4. Visuell indikasjon viser brukere om kommunikasjonen er kryptert

## Fremtidige forbedringer

- [ ] Legg til støtte for gruppesamtaler med mesh-nettverk
- [ ] Implementer lyd- og videosamtaler
- [ ] Utvide overvåkingsverktøy med mer detaljert statistikk
- [ ] Optimaliser for mobile enheter og dårlige nettverksforbindelser
- [ ] Legg til flere TURN-servere for bedre NAT-traversering

## Bidra

Bidrag er velkomne! Se [CONTRIBUTING.md](./CONTRIBUTING.md) for hvordan du kan bidra.

## Lisens

Dette prosjektet er lisensiert under MIT-lisensen - se [LICENSE](./LICENSE) filen for detaljer.
