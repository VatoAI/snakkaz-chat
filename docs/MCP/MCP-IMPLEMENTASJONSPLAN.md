# MCP (Model Context Protocol) Implementeringsplan for Snakkaz Chat

## Oversikt

Model Context Protocol (MCP) er en kraftig protokoll for å gi kontekstuell AI-assistanse i Snakkaz Chat. Denne planen beskriver hvordan vi kan implementere MCP på mcp.snakkaz.com og integrere den med chat-funksjoner for å skape inntektsgenererende AI-funksjonalitet.

## Forretningsmål

1. Tilby AI-assistansetjenester som en premium-funksjon
2. Skape inntektsstrømmer gjennom MCP API-bruk
3. Differensiere Snakkaz Chat fra konkurrenter
4. Øke brukerengasjement og -oppbevaring

## Teknisk Arkitektur

### Infrastruktur

```
                  +-------------------+
                  |   mcp.snakkaz.com |
                  +--------+----------+
                           |
                           v
+-------------+   +--------+----------+   +------------------+
| AI-backend  |<->| MCP API Gateway   |<->| Snakkaz Chat App |
+-------------+   +--------+----------+   +------------------+
                           |
                           v
                  +--------+----------+
                  | Brukerautentisering|
                  | & API-nøkkelstyring|
                  +-------------------+
```

### Komponenter

1. **MCP API Gateway (mcp.snakkaz.com)**
   - REST API-endepunkter for MCP-forespørsler
   - Rate-limiting og kvotehåndtering
   - Proxy til AI-backend

2. **AI-backend**
   - Modellintegrasjon (OpenAI API, Mistral, Anthropic, etc.)
   - Kunnskapsdatabase og vektorlagring
   - Kontekst-håndtering

3. **Brukerautentisering & API-nøkkelstyring**
   - JWT-autentisering integrert med Supabase
   - API-nøkkelgenerering for premium-brukere
   - Brukskvoter og -overvåking

## Implementeringsfaser

### Fase 1: Grunnleggende MCP-infrastruktur (1-2 måneder)

1. **Oppsett av mcp.snakkaz.com**
   - Skaffe domene og SSL
   - Sette opp Node.js/Express API-server
   - Implementere basis autentisering

2. **AI-modellintegrasjon**
   - Integrere med en primær AI-leverandør
   - Implementere konteksthåndtering
   - Sette opp fallback-mekanismer

3. **Grunnleggende API-endepunkter**
   - `/api/v1/chat`: Chat-komplettering
   - `/api/v1/embed`: Tekstinnebygning
   - `/api/v1/moderate`: Innholdsmoderasjon

### Fase 2: Premiumfunksjoner og integrasjon (2-3 måneder)

1. **Snakkaz Chat-app Integrasjon**
   - Implementere MCP-assistentknapp i chat-grensesnitt
   - Utvikle context-aware assistanseforespørsler
   - Legge til Premium-merke for MCP-assisterte svar

2. **Avanserte API-funksjoner**
   - `/api/v1/summarize`: Sammendrag av samtaler
   - `/api/v1/translate`: Oversettelse
   - `/api/v1/analyze`: Sentimentanalyse
   - `/api/v1/search`: Semantisk søk

3. **Premium API-tilgang**
   - Implementere API-nøkkelgenerering i brukerportal
   - Utvikle dokumentasjon for eksterne integrasjoner
   - Sette opp faktureringsgrunnlag

### Fase 3: Monetisering og skalering (3-4 måneder)

1. **Implementere faktureringsmodeller**
   - Pay-as-you-go API-bruk
   - Kvoter basert på abonnementsnivå
   - Sporing og fakturering av API-forbruk

2. **Brukergrensesnitt for API-administrasjon**
   - Dashboard for API-nøkkeladministrasjon
   - Bruksstatistikk og visualisering
   - Kostnadsestimering og faktureringshistorikk

3. **Vertikale Bransjespesifikke Løsninger**
   - Helserelatert AI-assistanse
   - Juridisk AI-assistanse
   - Utdannings-AI-assistanse

## Tekniske Spesifikasjoner

### API-spesifikasjoner

**Eksempel på API-forespørsel:**
```json
POST /api/v1/chat
Authorization: Bearer <jwt_token>
X-API-Key: <api_key>

{
  "messages": [
    { "role": "user", "content": "Hvordan kan jeg forbedre teamkommunikasjonen?" }
  ],
  "context": {
    "user_id": "123",
    "chat_id": "456",
    "conversation_context": "team_management"
  },
  "options": {
    "model": "snakkaz-fast",
    "temperature": 0.7,
    "max_tokens": 500
  }
}
```

