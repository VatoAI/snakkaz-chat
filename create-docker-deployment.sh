#!/bin/bash

# 🚀 SNAKKAZ DOCKER WORLD DOMINATION DEPLOYMENT! 🚀
# This script creates the ultimate Docker deployment

echo "🔥 STARTING SNAKKAZ DOCKER WORLD DOMINATION! 🔥"
echo "=============================================="

# Colors for epic output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Step 1: Build the Docker image
echo -e "${BLUE}📦 BUILDING DOCKER IMAGE...${NC}"
docker build -t snakkaz-chat:latest .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker image built successfully!${NC}"
else
    echo -e "${RED}❌ Docker build failed!${NC}"
    exit 1
fi

# Step 2: Test the container locally
echo -e "${BLUE}🧪 TESTING CONTAINER LOCALLY...${NC}"
docker run -d --name snakkaz-test -p 3001:3001 snakkaz-chat:latest

# Wait for container to start
sleep 5

# Health check
echo -e "${BLUE}🏥 RUNNING HEALTH CHECK...${NC}"
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health)

if [ "$HEALTH_CHECK" == "200" ]; then
    echo -e "${GREEN}✅ Health check passed! Container is healthy!${NC}"
else
    echo -e "${RED}❌ Health check failed! HTTP status: $HEALTH_CHECK${NC}"
fi

# Stop test container
docker stop snakkaz-test
docker rm snakkaz-test

# Step 3: Tag for Docker Hub (optional)
echo -e "${BLUE}🏷️  TAGGING FOR DOCKER HUB...${NC}"
echo -e "${YELLOW}Enter your Docker Hub username (or skip): ${NC}"
read DOCKER_USERNAME

if [ ! -z "$DOCKER_USERNAME" ]; then
    docker tag snakkaz-chat:latest $DOCKER_USERNAME/snakkaz-chat:latest
    docker tag snakkaz-chat:latest $DOCKER_USERNAME/snakkaz-chat:v1.0.0
    echo -e "${GREEN}✅ Tagged for Docker Hub: $DOCKER_USERNAME/snakkaz-chat${NC}"
    
    # Push to Docker Hub
    echo -e "${BLUE}🚀 PUSHING TO DOCKER HUB...${NC}"
    echo -e "${YELLOW}Login to Docker Hub first if needed: docker login${NC}"
    read -p "Press enter to push to Docker Hub (or Ctrl+C to skip)..."
    
    docker push $DOCKER_USERNAME/snakkaz-chat:latest
    docker push $DOCKER_USERNAME/snakkaz-chat:v1.0.0
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}🎉 SUCCESSFULLY PUSHED TO DOCKER HUB!${NC}"
    else
        echo -e "${RED}❌ Push to Docker Hub failed!${NC}"
    fi
fi

# Step 4: Create deployment files
echo -e "${BLUE}📄 CREATING DEPLOYMENT FILES...${NC}"

cat > docker-run-commands.sh << 'EOF'
#!/bin/bash
# Quick deployment commands for SnakkaZ

echo "🚀 SNAKKAZ DOCKER DEPLOYMENT COMMANDS 🚀"
echo "======================================="

echo "1. RUN WITH DOCKER COMPOSE (RECOMMENDED):"
echo "   docker-compose up -d"
echo ""

echo "2. RUN STANDALONE CONTAINER:"
echo "   docker run -d --name snakkaz-chat -p 3001:3001 snakkaz-chat:latest"
echo ""

echo "3. RUN WITH ENVIRONMENT VARIABLES:"
echo "   docker run -d --name snakkaz-chat \\"
echo "     -p 3001:3001 \\"
echo "     -e SUPABASE_URL=your_supabase_url \\"
echo "     -e SUPABASE_KEY=your_supabase_key \\"
echo "     snakkaz-chat:latest"
echo ""

echo "4. CHECK LOGS:"
echo "   docker logs -f snakkaz-chat"
echo ""

echo "5. STOP CONTAINER:"
echo "   docker stop snakkaz-chat && docker rm snakkaz-chat"
echo ""

echo "🏥 HEALTH CHECK:"
echo "   curl http://localhost:3001/health"
echo ""

echo "🌍 ACCESS APP:"
echo "   http://localhost:3001"
EOF

chmod +x docker-run-commands.sh

# Step 5: Create environment template
cat > .env.docker.template << 'EOF'
# SnakkaZ Docker Environment Template
# Copy this to .env and fill in your values

NODE_ENV=production
PORT=3001

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key

# Optional: Custom configuration
CORS_ORIGIN=*
MAX_CONNECTIONS=1000

# Optional: PostgreSQL (if using local database)
POSTGRES_DB=snakkaz_chat
POSTGRES_USER=snakkaz
POSTGRES_PASSWORD=snakkaz_secure_password

# Optional: Redis (if using caching)
REDIS_URL=redis://redis:6379
EOF

echo -e "${GREEN}📄 Created docker-run-commands.sh and .env.docker.template${NC}"

# Step 6: Final success message
echo ""
echo -e "${PURPLE}🎉 SNAKKAZ DOCKER DEPLOYMENT COMPLETE! 🎉${NC}"
echo -e "${PURPLE}=========================================${NC}"
echo ""
echo -e "${GREEN}✅ Docker image: snakkaz-chat:latest${NC}"
echo -e "${GREEN}✅ Docker Compose: docker-compose.yml${NC}"
echo -e "${GREEN}✅ Deployment commands: docker-run-commands.sh${NC}"
echo -e "${GREEN}✅ Environment template: .env.docker.template${NC}"
echo ""
echo -e "${YELLOW}🚀 QUICK START:${NC}"
echo -e "${YELLOW}1. Copy .env.docker.template to .env${NC}"
echo -e "${YELLOW}2. Fill in your Supabase credentials${NC}"
echo -e "${YELLOW}3. Run: docker-compose up -d${NC}"
echo -e "${YELLOW}4. Visit: http://localhost:3001${NC}"
echo ""
echo -e "${BLUE}🌍 READY TO DEPLOY ANYWHERE IN THE WORLD! 🌍${NC}"

# List all created files
echo -e "${PURPLE}📦 CREATED FILES:${NC}"
ls -la Dockerfile .dockerignore docker-compose.yml docker-run-commands.sh .env.docker.template
