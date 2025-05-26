#!/bin/bash
# dns-mail-fix.sh
# This script checks and recommends fixes for DNS settings for mail.snakkaz.com

echo "============================================="
echo "DNS Mail Configuration Check for Snakkaz Chat"
echo "============================================="
echo

# Extract domain from environment or use default
if [ -f .env ]; then
  source .env
  DOMAIN=${CPANEL_DOMAIN:-"snakkaz.com"}
else
  DOMAIN="snakkaz.com"
  echo "Warning: .env file not found, using default domain: $DOMAIN"
fi

echo "Checking DNS settings for $DOMAIN..."
echo

# Also check the alternative domain
ALT_DOMAIN="snakka.com"
echo "Also checking alternative domain: $ALT_DOMAIN"
echo

# Check A record for mail subdomain
echo "=== A Record for mail.$DOMAIN ==="
host_result=$(host mail.$DOMAIN 2>&1)
if echo "$host_result" | grep -q "has address"; then
  echo "✅ A record found for mail.$DOMAIN:"
  echo "   $host_result"
else
  echo "❌ A record missing or incorrect for mail.$DOMAIN"
  echo "   $host_result"
  echo
  echo "Recommendation:"
  echo "   Add an A record for mail.$DOMAIN pointing to your hosting server IP"
  echo "   Login to your DNS provider and add:"
  echo "   Type: A"
  echo "   Host: mail"
  echo "   Value: <Your hosting server IP>"
  echo "   TTL: 3600"
fi
echo

# Check MX records
echo "=== MX Records for $DOMAIN ==="
mx_result=$(host -t MX $DOMAIN 2>&1)
if echo "$mx_result" | grep -q "mail exchanger"; then
  echo "✅ MX records found for $DOMAIN:"
  echo "   $mx_result"
  
  # Check if MX record points to mail subdomain
  if echo "$mx_result" | grep -q "mail.$DOMAIN"; then
    echo "✅ MX record correctly points to mail.$DOMAIN"
  else
    echo "⚠️ MX record doesn't point to mail.$DOMAIN"
    echo "   Current configuration may work but consider updating"
  fi
else
  echo "❌ MX records missing for $DOMAIN"
  echo
  echo "Recommendation:"
  echo "   Add MX record for $DOMAIN pointing to mail.$DOMAIN"
  echo "   Login to your DNS provider and add:"
  echo "   Type: MX"
  echo "   Host: @"
  echo "   Value: mail.$DOMAIN"
  echo "   Priority: 10"
  echo "   TTL: 3600"
fi
echo

# Check SPF record
echo "=== SPF Record for $DOMAIN ==="
txt_result=$(host -t TXT $DOMAIN 2>&1)
if echo "$txt_result" | grep -q "v=spf1"; then
  echo "✅ SPF record found for $DOMAIN:"
  spf_record=$(echo "$txt_result" | grep "v=spf1")
  echo "   $spf_record"
else
  echo "❌ SPF record missing for $DOMAIN"
  echo
  echo "Recommendation:"
  echo "   Add SPF record to improve email deliverability"
  echo "   Login to your DNS provider and add:"
  echo "   Type: TXT"
  echo "   Host: @"
  echo "   Value: v=spf1 a mx ip4:<your-server-ip> ~all"
  echo "   TTL: 3600"
fi
echo

# Check DMARC record
echo "=== DMARC Record for $DOMAIN ==="
dmarc_result=$(host -t TXT _dmarc.$DOMAIN 2>&1)
if echo "$dmarc_result" | grep -q "v=DMARC1"; then
  echo "✅ DMARC record found for $DOMAIN:"
  dmarc_record=$(echo "$dmarc_result" | grep "v=DMARC1")
  echo "   $dmarc_record"
else
  echo "❌ DMARC record missing for $DOMAIN"
  echo
  echo "Recommendation:"
  echo "   Add DMARC record to improve email deliverability and prevent spoofing"
  echo "   Login to your DNS provider and add:"
  echo "   Type: TXT"
  echo "   Host: _dmarc"
  echo "   Value: v=DMARC1; p=none; sp=none; rua=mailto:admin@$DOMAIN;"
  echo "   TTL: 3600"
fi
echo

# Check if mail server is reachable
echo "=== Mail Server Connectivity ==="
nc -z -w5 mail.$DOMAIN 143 &>/dev/null
imap_result=$?
nc -z -w5 mail.$DOMAIN 993 &>/dev/null
imaps_result=$?
nc -z -w5 mail.$DOMAIN 25 &>/dev/null
smtp_result=$?
nc -z -w5 mail.$DOMAIN 587 &>/dev/null
submission_result=$?

if [ $imaps_result -eq 0 ]; then
  echo "✅ IMAPS (993) is accessible"
else
  echo "❌ IMAPS (993) is NOT accessible"
fi

if [ $imap_result -eq 0 ]; then
  echo "✅ IMAP (143) is accessible"
else
  echo "❌ IMAP (143) is NOT accessible"
fi

if [ $smtp_result -eq 0 ]; then
  echo "✅ SMTP (25) is accessible"
else
  echo "❌ SMTP (25) is NOT accessible"
fi

if [ $submission_result -eq 0 ]; then
  echo "✅ SMTP Submission (587) is accessible"
else
  echo "❌ SMTP Submission (587) is NOT accessible"
fi
echo

# Provide DNS update guidance
echo "=== DNS Update Guidance ==="
echo "After making DNS changes:"
echo "1. DNS changes can take up to 48 hours to propagate worldwide"
echo "2. You can check propagation status using online tools like https://dnschecker.org"
echo "3. Once propagation is complete, test mail.snakkaz.com again"
echo

# Try direct connection to hosting provider
echo "=== Direct Connection Test ==="
echo "If mail.$DOMAIN is not working, try direct connection to hosting provider:"
echo "- Webmail: https://premium123.web-hosting.com:2096/"
echo "- IMAP: premium123.web-hosting.com (port 993)"
echo "- SMTP: premium123.web-hosting.com (port 587)"
echo

# Check alternative domain MX records
echo "=== Alternative Domain Check: $ALT_DOMAIN ==="
alt_mx_result=$(host -t MX $ALT_DOMAIN 2>&1)
if echo "$alt_mx_result" | grep -q "mail exchanger"; then
  echo "✅ MX records found for $ALT_DOMAIN:"
  echo "   $alt_mx_result"
  
  # Check if MX record points to mail subdomain
  if echo "$alt_mx_result" | grep -q "mail.snakkaz.com"; then
    echo "✅ MX record correctly points to mail.snakkaz.com"
  else
    echo "⚠️ MX record doesn't point to mail.snakkaz.com"
    echo "   Current configuration may work but consider updating"
  fi
else
  echo "❌ MX records missing for $ALT_DOMAIN"
  echo
  echo "Recommendation:"
  echo "   Add MX record for $ALT_DOMAIN pointing to mail.snakkaz.com"
  echo "   Login to your DNS provider and add:"
  echo "   Type: MX"
  echo "   Host: @"
  echo "   Value: mail.snakkaz.com"
  echo "   Priority: 10"
  echo "   TTL: 3600"
fi
echo

echo "DNS check complete!"
