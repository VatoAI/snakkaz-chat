#!/bin/bash
# Script to migrate DNS records from Cloudflare to Namecheap
# This script requires the Namecheap API credentials to be set as environment variables

# Check for required environment variables
if [ -z "$NAMECHEAP_API_USER" ] || [ -z "$NAMECHEAP_API_KEY" ] || [ -z "$NAMECHEAP_USERNAME" ] || [ -z "$NAMECHEAP_CLIENT_IP" ]; then
  echo "❌ Error: Required Namecheap environment variables not set."
  echo "Please set the following environment variables:"
  echo "- NAMECHEAP_API_USER"
  echo "- NAMECHEAP_API_KEY"
  echo "- NAMECHEAP_USERNAME"
  echo "- NAMECHEAP_CLIENT_IP"
  exit 1
fi

# Domains to migrate
DOMAINS=("snakkaz.com" "dash.snakkaz.com" "business.snakkaz.com" "docs.snakkaz.com" "analytics.snakkaz.com")

echo "🚀 Starting Cloudflare to Namecheap DNS migration..."
echo

# Function to extract domain and subdomain parts
parse_domain() {
  local full_domain=$1
  local base_domain=""
  local subdomain=""
  
  # Check if this is a subdomain
  if [[ "$full_domain" == *"."*"."* ]]; then
    # Extract base domain (last two parts)
    base_domain=$(echo "$full_domain" | grep -oE '[^.]+\.[^.]+$')
    # Extract subdomain (everything before the base domain)
    subdomain=${full_domain%.$base_domain}
  else
    base_domain=$full_domain
    subdomain="@"
  fi
  
  echo "$base_domain|$subdomain"
}

# Process each domain
for domain in "${DOMAINS[@]}"; do
  echo "🔍 Processing domain: $domain"
  
  # Parse domain parts
  domain_parts=$(parse_domain "$domain")
  base_domain=$(echo "$domain_parts" | cut -d'|' -f1)
  subdomain=$(echo "$domain_parts" | cut -d'|' -f2)
  
  echo "  Base domain: $base_domain"
  echo "  Subdomain: $subdomain"
  
  # First, export DNS records from Cloudflare if possible
  if command -v curl &> /dev/null; then
    if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ -z "$CLOUDFLARE_ZONE_ID" ]; then
      echo "  ⚠️ Cloudflare API token or zone ID not set, skipping Cloudflare export"
    else
      echo "  📥 Exporting records from Cloudflare..."
      
      # Create backup directory if it doesn't exist
      mkdir -p "/workspaces/snakkaz-chat/backup/dns"
      
      # Export DNS records using Cloudflare API
      curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" > "/workspaces/snakkaz-chat/backup/dns/$domain-records.json"
      
      echo "  ✅ DNS records exported to /workspaces/snakkaz-chat/backup/dns/$domain-records.json"
    fi
  else
    echo "  ⚠️ curl command not available, skipping Cloudflare export"
  fi
  
  # Import to Namecheap using their API
  echo "  📤 Importing records to Namecheap..."
  
  # Import will be done using the Node.js utility separately
  # This script just prepares the environment and does the export part
  
  echo "  ✅ Domain $domain processed"
  echo
done

echo "📝 To complete the migration, run the Node.js utility:"
echo "node /workspaces/snakkaz-chat/src/scripts/complete-namecheap-migration.js"
echo
echo "🔔 Remember to update your DNS nameservers to point to Namecheap instead of Cloudflare."
echo "✅ DNS record export completed!"
