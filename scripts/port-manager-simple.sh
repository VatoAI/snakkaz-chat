#!/bin/bash

# 🎯 SnakkaZ Port Manager - VS Code MCP Safe
# MASTERPLAN PHASE 1.2: PORT & PROCESS MANAGEMENT

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 SnakkaZ Port Manager (VS Code MCP Safe)${NC}"

# Function to check if port is free
port_free() {
    ! lsof -t -i:$1 >/dev/null 2>&1
}

# Function to safely kill only Vite
safe_kill_vite() {
    echo -e "${YELLOW}🧹 Stopper kun Vite prosesser...${NC}"
    pkill -f "vite.*dev" 2>/dev/null || true
    pkill -f "npm.*run.*dev" 2>/dev/null || true
    sleep 1
    echo -e "${GREEN}✅ Vite prosesser stoppet${NC}"
}

# Function to find available port
find_port() {
    local start_port=$1
    for ((i=0; i<10; i++)); do
        local port=$((start_port + i))
        if port_free $port; then
            echo $port
            return 0
        fi
    done
    echo -1
}

# Main logic
echo -e "${BLUE}📊 Port status:${NC}"
for port in 3000 4000 5173 8080; do
    if port_free $port; then
        echo -e "${GREEN}  Port $port: LEDIG${NC}"
    else
        echo -e "${RED}  Port $port: OPPTATT${NC}"
    fi
done

# Clean up Vite
safe_kill_vite

# Find best port
BEST_PORT=$(find_port 4000)
if [ "$BEST_PORT" -eq -1 ]; then
    echo -e "${RED}❌ Ingen ledige porter!${NC}"
    exit 1
fi

echo -e "${GREEN}🎯 Bruker port: $BEST_PORT${NC}"

# Update .env.local
echo "VITE_PORT=$BEST_PORT" > .env.local

echo -e "${GREEN}🚀 Klar for: npm run dev${NC}"
echo -e "${BLUE}🌐 URL: http://localhost:$BEST_PORT${NC}"

export VITE_PORT=$BEST_PORT
