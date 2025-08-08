# SnakkaZ Chat - Master Prompt Handover

## 🎯 Project Overview

**SnakkaZ** er en premium, produksjonsklar chat/dashboard-applikasjon med norsk branding og avanserte chat-funksjoner. Prosjektet har beveget seg fra demo-stadium til full produksjonsklarhet med fokus på sikkerhet, brukeropplevelse og systematisk utvikling.

### 🔑 Core Requirements

- **Fjern demo-kode**: "fjern demo - vi ønsker snakkaz appen skal være bruker klar og ikke demo klar"
- **SnakkaZ branding**: Ren, moderne design som matcher SnakkaZ-stilen
- **Avanserte chat-funksjoner**: E2EE kryptering, MCP-integrasjon, avatarer, reaksjoner
- **Systematisk arbeidsflyt**: "vi må jobbe systematisk gjennom step by step og la meg bekrefte at alt fungerer før vi går videre"
- **Norsk språk**: All tekst og UI på norsk

## 🏗️ Technical Architecture

### Frontend Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **React Router** for navigasjon
- **Tabler Icons** for ikoner

### Backend Integration

- **Supabase** for autentisering og backend
- **Custom AuthProvider.js** for sesjonshåndtering
- **Real-time** meldinger (planlagt)

### Key Components

```
src/
├── auth/
│   └── AuthProvider.js          # Robust auth context med error handling
├── pages/
│   ├── Login.tsx               # Kun ekte Supabase auth (demo fjernet)
│   └── LiquidDreamMain.tsx     # Hoveddashboard med SnakkaZ design
├── components/
│   └── chat/
│       ├── SnakkaZChat.tsx     # Avansert chat med E2EE/MCP (nylig reparert)
│       └── TelegramStyleChat.tsx # Fallback chat
└── App.tsx                     # Routing og device detection
```

## 🔧 Current State Analysis

### ✅ Completed Tasks

1. **Demo-kode fjernet**: Kun ekte Supabase autentisering
2. **AuthProvider forbedret**: Robust error handling og loading states
3. **LiquidDreamMain refaktorert**: Ren SnakkaZ design, navigasjon, profil
4. **SnakkaZChat reparert**: React Hooks violation fikset, duplicate state fjernet
5. **Server startet**: Vite dev server kjører på port 3001

### 🚧 Partially Complete

1. **Design polish**: Input fields mangler onChange handlers
2. **Chat integration**: TelegramStyleChat vs SnakkaZChat routing
3. **Backend sync**: Profile data saving/loading
4. **Mobile responsiveness**: Desktop/mobile split forbedringer

### ❌ Known Issues (Recently Fixed)

- ~~React Hooks violation i SnakkaZChat.tsx~~
- ~~Duplicate useState declarations~~
- ~~Server startup problems~~
- ~~Black/white/gray screen etter login~~

## 🎨 Design Philosophy

### SnakkaZ Visual Identity

