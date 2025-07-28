# 🚀 SnakkaZ AI VPS Deployment Guide

Komplett guide for å deploye SnakkaZ AI på en VPS server, ikke lokalt.

## 🌊 Oversikt

Denne guiden setter opp:

- **VPS server** med AI modeller (Ollama + Norwegian LLMs)
- **Remote AI API** server for frontend integration
- **Nginx reverse proxy** med SSL
- **Frontend oppdateringer** for å koble til remote AI

## 📋 Forutsetninger

### VPS Requirements

- **RAM**: Minimum 8GB (anbefaler 16GB for flere modeller)
- **CPU**: 4+ cores (bedre ytelse med flere)
- **Disk**: 50GB+ SSD
- **OS**: Ubuntu 22.04 LTS
- **Provider**: Hetzner, DigitalOcean, Linode, etc.

### Domain/DNS

- Subdomain for AI server (f.eks. `ai.snakkaz.com`)
- DNS A-record som peker til VPS IP

## 🎯 Steg 1: Sett opp VPS

### 1.1 Opprett VPS

```bash
# Eksempel: Hetzner Cloud (anbefalt)
# - CPX31: 4 vCPU, 8GB RAM, 160GB SSD (~€8/måned)
# - CPX41: 8 vCPU, 16GB RAM, 240GB SSD (~€16/måned)

# Eller DigitalOcean
# - 8GB/4CPU Droplet (~$48/måned)
# - 16GB/8CPU Droplet (~$96/måned)
```

### 1.2 Initial server setup

```bash
# Koble til VPS
ssh root@your-vps-ip

# Oppdater system
apt update && apt upgrade -y

# Opprett sudo bruker
adduser snakkaz
usermod -aG sudo snakkaz

# Bytt til ny bruker
su - snakkaz
```

## 🚀 Steg 2: Kjør SnakkaZ AI Setup

### 2.1 Last ned setup script

```bash
# På VPS serveren
wget https://raw.githubusercontent.com/your-repo/snakkaz-chat/main/setup-snakkaz-ai-vps.sh
chmod +x setup-snakkaz-ai-vps.sh
```

### 2.2 Kjør automatisk installasjon

```bash
# Dette setter opp alt:
# - Ollama AI engine
# - Norwegian AI models
# - SnakkaZ AI API server
# - Nginx reverse proxy
# - SSL certificate
./setup-snakkaz-ai-vps.sh
```

### 2.3 Velg AI modeller under installasjon

```bash
# Script vil spørre:
# "Install CodeLlama 7B for code assistance? (y/N): y"

# Anbefalte modeller for SnakkaZ:
# ✅ Llama 3.2 3B (standard chat)
# ✅ Nomic Embed Text (embeddings/search)
# ✅ CodeLlama 7B (kode assistanse) - valgfri
```

## 🌐 Steg 3: DNS og Domain Setup

### 3.1 DNS Configuration

```bash
# Hos din DNS provider (Cloudflare, Namecheap, etc.)
# Opprett A-record:
Type: A
Name: ai (eller ai.snakkaz)
Value: your-vps-ip-address
TTL: 300 (eller auto)
```

### 3.2 SSL Certificate (automatisk)

```bash
# Setup scriptet håndterer SSL automatisk
# Sørg for at domenet peker til VPS før SSL setup
```

## ⚙️ Steg 4: Frontend Integration

### 4.1 Oppdater environment variables

```bash
# I din .env.local fil:
echo "VITE_AI_SERVER_URL=https://ai.snakkaz.com" >> .env.local
```

### 4.2 Test AI connection

```bash
# Fra SnakkaZ workspace
npm run build
npm run preview

# Eller test dev server
npm run dev
```

### 4.3 Verifiser AI integration

```bash
# Test AI API direkte
curl -X POST https://ai.snakkaz.com/api/chat/norwegian \
  -H "Content-Type: application/json" \
  -d '{"message":"Hei SnakkaZ AI!"}'

# Expected response:
# {"response":"Hei! Hyggelig å høre fra deg!","model":"llama3.2:3b","timestamp":"..."}
```

## 🛠️ Administrasjon og Vedlikehold

### 4.1 Server Management

```bash
# Service status
sudo systemctl status snakkaz-ai
sudo systemctl status ollama
sudo systemctl status nginx

# View logs
sudo journalctl -u snakkaz-ai -f
sudo journalctl -u ollama -f

# Restart services
sudo systemctl restart snakkaz-ai
sudo systemctl restart ollama
```

### 4.2 AI Model Management

```bash
# List installed models
ollama list

# Install new model
ollama pull mistral:7b

# Remove model
ollama rm old-model:tag

# Check resource usage
htop
df -h
free -h
```

### 4.3 Update AI API server

```bash
# Update API server code
cd /opt/snakkaz-ai
sudo nano server.js  # Make changes
sudo systemctl restart snakkaz-ai
```

## 📊 Performance Monitoring

### 4.1 Resource Monitoring

```bash
# Real-time monitoring
htop

# Disk usage
df -h

# Memory usage
free -h

# Check AI model memory usage
ps aux | grep ollama
```

### 4.2 API Performance

```bash
# Test response time
time curl -X POST https://ai.snakkaz.com/api/health

# Monitor logs for errors
sudo journalctl -u snakkaz-ai -f | grep ERROR
```

## 🔧 Troubleshooting

### Common Issues

#### 1. "AI server utilgjengelig"

```bash
# Check if services are running
sudo systemctl status snakkaz-ai
sudo systemctl status ollama

# Check if models are loaded
ollama list

# Restart services
sudo systemctl restart ollama
sudo systemctl restart snakkaz-ai
```

#### 2. High memory usage

```bash
# Check memory usage
free -h

# Reduce number of models if needed
ollama rm large-model:tag

# Restart to free memory
sudo systemctl restart ollama
```

#### 3. SSL certificate issues

```bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

#### 4. Nginx configuration

```bash
# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## 💰 Cost Estimation

### Monthly VPS Costs

- **Hetzner CPX31** (8GB): €8/måned (~$9)
- **Hetzner CPX41** (16GB): €16/måned (~$18)
- **DigitalOcean 8GB**: $48/måned
- **Linode 8GB**: $40/måned

### Resource Usage

- **Llama 3.2 3B**: ~4GB RAM
- **CodeLlama 7B**: ~8GB RAM
- **API server**: ~200MB RAM
- **OS + services**: ~1GB RAM

## 🎯 Production Checklist

- [ ] VPS opprettet og SSH tilgang
- [ ] DNS A-record konfigurert
- [ ] SnakkaZ AI setup script kjørt
- [ ] SSL certificate installert
- [ ] AI modeller installert og testet
- [ ] Frontend .env.local oppdatert
- [ ] AI connection test passert
- [ ] Monitoring satt opp
- [ ] Backup strategi planlagt

## 🔄 Next Steps

1. **Test thoroughly**: Kjør extensive testing av AI features
2. **Monitor performance**: Overvåk server ytelse første uken
3. **Backup setup**: Implementer regular backups
4. **Scaling plan**: Plan for flere AI modeller eller større server
5. **Integration**: Koble AI til flere SnakkaZ features

## 🆘 Support

Hvis du får problemer:

1. Sjekk server logs først
2. Verifiser DNS/SSL setup
3. Test AI API endpoints direkte
4. Check resource usage (RAM/CPU/disk)

---

**🌊 SnakkaZ AI er nå klar for norske samtaler på din VPS server! 🇳🇴🤖**
