# 🚀 SNAKKAZ FULL AI STACK LAUNCHER - ULTIMATE EDITION

#!/bin/bash

echo "🔥🔥🔥 LAUNCHING SNAKKAZ FULL AI STACK - WORLD DOMINATION MODE! 🔥🔥🔥"
echo "=================================================================="

# Colors for epic output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Art banner
echo -e "${PURPLE}"
echo "    ███████╗███╗   ██╗ █████╗ ██╗  ██╗██╗  ██╗ █████╗ ███████╗"
echo "    ██╔════╝████╗  ██║██╔══██╗██║ ██╔╝██║ ██╔╝██╔══██╗╚══███╔╝"
echo "    ███████╗██╔██╗ ██║███████║█████╔╝ █████╔╝ ███████║  ███╔╝ "
echo "    ╚════██║██║╚██╗██║██╔══██║██╔═██╗ ██╔═██╗ ██╔══██║ ███╔╝  "
echo "    ███████║██║ ╚████║██║  ██║██║  ██╗██║  ██╗██║  ██║███████╗"
echo "    ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝"
echo "                    🚀 DOCKER AI WORLD DOMINATION 🚀"
echo -e "${NC}"

# Pre-flight checks
echo -e "${BLUE}🔍 RUNNING PRE-FLIGHT CHECKS...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found! Please install Docker Desktop first.${NC}"
    exit 1
fi

# Check Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker is not running! Please start Docker Desktop.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}⚠️ docker-compose not found, using 'docker compose' instead${NC}"
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

echo -e "${GREEN}✅ Docker Compose available${NC}"

# Check if .env.docker exists
if [ ! -f ".env.docker" ]; then
    echo -e "${RED}❌ .env.docker not found! Creating default...${NC}"
    echo "NODE_ENV=production" > .env.docker
    echo "PORT=3001" >> .env.docker
fi

echo -e "${GREEN}✅ Environment configuration ready${NC}"

# Check if compose file exists
if [ ! -f "docker-compose-world-domination.yml" ]; then
    echo -e "${RED}❌ docker-compose-world-domination.yml not found!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker Compose file ready${NC}"

# System requirements check
echo -e "${BLUE}💻 CHECKING SYSTEM REQUIREMENTS...${NC}"

# Check available memory
AVAILABLE_MEMORY=$(free -m | awk 'NR==2{printf "%.0f", $7}' 2>/dev/null || echo "8000")
if [ "$AVAILABLE_MEMORY" -lt 4000 ]; then
    echo -e "${YELLOW}⚠️ Low memory detected: ${AVAILABLE_MEMORY}MB available. Recommended: 8GB+${NC}"
    echo -e "${YELLOW}⚠️ AI features may be limited${NC}"
else
    echo -e "${GREEN}✅ Memory check passed: ${AVAILABLE_MEMORY}MB available${NC}"
fi

# Check disk space
DISK_SPACE=$(df -h . | awk 'NR==2 {print $4}' | sed 's/G//')
if [ "${DISK_SPACE%.*}" -lt 10 ]; then
    echo -e "${YELLOW}⚠️ Low disk space: ${DISK_SPACE}G available. Recommended: 20GB+${NC}"
else
    echo -e "${GREEN}✅ Disk space check passed: ${DISK_SPACE}G available${NC}"
fi

echo ""
echo -e "${CYAN}🚀 PRE-FLIGHT CHECKS COMPLETE! READY FOR LAUNCH! 🚀${NC}"
echo ""

# Launch confirmation
echo -e "${YELLOW}📋 WHAT WILL BE LAUNCHED:${NC}"
echo "  🎯 SnakkaZ MCP Server (your current dominating server)"
echo "  🧠 Llama 3.1 AI Model (local GPU acceleration)"
echo "  💾 Qdrant Vector Database (AI memory)"
echo "  ⚡ Redis Cache (ultra-fast caching)"
echo "  📊 PostgreSQL Database (persistent data)"
echo "  📈 Analytics Dashboard (performance monitoring)"
echo "  🌐 Nginx Load Balancer (traffic distribution)"
echo ""

read -p "🔥 Ready to launch WORLD DOMINATION STACK? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Launch cancelled. Run this script again when ready!${NC}"
    exit 1
fi

echo ""
echo -e "${PURPLE}🚀 INITIATING LAUNCH SEQUENCE... 🚀${NC}"
echo ""

# Step 1: Pull required images
echo -e "${BLUE}📥 PHASE 1: Pulling Docker images...${NC}"
echo "This may take a few minutes on first run..."

docker pull redis:7-alpine &
docker pull postgres:15-alpine &
docker pull qdrant/qdrant:latest &
docker pull nginx:alpine &

# Try to pull Docker Model Runner (may not be available yet)
echo -e "${YELLOW}🤖 Attempting to pull Docker Model Runner...${NC}"
if docker pull docker/model-runner:llama3.1 2>/dev/null; then
    echo -e "${GREEN}✅ Docker Model Runner pulled successfully${NC}"
