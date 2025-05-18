#!/bin/bash
# security-evaluation.sh
#
# This script performs a security evaluation of the Snakkaz application
# after migration from Cloudflare to Namecheap

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Snakkaz Security Evaluation Tool    ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Check for required tools
for cmd in curl openssl nmap nikto sslyze; do
  if ! command -v $cmd &> /dev/null; then
    echo -e "${YELLOW}Warning: $cmd is not installed.${NC}"
    echo -e "Some security tests will be skipped."
    echo
  fi
done

# List of domains to test
MAIN_DOMAIN="snakkaz.com"
SUBDOMAINS=("www" "dash" "business" "docs" "analytics" "mcp" "help")

# Create results directory
RESULTS_DIR="security_scan_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$RESULTS_DIR"

# Function to check HTTP security headers
check_security_headers() {
  local url="$1"
  local domain_name="$2"
  
  echo -e "${BLUE}Checking security headers for ${url}:${NC}"
  
  # Create results file
  local results_file="$RESULTS_DIR/${domain_name}_headers.txt"
  curl -s -I "$url" > "$results_file"
  
  # Check for important security headers
  local headers=(
    "Content-Security-Policy"
    "Strict-Transport-Security"
    "X-Content-Type-Options"
    "X-Frame-Options"
    "X-XSS-Protection"
    "Referrer-Policy"
    "Permissions-Policy"
  )
  
  local score=0
  local max_score=${#headers[@]}
  
  for header in "${headers[@]}"; do
    if grep -q "$header:" "$results_file"; then
      echo -e "  ${GREEN}✓${NC} $header"
      ((score++))
    else
      echo -e "  ${RED}✗${NC} $header"
    fi
  done
  
  # Calculate security header score
  local percentage=$((score * 100 / max_score))
  echo -e "  Security Header Score: $percentage%"
  
  if [ $percentage -ge 80 ]; then
    echo -e "  ${GREEN}Good security header implementation${NC}"
  elif [ $percentage -ge 50 ]; then
    echo -e "  ${YELLOW}Average security header implementation${NC}"
  else
    echo -e "  ${RED}Poor security header implementation${NC}"
  fi
  
  echo
}

# Function to check SSL/TLS configuration
check_ssl_configuration() {
  local domain="$1"
  
  if command -v openssl &> /dev/null; then
    echo -e "${BLUE}Checking SSL/TLS configuration for ${domain}:${NC}"
    
    # Create results file
    local results_file="$RESULTS_DIR/${domain}_ssl.txt"
    
    # Check SSL certificate
    echo -e "  Testing SSL certificate..."
    openssl s_client -connect "${domain}:443" -servername "${domain}" </dev/null 2>/dev/null | openssl x509 -noout -text > "$results_file"
    
    # Check certificate validity
    local valid_from=$(grep "Not Before" "$results_file" | sed 's/.*Not Before: //')
    local valid_to=$(grep "Not After" "$results_file" | sed 's/.*Not After : //')
    
    echo -e "  Certificate valid from: $valid_from"
    echo -e "  Certificate valid until: $valid_to"
    
    # Check supported protocols
    echo -e "  Testing supported SSL/TLS protocols..."
    local protocols=("SSLv3" "TLSv1" "TLSv1.1" "TLSv1.2" "TLSv1.3")
    
    for protocol in "${protocols[@]}"; do
      if openssl s_client -connect "${domain}:443" -"${protocol}" -servername "${domain}" </dev/null &>/dev/null; then
        case "$protocol" in
          "SSLv3"|"TLSv1"|"TLSv1.1")
            echo -e "  ${RED}✗${NC} $protocol (insecure protocol supported)"
            ;;
          *)
            echo -e "  ${GREEN}✓${NC} $protocol"
            ;;
        esac
      else
        case "$protocol" in
          "SSLv3"|"TLSv1"|"TLSv1.1")
            echo -e "  ${GREEN}✓${NC} $protocol (insecure protocol not supported)"
            ;;
          *)
            echo -e "  ${RED}✗${NC} $protocol (secure protocol not supported)"
            ;;
        esac
      fi
    done
    
    echo
  fi
}

# Function to check for common vulnerabilities using nikto
check_vulnerabilities() {
  local url="$1"
  local domain_name="$2"
  
  if command -v nikto &> /dev/null; then
    echo -e "${BLUE}Checking for common vulnerabilities on ${url}:${NC}"
    echo -e "${YELLOW}Note: This will take several minutes...${NC}"
    
    # Create results file
    local results_file="$RESULTS_DIR/${domain_name}_vulnerabilities.txt"
    
    # Run nikto scan
    nikto -h "$url" -o "$results_file" -Format txt
    
    echo -e "  Scan completed. Results saved to $results_file"
    echo
  fi
}

# Function to check DNS security
check_dns_security() {
  local domain="$1"
  
  echo -e "${BLUE}Checking DNS security for ${domain}:${NC}"
  
  # Create results file
  local results_file="$RESULTS_DIR/${domain}_dns.txt"
  
  # Check DNS records
  echo -e "  Checking DNS records..."
  dig +short MX "$domain" >> "$results_file"
  dig +short TXT "$domain" >> "$results_file"
  dig +short SPF "$domain" >> "$results_file"
  dig +short DMARC "dmarc.${domain}" >> "$results_file"
  
  # Check for SPF record
  if grep -q "v=spf1" "$results_file"; then
    echo -e "  ${GREEN}✓${NC} SPF record found"
  else
    echo -e "  ${RED}✗${NC} SPF record not found"
  fi
  
  # Check for DMARC record
  if grep -q "v=DMARC1" "$results_file"; then
    echo -e "  ${GREEN}✓${NC} DMARC record found"
  else
    echo -e "  ${RED}✗${NC} DMARC record not found"
  fi
  
  echo
}

