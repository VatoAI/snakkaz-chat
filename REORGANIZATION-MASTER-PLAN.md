# 🚀 SNAKKAZ - SYSTEMATISK REORGANISERING PLAN

## 🔍 NÅVÆRENDE PROBLEM

### Loading System Forvirring

- **3+ forskjellige loading implementasjoner**:
  - `StandardLoading.tsx` (har MatrixLoading)
  - `LoadingStates.tsx` (chat-spesifikk)
  - Inline loading states i komponenter
  - Forskjellige animasjoner og stiler

### Filorganisering Problemer

- Komponenter spredt utover
- Inkonsistente navnekonvensjoner
- Manglende kategorisering
- Duplikate implementasjoner

---

## ✨ NY FOLDER STRUKTUR - CLEAN & SYSTEMATISK

```
src/
├── core/                    🏗️ KJERNE SYSTEM
│   ├── ui/                 # UI primitives (loading, buttons, modals)
│   │   ├── loading/        # ALT LOADING SAMLET HER!
│   │   │   ├── MatrixLoading.tsx
│   │   │   ├── LoadingProvider.tsx
│   │   │   ├── LoadingTypes.ts
│   │   │   └── index.ts
│   │   ├── buttons/
│   │   ├── modals/
│   │   └── forms/
│   ├── auth/              # Auth provider & guards
│   ├── hooks/             # Alle custom hooks
│   └── utils/             # Helper functions
│
├── features/              🎯 FEATURE-BASERT ORGANISERING
│   ├── authentication/   # Login, register, profile
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   ├── chat/             # Hele chat systemet
│   │   ├── components/
│   │   │   ├── TelegramKillerChat/
│   │   │   ├── MessageList/
│   │   │   └── ChatInput/
│   │   ├── hooks/
│   │   └── types/
│   ├── dashboard/        # Dashboard widgets
│   ├── marketplace/      # Handelsplattform
│   ├── profile/          # Brukerprofile
│   └── settings/         # Innstillinger
│
├── shared/               🔄 DELT MELLOM FEATURES
│   ├── components/       # Gjenbrukbare komponenter
│   ├── constants/        # App konstanter
│   ├── types/           # TypeScript types
│   └── assets/          # Ikoner, bilder
│
└── pages/               📄 TOP-LEVEL SIDER
    ├── HomePage.tsx
    ├── LoginPage.tsx
    └── DashboardPage.tsx
```

---

## 🎯 STEG-FOR-STEG IMPLEMENTERING

### 📦 FASE 1: LOADING SYSTEM KONSOLIDERING (30 min)

#### Steg 1.1: Opprett Unified Loading System

```bash
mkdir -p src/core/ui/loading
```

#### Steg 1.2: Matrix Loading Som Standard

- Flytt `MatrixLoading.tsx` → `src/core/ui/loading/`
- Lag `LoadingProvider.tsx` for state management
- Lag `LoadingTypes.ts` for alle loading types
- Lag clean export i `index.ts`

#### Steg 1.3: Erstatt Alle Loading Implementasjoner

- Slett `LoadingStates.tsx` (duplikat)
- Oppdater alle imports til ny unified system
- Standardiser alle loading messages

### 📁 FASE 2: FEATURE REORGANISERING (45 min)

#### Steg 2.1: Chat Feature Modul

```bash
mkdir -p src/features/chat/{components,hooks,types}
mv src/components/chat/* src/features/chat/components/
```

#### Steg 2.2: Dashboard Feature Modul

```bash
mkdir -p src/features/dashboard/{components,hooks,types}
mv src/components/dashboard/* src/features/dashboard/components/
```

#### Steg 2.3: Auth Feature Modul

```bash
mkdir -p src/features/authentication/{components,hooks,types}
mv src/auth/* src/features/authentication/
```

### 🧹 FASE 3: CLEANUP & OPTIMIZING (30 min)

#### Steg 3.1: Import Paths Oppdatering

- Oppdater alle import statements
- Lag barrel exports (`index.ts`) i hver modul
- Test at alt kompilerer riktig

#### Steg 3.2: Duplicate Removal

- Identifiser og slett duplikate komponenter
- Konsolider lignende funksjonalitet
- Standardiser navnekonvensjoner

#### Steg 3.3: Performance Optimization

- Lazy loading av features
- Code splitting per modul
- Tree shaking optimization

---

## 🚀 MATRIX LOADING - UNIFIED DESIGN

### Ny LoadingProvider.tsx

```tsx
type LoadingType =
  | "app-startup" // App loading
  | "auth-login" // Login prosess
  | "chat-loading" // Chat initialisering
  | "message-sending" // Sender melding
  | "file-upload" // Fil opplasting
  | "page-transition"; // Side overgang

interface LoadingState {
  type: LoadingType;
  message: string;
  progress?: number;
  isVisible: boolean;
}
```

### Matrix Animasjoner for Hver Type

- **App Startup**: Full-screen matrix med "Krypterer forbindelse..."
- **Auth Login**: Compact matrix med "Autentiserer bruker..."
- **Chat Loading**: Inline matrix med "Laster meldinger..."
- **Message Sending**: Mini matrix med progress
- **File Upload**: Matrix med progress bar

---

## 🎯 FORDELER MED NY STRUKTUR

### ✅ Utvikler-vennlig

- **Feature-basert**: Alt relatert til chat er samlet
- **Flat hierarki**: Maksimalt 3-4 nivåer dyp
- **Klare ansvarsområder**: Hver mappe har ett formål

### ✅ Skalerbar

- **Ny feature**: Bare lag ny mappe i `features/`
- **Ny UI komponent**: Går i `core/ui/`
- **Shared logic**: Går i `shared/`

### ✅ Vedlikeholdbar

- **Ett loading system**: Én kilde til sannhet
- **Konsistente patterns**: Like konvensjoner overalt
- **Type safety**: Bedre TypeScript støtte

---

## 🎬 IMPLEMENTERING I DAG

**Estimert tid**: 1.5-2 timer
**Resultat**: Clean, organisert kodebase klar for produksjon

**Vil du at jeg starter implementeringen? 🚀**

1. **Ja, start med loading system** → Vi fikser Matrix loading først
2. **Ja, full reorganisering** → Vi gjør hele restructureringen
3. **Vis meg mer detaljer først** → Jeg forklarer dypere

Hva sier du? ✨