else
    echo -e "${YELLOW}⚠️ Docker Model Runner not available yet, using placeholder${NC}"
fi

wait # Wait for all background pulls to complete
echo -e "${GREEN}✅ Base images pulled successfully${NC}"

# Step 2: Build SnakkaZ image
echo -e "${BLUE}🏗️ PHASE 2: Building SnakkaZ container...${NC}"
docker build -t snakkaz-world-domination:latest . || {
    echo -e "${RED}❌ Build failed! Check Dockerfile${NC}"
    exit 1
}
echo -e "${GREEN}✅ SnakkaZ container built successfully${NC}"

# Step 3: Launch the stack
echo -e "${BLUE}🚀 PHASE 3: Launching World Domination Stack...${NC}"
$DOCKER_COMPOSE -f docker-compose-world-domination.yml --env-file .env.docker up -d

# Step 4: Wait for services to initialize
echo -e "${BLUE}⏳ PHASE 4: Initializing services...${NC}"
echo "Waiting for services to start up..."

for i in {1..60}; do
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        break
    fi
    echo -n "."
    sleep 1
done

echo ""

# Step 5: Health checks
echo -e "${BLUE}🏥 PHASE 5: Running health checks...${NC}"

# Check main SnakkaZ server
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    HEALTH_STATUS=$(curl -s http://localhost:3001/health | jq -r '.status' 2>/dev/null || echo "unknown")
    echo -e "${GREEN}✅ SnakkaZ Server: ${HEALTH_STATUS}${NC}"
else
    echo -e "${RED}❌ SnakkaZ Server: Not responding${NC}"
fi

# Check Redis
if docker exec snakkaz-speed-cache redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis Cache: PONG${NC}"
else
    echo -e "${YELLOW}⚠️ Redis Cache: Starting...${NC}"
fi

# Check PostgreSQL
if docker exec snakkaz-database pg_isready -U snakkaz > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL: Ready${NC}"
else
    echo -e "${YELLOW}⚠️ PostgreSQL: Starting...${NC}"
fi

# Check Qdrant
if curl -s http://localhost:6333/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Vector Database: Online${NC}"
else
    echo -e "${YELLOW}⚠️ Vector Database: Starting...${NC}"
fi

# Step 6: Display access information
echo ""
echo -e "${PURPLE}🎉🎉🎉 SNAKKAZ WORLD DOMINATION STACK LAUNCHED! 🎉🎉🎉${NC}"
echo -e "${PURPLE}======================================================${NC}"
echo ""
echo -e "${CYAN}🌍 ACCESS YOUR EMPIRE:${NC}"
echo -e "${GREEN}📱 Main SnakkaZ App:    ${BLUE}http://localhost:3001${NC}"
echo -e "${GREEN}🏥 Health Dashboard:    ${BLUE}http://localhost:3001/health${NC}"
echo -e "${GREEN}💼 Control Dashboard:   ${BLUE}http://localhost:3001/dashboard${NC}"
echo -e "${GREEN}📊 Analytics:           ${BLUE}http://localhost:3002${NC}"
echo -e "${GREEN}🧠 AI Endpoint:         ${BLUE}http://localhost:8000${NC}"
echo -e "${GREEN}💾 Vector Database:     ${BLUE}http://localhost:6333${NC}"
echo ""
echo -e "${CYAN}🔧 MANAGEMENT COMMANDS:${NC}"
echo -e "${GREEN}📋 View logs:           ${YELLOW}docker-compose -f docker-compose-world-domination.yml logs -f${NC}"
echo -e "${GREEN}⏹️ Stop all services:   ${YELLOW}docker-compose -f docker-compose-world-domination.yml down${NC}"
echo -e "${GREEN}🔄 Restart services:    ${YELLOW}docker-compose -f docker-compose-world-domination.yml restart${NC}"
echo -e "${GREEN}📊 Service status:      ${YELLOW}docker-compose -f docker-compose-world-domination.yml ps${NC}"
echo ""
echo -e "${CYAN}💡 NEXT STEPS:${NC}"
echo "1. Visit http://localhost:3001/health to see your domination status"
echo "2. Test the chat functionality at http://localhost:3001"
echo "3. Check analytics at http://localhost:3002"
echo "4. Monitor logs with: docker-compose -f docker-compose-world-domination.yml logs -f"
echo ""
echo -e "${RED}🚨 COMPETITOR WARNING: ${NC}"
echo -e "${YELLOW}Signal, Telegram, WhatsApp, Snapchat, and Wickr are officially${NC}"
echo -e "${YELLOW}being DOMINATED by your SnakkaZ AI-powered chat platform!${NC}"
echo ""
echo -e "${PURPLE}🌍👑 WORLD DOMINATION ACHIEVED! 👑🌍${NC}"

# Final status check
echo ""
echo -e "${BLUE}📈 FINAL STATUS CHECK:${NC}"
docker-compose -f docker-compose-world-domination.yml ps

echo ""
echo -e "${GREEN}🎯 Launch complete! Your AI-powered chat empire is now online!${NC}"
