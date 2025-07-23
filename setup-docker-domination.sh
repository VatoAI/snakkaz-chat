# 🚀 SNAKKAZ DOCKER LAUNCH SCRIPT - INSTANT WORLD DOMINATION!

#!/bin/bash

echo "🔥 LAUNCHING SNAKKAZ DOCKER WORLD DOMINATION! 🔥"
echo "================================================="

# Colors for epic output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Step 1: Create environment file
echo -e "${BLUE}📝 CREATING ENVIRONMENT CONFIGURATION...${NC}"
cat > .env.docker << 'EOF'
# SnakkaZ Docker World Domination Configuration
NODE_ENV=production
PORT=3001

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key

# Database
DB_PASSWORD=snakkaz_domination_2025

# Performance Settings
PERFORMANCE_MODE=DOMINATION
MAX_CONNECTIONS=10000
CACHE_TTL=3600

# AI Configuration
AI_MODEL=llama3.1
AI_CONTEXT_LENGTH=32768
GPU_ENABLED=true

# MCP Server
MCP_SERVER_URL=mcp.snakkaz.com
MCP_VERSION=1.0.0

# Security
JWT_SECRET=snakkaz_ultra_secure_world_domination_key_2025
CORS_ORIGIN=*

# Analytics
ANALYTICS_ENABLED=true
PERFORMANCE_TRACKING=true
COMPETITOR_MONITORING=true
EOF

echo -e "${GREEN}✅ Environment file created: .env.docker${NC}"

# Step 2: Create nginx configuration
echo -e "${BLUE}🌐 CREATING NGINX LOAD BALANCER CONFIG...${NC}"
mkdir -p nginx-config
cat > nginx-config/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream snakkaz_backend {
        server snakkaz-mcp:3001;
    }
    
    upstream snakkaz_analytics {
        server analytics:3002;
    }

    server {
        listen 80;
        server_name mcp.snakkaz.com snakkaz.com www.snakkaz.com;
        
        # Main app
        location / {
            proxy_pass http://snakkaz_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Analytics dashboard
        location /analytics {
            proxy_pass http://snakkaz_analytics/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
        
        # Health checks
        location /health {
            proxy_pass http://snakkaz_backend/health;
            access_log off;
        }
    }
}
EOF

echo -e "${GREEN}✅ Nginx configuration created${NC}"

# Step 3: Create analytics Dockerfile
echo -e "${BLUE}📊 CREATING ANALYTICS DOCKERFILE...${NC}"
cat > Dockerfile.analytics << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY analytics/ ./
EXPOSE 3002
CMD ["node", "analytics-server.js"]
EOF

# Step 4: Update main Dockerfile for Docker optimizations
echo -e "${BLUE}🐳 OPTIMIZING MAIN DOCKERFILE...${NC}"
cat > Dockerfile.optimized << 'EOF'
# Multi-stage build for optimal size
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS runtime
RUN addgroup -g 1001 -S snakkaz && \
    adduser -S snakkaz -u 1001
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN chown -R snakkaz:snakkaz /app
USER snakkaz

# Labels for Docker Hub
LABEL maintainer="SnakkaZ Team <team@snakkaz.com>"
LABEL version="1.0.0"
LABEL description="The chat app that DOMINATES all competitors!"
LABEL org.opencontainers.image.source="https://github.com/VatoAI/snakkaz-chat"

EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["node", "server-production.cjs"]
EOF

# Step 5: Create Docker launch commands
echo -e "${BLUE}🚀 CREATING LAUNCH COMMANDS...${NC}"
cat > docker-launch.sh << 'EOF'
#!/bin/bash

echo "🚀 LAUNCHING SNAKKAZ WORLD DOMINATION STACK! 🚀"

# Pull latest Docker AI images
echo "📥 Pulling Docker AI stack..."
docker pull docker/model-runner:llama3.1
docker pull qdrant/qdrant:latest
docker pull redis:7-alpine
docker pull postgres:15-alpine

# Build and launch the full stack
echo "🏗️ Building and launching SnakkaZ..."
docker-compose -f docker-compose-world-domination.yml up -d --build

# Wait for services to start
echo "⏳ Waiting for services to initialize..."
sleep 30

# Health checks
echo "🏥 Running health checks..."
echo "Main app: $(curl -s http://localhost:3001/health | jq -r .status)"
echo "AI Model: $(curl -s http://localhost:8000/health 2>/dev/null || echo 'Starting...')"
echo "Vector DB: $(curl -s http://localhost:6333/health 2>/dev/null || echo 'Starting...')"

echo ""
echo "🎉 SNAKKAZ WORLD DOMINATION STACK LAUNCHED! 🎉"
echo "=============================================="
echo "📱 Main App:      http://localhost:3001"
echo "🧠 AI Endpoint:   http://localhost:8000"
echo "💾 Vector DB:     http://localhost:6333"
echo "🚀 Analytics:     http://localhost:3002"
echo "⚡ Redis Cache:   localhost:6379"
echo "📊 Database:      localhost:5432"
echo ""
echo "🌍 READY TO DOMINATE THE WORLD! 🌍"
EOF

chmod +x docker-launch.sh

# Step 6: Create development vs production configs
echo -e "${BLUE}⚙️ CREATING DEPLOYMENT CONFIGS...${NC}"
cat > docker-compose.dev.yml << 'EOF'
# Development version - lighter, faster iteration
version: '3.8'
services:
  snakkaz-dev:
    build: .
    ports: ["3001:3001"]
    environment:
      - NODE_ENV=development
      - HOT_RELOAD=true
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
EOF

cat > docker-compose.prod.yml << 'EOF'
# Production version - full performance stack
version: '3.8'
services:
  snakkaz:
    build:
      context: .
      dockerfile: Dockerfile.optimized
    ports: ["3001:3001"]
    environment:
      - NODE_ENV=production
      - PERFORMANCE_MODE=MAXIMUM
    restart: unless-stopped
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 1G
EOF

# Step 7: Final instructions
echo ""
echo -e "${PURPLE}🎉 SNAKKAZ DOCKER SETUP COMPLETE! 🎉${NC}"
echo -e "${PURPLE}====================================${NC}"
echo ""
echo -e "${YELLOW}🚀 LAUNCH OPTIONS:${NC}"
echo -e "${GREEN}1. FULL WORLD DOMINATION STACK:${NC}"
echo "   ./docker-launch.sh"
echo ""
echo -e "${GREEN}2. DEVELOPMENT MODE:${NC}"
echo "   docker-compose -f docker-compose.dev.yml up"
echo ""
echo -e "${GREEN}3. PRODUCTION MODE:${NC}"
echo "   docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo -e "${GREEN}4. CUSTOM WORLD DOMINATION:${NC}"
echo "   docker-compose -f docker-compose-world-domination.yml up -d"
echo ""
echo -e "${BLUE}📝 NEXT STEPS:${NC}"
echo "1. Edit .env.docker with your Supabase credentials"
echo "2. Run your preferred launch option"
echo "3. Visit http://localhost:3001/health"
echo "4. DOMINATE THE WORLD! 🌍👑"
echo ""
echo -e "${RED}⚠️ REQUIREMENTS:${NC}"
echo "- Docker Desktop installed"
echo "- GPU drivers (for AI features)"
echo "- 8GB+ RAM recommended"
echo ""
echo -e "${PURPLE}🔥 READY TO DOCKERIZE SNAKKAZ? 🔥${NC}"
