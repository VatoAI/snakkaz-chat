#!/bin/bash
# performance-test.sh
#
# This script tests the performance of Snakkaz domains after migration
# and compares it with previous benchmarks

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Snakkaz Performance Testing Tool    ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Check for required tools
for cmd in curl ab siege; do
  if ! command -v $cmd &> /dev/null; then
    echo -e "${RED}Error: $cmd is not installed.${NC}"
    if [ "$cmd" == "ab" ]; then
      echo -e "Please install Apache Bench with: apt-get install apache2-utils"
    elif [ "$cmd" == "siege" ]; then
      echo -e "Please install Siege with: apt-get install siege"
    else
      echo -e "Please install $cmd"
    fi
    missing_tools=true
  fi
done

if [ "$missing_tools" == "true" ]; then
  echo -e "${YELLOW}Some tools are missing. Performance testing may be limited.${NC}"
  echo
fi

# List of domains to test
MAIN_DOMAIN="snakkaz.com"
SUBDOMAINS=("www" "dash" "business" "docs" "analytics" "mcp" "help")

# Create results directory
RESULTS_DIR="performance_results_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$RESULTS_DIR"

# Function to test single URL load time
test_load_time() {
  local url="$1"
  local domain_name="$2"
  
  echo -e "${BLUE}Testing load time for ${url}:${NC}"
  
  # Use curl to measure time_total
  TIMES=$(curl -s -w "%{time_connect} %{time_starttransfer} %{time_total}\n" -o /dev/null "$url")
  
  # Parse times
  TIME_CONNECT=$(echo "$TIMES" | cut -d' ' -f1)
  TIME_FIRST_BYTE=$(echo "$TIMES" | cut -d' ' -f2)
  TIME_TOTAL=$(echo "$TIMES" | cut -d' ' -f3)
  
  # Save results to file
  echo "$domain_name,$url,$TIME_CONNECT,$TIME_FIRST_BYTE,$TIME_TOTAL" >> "$RESULTS_DIR/load_times.csv"
  
  # Display results
  printf "  %-20s: %ss\n" "Connection time" "$TIME_CONNECT"
  printf "  %-20s: %ss\n" "Time to first byte" "$TIME_FIRST_BYTE"
  printf "  %-20s: %ss\n" "Total load time" "$TIME_TOTAL"
  
  # Evaluate performance
  if (( $(echo "$TIME_TOTAL < 1.0" | bc -l) )); then
    echo -e "  ${GREEN}Performance: Excellent${NC}"
  elif (( $(echo "$TIME_TOTAL < 2.0" | bc -l) )); then
    echo -e "  ${GREEN}Performance: Good${NC}"
  elif (( $(echo "$TIME_TOTAL < 3.0" | bc -l) )); then
    echo -e "  ${YELLOW}Performance: Average${NC}"
  else
    echo -e "  ${RED}Performance: Slow${NC}"
  fi
  
  echo
}

# Function to run Apache Bench (ab) tests
run_ab_test() {
  local url="$1"
  local domain_name="$2"
  local concurrency=10
  local requests=100
  
  if command -v ab &> /dev/null; then
    echo -e "${BLUE}Running Apache Bench test for ${url}:${NC}"
    echo -e "${YELLOW}Parameters: $requests requests, concurrency $concurrency${NC}"
    
    # Run ab test and save results
    ab -n $requests -c $concurrency -k "$url" > "$RESULTS_DIR/ab_${domain_name}.txt"
    
    # Extract key metrics
    REQUESTS_PER_SEC=$(grep "Requests per second" "$RESULTS_DIR/ab_${domain_name}.txt" | awk '{print $4}')
    TIME_PER_REQUEST=$(grep "Time per request" "$RESULTS_DIR/ab_${domain_name}.txt" | head -1 | awk '{print $4}')
    TRANSFER_RATE=$(grep "Transfer rate" "$RESULTS_DIR/ab_${domain_name}.txt" | awk '{print $3}')
    
    # Display results
    echo -e "  Requests per second: ${GREEN}$REQUESTS_PER_SEC${NC}"
    echo -e "  Time per request: ${YELLOW}$TIME_PER_REQUEST ms${NC}"
    echo -e "  Transfer rate: ${BLUE}$TRANSFER_RATE Kbytes/sec${NC}"
    
    # Save to CSV
    echo "$domain_name,$url,$REQUESTS_PER_SEC,$TIME_PER_REQUEST,$TRANSFER_RATE" >> "$RESULTS_DIR/ab_results.csv"
    
    echo
  fi
}

