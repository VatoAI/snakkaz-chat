# 🚀 SnakkaZ Enhanced MCP API - Third-Party Integration

## 🎯 Oversikt

SnakkaZ Enhanced MCP API Server gir robust API-nøkkel autentisering for tredjeparter som ønsker å integrere med SnakkaZ MCP-systemet.

## ✨ Nye funksjoner

### 🔑 API Key Management

- **Sikre API-nøkler**: `sk_snakkaz_...` format
- **Tillatelsessystem**: read, chat, analytics, admin
- **Rate limiting**: 1000 requests/15 min for API-brukere
- **Usage tracking**: Statistikk og overvåking

### 🛠️ Endpoints for tredjeparter

```bash
# Public endpoints (ingen API-nøkkel påkrevd)
GET  /api/health              # System status
GET  /api/mcp/info            # MCP server info
POST /api/beta-signup         # Beta registrering

# Protected endpoints (API-nøkkel påkrevd)
POST /api/mcp/chat           # Chat processing
GET  /api/mcp/tools          # Tilgjengelige MCP tools
GET  /api/mcp/status         # MCP system status
GET  /api/stats              # Registrerings-statistikk

# Admin endpoints (admin API-nøkkel påkrevd)
POST /api/keys/generate      # Generer ny API-nøkkel
GET  /api/keys/list          # List alle API-nøkler
GET  /api/export             # Eksporter data
```

## 🚀 Setup for mcp.snakkaz.com

### 1. Upload filer

```bash
# Last opp til server
scp -r mcp-api-server-enhanced/ user@server:/var/www/mcp-api/
cd /var/www/mcp-api/
npm install
```

### 2. Start serveren

```bash
# Med PM2 (anbefalt)
pm2 start server.js --name snakkaz-mcp-enhanced
pm2 save
pm2 startup

# Eller direkte
npm start
```

### 3. Første oppstart

Serveren lager automatisk en admin API-nøkkel ved første oppstart:

```
🔐 DEFAULT ADMIN KEY CREATED:
   Key: sk_snakkaz_abc123def456...
   ⚠️  Save this key securely!
```

## 🔑 API Key Usage

### Generere ny API-nøkkel

```bash
curl -X POST https://mcp.snakkaz.com/api/keys/generate \
  -H "X-API-Key: sk_snakkaz_admin_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "third-party-mcp-server",
    "permissions": ["read", "chat"]
  }'
```

### Bruke API-nøkkel

```bash
# Med X-API-Key header
curl -H "X-API-Key: sk_snakkaz_your_key_here" \
     https://mcp.snakkaz.com/api/mcp/status

# Eller med Authorization header
curl -H "Authorization: Bearer sk_snakkaz_your_key_here" \
     https://mcp.snakkaz.com/api/mcp/tools
```

## 🔗 Integrere med andre MCP servere

### Eksempel: Koble MCP Server til SnakkaZ

```javascript
const axios = require("axios");

class SnakkaZMCPClient {
  constructor(apiKey, baseUrl = "https://mcp.snakkaz.com/api") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.headers = {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    };
  }

  async sendMessage(message, userId, context = {}) {
    const response = await axios.post(
      `${this.baseUrl}/mcp/chat`,
      {
        message,
        userId,
        context,
      },
      { headers: this.headers }
    );

    return response.data;
  }

  async getTools() {
    const response = await axios.get(`${this.baseUrl}/mcp/tools`, {
      headers: this.headers,
    });
    return response.data.tools;
  }

  async getStatus() {
    const response = await axios.get(`${this.baseUrl}/mcp/status`, {
      headers: this.headers,
    });
    return response.data;
  }
}

// Bruk
const snakkaz = new SnakkaZMCPClient("sk_snakkaz_your_key_here");

// Send melding via SnakkaZ MCP
const result = await snakkaz.sendMessage("Hei fra ekstern MCP!", "user123");
console.log(result.response);

// Hent tilgjengelige tools
const tools = await snakkaz.getTools();
console.log(
  "Available tools:",
  tools.map((t) => t.name)
);
```

## 🔒 Tillatelser (Permissions)

| Permission    | Beskrivelse     | Endpoints                           |
| ------------- | --------------- | ----------------------------------- |
| **read**      | Les-tilgang     | `/api/mcp/status`, `/api/mcp/tools` |
| **chat**      | Chat processing | `/api/mcp/chat` + read              |
| **analytics** | Statistikk      | `/api/stats` + read                 |
| **admin**     | Full tilgang    | Alle endpoints                      |

## 📊 Rate Limits

- **Uten API-nøkkel**: 100 requests/15 min
- **Med API-nøkkel**: 1000 requests/15 min
- **Admin**: Ubegrenset

## 🛡️ Sikkerhet

- **API-nøkler**: Kryptografisk sikre (32 bytes random)
- **HTTPS**: Kun sikre tilkoblinger i produksjon
- **Rate limiting**: Forhindrer misbruk
- **Permission system**: Granular tilgangskontroll
- **Usage tracking**: Overvåking av API-bruk

## 🌐 Live Deployment

Når serveren er deployet til `mcp.snakkaz.com`:

```bash
# Test at API-en fungerer
curl https://mcp.snakkaz.com/api/health

# Få MCP info
curl https://mcp.snakkaz.com/api/mcp/info

# Generer API-nøkkel (trenger admin-nøkkel)
curl -X POST https://mcp.snakkaz.com/api/keys/generate \
  -H "X-API-Key: admin_key_here" \
  -H "Content-Type: application/json" \
  -d '{"name": "my-mcp-integration", "permissions": ["read", "chat"]}'
```

## 🎉 Resultatet

Nå kan tredjeparter enkelt integrere sine MCP servere med SnakkaZ ved å:

1. **Få API-nøkkel** fra SnakkaZ admin
2. **Bruke endpoints** med sin API-nøkkel
3. **Sende meldinger** gjennom SnakkaZ MCP-system
4. **Få tilgang til** SnakkaZ tools og funktionalitet

Dette gjør SnakkaZ til en **MCP Hub** for norske chat-systemer! 🇳🇴
