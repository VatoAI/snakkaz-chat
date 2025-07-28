# 🌊 SnakkaZ AI på Namecheap Server - Teknisk Analyse

## 📊 **REALITETSSJEKK: AI Models på Namecheap Hosting**

### **❌ SHARED HOSTING = IKKE MULIG**

**Namecheap Shared Hosting Specs:**

- **CPU:** Begrenset shared CPU (1-4X cores)
- **RAM:** 20 GB SSD storage, begrenset RAM (~1-2 GB)
- **Prosesser:** Strenge CPU/memory limits
- **Kontroll:** Ingen root access, kan ikke installere Ollama

**AI Model Requirements:**

- **Minimum:** 8 GB RAM for 3B modeller
- **Optimal:** 16+ GB RAM, dedicated CPU cores
- **Kontroll:** Root access for Ollama installation

### **✅ MULIGE LØSNINGER: VPS/Dedicated**

## 🚀 **ANBEFALT LØSNING: Hybrid Arkitektur**

### **1. 💰 Budget-Vennlig Approach ($10-20/måned)**

#### **Frontend på Namecheap + AI på VPS**

```
┌─────────────────┐    ┌─────────────────┐
│   Namecheap     │    │   VPS Server    │
│   Shared Host   │◄──►│   (AI Models)   │
│                 │    │                 │
│ • React App     │    │ • Ollama        │
│ • Static Files  │    │ • AI API        │
│ • Domain        │    │ • WebSocket     │
└─────────────────┘    └─────────────────┘
```

**VPS Options for AI:**

- **DigitalOcean:** $20/month (4GB RAM, 2 CPU)
- **Linode:** $24/month (4GB RAM, 2 CPU)
- **Vultr:** $24/month (4GB RAM, 2 CPU)
- **Hetzner:** €15/month (8GB RAM, 2 CPU) ⭐ BEST VALUE

### **2. 🏢 All-in-One: Namecheap VPS**

#### **Namecheap VPS Specs (2025):**

**Tilgjengelige Planer:**

```
🔸 PULSAR VPS - $6.88/måned
   • CPU: 2 cores
   • RAM: 2 GB ❌ (For lite for AI)
   • Storage: 40 GB SSD RAID 10
   • Bandwidth: 1000 GB

🔸 QUASAR VPS - $12.88/måned
   • CPU: 4 cores
   • RAM: 4 GB ⚠️ (Minimum for små AI modeller)
   • Storage: 60 GB SSD RAID 10
   • Bandwidth: 2000 GB

🔸 MAGNETAR VPS - ~$25-30/måned
   • CPU: 6+ cores
   • RAM: 8+ GB ✅ (Kan kjøre AI modeller)
   • Storage: 120+ GB SSD RAID 10
   • Bandwidth: 3000+ GB
```

VPS Hosting Plans:
• Pulsar: $6.88/month - 1GB RAM, 1 CPU ❌ (Too small)
• Quasar: $11.88/month - 2GB RAM, 2 CPU ❌ (Still too small)
• Magnetar: $21.88/month - 4GB RAM, 4 CPU ⚠️ (Marginal)
• Custom: Contact for 8GB+ ✅ (Workable)

```

### **3. 🎯 ANBEFALT: Namecheap Dedicated Server**

#### **Dedicated Server Specs:**

```

Xeon E3-1230v6:
• CPU: 4 cores @ 3.5 GHz
• RAM: 16 GB DDR4 ✅
• Storage: 480 GB SSD
• Price: ~$69/month

Xeon E-2224:
• CPU: 4 cores @ 3.4 GHz
• RAM: 16 GB ECC ✅
• Storage: 1 TB NVMe
• Price: ~$89/month

````

## 🛠️ **IMPLEMENTERING: SnakkaZ AI Server Setup**

### **Scenario A: Hybrid (Anbefalt for start)**

#### **1. Frontend (Namecheap Shared)**

```bash
# Deploy SnakkaZ React app
npm run build
# Upload dist/ folder via cPanel
````

#### **2. AI Server (External VPS)**

```bash
# Hetzner VPS €15/month (8GB RAM)
# Install Ubuntu 22.04
sudo apt update
curl -fsSL https://ollama.com/install.sh | sh

# Install AI models
ollama pull llama3.2:3b        # Norwegian chat
ollama pull nomic-embed-text   # Search embeddings
```

#### **3. Connect Frontend → AI**

```typescript
// Environment config
VITE_AI_SERVER_URL=https://ai.snakkaz.com:11434
VITE_AI_WEBSOCKET_URL=wss://ai.snakkaz.com:3001
```

### **Scenario B: All-in-One Namecheap VPS**

#### **Upgrade to 8GB+ VPS**

```bash
# Contact Namecheap for custom VPS
# Minimum: 8GB RAM, 4 CPU cores
# Price: ~$40-60/month