# Function to run Siege tests for stress testing
run_siege_test() {
  local url="$1"
  local domain_name="$2"
  local time=30s  # Test duration
  
  if command -v siege &> /dev/null; then
    echo -e "${BLUE}Running Siege stress test for ${url}:${NC}"
    echo -e "${YELLOW}Parameters: $time duration, 15 concurrent users${NC}"
    
    # Run siege test and save results
    siege -c 15 -t "$time" "$url" > "$RESULTS_DIR/siege_${domain_name}.txt"
    
    # Extract key metrics
    TRANSACTIONS=$(grep "Transactions:" "$RESULTS_DIR/siege_${domain_name}.txt" | awk '{print $2}')
    AVAILABILITY=$(grep "Availability:" "$RESULTS_DIR/siege_${domain_name}.txt" | awk '{print $2}')
    RESPONSE_TIME=$(grep "Response time:" "$RESULTS_DIR/siege_${domain_name}.txt" | awk '{print $4}')
    
    # Display results
    echo -e "  Transactions: ${GREEN}$TRANSACTIONS${NC}"
    echo -e "  Availability: ${YELLOW}$AVAILABILITY%${NC}"
    echo -e "  Response time: ${BLUE}$RESPONSE_TIME secs${NC}"
    
    # Save to CSV
    echo "$domain_name,$url,$TRANSACTIONS,$AVAILABILITY,$RESPONSE_TIME" >> "$RESULTS_DIR/siege_results.csv"
    
    echo
  fi
}

# Create CSV headers
echo "domain,url,connect_time,time_to_first_byte,total_time" > "$RESULTS_DIR/load_times.csv"
echo "domain,url,requests_per_sec,time_per_request_ms,transfer_rate_kbps" > "$RESULTS_DIR/ab_results.csv"
echo "domain,url,transactions,availability_percent,response_time_sec" > "$RESULTS_DIR/siege_results.csv"

# Run tests for main domain
domain="$MAIN_DOMAIN"
url="https://$domain"
test_load_time "$url" "$domain"

# Ask if user wants to run more intensive tests for main domain
echo -e "${BLUE}Do you want to run more intensive performance tests for the main domain? (y/n)${NC}"
read -n1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  run_ab_test "$url" "$domain"
  run_siege_test "$url" "$domain"
fi

# Test each subdomain
for subdomain in "${SUBDOMAINS[@]}"; do
  full_domain="${subdomain}.${MAIN_DOMAIN}"
  url="https://$full_domain"
  test_load_time "$url" "$full_domain"
done

# Ask if user wants to run more intensive tests for subdomains
echo -e "${BLUE}Do you want to run more intensive performance tests for all subdomains? (y/n)${NC}"
read -n1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  for subdomain in "${SUBDOMAINS[@]}"; do
    full_domain="${subdomain}.${MAIN_DOMAIN}"
    url="https://$full_domain"
    run_ab_test "$url" "$full_domain"
    # Skip siege test for subdomains to avoid excessive testing
  done
fi

# Generate summary report
echo -e "${BLUE}Generating performance summary report...${NC}"
cat > "$RESULTS_DIR/performance_summary.md" << EOF
# Snakkaz Performance Test Results
Date: $(date)

## Load Time Summary

| Domain | Connection Time | Time to First Byte | Total Load Time |
| ------ | --------------- | ------------------ | --------------- |
EOF

tail -n +2 "$RESULTS_DIR/load_times.csv" | while IFS=, read -r domain url connect first_byte total; do
  echo "| $domain | ${connect}s | ${first_byte}s | ${total}s |" >> "$RESULTS_DIR/performance_summary.md"
done

# Add Apache Bench results if available
if [ -f "$RESULTS_DIR/ab_results.csv" ]; then
  cat >> "$RESULTS_DIR/performance_summary.md" << EOF

## Apache Bench Results

| Domain | Requests/sec | Time per Request (ms) | Transfer Rate (KB/s) |
| ------ | ----------- | -------------------- | ------------------- |
EOF

  tail -n +2 "$RESULTS_DIR/ab_results.csv" | while IFS=, read -r domain url rps time_req transfer; do
    echo "| $domain | $rps | $time_req | $transfer |" >> "$RESULTS_DIR/performance_summary.md"
  done
fi

# Add Siege results if available
if [ -f "$RESULTS_DIR/siege_results.csv" ]; then
  cat >> "$RESULTS_DIR/performance_summary.md" << EOF

## Stress Test Results (Siege)

| Domain | Transactions | Availability (%) | Response Time (s) |
| ------ | ----------- | ---------------- | ---------------- |
EOF

  tail -n +2 "$RESULTS_DIR/siege_results.csv" | while IFS=, read -r domain url trans avail resp_time; do
    echo "| $domain | $trans | $avail | $resp_time |" >> "$RESULTS_DIR/performance_summary.md"
  done
fi

# Add recommendations
cat >> "$RESULTS_DIR/performance_summary.md" << EOF

## Recommendations

Based on the performance test results, here are some recommendations:

1. Any page with total load time > 2s should be optimized
2. Consider implementing a CDN for static assets
3. Enable browser caching through .htaccess
4. Optimize image sizes and compression
5. Minify CSS and JavaScript files

## Comparison with Cloudflare

To compare with previous Cloudflare performance:
1. Check previous performance benchmarks
2. Compare time to first byte metrics
3. Evaluate availability percentages
4. Consider implementing additional optimization if performance has degraded

EOF

echo -e "${GREEN}Performance testing completed!${NC}"
echo -e "Results saved to ${YELLOW}$RESULTS_DIR${NC}"
echo -e "Summary report: ${YELLOW}$RESULTS_DIR/performance_summary.md${NC}"
echo