- **Primary**: Blue (#3B82F6) gradient themes
- **Clean**: Minimal, moderne kort-basert layout
- **Consistent**: White backgrounds med subtle borders
- **Interactive**: Hover effects og smooth transitions
- **Norwegian**: All tekst på norsk

### Component Patterns

```tsx
// Standard SnakkaZ card pattern
<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md">
  <div className="flex items-center space-x-4 mb-4">
    <div className="bg-blue-600 rounded-lg p-3">
      <Icon className="text-white" size={24} />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-900">Tittel</h3>
      <p className="text-blue-600 text-sm font-medium">Undertekst</p>
    </div>
  </div>
</div>
```

## 💬 Chat Features Specification

### SnakkaZChat.tsx Features

- **E2EE Encryption**: End-to-end kryptering for alle meldinger
- **MCP Integration**: AI-assistenter (Claude) integrert i chat
- **Rich Interactions**:
  - Reply to messages
  - Edit/delete egen meldinger
  - Emoji reactions
  - Avatarer og status
- **Room System**: Forskjellige chat-rom (Generell, Norsk, Teknologi, AI Assistenter)
- **Quick Start Guide**: Introduksjon for nye brukere
- **Norwegian UI**: Alle labels og meldinger på norsk

### Message Types

```typescript
interface Message {
  id: string;
  text: string;
  user: string;
  userId: string;
  timestamp: Date;
  type: "text" | "mcp" | "system";
  encrypted: boolean;
  replyTo?: string;
  reactions?: Record<string, string[]>;
  avatar?: string;
  mcpAgent?: string;
}
```

## 🔒 Security & Authentication

### Current Auth Flow

1. **Login.tsx**: Supabase email/password (demo login fjernet)
2. **AuthProvider.js**: Session management med robust error handling
3. **ProtectedRoute**: Auth guards for beskyttede sider
4. **Profile Creation**: Auto-generert fra Supabase user metadata

### Profile Structure

```typescript
interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  full_name?: string;
  bio?: string;
  superpower_level: number;
  chat_messages_count: number;
  created_at: string;
}
```

## 🚀 Development Workflow

### Running the Project

```bash
npm run dev  # Starts Vite server on localhost:3001
```

### Key npm Scripts

- `dev`: Development server
- `build`: Production build
- `preview`: Preview production build

### VS Code Tasks

- **npm: dev** task configured for reliable server startup
- Use VS Code tasks instead of terminal for consistency

## 🐛 Debugging Guidelines

### Common Issues & Solutions

1. **React Hooks Violations**

   - All `useState`/`useEffect` must be before conditional returns
   - No duplicate state declarations
   - Fixed in SnakkaZChat.tsx

2. **Auth Loading States**

   - Proper loading indicators in AuthProvider
   - Timeout fallbacks for infinite loading
   - User state validation

3. **Chat Not Loading**
   - Check console for React errors
   - Verify hooks order in SnakkaZChat
   - Ensure TelegramStyleChat vs SnakkaZChat routing

### Error Checking Commands

```typescript
// Check compile errors
get_errors(["/path/to/file.tsx"]);

// Search for patterns
grep_search("useState|useEffect", true);

// Read specific sections
read_file("/path/to/file", startLine, endLine);
```

## 📋 Next Steps Priority

### Immediate Tasks (High Priority)

1. **Test SnakkaZChat loading**: Verify chat works after recent fixes
2. **Add onChange handlers**: Input fields i settings need functionality
3. **Profile saving**: Implement backend sync for profile changes
4. **Chat routing**: Decide TelegramStyleChat vs SnakkaZChat usage

### Medium Priority

1. **Mobile optimization**: Improve responsive design
2. **Real-time backend**: Supabase real-time integration
3. **MCP implementation**: Actual AI assistant integration
4. **E2EE implementation**: Real encryption (currently simulated)

### Future Enhancements

1. **File uploads**: Image/file sharing i chat
2. **Voice messages**: Audio recording/playback
3. **Advanced settings**: Theme customization
4. **Admin panel**: Chat moderation tools

## 🔄 Systematic Workflow

### User's Preferred Process

1. **Step-by-step**: Aldri gjør store endringer på en gang
2. **Confirmation**: La brukeren bekrefte før neste steg
3. **Testing**: Test hver endring før videre utvikling
4. **Norwegian communication**: Kommuniser på norsk
5. **Production focus**: Alltid tenk produksjonsklarhet

### Example Interaction Pattern

```
Agent: "Jeg skal nå fikse input field onChange handlers. Skal jeg fortsette?"
User: "Ja, gjør det systematisk"
Agent: [Makes specific change]
Agent: "onChange handler lagt til for full_name input. Fungerer det? Skal jeg fortsette med bio field?"
```

## 📁 File Structure Guide

### Critical Files (Priority Order)

1. **AuthProvider.js**: Session/user management
2. **LiquidDreamMain.tsx**: Main dashboard og navigation
3. **SnakkaZChat.tsx**: Advanced chat implementation
4. **Login.tsx**: Authentication page
5. **App.tsx**: Routing og app structure

### Recent Changes Log

- ✅ SnakkaZChat.tsx: Fixed React Hooks violation
- ✅ AuthProvider.js: Improved error handling
- ✅ LiquidDreamMain.tsx: SnakkaZ design implementation
- ✅ Removed all demo code from Login.tsx

## 🎯 Success Criteria

### Definition of Done

- [ ] Chat loads and works perfectly after login
- [ ] All input fields have proper onChange handlers
- [ ] Profile data saves to backend
- [ ] No console errors or warnings
- [ ] Mobile responsive design
- [ ] Norwegian text throughout
- [ ] Production-ready security
- [ ] User confirmation at each step

### User Satisfaction Indicators

- "Alt fungerer som forventet"
- "Design matcher SnakkaZ perfectly"
- "Chat er smooth og responsiv"
- "Ingen errors i console"
- "Klar for production deployment"

---

## 🤝 Handover Notes

**Siste status**: SnakkaZChat.tsx er reparert fra React Hooks violation. Server kjører. Chat bør nå laste riktig. Neste steg er å teste chat loading og polere input field functionality.

**Bruker forventer**: Systematisk, step-by-step arbeid med bekreftelse på norsk. Fokus på produksjonsklarhet og SnakkaZ branding.

**Teknisk kontekst**: React + TypeScript + Vite + Supabase stack. Alle hooks må være øverst i komponenter. Bruk VS Code tasks for server startup.

**Testing approach**: Alltid test hver endring før neste steg. Bruk get_errors() for compile-sjekk. Kommuniser status til bruker.
