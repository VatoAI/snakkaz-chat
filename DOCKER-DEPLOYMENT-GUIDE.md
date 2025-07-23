# 🐳 SnakkaZ Docker Deployment Guide

## 🚀 INSTANT DOCKER DEPLOYMENT

### Quick Start (3 commands):
```bash
# 1. Run the deployment script
./create-docker-deployment.sh

# 2. Start with Docker Compose
docker-compose up -d

# 3. Check if it's running
curl http://localhost:3001/health
```

### Alternative Single Container:
```bash
# Build and run in one line
docker build -t snakkaz-chat . && docker run -d --name snakkaz -p 3001:3001 snakkaz-chat
```

## 🌍 DEPLOY ANYWHERE:

### Local Development:
```bash
docker-compose up -d
# Access: http://localhost:3001
```

### Cloud Deployment:
```bash
# Push to Docker Hub
docker tag snakkaz-chat:latest yourusername/snakkaz-chat:latest
docker push yourusername/snakkaz-chat:latest

# Deploy on any cloud provider
# Digital Ocean, AWS, Google Cloud, Azure, Heroku, etc.
```

### Production Server:
```bash
# Copy files to server
scp -r . user@yourserver.com:/app/snakkaz-chat/
ssh user@yourserver.com
cd /app/snakkaz-chat
docker-compose up -d
```

## 🏥 MONITORING & MAINTENANCE:

### Health Checks:
```bash
curl http://localhost:3001/health
docker logs -f snakkaz-chat
```

### Updates:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🔧 CONFIGURATION:

### Environment Variables:
- Copy `.env.docker.template` to `.env`
- Add your Supabase credentials
- Customize as needed

### Scaling:
```bash
# Run multiple instances
docker-compose up -d --scale snakkaz-chat=3
```

## ⚡ FEATURES INCLUDED:

- ✅ Multi-stage optimized build
- ✅ Security hardened (non-root user)
- ✅ Health checks built-in
- ✅ Production-ready logging
- ✅ Auto-restart on failure
- ✅ PostgreSQL + Redis included
- ✅ Volume persistence
- ✅ Network isolation

**DOCKER DEPLOYMENT = INSTANT WORLD DOMINATION! 🌍👑**
