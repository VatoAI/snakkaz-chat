#!/bin/bash
# filepath: /workspaces/snakkaz-chat/enhanced-health-monitor.sh

# 🔍 Enhanced Snakkaz Chat Health Monitor
# Version: 2.0 - June 3, 2025
# Description: Health monitoring with specific React state error detection

echo "🔍 ENHANCED SNAKKAZ CHAT HEALTH MONITOR"
echo "========================================"
echo "Running comprehensive health check with React error detection..."

# Define endpoints to check
MAIN_SITE="https://www.snakkaz.com"
MCP_SITE="https://mcp.snakkaz.com"
MCP_API="https://mcp.snakkaz.com/api/health.php"
TEST_API="https://mcp.snakkaz.com/api/test.php"
MEMORY_API="https://mcp.snakkaz.com/api/memory.php"

# Function to check endpoint with timeout and content validation
check_endpoint() {
  local url=$1
  local name=$2
  local expected_content=$3
  
  echo -n "Checking $name ($url)... "
  
  # Get HTTP status and content with a 10-second timeout
  local response=$(curl -s -m 10 -w "STATUS:%{http_code}" "$url")
  local status="${response##*STATUS:}"
  local content="${response%STATUS:*}"
  
  if [[ $status == "200" ]]; then
    if [[ -n "$expected_content" && "$content" == *"$expected_content"* ]]; then
      echo "✅ Online (HTTP 200) - Content verified"
    else
      echo "✅ Online (HTTP 200)"
    fi
  else
    echo "❌ Error (HTTP $status)"
  fi
}

# Function to check for React errors by analyzing the page source
check_for_react_errors() {
  local url=$1
  local name=$2
  
  echo -n "🔍 Analyzing $name for React errors... "
  
  # Download the page with a 10-second timeout
  local page_source=$(curl -s -m 10 "$url")
  
  # Check for various React error signatures
  if [[ "$page_source" == *"TypeError: Cannot read properties of undefined"* ]]; then
    echo "❌ React 'undefined' error detected!"
    return 1
  elif [[ "$page_source" == *"G is undefined"* ]]; then
    echo "❌ React 'G is undefined' error detected!"
    return 1
  elif [[ "$page_source" == *"ni is undefined"* ]]; then
    echo "❌ React 'ni is undefined' error detected!"
    return 1
  elif [[ "$page_source" == *"React.useState"* && "$page_source" == *"not a function"* ]]; then
    echo "❌ React.useState error detected!"
    return 1
  elif [[ "$page_source" == *"Failed to compile"* && "$page_source" == *"React"* ]]; then
    echo "❌ React compilation error detected!"
    return 1
  elif [[ "$page_source" == *"polyfill"* && "$page_source" == *"applied"* ]]; then
    echo "⚠️ React polyfill was applied (working but needed fix)"
    return 0
  else
    echo "✅ No React errors detected"
    return 0
  fi
}

# Check basic endpoint availability
echo "📊 ENDPOINT AVAILABILITY TEST"
echo "========================================"
check_endpoint "$MAIN_SITE" "Main Site" "SnakkaZ Chat"
check_endpoint "$MCP_SITE" "MCP Dashboard" "Model Context Protocol"
check_endpoint "$MCP_API" "MCP API Health" "healthy"
check_endpoint "$TEST_API" "PHP Test" "working"
check_endpoint "$MEMORY_API" "Memory API" "ready"

# Check for React errors
echo ""
echo "🔍 REACT ERROR DETECTION"
echo "========================================"
check_for_react_errors "$MAIN_SITE" "Main Site"
check_for_react_errors "$MCP_SITE" "MCP Dashboard"

# Test memory integration
echo ""
echo "📊 MEMORY INTEGRATION TEST"
echo "========================================"
echo "Running test memory fetch..."

# POST request to memory API
memory_response=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user","action":"verify"}' \
  "$MEMORY_API")

if [[ "$memory_response" == *"success"* ]]; then
  echo "✅ Memory API successfully handled POST request"
else
  echo "❌ Memory API failed to handle POST request"
fi

# Check performance
echo ""
echo "📈 PERFORMANCE TEST"
echo "========================================"
echo "Checking response times..."

# Function to measure response time
measure_response_time() {
  local url=$1
  local name=$2
  
  local start_time=$(date +%s.%N)
  curl -s -o /dev/null -w "" "$url"
  local end_time=$(date +%s.%N)
  
  local response_time=$(echo "$end_time - $start_time" | bc)
  local response_ms=$(echo "$response_time * 1000" | bc | cut -d'.' -f1)
  
  if [[ $response_ms -lt 500 ]]; then
    echo "Response time for $name: ✅ $response_ms ms (Good)"
  elif [[ $response_ms -lt 1000 ]]; then
    echo "Response time for $name: ⚠️ $response_ms ms (Acceptable)"
  else
    echo "Response time for $name: ❌ $response_ms ms (Slow)"
  fi
}

measure_response_time "$MAIN_SITE" "Main Site"
measure_response_time "$MCP_SITE" "MCP Dashboard"
measure_response_time "$MCP_API" "MCP API"

echo ""
echo "========================================"
echo "🏁 HEALTH CHECK SUMMARY"
echo "========================================"
echo "Time: $(date)"
echo "All essential systems checked."
echo ""
echo "Need help? Run ./emergency-repair-snakkaz.sh"
echo "For detailed stats: node test-full-integration.js"
