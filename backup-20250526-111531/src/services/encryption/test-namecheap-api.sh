#!/bin/bash

# Namecheap API Test Script
# For testing Namecheap API connection and whitelist status

# API credentials from namecheapConfig.ts
API_USER="SnakkaZ"
API_KEY="43cb18d3efb341258414943ce1549db7"
USERNAME="SnakkaZ"
DOMAIN="snakkaz.com"

# Get the current IP address
echo "Getting your current IP address..."
CLIENT_IP=$(curl -s https://api.ipify.org?format=json | grep -o '"ip":"[^"]*' | grep -o '[^"]*$')

echo "Your current IP address: $CLIENT_IP"
echo "Testing Namecheap API connection..."

# Construct the API URL
API_URL="https://api.sandbox.namecheap.com/xml.response?ApiUser=$API_USER&ApiKey=$API_KEY&UserName=$USERNAME&ClientIp=$CLIENT_IP&Command=namecheap.domains.getInfo&DomainName=$DOMAIN"

# Make the API request
echo "Making API request to Namecheap..."
RESPONSE=$(curl -s "$API_URL")

# Check for whitelist issues
if echo "$RESPONSE" | grep -q "IP not whitelisted"; then
  echo -e "\n❌ ERROR: Your IP address is not whitelisted."
  echo "Add $CLIENT_IP to the whitelist in Namecheap API Access settings."
  exit 1
fi

# Check for API key issues
if echo "$RESPONSE" | grep -q "Invalid ApiKey"; then
  echo -e "\n❌ ERROR: Invalid API key."
  echo "Double-check your API key in namecheapConfig.ts"
  exit 1
fi

# Check for success
if echo "$RESPONSE" | grep -q "<Status>OK</Status>"; then
  echo -e "\n✅ SUCCESS: API connection successful!"
  echo "Your Namecheap API is properly configured."
else
  echo -e "\n❌ ERROR: Unknown API error."
  echo "API Response:"
  echo "$RESPONSE"
  exit 1
fi
