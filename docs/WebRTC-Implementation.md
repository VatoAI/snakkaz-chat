# WebRTC-implementasjon i SnakkaZ Chat

Dette dokumentet beskriver implementasjonen av WebRTC-funksjonalitet i SnakkaZ Chat-applikasjonen. WebRTC gir mulighet for direkte bruker-til-bruker kommunikasjon med ende-til-ende-kryptering og lavere latens enn server-baserte løsninger.

## Arkitektur

WebRTC-implementasjonen i SnakkaZ Chat følger en lagdelt arkitektur:

1. **WebRTCManager**: Kjernen i systemet, håndterer alle WebRTC-tilkoblinger, datakanaler, og kryptert kommunikasjon.
2. **Hooks**: React hooks for å binde WebRTC-funksjonalitet til UI-komponenter.
3. **Signalering**: Supabase-basert signaleringskanal for å etablere WebRTC-tilkoblinger.
4. **UI-komponenter**: Statusindikatorer og monitorering av WebRTC-tilkoblinger.
5. **Integrert meldingssystem**: Kombinerer WebRTC-direktemeldinger med server-lagret historikk.

## Komponentene i systemet

### WebRTC Core

- **WebRTCManager** (`src/utils/webrtc/webrtc-manager.ts`): Hovedklasse for WebRTC-funksjonalitet.
  - Håndterer oppretting av peer connections
  - Konfigurerer og håndterer datakanaler
  - Implementerer ende-til-ende-kryptering
  - Håndterer tilkoblingsstatuser og fallback til server

### React Hooks

- **useWebRTC** (`src/hooks/useWebRTC.ts`): Gir tilgang til WebRTCManager-instansen og grunnleggende funksjoner.
- **useSignaling** (`src/hooks/useSignaling.ts`): Håndterer signalering mellom brukere for å etablere WebRTC-tilkoblinger.
- **useWebRTCDirectMessaging** (`src/hooks/useWebRTCDirectMessaging.ts`): Kobler WebRTC til direktemeldinger.
- **useIntegratedChat** (`src/hooks/useIntegratedChat.ts`): Kombinerer WebRTC med tradisjonelle server-meldinger.
- **useWebRTCMonitoring** (`src/hooks/useWebRTCMonitoring.ts`): Gir tilgang til WebRTC-overvåkingsfunksjonalitet.

### UI-komponenter

- **WebRTCStatus** (`src/components/chat/WebRTCStatus.tsx`): Viser gjeldende WebRTC-tilkoblingsstatus.
- **WebRTCDirectChat** (`src/components/chat/WebRTCDirectChat.tsx`): UI for direktemeldinger med WebRTC.
- **ChatContainer** (`src/components/chat/ChatContainer.tsx`): Container for chat med integrert WebRTC.
- **WebRTCMonitor** (`src/components/chat/WebRTCMonitor.tsx`): Avansert overvåking av WebRTC-tilkoblinger.

## Automatisk fallback

En nøkkelfunksjon i implementasjonen er automatisk fallback til server-basert meldingsutveksling når WebRTC ikke er tilgjengelig:

1. Systemet prøver først å etablere en WebRTC-tilkobling.
2. Hvis det feiler etter et angitt antall forsøk, brukes server-basert kommunikasjon.
3. Alle meldinger lagres i databasen uansett, for å sikre meldingshistorikk.
4. Systemet forsøker periodisk å gjenopprette WebRTC-tilkoblingen.

## Sikkerhetsfunksjoner

- **Ende-til-ende-kryptering**: Alle WebRTC-meldinger krypteres ende-til-ende.
- **Nøkkelutveksling**: Sikker nøkkelutveksling for kryptering via signalering.
- **Statusindikatorer**: Visuelle indikatorer for å vise brukerne om kommunikasjonen er kryptert.

## Fordeler med WebRTC i SnakkaZ Chat

1. **Sikkerhet**: Ende-til-ende-krypterte meldinger.
2. **Ytelse**: Lavere latens enn server-baserte løsninger.
3. **Robusthet**: Automatisk fallback til server når nødvendig.
4. **Kostnadseffektivt**: Reduserer server-belastning for meldingstrafikk.

## Integrering i eksisterende chat-system

WebRTC-funksjonaliteten er designet for å integreres sømløst med det eksisterende chat-systemet i SnakkaZ:

- Delt meldingshistorikk mellom WebRTC og server.
- Konsistent brukeropplevelse uavhengig av transportlag.
- Automatisk håndtering av meldingskø ved tilkoblingsproblemer.
- Leveringsbekreftelser og leste statusoppdateringer.

---

## Implementasjonsnotater

### Neste steg

- Fullstendig testing i ulike nettverksmiljøer.
- Implementering av gruppesamtaler med mesh-nettverk eller SFU.
- Optimalisering av mediaoverføring for lyd og video.
- Utvide overvåkingsverktøyene for bedre feilsøking.
