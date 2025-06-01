#!/bin/bash

echo "=== Snakkaz DNS Mail Configuration Check ==="
echo "Date: $(date)"
echo

# Check MX records for snakkaz.com
echo "1. Checking MX records for snakkaz.com..."
dig +short MX snakkaz.com
echo

# Check MX records for snakka.com  
echo "2. Checking MX records for snakka.com..."
dig +short MX snakka.com
echo

# CRITICAL: Check for circular MX reference
echo "3. 🚨 CHECKING FOR CIRCULAR MX REFERENCE..."
mx_check=$(dig +short MX mail.snakkaz.com)
if [ -n "$mx_check" ]; then
    echo "❌ CRITICAL ISSUE: mail.snakkaz.com has MX records (should have NONE)"
    echo "Found: $mx_check"
    echo "⚠️  This creates a circular reference and must be fixed immediately!"
    echo "    See DNS-MX-CIRCULAR-FIX.md for instructions"
else
    echo "✅ Good: mail.snakkaz.com has no MX records"
fi
echo

# Check A record for mail server
echo "4. Checking A record for mail.snakkaz.com..."
mail_ip=$(dig +short A mail.snakkaz.com)
if [ "$mail_ip" = "162.0.229.214" ]; then
    echo "✅ Mail server IP correct: $mail_ip"
else
    echo "❌ Mail server IP issue: $mail_ip (expected: 162.0.229.214)"
fi
echo

# Check mail server connectivity
echo "5. Testing mail server connectivity..."
nc -zv mail.snakkaz.com 993 &>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ IMAP server (port 993) is reachable"
else
    echo "❌ Cannot connect to IMAP server on port 993"
fi

nc -zv mail.snakkaz.com 587 &>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ SMTP server (port 587) is reachable"
else
    echo "❌ Cannot connect to SMTP server on port 587"
fi
echo

echo "=== Configuration Summary ==="
echo "Mail Server: mail.snakkaz.com (162.0.229.214)"
echo "Webmail: https://mail.snakkaz.com"
echo "IMAP: mail.snakkaz.com:993 (SSL)"
echo "SMTP: mail.snakkaz.com:587 (TLS)"
echo
echo "⚠️  If any issues were found above, please fix them immediately!"
echo "📖 See MAIL-MX-UPDATE-MAY24-2025.md for full documentation"