# Function to generate recommended security improvements
generate_recommendations() {
  echo -e "${BLUE}Generating security recommendations...${NC}"
  
  local recommendations_file="$RESULTS_DIR/security_recommendations.md"
  
  cat > "$recommendations_file" << EOF
# Snakkaz Security Recommendations

## After Migration from Cloudflare to Namecheap

Date: $(date)

### Security Headers

1. Implement all missing security headers:
   - Content-Security-Policy: Defines allowed content sources
   - Strict-Transport-Security: Enforces HTTPS
   - X-Content-Type-Options: Prevents MIME type sniffing
   - X-Frame-Options: Prevents clickjacking
   - X-XSS-Protection: Helps prevent XSS attacks
   - Referrer-Policy: Controls referrer information
   - Permissions-Policy: Controls browser features

2. Sample .htaccess configuration for security headers:
\`\`\`
<IfModule mod_headers.c>
    # Enable HSTS
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    
    # Prevent clickjacking
    Header always set X-Frame-Options "SAMEORIGIN"
    
    # Prevent XSS attacks
    Header always set X-XSS-Protection "1; mode=block"
    
    # Prevent MIME type sniffing
    Header always set X-Content-Type-Options "nosniff"
    
    # Referrer policy
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Content Security Policy (customize based on your needs)
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.gpteng.co; connect-src 'self' *.supabase.co *.supabase.in wss://*.supabase.co *.amazonaws.com storage.googleapis.com *.snakkaz.com cdn.gpteng.co; img-src 'self' data: blob: *.amazonaws.com storage.googleapis.com *.supabase.co *.supabase.in;"
    
    # Permissions policy
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()"
</IfModule>
\`\`\`

### SSL/TLS Configuration

1. Ensure only secure protocols are enabled (TLS 1.2 and TLS 1.3)
2. Disable SSLv3, TLS 1.0, and TLS 1.1
3. Use strong cipher suites
4. Configure perfect forward secrecy

Sample Apache configuration:
\`\`\`
<IfModule mod_ssl.c>
    SSLProtocol -all +TLSv1.2 +TLSv1.3
    SSLCipherSuite HIGH:!aNULL:!MD5:!3DES
    SSLHonorCipherOrder on
    SSLCompression off
    SSLSessionTickets off
</IfModule>
\`\`\`

### WAF Replacement (Cloudflare Alternative)

1. Consider installing ModSecurity on your Namecheap hosting if supported
2. Configure rate limiting in .htaccess:
\`\`\`
<IfModule mod_rewrite.c>
    RewriteEngine on
    RewriteCond %{REQUEST_METHOD} POST
    RewriteCond %{HTTP:X-Forwarded-For} !=127.0.0.1
    RewriteCond %{REMOTE_ADDR} !=127.0.0.1
    RewriteCond %{HTTP_USER_AGENT} ^$
    RewriteRule .* - [F]
</IfModule>
\`\`\`

3. Implement IP blocking for malicious traffic:
\`\`\`
<IfModule mod_rewrite.c>
    RewriteEngine on
    RewriteCond %{REQUEST_URI} !/blocked.html$
    RewriteCond %{REMOTE_ADDR} ^(192\.168\.0\.1|10\.0\.0\.1)$
    RewriteRule .* /blocked.html [R=403,L]
</IfModule>
\`\`\`

### DNS Security

1. Implement SPF records to prevent email spoofing
2. Set up DMARC policy
3. Consider DNSSEC if supported by Namecheap
4. Implement CAA records to restrict which CAs can issue certificates for your domain

### Additional Security Measures

1. Regular security scans
2. Implement an intrusion detection system
3. Consider a third-party security monitoring service
4. Backup website data regularly
5. Keep all software and libraries updated

EOF
  
  echo -e "  ${GREEN}Recommendations saved to ${recommendations_file}${NC}"
  echo
}

# Main testing loop
echo -e "${BLUE}Starting security evaluation...${NC}"
echo

# Test main domain first
domain="$MAIN_DOMAIN"
url="https://$domain"
check_security_headers "$url" "$domain"
check_ssl_configuration "$domain"
check_dns_security "$domain"

# Ask if user wants to run vulnerability scan for main domain
echo -e "${BLUE}Do you want to run a vulnerability scan for the main domain? (y/n)${NC}"
echo -e "${YELLOW}Warning: This can take several minutes and may trigger security alerts.${NC}"
read -n1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  check_vulnerabilities "$url" "$domain"
fi

# Check each subdomain
for subdomain in "${SUBDOMAINS[@]}"; do
  full_domain="${subdomain}.${MAIN_DOMAIN}"
  url="https://$full_domain"
  check_security_headers "$url" "$full_domain"
  check_ssl_configuration "$full_domain"
done

# Generate recommendations
generate_recommendations

echo -e "${BLUE}Security evaluation completed!${NC}"
echo -e "Results saved to ${YELLOW}$RESULTS_DIR${NC}"
echo -e "Review the security recommendations in ${YELLOW}$RESULTS_DIR/security_recommendations.md${NC}"
echo
echo -e "${YELLOW}Important: The security evaluation is a basic assessment. Consider a professional security audit for comprehensive testing.${NC}"
echo
