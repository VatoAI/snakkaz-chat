#!/bin/bash

# 🎯 SnakkaZ Smart Port Manager - VS Code MCP Safe
# Fra MASTERPLAN PHASE 1.2: PORT & PROCESS MANAGEMENT

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 SnakkaZ Smart Port Manager (VS Code MCP Safe)${NC}"
echo -e "${YELLOW}⚠️  Bevarer VS Code MCP og andre kritiske prosesser${NC}"

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -t -i:$port >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to safely kill only Vite processes
safe_kill_vite() {
    echo -e "${YELLOW}🧹 Rydder kun Vite prosesser (bevarer VS Code MCP)...${NC}"
    
    # Find only Vite processes (not VS Code or MCP)
    local vite_pids=$(pgrep -f "vite.*--host.*--port" 2>/dev/null | grep -v "code-server\|mcp\|vs.*code")
    
    if [ ! -z "$vite_pids" ]; then
        for pid in $vite_pids; do
            # Double check it's actually a vite process
            local cmd=$(ps -p $pid -o cmd= 2>/dev/null)
            if [[ "$cmd" =~ "vite" ]] && [[ ! "$cmd" =~ "code-server|mcp|vscode" ]]; then
                echo -e "${RED}  Stopper Vite PID: $pid${NC}"
                kill -TERM $pid 2>/dev/null
                sleep 1
                kill -KILL $pid 2>/dev/null
            fi
        done
        echo -e "${GREEN}✅ Vite prosesser stoppet${NC}"
    else
        echo -e "${GREEN}✅ Ingen Vite prosesser å stoppe${NC}"
    fi
}

# Function to find best available port
find_available_port() {
    local start_port=$1
    local max_attempts=10
    
    echo -e "${YELLOW}🔍 Søker etter ledig port fra $start_port...${NC}"
    
    for ((i=0; i<$max_attempts; i++)); do
        local port=$((start_port + i))
        if ! check_port $port; then
            echo -e "${GREEN}✅ Port $port er ledig!${NC}"
            echo $port
            return 0
        else
            echo -e "${YELLOW}  Port $port er opptatt${NC}"
        fi
    done
    
    echo -1
    return 1
}

# Main logic
echo -e "${BLUE}📊 Sjekker nåværende port status...${NC}"

# Check common dev ports
COMMON_PORTS=(3000 3001 4000 4001 5173 5174 8080 8081)
for port in "${COMMON_PORTS[@]}"; do
    if check_port $port; then
        local process_info=$(lsof -t -i:$port 2>/dev/null | head -1)
        local cmd=$(ps -p $process_info -o cmd= 2>/dev/null | cut -c1-50)
        echo -e "${RED}  Port $port: OPPTATT ($cmd...)${NC}"
    else
        echo -e "${GREEN}  Port $port: LEDIG${NC}"
    fi
done

# Clean up old Vite processes
safe_kill_vite

# Find best port for Vite
PREFERRED_PORT=4000
AVAILABLE_PORT=$(find_available_port $PREFERRED_PORT)

if [ $AVAILABLE_PORT -eq -1 ]; then
    echo -e "${RED}❌ Ingen ledige porter funnet!${NC}"
    echo -e "${YELLOW}💡 Prøv å lukke andre development servere manuelt${NC}"
    exit 1
fi

# Update environment
echo -e "${BLUE}⚙️  Setter opp port $AVAILABLE_PORT...${NC}"

# Create/update .env.local
if [ -f .env.local ]; then
    if grep -q "VITE_PORT=" .env.local; then
        sed -i "s/VITE_PORT=.*/VITE_PORT=$AVAILABLE_PORT/" .env.local
    else
        echo "VITE_PORT=$AVAILABLE_PORT" >> .env.local
    fi
else
    echo "VITE_PORT=$AVAILABLE_PORT" > .env.local
fi

# Update package.json dev script if needed
if grep -q '"dev":.*--port' package.json; then
    sed -i "s/--port [0-9][0-9]*/--port $AVAILABLE_PORT/" package.json
fi

echo -e "${GREEN}🚀 Port management komplett!${NC}"
echo -e "${GREEN}📍 Bruk port: $AVAILABLE_PORT${NC}"
echo -e "${BLUE}🌐 URL: http://localhost:$AVAILABLE_PORT${NC}"
echo -e "${YELLOW}💡 Kjør: npm run dev${NC}"

# Export for current session
export VITE_PORT=$AVAILABLE_PORT
