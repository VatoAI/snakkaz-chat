#!/bin/bash

# ===========================================
# Snakkaz Chat - Memory System Monitor
# ===========================================
# Monitors the status of the Memory System
# - Checks Python MCP server status
# - Verifies API connections
# - Tests database connectivity
# - Validates memory dashboard access
# ===========================================
# Created: June 25, 2025

# Define colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Working directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# Load environment variables if available
if [ -f "$PROJECT_ROOT/.env" ]; then
  set -o allexport
  source "$PROJECT_ROOT/.env"
  set +o allexport
fi

# Configuration
MCP_SERVER_DIR="$PROJECT_ROOT/src/services/mcp"
MCP_SERVER_FILE="$MCP_SERVER_DIR/memoryServer.py"
MCP_SERVER_URL=${MCP_SERVER_URL:-"http://localhost:3001"}
MCP_SERVER_PID_FILE="/tmp/snakkaz-mcp-server.pid"

# Banner
echo -e "${BLUE}${BOLD}=========================================${NC}"
echo -e "${BLUE}${BOLD}    SNAKKAZ MEMORY SYSTEM MONITOR        ${NC}"
echo -e "${BLUE}${BOLD}=========================================${NC}"
echo "Started at: $(date)"
echo -e "${BLUE}${BOLD}=========================================${NC}"
echo ""

# Function to check if a process is running
is_process_running() {
  local pid=$1
  if [ -z "$pid" ]; then
    return 1
  fi
  
  if ps -p "$pid" > /dev/null; then
    return 0
  else
    return 1
  fi
}

# Function to check if a port is in use
is_port_in_use() {
  local port=$1
  if command -v lsof > /dev/null; then
    if lsof -i:"$port" > /dev/null; then
      return 0
    else
      return 1
    fi
  elif command -v netstat > /dev/null; then
    if netstat -tuln | grep ":$port " > /dev/null; then
      return 0
    else
      return 1
    fi
  else
    echo "Neither lsof nor netstat is available"
    return 2
  fi
}

# Check Python environment
echo -e "${CYAN}${BOLD}Checking Python environment${NC}"
echo "----------------------------------------"

if command -v python3 > /dev/null; then
  PYTHON_VERSION=$(python3 --version)
  echo -e "  ${GREEN}✓ Python installed: $PYTHON_VERSION${NC}"
  
  # Check for required Python modules
  echo "Checking required Python modules:"
  
  # Define array of required modules
  REQUIRED_MODULES=("fastapi" "uvicorn" "psycopg2" "redis" "numpy" "openai" "anthropic" "pgvector")
  
  # Loop through and check each module
  for module in "${REQUIRED_MODULES[@]}"; do
    if python3 -c "import $module" 2> /dev/null; then
      echo -e "  ${GREEN}✓ $module${NC}"
    else
      echo -e "  ${RED}✗ $module not installed${NC}"
      MISSING_MODULES=1
    fi
  done
  
  if [ "$MISSING_MODULES" == "1" ]; then
    echo ""
    echo -e "${YELLOW}Some required modules are missing. Install them with:${NC}"
    echo -e "  cd $MCP_SERVER_DIR"
    echo -e "  pip install -r requirements.txt"
    echo ""
  fi
else
  echo -e "${RED}✗ Python 3 not found${NC}"
  echo -e "${YELLOW}Please install Python 3 before continuing${NC}"
  exit 1
fi

# Check MCP Server files
echo ""
echo -e "${CYAN}${BOLD}Checking MCP Server files${NC}"
echo "----------------------------------------"

if [ -d "$MCP_SERVER_DIR" ]; then
  echo -e "  ${GREEN}✓ MCP server directory exists${NC}"
  
  if [ -f "$MCP_SERVER_FILE" ]; then
    echo -e "  ${GREEN}✓ memoryServer.py found${NC}"
    
    # Check if requirements.txt exists
    if [ -f "$MCP_SERVER_DIR/requirements.txt" ]; then
      echo -e "  ${GREEN}✓ requirements.txt found${NC}"
    else
      echo -e "  ${RED}✗ requirements.txt not found${NC}"
      echo -e "${YELLOW}Creating requirements.txt file...${NC}"
      
      # Create requirements.txt file
      cat > "$MCP_SERVER_DIR/requirements.txt" << EOF
fastapi>=0.95.0
uvicorn>=0.21.1
psycopg2-binary>=2.9.6
redis>=4.5.4
numpy>=1.24.2
openai>=0.27.0
anthropic>=0.4.0
pgvector>=0.1.6
httpx>=0.24.0
pydantic>=1.10.7
python-dotenv>=1.0.0
EOF
      
      echo -e "  ${GREEN}✓ Created requirements.txt${NC}"
    fi
  else
    echo -e "  ${RED}✗ memoryServer.py not found${NC}"
  fi
