# SnakkaZ Chat - WebRTC Implementasjon

Dette området av SnakkaZ Chat håndterer WebRTC-funksjonaliteten for direkte peer-to-peer kommunikasjon mellom brukere. WebRTC muliggjør raskere, sikrere og mer privat meldingsutveksling ved å eliminere behovet for å gå via serveren når det er mulig.

## Fordeler med WebRTC i SnakkaZ Chat

- **Direkte P2P-kommunikasjon** - Meldinger går direkte mellom brukere uten å gå via serveren
- **Ende-til-ende-kryptering** - Meldinger er kryptert på avsenderenheten og dekryptert kun på mottakerenheten
- **Lavere forsinkelse** - Redusert latens sammenlignet med server-mediert kommunikasjon
- **Redusert serverbelastning** - Flytter trafikk fra våre servere til direktekommunikasjon
- **Økt personvern** - Meldingsinnhold er ikke tilgjengelig for serveren

## Arkitektur

Vår WebRTC-implementasjon består av følgende hovedkomponenter:

1. **Signaleringstjeneste** - Bruker Supabase Realtime for å utveksle tilkoblingsinformasjon
2. **P2P-tilkoblingsmodul** - Håndterer oppretting og vedlikehold av direkte tilkoblinger
3. **Krypteringsmodul** - Implementerer ende-til-ende-kryptering for meldinger
4. **Fallback-mekanisme** - Bytter sømløst til server-basert kommunikasjon når P2P ikke er mulig

### Filstruktur

```
src/
├── components/
│   └── chat/
│       ├── WebRTCStatus.tsx         # UI-komponent for å vise tilkoblingsstatus
│       └── WebRTCMonitor.tsx        # Avansert monitor for debugging/diagnostikk
├── hooks/
│   ├── useWebRTC.ts                # Hovedkrok for WebRTC-funksjonalitet
│   └── useSignaling.ts             # Krok for signalering via Supabase
├── services/
│   └── webrtc/
│       ├── connection.ts           # P2P-tilkoblingslogikk
│       ├── encryption.ts           # Ende-til-ende-krypteringstjeneste
│       ├── signaling.ts            # Signaleringstjeneste
│       └── fallback.ts             # Fallback-logikk til server
└── types/
    └── webrtc.ts                  # TypeScript-typer for WebRTC
```

## Bruk av WebRTC i SnakkaZ

WebRTC-funksjonaliteten er integrert i chatten og krever ingen spesiell håndtering fra brukeren. Systemet vil automatisk:

1. Forsøke å etablere direkte P2P-tilkoblinger når det er mulig
2. Falle tilbake til server-basert kommunikasjon når P2P ikke er mulig
3. Vise tilkoblingsstatus til brukeren (P2P eller server)
4. Håndtere krypteringsnøkler og sikkerhets-handshakes

## Testing og Feilsøking

For å teste og feilsøke WebRTC-funksjonalitet, har vi laget følgende verktøy:

```bash
# Kjør WebRTC testscript
./snakkaz-webrtc-test.sh
```

Dette scriptet vil kjøre diagnostikk, sjekke tilkoblinger til STUN-servere, og teste WebRTC-funksjonalitet i applikasjonen.

For mer avansert feilsøking, bruk WebRTCMonitor-komponenten som kan aktiveres i utviklermodus:

```tsx
// Aktiver WebRTC-monitor i en komponent
<WebRTCMonitor 
  peerConnection={peerConnection}
  isUsingFallback={isUsingFallback}
  isEncrypted={isEncrypted}
  isVisible={true}
/>
```

## Kompatibilitet

WebRTC er støttet i alle moderne nettlesere:

- Chrome 28+
- Firefox 22+
- Safari 11+
- Edge 12+
- Opera 18+
- Chrome for Android
- Firefox for Android
- Safari iOS 11+

For eldre nettlesere eller miljøer der WebRTC er blokkert, vil vår fallback-mekanisme sørge for at meldinger fortsatt leveres via server.

## Teknisk Dokumentasjon

For mer detaljert teknisk informasjon, se følgende dokumenter:

- [WebRTC Implementasjon](./docs/webrtc-implementation.md)
- [WebRTC Sjekkliste](./docs/webrtc-checklist.md)

## Sikkerhetshensyn

WebRTC-implementasjonen vår følger beste praksis for sikkerhet:

1. **Ende-til-ende-kryptering** - Meldinger er kryptert på klientsiden
2. **Sikker nøkkelutveksling** - Bruk av WebCrypto API for kryptonøkler
3. **Ingen lagring av krypteringsnøkler** - Nøkler eksisterer kun i minnet
4. **IP-adressebeskyttelse** - Bruk av TURN-server når nødvendig for å skjule klientens IP

## Fremtidig Utvikling

Planlagte forbedringer for WebRTC-implementasjonen:

1. Støtte for gruppechat via WebRTC mesh-nettverk
2. Integrert lyd/video-funksjonalitet
3. Filoverføring direkte mellom peers
4. Ytterligere optimalisering av krypteringsalgoritmer
5. Implementering av egne TURN-servere

## Kontakt

Ved spørsmål eller problemer relatert til WebRTC-implementasjonen, kontakt utviklingsteamet på dev@snakkaz.com