# Full stack on one server:
# - React app (Nginx)
# - Node.js backend
# - Ollama AI models
# - Supabase connection
```

## 💰 **KOSTNADS-SAMMENLIGNING**

### **Option 1: Hybrid Setup**

```
Namecheap Shared: $1.58/month
Hetzner VPS 8GB: €15/month (~$16)
Total: ~$18/month
```

### **Option 2: Namecheap VPS Only**

```
Custom 8GB VPS: ~$45/month
All-in-one hosting
```

### **Option 3: Namecheap Dedicated**

```
16GB Dedicated: ~$69/month
Premium performance
Full control
```

## 🔧 **TECHNICAL SETUP: AI API Server**

### **AI Server Architecture:**

```typescript
// ai-server.js (Node.js API på VPS)
import express from "express";
import { ollamaService } from "./ollama-service.js";

const app = express();

// CORS for Namecheap domain
app.use(
  cors({
    origin: ["https://snakkaz.com", "https://www.snakkaz.com"],
  })
);

// AI endpoint for Norwegian chat
app.post("/api/chat", async (req, res) => {
  const { message, model = "llama3.2:3b" } = req.body;

  try {
    const response = await ollamaService.generateNorwegian(message, model);
    res.json({ response, status: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log("🤖 SnakkaZ AI Server running on port 3001");
});
```

### **Frontend Integration:**

```typescript
// Frontend: snakkaz.com (Namecheap)
// Connect to AI server på VPS

const AI_SERVER = "https://ai.snakkaz.com";

export const aiService = {
  async chatNorwegian(message: string): Promise<string> {
    const response = await fetch(`${AI_SERVER}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return data.response;
  },
};
```

## 🚀 **DEPLOYMENT PLAN**

### **Phase 1: Hybrid Setup (1-2 days)**

1. ✅ Keep existing Namecheap hosting for frontend
2. 🚀 Setup Hetzner VPS for AI (€15/month)
3. 🔧 Deploy Ollama + Norwegian models
4. 🌐 Configure subdomain: ai.snakkaz.com
5. 🔗 Update SnakkaZ frontend to use AI API

### **Phase 2: Optimization (1 week)**

1. 📊 Add caching layer (Redis)
2. ⚡ Optimize model loading
3. 📈 Monitor performance metrics
4. 🔒 Add authentication/rate limiting

### **Phase 3: Scale (når nødvendig)**

1. 📈 Monitor usage patterns
2. 🔄 Add load balancing hvis nødvendig
3. 🏢 Upgrade til Namecheap dedicated hvis høy trafikk

## 📋 **SETUP SCRIPT: AI VPS**

```bash
#!/bin/bash
# setup-snakkaz-ai-vps.sh

echo "🌊 Setting up SnakkaZ AI Server on VPS..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y curl wget git nginx nodejs npm

# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama service
sudo systemctl enable ollama
sudo systemctl start ollama

# Install AI models
echo "📥 Installing Norwegian AI models..."
ollama pull llama3.2:3b
ollama pull nomic-embed-text

# Setup SnakkaZ AI API
git clone https://github.com/VatoAI/snakkaz-ai-server.git
cd snakkaz-ai-server
npm install
npm run build

# Configure Nginx reverse proxy
sudo tee /etc/nginx/sites-available/snakkaz-ai > /dev/null <<EOF
server {
    listen 80;
    server_name ai.snakkaz.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /ollama/ {
        proxy_pass http://localhost:11434/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/snakkaz-ai /etc/nginx/sites-enabled/
sudo systemctl reload nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d ai.snakkaz.com

echo "✅ SnakkaZ AI Server setup complete!"
echo "🌐 API available at: https://ai.snakkaz.com"
echo "🤖 Test: curl https://ai.snakkaz.com/api/health"
```

## 🎯 **KONKLUSJON & ANBEFALING**

### **🏆 BEST PRACTICE: Hybrid Approach**

**Umiddelbar implementering:**

1. **Keep Namecheap shared hosting** for frontend ($1.58/month)
2. **Add Hetzner VPS** for AI models (€15/month)
3. **Total cost:** ~$18/month
4. **Benefits:** Optimal performance, cost-effective, scalable

**Migration path:**

- **Month 1-3:** Test hybrid setup
- **Month 4+:** Vurder all-in-one VPS hvis trafikk øker
- **Scale:** Move til dedicated server når >1000 aktive brukere

### **📝 Action Items:**

1. **Setup VPS for AI** - Hetzner/DigitalOcean 8GB
2. **Deploy AI server** - Ollama + Norwegian models
3. **Configure subdomain** - ai.snakkaz.com
4. **Update SnakkaZ frontend** - Point til AI API
5. **Test & optimize** - Performance monitoring

**🚀 Result: SnakkaZ med server-hosted norsk AI for under $20/måned!**