else
  echo -e "  ${RED}✗ MCP server directory not found${NC}"
fi

# Check MCP Server status
echo ""
echo -e "${CYAN}${BOLD}Checking MCP Server status${NC}"
echo "----------------------------------------"

# Check if PID file exists
if [ -f "$MCP_SERVER_PID_FILE" ]; then
  MCP_PID=$(cat "$MCP_SERVER_PID_FILE")
  if is_process_running "$MCP_PID"; then
    echo -e "  ${GREEN}✓ MCP Server is running (PID: $MCP_PID)${NC}"
    SERVER_RUNNING=1
  else
    echo -e "  ${YELLOW}⚠️ MCP Server PID file exists but process is not running${NC}"
    echo -e "  ${YELLOW}⚠️ Removing stale PID file${NC}"
    rm "$MCP_SERVER_PID_FILE"
  fi
else
  echo -e "  ${YELLOW}⚠️ MCP Server PID file not found${NC}"
fi

# Check if server port is in use
SERVER_PORT=$(echo "$MCP_SERVER_URL" | sed -E 's|.*:([0-9]+)/?.*|\1|')
if [ -n "$SERVER_PORT" ] && is_port_in_use "$SERVER_PORT"; then
  echo -e "  ${GREEN}✓ Something is running on port $SERVER_PORT${NC}"
  if [ "$SERVER_RUNNING" != "1" ]; then
    echo -e "  ${YELLOW}⚠️ Port is in use but MCP PID not found - might be another service${NC}"
  fi
else
  echo -e "  ${RED}✗ Nothing running on port $SERVER_PORT${NC}"
fi

# Try to connect to the server
echo ""
echo -e "${CYAN}${BOLD}Testing MCP Server connection${NC}"
echo "----------------------------------------"

if command -v curl > /dev/null; then
  echo "Attempting to connect to $MCP_SERVER_URL..."
  if curl -s --connect-timeout 5 "$MCP_SERVER_URL/health" > /dev/null; then
    echo -e "  ${GREEN}✓ MCP Server is responding${NC}"
    
    # Test memory API endpoints
    echo "Testing memory API endpoints:"
    
    # Health endpoint
    HEALTH_RESPONSE=$(curl -s --connect-timeout 5 "$MCP_SERVER_URL/health")
    if [ -n "$HEALTH_RESPONSE" ]; then
      echo -e "  ${GREEN}✓ Health endpoint: $HEALTH_RESPONSE${NC}"
    else
      echo -e "  ${RED}✗ Health endpoint not responding${NC}"
    fi
    
    # Stats endpoint
    STATS_RESPONSE=$(curl -s --connect-timeout 5 "$MCP_SERVER_URL/stats")
    if [ -n "$STATS_RESPONSE" ]; then
      echo -e "  ${GREEN}✓ Stats endpoint responding${NC}"
      
      # Extract some stats
      MEMORY_COUNT=$(echo "$STATS_RESPONSE" | grep -o '"total_memories":[0-9]*' | grep -o '[0-9]*')
      if [ -n "$MEMORY_COUNT" ]; then
        echo -e "    Total memories: ${GREEN}$MEMORY_COUNT${NC}"
      fi
    else
      echo -e "  ${RED}✗ Stats endpoint not responding${NC}"
    fi
  else
    echo -e "  ${RED}✗ Could not connect to MCP Server${NC}"
  fi
else
  echo -e "  ${RED}✗ curl not found, cannot test connection${NC}"
fi

# Check TypeScript Integration
echo ""
echo -e "${CYAN}${BOLD}Checking TypeScript Integration${NC}"
echo "----------------------------------------"

MEMORY_SERVICE_FILE="$PROJECT_ROOT/src/services/ai/memoryService.ts"
if [ -f "$MEMORY_SERVICE_FILE" ]; then
  echo -e "  ${GREEN}✓ memoryService.ts exists${NC}"
  
  # Check if it's importing from the correct URL
  if grep -q "MCP_SERVER_URL\|MEMORY_API_URL" "$MEMORY_SERVICE_FILE"; then
    echo -e "  ${GREEN}✓ memoryService.ts has server URL references${NC}"
  else
    echo -e "  ${YELLOW}⚠️ memoryService.ts may not be referencing the server URL${NC}"
  fi
  
  # Check memory type definitions
  if grep -q "export type MemoryType" "$MEMORY_SERVICE_FILE"; then
    echo -e "  ${GREEN}✓ Memory type definitions found${NC}"
    
    # Count memory types
    MEMORY_TYPES=$(grep -o "'[^']*'" "$MEMORY_SERVICE_FILE" | grep -v "fetch\|get\|post\|put\|delete" | wc -l)
    echo -e "  ${GREEN}✓ Found $MEMORY_TYPES memory type references${NC}"
  else
    echo -e "  ${YELLOW}⚠️ Memory type definitions not found${NC}"
  fi