**Eksempel på API-respons:**
```json
{
  "id": "mcp-resp-789",
  "created_at": "2025-05-24T12:34:56Z",
  "message": {
    "role": "assistant",
    "content": "For å forbedre teamkommunikasjon kan du...",
    "features": {
      "citations": [...],
      "suggestions": [...]
    }
  },
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 156,
    "total_tokens": 180,
    "cost_nok": 0.09
  }
}
```

### Databaseskjema (Supabase)

```sql
-- API-nøkler for MCP-tilgang
CREATE TABLE mcp_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, name)
);

-- API-brukslogger for fakturering
CREATE TABLE mcp_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key_id UUID REFERENCES mcp_api_keys(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  tokens_used INTEGER NOT NULL,
  cost_nok NUMERIC(10, 4) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API-brukskvoter
CREATE TABLE mcp_user_quotas (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_token_limit INTEGER NOT NULL,
  tokens_used_this_month INTEGER DEFAULT 0,
  reset_date TIMESTAMP WITH TIME ZONE NOT NULL,
  subscription_tier TEXT NOT NULL
);
```

## Inntektsmodell

### Prisstruktur

| Abonnement | MCP Gratis Kvote | Pris per ekstra 1K tokens | Maksimal API forespørsler/min |
|------------|------------------|--------------------------|------------------------------|
| Gratis     | 10,000 tokens/mnd| Ikke tilgjengelig        | 5                            |
| Premium    | 100,000 tokens/mnd| 1,20 kr                  | 30                           |
| Business   | 500,000 tokens/mnd| 0,80 kr                  | 100                          |

### ROI-estimat

Basert på en antakelse om at:
- 5% av gratisbrukere oppgraderer til Premium for MCP-funksjoner
- Gjennomsnittlig Premium-bruker bruker 150,000 tokens/mnd (50,000 tokens over kvoten)
- Gjennomsnittlig Business-bruker bruker 600,000 tokens/mnd (100,000 tokens over kvoten)

**Månedlig inntektsestimat per 1,000 brukere:**
- Premium-abonnement: 50 brukere × 99 kr = 4,950 kr
- Ekstra tokenbruk Premium: 50 brukere × 50,000 tokens × 1,20 kr/1000 tokens = 3,000 kr
- Business-abonnement: 10 brukere × 299 kr = 2,990 kr
- Ekstra tokenbruk Business: 10 brukere × 100,000 tokens × 0,80 kr/1000 tokens = 800 kr
- **Total månedlig inntekt:** 11,740 kr per 1,000 brukere

### Kostnadsmessige hensyn

- Modellhosting og API-kostnader: ~40% av inntekten
- Infrastrukturkostnader: ~15% av inntekten
- Utviklingskostnader: ~20% av inntekten
- Bruttofortjeneste: ~25% av inntekten

## Roadmap

| Tidsperiode | Milepæler |
|-------------|-----------|
| Måned 1     | - Grunnleggende MCP API Gateway<br>- Første AI-modellintegrasjon<br>- Autentiseringssystem |
| Måned 2     | - Chat-integrasjonsendepunkt<br>- Premium-funksjonalitet i Snakkaz Chat<br>- Brukerkvoter |
| Måned 3     | - API-nøkkeladministrasjon<br>- Faktureringsintegrering<br>- Dokumentasjonsportal |
| Måned 4     | - Avanserte funksjoner (oversettelse, analyse)<br>- Dashboards for API-bruk<br>- Vertikal løsningspakke #1 |
| Måned 5     | - Ekstern API-tilgang<br>- Partner-integrasjoner<br>- Vertikal løsningspakke #2 |
| Måned 6     | - Skaleringsoptimalisering<br>- Avansert analyse og innsikt<br>- Selvbetjeningsfunksjonalitet |

## Sikkerhets- og personvernhensyn

1. **Databehandling**
   - Implementer GDPR-kompatibel databehandling
   - Minimer/anonymiser data når mulig
   - Klar dataoppbevaringspolicy

2. **Sikkerhet**
   - Krypter alle data under overføring og i ro
   - Implementer rate limiting og DDoS-beskyttelse
   - Regelmessige sikkerhetsrevisjoner

3. **Personvern**
   - Opt-in for AI-assistanse
   - Transparente datapolicyer
   - Valg for å slette historikk

## Ressursbehov

### Utvikling
- 1 Backend-utvikler med ML-erfaring
- 1 Frontend-/integrasjonsutvikler
- 1 DevOps-ingeniør (deltid)

### Infrastruktur
- Dedikert server eller cloud-instans for MCP API
- Skalerbar databaseløsning
- CDN for API-dokumentasjon

### Markedsføring
- Lanseringskampanje for MCP-funksjoner
- Opplæringsvideo for brukere
- Dokumentasjon og eksempler for utviklere

## Neste steg

1. Gjennomfør teknisk vurdering av AI-modellleverandører
2. Etabler mcp.snakkaz.com infrastruktur
3. Utvikle PoC for chat-integrasjon
4. Begynn API-designprosessen
