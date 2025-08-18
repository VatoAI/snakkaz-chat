# SnakkaZ App Design Prompt 🎨

## Overgripende Visjonsvisjon

Lag komponenter for **SnakkaZ** - en premium, sikker chat-applikasjon med Apple Liquid Glass design og norsk eleganse.

## 🎯 Design Filosofi

**SnakkaZ** er en avansert, kryptert meldingsplattform som kombinerer:

- **Norsk premium kvalitet** - Som Best Buy, men for chat
- **Apple Liquid Glass** - Moderne glassmorfisme med aurora-effekter
- **Sikkerhet først** - End-to-end kryptering som kjerneverdi
- **AI-drevet** - GitHub Copilot MCP-integrasjon
- **Universell tilgjengelighet** - Fungerer perfekt på alle enheter

## 🎨 Visual Identity

### Fargepalett

```css
Primary Colors:
- SnakkaZ Blue: #007AFF (Hovedfarge - Apple Blue)
- SnakkaZ Purple: #5856D6 (Sekundær - AI/Tech vibes)
- SnakkaZ Red: #FF3B30 (Accent - Kritiske handlinger)
- SnakkaZ Green: #34C759 (Suksess - Sikker tilkobling)

Supporting Colors:
- Warning: #FF9500 (Advarsler)
- Background: rgba(13, 13, 13, 0.98) til rgba(25, 25, 35, 0.98)
```

### Aurora Gradient Backgrounds

```css
Primary Aurora:
linear-gradient(135deg,
  rgba(0, 122, 255, 0.2) 0%,    /* SnakkaZ Blue */
  rgba(88, 86, 214, 0.15) 35%,  /* Purple */
  rgba(255, 59, 48, 0.1) 70%,   /* Red accent */
  rgba(52, 199, 89, 0.15) 100%  /* Success green */
)

Secondary Aurora:
linear-gradient(225deg,
  rgba(255, 149, 0, 0.2) 0%,    /* Orange */
  rgba(175, 82, 222, 0.15) 35%, /* Purple variant */
  rgba(0, 122, 255, 0.1) 70%,   /* SnakkaZ Blue */
  rgba(88, 86, 214, 0.15) 100%  /* Tech purple */
)
```

### Typografi

```css
Font Stack:
- Primary: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif
- Code/Tech: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace
```

## 🌟 Liquid Glass Design System

### Glass Effekter

```css
Strong Glass: backdrop-filter: blur(40px) saturate(180%) brightness(105%);
Medium Glass: backdrop-filter: blur(20px) saturate(160%) brightness(102%);
Light Glass: backdrop-filter: blur(10px) saturate(140%) brightness(100%);
```

### Surface Layers

```css
Primary Surface: rgba(255, 255, 255, 0.1)
Secondary Surface: rgba(255, 255, 255, 0.05)
Tertiary Surface: rgba(255, 255, 255, 0.03)
```

### Elevation Shadows

```css
Level 1: 0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.06)
Level 2: 0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)
Level 3: 0 8px 32px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15)
Level 4: 0 16px 48px rgba(0, 0, 0, 0.25), 0 8px 24px rgba(0, 0, 0, 0.2)
```

## 🚀 Komponent Guidelines

### Layout Komponenter

#### Chat Cards/Bubbles

- **Bakgrunn**: `rgba(255, 255, 255, 0.1)` med glassmorfisme
- **Border**: `1px solid rgba(255, 255, 255, 0.2)`
- **Radius**: `16px` for moderne roundness
- **Hover Effect**: Øk opacity til `0.15` og legg til glow
- **Animation**: Smooth `all 0.2s ease-out` transitions

#### Input Fields

- **Base**: Glass surface med `rgba(255, 255, 255, 0.05)`
- **Focus**: Border glow med SnakkaZ blue `#007AFF`
- **Placeholder**: `rgba(255, 255, 255, 0.6)`
- **Text**: `#FFFFFF` for maksimal kontrast

#### Buttons

- **Primary**: SnakkaZ blue gradient med glassmorfisme
- **Secondary**: Glass surface med subtil border
- **Danger**: SnakkaZ red med samme glass-behandling
- **Disabled**: 50% opacity med faded glass effect

### Chat Interface Design

#### Message Bubbles

