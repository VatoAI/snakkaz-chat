# SnakkaZ Production Deployment Guide 🚀🇳🇴

## 📋 Complete System Setup Checklist

### ✅ Current Status

- [x] **Production App Built** - Complete React/TypeScript app ready
- [x] **Git Repository Clean** - Force pushed production version
- [x] **Development Server** - Running on port 3001
- [x] **MCP Integration** - All APIs configured
- [x] **Payment System** - Stripe + Vipps ready
- [x] **Norwegian Design** - UI/UX optimized

### 🔧 Next Steps for Complete System

## 1. 🔐 SSH Key Setup

```bash
# Generate SSH key for GitHub
ssh-keygen -t ed25519 -C "your-email@snakkaz.com" -f ~/.ssh/snakkaz_github
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/snakkaz_github

# Add public key to GitHub
cat ~/.ssh/snakkaz_github.pub
# Copy and add to GitHub Settings > SSH Keys
```

## 2. 🏗 GitHub Actions Deployment

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy SnakkaZ Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - name: Install dependencies
        run: cd snakkaz-production && npm ci
      - name: Build
        run: cd snakkaz-production && npm run build
      - name: Deploy to production
        run: |
          # FTP upload script or hosting deployment
          echo "Deploying to www.snakkaz.com"
```

## 3. 🗄 Supabase Production Setup

### Database Tables

```sql
-- Users profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  plan TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Chat rooms
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES profiles(id),
  is_private BOOLEAN DEFAULT false,
  premium_only BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES chat_rooms(id),
  user_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  file_url TEXT,
  is_encrypted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

## 4. 🌐 Domain & Hosting Setup (Namecheap)

### DNS Configuration

```
Type    Name    Value
A       @       YOUR_SERVER_IP
A       www     YOUR_SERVER_IP
CNAME   api     YOUR_API_SERVER
TXT     @       "v=spf1 include:_spf.google.com ~all"
```

### SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d snakkaz.com -d www.snakkaz.com
```

## 5. 📧 Email Setup

```bash
# Configure email service (Google Workspace or similar)
# Add MX records to Namecheap:
MX  @  aspmx.l.google.com     1
MX  @  alt1.aspmx.l.google.com  5
MX  @  alt2.aspmx.l.google.com  5
```

## 6. 🔌 MCP API Production Setup

```env
# Production environment variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MCP_API_URL=https://api.snakkaz.com
VITE_MCP_API_KEY=your_production_mcp_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 7. 💰 Payment Integration

```javascript
// Stripe webhook handler
app.post("/api/webhooks/stripe", (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle subscription events
  if (event.type === "invoice.payment_succeeded") {
    // Update user subscription in Supabase
  }

  res.json({ received: true });
});
```

## 8. 📊 Analytics & Monitoring

```javascript
// Google Analytics 4 setup
gtag("config", "G-XXXXXXXXXX", {
  page_title: "SnakkaZ",
  page_location: "https://www.snakkaz.com",
  content_group1: "Norwegian Chat App",
});

// Revenue tracking
gtag("event", "purchase", {
  transaction_id: subscriptionId,
  value: amount,
  currency: "NOK",
});
```

## 9. 🚀 Deployment Script

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Deploying SnakkaZ to production..."

# Build production app
cd snakkaz-production
npm run build

# Upload to hosting
rsync -avz --delete dist/ user@yourserver:/var/www/snakkaz.com/

# Restart services
ssh user@yourserver "sudo systemctl restart nginx"

echo "✅ SnakkaZ deployed successfully!"
echo "🌐 Live at: https://www.snakkaz.com"
```

## 10. 🔄 Continuous Integration

```bash
# GitHub Actions deployment
name: Production Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: ./deploy.sh
```

---

## 🎯 Revenue Targets

- **Month 1**: 100 Pro users = 9,900 NOK
- **Month 3**: 500 Pro + 100 Business = 79,400 NOK
- **Month 6**: 1000 Pro + 200 Business + 50 Enterprise = 208,800 NOK
- **Year 1**: **2.5M NOK årlig inntekt**

## 📞 Support System

- **Email**: support@snakkaz.com
- **Chat**: Live chat på www.snakkaz.com
- **Docs**: docs.snakkaz.com
- **Status**: status.snakkaz.com

**🇳🇴 SnakkaZ - Laget med ❤️ i Norge**
