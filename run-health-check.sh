#!/bin/bash
# Comprehensive health monitoring system for Snakkaz Chat
# Created as part of emergency repair - June 3, 2025

echo "🔍 SNAKKAZ CHAT HEALTH MONITOR"
echo "========================================"
echo "Running comprehensive health check..."

# Define endpoints to check
MAIN_SITE="https://www.snakkaz.com"
MCP_SITE="https://mcp.snakkaz.com"
MCP_API="https://mcp.snakkaz.com/api/health.php"
TEST_API="https://mcp.snakkaz.com/api/test.php"
MEMORY_API="https://mcp.snakkaz.com/api/memory.php"

# Function to check endpoint with timeout
check_endpoint() {
  local url=$1
  local name=$2
  local expected_content=$3
  
  echo -n "Checking $name ($url)... "
  
  # Get HTTP status and content
  local response=$(curl -s -m 10 -w "STATUS:%{http_code}" "$url")
  local status="${response##*STATUS:}"
  local content="${response%STATUS:*}"
  
  if [[ $status == "200" ]]; then
    echo "✅ Online (HTTP 200)"
    
    # Check for expected content if provided
    if [[ -n "$expected_content" ]] && [[ "$content" == *"$expected_content"* ]]; then
      echo "   Content check: ✅ Contains '$expected_content'"
    elif [[ -n "$expected_content" ]]; then
      echo "   Content check: ❌ Missing '$expected_content'"
    fi
  else
    echo "❌ Error (HTTP $status)"
  fi
}

# Check main site
check_endpoint "$MAIN_SITE" "Main Site" "SnakkaZ Chat"

# Check MCP Dashboard
check_endpoint "$MCP_SITE" "MCP Dashboard" ""

# Check MCP API health endpoint
check_endpoint "$MCP_API" "MCP API Health" "status"

# Check PHP test file
check_endpoint "$TEST_API" "PHP Test" "PHP Test: OK"

# Check memory API
check_endpoint "$MEMORY_API" "Memory API" "user_id"

echo ""
echo "📊 MEMORY INTEGRATION TEST"
echo "========================================"
echo "Running test memory fetch..."

# Make a test memory API call with a basic payload
MEMORY_TEST_RESPONSE=$(curl -s -X POST "$MEMORY_API" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test-user-monitor", "action": "get"}')

if [[ "$MEMORY_TEST_RESPONSE" == *"user_id"* ]]; then
  echo "✅ Memory API responding correctly to POST requests"
else
  echo "❌ Memory API failed to handle POST request"
fi

echo ""
echo "📈 PERFORMANCE TEST"
echo "========================================"
echo "Checking response times..."

# Check response times for critical endpoints
check_response_time() {
  local url=$1
  local name=$2
  
  echo -n "Response time for $name: "
  local time=$(curl -s -o /dev/null -w "%{time_total}" "$url")
  
  # Convert to milliseconds
  local ms=$(echo "$time * 1000" | bc)
  
  # Evaluate the response time
  if (( $(echo "$time < 0.5" | bc -l) )); then
    echo "✅ ${ms%.*} ms (Good)"
  elif (( $(echo "$time < 1.0" | bc -l) )); then
    echo "⚠️ ${ms%.*} ms (Acceptable)"
  else
    echo "❌ ${ms%.*} ms (Slow)"
  fi
}

check_response_time "$MAIN_SITE" "Main Site"
check_response_time "$MCP_SITE" "MCP Dashboard"
check_response_time "$MCP_API" "MCP API"

echo ""
echo "========================================"
echo "🏁 HEALTH CHECK SUMMARY"
echo "========================================"

echo "Time: $(date)"
echo "All essential systems checked."
echo ""
echo "Need help? Run ./emergency-repair-snakkaz.sh"
echo "For detailed stats: node test-full-integration.js"
