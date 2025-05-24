# Environment verification script for Snakkaz email configuration
# This script checks if mail settings in .env are correct

#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    exit 1
fi

# Check for required email variables
echo "Checking email configuration in .env file..."

# Source the .env file to get variables
source .env

# Check cPanel variables
if [[ -z "$CPANEL_USERNAME" ]]; then
    echo "❌ Missing CPANEL_USERNAME in .env file"
    missing=1
else
    echo "✓ CPANEL_USERNAME is set to: $CPANEL_USERNAME"
fi

if [[ "$CPANEL_API_TOKEN" == "CPANEL_API_TOKEN_HERE" ]]; then
    echo "❌ CPANEL_API_TOKEN has default value in .env file"
    echo "   Please update it with a real API token"
    missing=1
elif [[ -z "$CPANEL_API_TOKEN" ]]; then
    echo "❌ Missing CPANEL_API_TOKEN in .env file"
    missing=1
else
    echo "✓ CPANEL_API_TOKEN is set (hidden for security)"
fi

if [[ -z "$CPANEL_DOMAIN" ]]; then
    echo "❌ Missing CPANEL_DOMAIN in .env file"
    missing=1
else
    echo "✓ CPANEL_DOMAIN is set to: $CPANEL_DOMAIN"
fi

# Check email API variables
if [[ "$EMAIL_API_KEY" == "CPANEL_API_TOKEN_HERE" ]]; then
    echo "❌ EMAIL_API_KEY has default value in .env file"
    echo "   Please update it with a real API token"
    missing=1
elif [[ -z "$EMAIL_API_KEY" ]]; then
    echo "❌ Missing EMAIL_API_KEY in .env file"
    missing=1
else
    echo "✓ EMAIL_API_KEY is set (hidden for security)"
fi

if [[ -z "$EMAIL_API_URL" ]]; then
    echo "❌ Missing EMAIL_API_URL in .env file"
    missing=1
else
    echo "✓ EMAIL_API_URL is set to: $EMAIL_API_URL"
fi

# Check DNS
echo -e "\nChecking DNS for mail.${CPANEL_DOMAIN}..."
host_result=$(host mail.${CPANEL_DOMAIN} 2>&1)
if echo "$host_result" | grep -q "has address"; then
    echo "✓ DNS record found for mail.${CPANEL_DOMAIN}"
    echo "  $host_result"
else
    echo "❌ DNS resolution failed for mail.${CPANEL_DOMAIN}"
    echo "  $host_result"
fi

# Check if mail server is reachable
echo -e "\nChecking mail server connectivity..."
nc -zv mail.${CPANEL_DOMAIN} 993 &>/dev/null
if [ $? -eq 0 ]; then
    echo "✓ IMAP server (port 993) is reachable"
else
    echo "❌ Cannot connect to IMAP server on port 993"
fi

nc -zv mail.${CPANEL_DOMAIN} 587 &>/dev/null
if [ $? -eq 0 ]; then
    echo "✓ SMTP server (port 587) is reachable"
else
    echo "❌ Cannot connect to SMTP server on port 587"
fi

# Summary
echo -e "\nRecommendations:"
echo "1. Make sure cPanel API tokens in .env are valid"
echo "2. Verify DNS settings for mail.${CPANEL_DOMAIN}"
echo "3. Check if the mail server is up and running"
echo "4. Test direct login to webmail at https://${CPANEL_DOMAIN}:2096/"

if [ ! -z "$missing" ]; then
    echo -e "\n⚠️ Some configuration issues were found. Please fix them."
    exit 1
else
    echo -e "\n✅ Email configuration looks good!"
    exit 0
fi
