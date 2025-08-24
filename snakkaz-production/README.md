# SnakkaZ Production App

Dette er den produksjonsklare versjonen av SnakkaZ - Norges smarteste chat-app.

## 🚀 Funksjoner

- **Real-time Chat** - Øyeblikkelig meldingsutveksling
- **Sikker** - Ende-til-ende kryptering
- **AI-Assistent** - Innebygd AI for produktivitet
- **Team-Samarbeid** - Private rom og team-funksjoner
- **Multilingval** - Norsk fokus med automatisk oversettelse
- **Premium Abonnementer** - 4 prisnivåer for alle behov

## 💰 Priser

- **Gratis** - 0 NOK/måned
- **Pro** - 99 NOK/måned
- **Business** - 299 NOK/måned
- **Enterprise** - 999 NOK/måned

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase + MCP API
- **Betalinger**: Stripe + Vipps
- **PWA**: Service Worker + Manifest
- **Analytics**: Google Analytics 4

## 📦 Installasjon

```bash
# Klon repo
git clone https://github.com/VatoAI/snakkaz-chat.git
cd snakkaz-chat/snakkaz-production

# Installer avhengigheter
npm install

# Kopier miljøvariabler
cp .env.example .env.local

# Start utviklingsserver
npm run dev
```

## 🔧 Miljøvariabler

Se `.env.example` for alle nødvendige miljøvariabler.

## 🚀 Deployment

```bash
# Bygg for produksjon
npm run build

# Preview build
npm run preview

# Deployment (eksempel med Netlify)
npm run build && netlify deploy --prod --dir dist
```

## 📱 PWA

Appen støtter Progressive Web App (PWA) funksjoner:

- Offline-støtte
- Push-notifikasjoner
- App-lignende opplevelse
- Installasjon på mobil/desktop

## 💳 Betalingsintegrasjon

### Stripe

- Konfigurer Stripe nøkler i miljøvariabler
- Webhook endpoint: `/api/webhooks/stripe`

### Vipps

- Norsk betalingsløsning
- Konfigurer Vipps API nøkler
- Webhook endpoint: `/api/webhooks/vipps`

## 📊 Analytics

Tracker automatisk:

- Sidevisninger
- Brukerengasjement
- Konverteringer
- Inntekter

## 🔐 Sikkerhet

- Ende-til-ende kryptering for meldinger
- JWT-basert autentisering
- GDPR-kompatibel
- Secure headers og CSP

## 📞 Support

For support og spørsmål:

- E-post: support@snakkaz.com
- Dokumentasjon: [docs.snakkaz.com](https://docs.snakkaz.com)

## 📄 Lisens

Proprietær - Alle rettigheter reservert.

---

**Laget med ❤️ i Norge** 🇳🇴