```css
.snakkaz-message {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 12px 16px;
  max-width: 70%;
  box-shadow: var(--snakkaz-shadow-elevation-1);
}

.snakkaz-message.own {
  background: linear-gradient(
    135deg,
    rgba(0, 122, 255, 0.2),
    rgba(88, 86, 214, 0.15)
  );
  margin-left: auto;
}
```

#### Security Indicators

- **🔒 Kryptert**: Grønn lås-ikon med `#34C759`
- **⚡ MCP Aktiv**: Blå AI-ikon med pulserende animasjon
- **🌐 Tilkoblet**: Grønn prikk med glow-effekt
- **⚠️ Advarsel**: Oransje triangle med `#FF9500`

## 📱 Mobile-First Design

### Breakpoints

```css
Mobile: max-width: 767px
Tablet: 768px - 1023px
Desktop: 1024px+
```

### Touch Targets

- **Minimum**: 44px × 44px (Apple standard)
- **Preferred**: 48px × 48px
- **Spacing**: Minimum 8px mellom interactive elementer

## 🎭 Animasjoner og Interaksjoner

### Micro-Interactions

- **Hover**: `transform: translateY(-2px)` med økt glow
- **Tap/Click**: `transform: scale(0.98)` for 100ms
- **Loading**: Pulserende aurora-effekt
- **Success**: Grønn checkmark med scale-in animasjon

### Transition Timing

```css
Fast: 0.15s ease-out (hover states)
Standard: 0.2s ease-out (general interactions)
Slow: 0.3s ease-out (layout changes)
```

## 🌈 Accessibility & UX

### Kontrast

- **Text på glass**: Minimum 4.5:1 kontrast ratio
- **Icons**: Minimum 3:1 kontrast ratio
- **Focus states**: Synlig outline med SnakkaZ blue

### Dark Mode Only

SnakkaZ bruker kun dark mode for:

- **Bedre sikkerhetsfølelse** - Diskré og profesjonell
- **Batterisparing** på OLED skjermer
- **Redusert øyebelastning** ved langvarig bruk

## 🛡️ Sikkerhet i Design

### Visual Cues

- **End-to-End Kryptering**: Gjennomgående grønn accent
- **Usikre tilkoblinger**: Rød/oransje varsler
- **MCP Status**: Blå AI-indikatorer
- **Admin handlinger**: Distinkte purple accent

### Tillit-byggende elementer

- **Norsk flagg**: Subtil for lokal tillit
- **Krypterings-badges**: Synlige sikkerhetsindikatorer
- **Åpen kildekode**: GitHub-integrasjon som tillitsmerke

## 🎯 Branding Konsistens

### Logo Usage

- **Primær**: "SnakkaZ" i SF Pro Display, medium weight
- **Sekundær**: Med norsk flagg eller krypterings-ikon
- **Minimum størrelse**: 16px høyde for lesbarhet

### Tone of Voice in UI

- **Norsk/Engelsk blanding**: "Sikker chat" / "Secure messaging"
- **Teknisk men tilgjengelig**: Forklarer kryptering enkelt
- **Trygg og profesjonell**: Aldri leken med sikkerhet

## 📦 Component Library Classes

```css
/* Core Classes */
.liquid-glass {
  /* Standard glass morphism */
}
.snakkaz-card {
  /* Chat cards med aurora */
}
.snakkaz-button {
  /* Brand buttons */
}
.snakkaz-input {
  /* Glass input fields */
}
.aurora-bg {
  /* Background aurora effects */
}

/* State Classes */
.encrypted {
  /* Sikker tilstand */
}
.mcp-active {
  /* AI/MCP tilkoblet */
}
.admin-mode {
  /* Admin interface */
}
.mobile-optimized {
  /* Mobile-specific styling */
}
```

## 🎨 Eksempel Komponent Requests

Når du ber om SnakkaZ komponenter, kan du bruke:

**For Chat Interface:**
"/ui Lag en meldingsboble for SnakkaZ med liquid glass effect, krypteringsikon og norsk eleganse"

**For Authentication:**  
"/ui Design en login-skjema for SnakkaZ med aurora gradient, glass morphism og sikkerhetsfokus"

**For Navigation:**
"/ui Opprett en sidebar for SnakkaZ chat med glass effects, MCP-status og norsk design"

---

_Denne design-prompen skal sikre konsistent, premium SnakkaZ-design på tvers av alle komponenter og funksjoner. 🇳🇴✨_
