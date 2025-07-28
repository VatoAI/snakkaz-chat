# SnakkaZ Chat - Claude Memory System

## Project Overview

SnakkaZ er en avansert norsk chat-applikasjon med enterprise-grade features, utviklet som full-stack løsning med React/TypeScript frontend og comprehensive backend integrasjon.

## Current Status: Production Ready ✅

- 100% Beta Production Ready
- Full Norwegian Enterprise Excellence
- MCP Integration Active & Tested
- PWA Features Implemented
- Security & Encryption Complete
- Live MCP Dashboard & Testing Suite

## Core Architecture

### Frontend Stack

- **Framework**: React 18.3.1 + TypeScript
- **Routing**: React Router DOM 6.30.0
- **Styling**: TailwindCSS + Custom CSS (Liquid Glass Design)
- **State Management**: React Query + Zustand patterns
- **UI Components**: Radix UI + Custom components
- **Animation**: Framer Motion + React Spring

### Backend Integration

- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + Custom JWT
- **Real-time**: Supabase Realtime + WebRTC
- **MCP Server**: Custom implementation med norsk tech knowledge
- **Security**: E2EE encryption, CSP headers, security middleware

### Key Features Status

#### ✅ Authentication System

- Login/Register pages complete
- Email confirmation flow
- Password reset functionality
- OAuth providers integration
- Multi-factor authentication

#### ✅ Chat System

- Basic Chat Page (BasicChatPage)
- Professional Chat (ProfessionalChatPage)
- SnakkaZ Beta Chat (SnakkaZChatBeta)
- AI Chat integration (AIChatPage)
- Real-time messaging
- End-to-end encryption

#### ✅ Group Features

- Group creation (CreateGroupPage)
- Group chat functionality (GroupChatPage)
- Dynamic group management
- Group permissions system

#### ✅ User Management

- Profile system (ProfilePageNew)
- Settings page (SettingsPage)
- Friend system (FriendsPage, FindFriends)
- User dashboard (DashboardPage)

#### ✅ Media & Rich Content

- File upload with Uppy
- Image/video support
- Emoji system integration
- QR code generation
- Real-time reactions

#### ✅ PWA & Mobile

- Service worker implementation
- Offline functionality
- Mobile optimization
- App-like experience
- Push notifications ready

#### ✅ Security & Enterprise

- Digital Vokter AI security
- Admin security panel
- Audit logging
- GDPR compliance
- Security monitoring

## Development Commands

### Core Commands

```bash
# Development server
npm run dev                 # Start dev server på port 5173
npm run dev:network        # Network accessible dev server
npm run dev:mcp            # Start MCP server

# Build & Deploy
npm run build              # Production build
npm run build:prod         # Optimized production build
npm run preview            # Preview build lokalt

# Testing
npm run test               # Unit tests
npm run test:beta          # Beta readiness tests
npm run test:integration   # Integration tests

# Database
npm run supabase:start     # Start lokal Supabase
npm run supabase:status    # Sjekk Supabase status
```

## File Structure Priority

### Critical Files

- `src/App.tsx` - Main app routing og error boundaries
- `src/pages/SnakkaZChatBeta.tsx` - Hovedchat system
- `src/pages/Login.tsx` & `src/pages/Register.tsx` - Auth system
- `src/components/` - Reusable UI components
- `MCP SnakkaZ/` - MCP server implementation

### Database Schema

Located in: `database/schema.sql`, `supabase-schema.sql`

- Users table med profiles
- Messages med encryption
- Groups og group_members
- Files og media storage
- Security audit logs

## Current Development Priorities

### 🔥 Immediate Focus: SnakkaZ Beta Completion

1. **Core App Flow**: Index → Login/Register → Chat → Features
2. **Media Integration**: Complete image/video/emoji system
3. **Group System**: Finalize group chat functionality
4. **Profile Management**: Complete profile editing og settings
5. **Email System**: Confirm email/password reset flows

### Next Features Queue

- Vector database for langtidsminne
- Advanced AI integration
- Real-time collaboration features
- Advanced security features

## Memory Context for Claude

### What Claude Should Remember

- SnakkaZ is production-ready Norwegian chat app
- Main architecture: React + Supabase + MCP
- Focus on Norwegian market og enterprise features
- All core systems implemented og functional
- Current priority: Perfecting Beta experience

### Development Patterns

- Always use TypeScript
- Follow existing code conventions
- Prioritize security og performance
- Maintain Norwegian language support
- Use existing UI components før creating new ones

### Key Integrations

- Supabase for backend services
- MCP server for AI features
- WebRTC for real-time communication
- PWA for mobile-like experience

## Version Control

- Repository: https://github.com/VatoAI/snakkaz-chat
- Main branch: `main`
- Current status: Production deployment ready

---

_Last updated: 2025-07-27_
_Memory system active for continuous development context_