else
  echo -e "  ${RED}✗ memoryService.ts not found${NC}"
fi

# Check React component integration
echo ""
echo -e "${CYAN}${BOLD}Checking React Component Integration${NC}"
echo "----------------------------------------"

MEMORY_DASHBOARD_FILE="$PROJECT_ROOT/src/pages/MemoryDashboard.tsx"
if [ -f "$MEMORY_DASHBOARD_FILE" ]; then
  echo -e "  ${GREEN}✓ MemoryDashboard.tsx exists${NC}"
  
  # Check if it's importing the memory service
  if grep -q "memoryService" "$MEMORY_DASHBOARD_FILE"; then
    echo -e "  ${GREEN}✓ Dashboard imports memory service${NC}"
  else
    echo -e "  ${YELLOW}⚠️ Dashboard may not be importing memory service${NC}"
  fi
  
  # Check navigation integration
  NAVIGATION_FILE="$PROJECT_ROOT/src/components/navigation/UnifiedNavigation.tsx"
  if [ -f "$NAVIGATION_FILE" ] && grep -q "Brain\|memory" "$NAVIGATION_FILE"; then
    echo -e "  ${GREEN}✓ Memory navigation integration found${NC}"
    
    # Check the route path
    ROUTE_PATH=$(grep -o "path: '/memory'" "$NAVIGATION_FILE")
    if [ -n "$ROUTE_PATH" ]; then
      echo -e "  ${GREEN}✓ Memory dashboard route: /memory${NC}"
    else
      echo -e "  ${YELLOW}⚠️ Memory dashboard route not found or not standard${NC}"
    fi
  else
    echo -e "  ${RED}✗ Memory navigation integration missing${NC}"
  fi
else
  echo -e "  ${RED}✗ MemoryDashboard.tsx not found${NC}"
fi

# Check database configuration
echo ""
echo -e "${CYAN}${BOLD}Checking Database Configuration${NC}"
echo "----------------------------------------"

# Check for environment variables
if [ -f "$PROJECT_ROOT/.env" ]; then
  if grep -q "SUPABASE\|DATABASE" "$PROJECT_ROOT/.env"; then
    echo -e "  ${GREEN}✓ Database configuration found in .env${NC}"
    
    # Check for pgvector extension setup
    if grep -q "pgvector\|embedding" "$PROJECT_ROOT/src/services/mcp/memoryServer.py" 2>/dev/null; then
      echo -e "  ${GREEN}✓ pgvector integration found in memoryServer.py${NC}"
    else
      echo -e "  ${YELLOW}⚠️ No pgvector references found in memoryServer.py${NC}"
    fi
  else
    echo -e "  ${YELLOW}⚠️ No database configuration found in .env${NC}"
  fi
else
  echo -e "  ${RED}✗ .env file not found${NC}"
fi

# Instructions for starting the memory system
echo ""
echo -e "${CYAN}${BOLD}Memory System Start Instructions${NC}"
echo "----------------------------------------"

if [ -f "$MCP_SERVER_FILE" ]; then
  echo -e "${YELLOW}To start the Memory System:${NC}"
  echo ""
  echo -e "1. ${BLUE}Start MCP Server:${NC}"
  echo -e "   cd $MCP_SERVER_DIR"
  echo -e "   python3 -m venv env             # Create virtual environment if needed"
  echo -e "   source env/bin/activate         # Activate environment"
  echo -e "   pip install -r requirements.txt # Install dependencies"
  echo -e "   python memoryServer.py          # Start server"
  echo ""
  echo -e "2. ${BLUE}Start Frontend:${NC}"
  echo -e "   cd $PROJECT_ROOT"
  echo -e "   npm run dev"
  echo ""
  echo -e "3. ${BLUE}Access Memory Dashboard:${NC}"
  echo -e "   Open ${GREEN}http://localhost:5173/memory${NC} in your browser"
  echo -e "   (Login required)"
fi

echo ""
echo -e "${BLUE}${BOLD}Memory System Monitor completed at $(date)${NC}"
