# 🚀 SnakkaZ Systematisk Deployment Plan

## Komplett Step-by-Step Guide til Live Production

---

## ✅ FASE 1: KRITISKE FEIL-FIXER (5 minutter)

### 1.1 Fix Tailwind CSS Config Error

```bash
# Fjern eventuelle konflikterende config-filer
rm -f tailwind.config.js
# Kontroller at kun tailwind.config.ts eksisterer
ls -la tailwind.config.*
```

### 1.2 Validér Package.json

```bash
# Test JSON-syntax
node -p "JSON.parse(require('fs').readFileSync('package.json', 'utf8')); 'OK'"
```

### 1.3 Clean Install Dependencies

```bash
# Ren installasjon av alle dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ FASE 2: SUPABASE SETUP VIA MCP (10 minutter)

### 2.1 Database Schema Application

- ✅ MCP Supabase tools aktivert
- Appliser schema via MCP tools
- Verifiser tabeller og RLS policies

### 2.2 Environment Variables Setup

```bash
# Opprett .env.production
cat > .env.production << EOF
VITE_SUPABASE_URL=https://wqpoozpbceucynsojmbk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_VIPPS_CLIENT_ID=your_vipps_client_id
VITE_MCP_API_URL=https://api.snakkaz.com/mcp
VITE_APP_URL=https://www.snakkaz.com
EOF
```

### 2.3 Database Health Check

- Test connection
- Verify RLS policies
- Check subscription tables

---

## ✅ FASE 3: BUILD & TEST SYSTEM (15 minutter)

### 3.1 Development Build Test

```bash
# Test development build
npm run dev
# Åpne http://localhost:3001
# Test alle hovedfunksjoner
```

### 3.2 Production Build Test

```bash
# Production build
npm run build:prod
npm run preview
# Test production build lokalt
```

### 3.3 Core Feature Testing

- [ ] Landing page loading
- [ ] User registration/login
- [ ] Subscription payment flow
- [ ] Chat functionality
- [ ] Dashboard access
- [ ] MCP API integration

---

## ✅ FASE 4: PAYMENT SYSTEM VALIDATION (10 minutter)

### 4.1 Stripe Integration

```bash
# Test Stripe webhook
curl -X POST https://your-server.com/webhook/stripe \
  -H "Content-Type: application/json" \
  -d '{"type": "customer.subscription.created"}'
```

### 4.2 Vipps Integration

- Verify Vipps API credentials
- Test payment flow
- Validate callback URLs

### 4.3 Subscription Logic Test

- Test upgrade/downgrade flow
- Verify usage limits
- Check billing cycles

---

## ✅ FASE 5: PRODUCTION DEPLOYMENT (20 minutter)

### 5.1 GitHub Actions Deployment

```bash
# Commit all changes
git add .
git commit -m "🚀 Production ready - All systems verified"
git push origin main
# Dette triggerer automatisk deployment via GitHub Actions
```

### 5.2 Domain & SSL Setup

```bash
# SSH til produksjonserver
ssh root@your-server.com

# Kjør deployment script
chmod +x deploy.sh
./deploy.sh
```

### 5.3 DNS Configuration

```
# Hos Namecheap - sett disse DNS records:
A Record: @ → Your-Server-IP
A Record: www → Your-Server-IP
CNAME: api → @
```

---

## ✅ FASE 6: LIVE TESTING & VALIDATION (15 minutter)

### 6.1 Live Site Testing

- [ ] https://www.snakkaz.com loads correctly
- [ ] SSL certificate active (green lock)
- [ ] All pages accessible
- [ ] Mobile responsive design

### 6.2 Payment Flow Testing

- [ ] Complete subscription signup
- [ ] Verify webhook delivery
- [ ] Test payment confirmation
- [ ] Check user dashboard updates

### 6.3 Performance Validation

```bash
# Lighthouse score test
npx lighthouse https://www.snakkaz.com --output=html --output-path=lighthouse-report.html

# Load testing
npm run fase4:test:load
```

---

## ✅ FASE 7: MONITORING & ANALYTICS (10 minutter)

### 7.1 Error Monitoring Setup

- Sentry error tracking active
- Supabase logs monitoring
- Server health checks

### 7.2 Analytics Configuration

- User journey tracking
- Conversion funnel setup
- Revenue analytics active

### 7.3 Backup & Recovery

```bash
# Database backup
npm run db:backup
# Code backup
git tag v1.0.0-production
git push --tags
```

---

## 🎯 SUCCESS METRICS

### Immediate Validation (First 24 hours)

- [ ] 0 critical errors in logs
- [ ] SSL A+ rating
- [ ] Mobile-friendly test pass
- [ ] First paying customer

### Revenue Goals (First Month)

- Target: 50 registrations
- Goal: 10 Pro subscriptions (1,990 kr)
- Stretch: 5 Business subscriptions (2,495 kr)
- **Total Monthly Recurring Revenue: ~4,500 kr**

---

## 🚨 EMERGENCY ROLLBACK PLAN

### If Critical Issues Occur:

```bash
# Revert to previous working version
git revert HEAD
git push origin main

# Or restore from backup
git checkout v1.0.0-production
git push -f origin main
```

### Emergency Contacts

- Server Support: [Your hosting provider]
- Domain Support: Namecheap
- Payment Support: Stripe + Vipps

---

## 📞 NEXT ACTIONS

### Umiddelbart (Now):

1. **FIX TAILWIND ERROR** → Run Fase 1
2. **APPLY SUPABASE SCHEMA** → Run Fase 2
3. **BUILD & TEST** → Run Fase 3

### I dag:

4. **DEPLOY TO PRODUCTION** → Run Fase 4-6
5. **GO LIVE** → www.snakkaz.com active!

### Denne uken:

6. **MONITOR & OPTIMIZE** → Run Fase 7
7. **FIRST CUSTOMERS** → Start earning revenue! 💰

---

**Ready to launch? Let's execute each fase step by step! 🚀🇳🇴**
