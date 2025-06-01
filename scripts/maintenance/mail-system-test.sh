#!/bin/bash
# mail-system-test.sh - Comprehensive test for mail.snakkaz.com
# This script checks Roundcube configuration and connection issues

echo "================================================"
echo "Mail System Test for mail.snakkaz.com"
echo "================================================"

# Check if curl is installed
if ! command -v curl &> /dev/null; then
    echo "❌ curl is not installed. Please install it first."
    exit 1
fi

# Check if openssl is installed
if ! command -v openssl &> /dev/null; then
    echo "❌ openssl is not installed. Please install it first."
    exit 1
fi

# Define variables
MAIL_DOMAIN="mail.snakkaz.com"
DIRECT_DOMAIN="premium123.web-hosting.com"
MAIL_USER="help@snakkaz.com"
MAIL_PORTS=("993" "143" "587" "25" "110" "995")
MAIL_SERVICES=("IMAPS" "IMAP" "SMTP Submission" "SMTP" "POP3" "POP3S")

# Ask for password
read -sp "Enter email password for testing (will not be stored): " MAIL_PASSWORD
echo

# Check website response
echo -e "\n=== Website Connectivity ==="
echo "Testing Roundcube webmail at https://$MAIL_DOMAIN..."
CURL_RESULT=$(curl -s -o /dev/null -w "%{http_code}" -m 10 https://$MAIL_DOMAIN)
if [ "$CURL_RESULT" = "200" ] || [ "$CURL_RESULT" = "302" ]; then
    echo "✅ Website is accessible (HTTP status $CURL_RESULT)"
else
    echo "❌ Website is NOT accessible (HTTP status $CURL_RESULT)"
    echo "  Trying direct hosting URL..."
    
    DIRECT_RESULT=$(curl -s -o /dev/null -w "%{http_code}" -m 10 https://$DIRECT_DOMAIN:2096)
    if [ "$DIRECT_RESULT" = "200" ] || [ "$DIRECT_RESULT" = "302" ]; then
        echo "✅ Direct hosting webmail is accessible (HTTP status $DIRECT_RESULT)"
        echo "  Use https://$DIRECT_DOMAIN:2096 instead of mail.$MAIL_DOMAIN"
    else
        echo "❌ Direct hosting webmail is also NOT accessible (HTTP status $DIRECT_RESULT)"
    fi
fi

# Check HTTPS certificate
echo -e "\n=== SSL Certificate Check ==="
echo "Testing SSL certificate for https://$MAIL_DOMAIN..."
SSL_RESULT=$(echo | openssl s_client -servername $MAIL_DOMAIN -connect $MAIL_DOMAIN:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
if [ -n "$SSL_RESULT" ]; then
    echo "✅ SSL certificate is valid"
    echo "  $SSL_RESULT"
else
    echo "❌ SSL certificate check failed"
    echo "  Try direct hosting URL: https://$DIRECT_DOMAIN:2096"
    SSL_DIRECT=$(echo | openssl s_client -servername $DIRECT_DOMAIN -connect $DIRECT_DOMAIN:2096 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
    if [ -n "$SSL_DIRECT" ]; then
        echo "✅ Direct hosting SSL certificate is valid"
        echo "  $SSL_DIRECT"
    fi
fi

# Check mail ports
echo -e "\n=== Mail Ports Check ==="
for i in ${!MAIL_PORTS[@]}; do
    PORT=${MAIL_PORTS[$i]}
    SERVICE=${MAIL_SERVICES[$i]}
    
    echo "Testing $SERVICE (port $PORT) on $MAIL_DOMAIN..."
    if nc -z -w5 $MAIL_DOMAIN $PORT 2>/dev/null; then
        echo "✅ $SERVICE port $PORT is open"
    else
        echo "❌ $SERVICE port $PORT is closed or filtered"
        
        # Try direct hosting domain
        if nc -z -w5 $DIRECT_DOMAIN $PORT 2>/dev/null; then
            echo "✅ $SERVICE port $PORT is open on $DIRECT_DOMAIN"
        else
            echo "❌ $SERVICE port $PORT is closed on $DIRECT_DOMAIN too"
        fi
    fi
done

# Test login to IMAP
echo -e "\n=== IMAP Login Test ==="
echo "Testing IMAP login with $MAIL_USER..."

# Try with mail.snakkaz.com
(
    exec 3<>/dev/tcp/$MAIL_DOMAIN/993
    sleep 1
    echo -n "a001 LOGIN \"$MAIL_USER\" \"$MAIL_PASSWORD\"" >&3
    sleep 1
    RESULT=$(cat <&3)
    if echo "$RESULT" | grep -q "a001 OK"; then
        echo "✅ IMAP login successful on $MAIL_DOMAIN"
    else
        echo "❌ IMAP login failed on $MAIL_DOMAIN"
    fi
    exec 3<&-
) 2>/dev/null || echo "❌ Failed to connect to IMAP on $MAIL_DOMAIN"

# Try with direct hosting domain
(
    exec 3<>/dev/tcp/$DIRECT_DOMAIN/993
    sleep 1
    echo -n "a001 LOGIN \"$MAIL_USER\" \"$MAIL_PASSWORD\"" >&3
    sleep 1
    RESULT=$(cat <&3)
    if echo "$RESULT" | grep -q "a001 OK"; then
        echo "✅ IMAP login successful on $DIRECT_DOMAIN"
    else
        echo "❌ IMAP login failed on $DIRECT_DOMAIN"
    fi
    exec 3<&-
) 2>/dev/null || echo "❌ Failed to connect to IMAP on $DIRECT_DOMAIN"

# Fix for "Ugyldig forespørsel! Ingen data ble lagret." error
echo -e "\n=== Roundcube Configuration Check ==="
echo "The error 'Ugyldig forespørsel! Ingen data ble lagret.' is typically caused by:"
echo "1. Session handling issues in Roundcube configuration"
echo "2. CSRF protection problems"
echo "3. Incorrect database permissions"

echo -e "\nRecommendations to fix the error:"
echo "1. Check the Roundcube configuration file (config.inc.php):"
echo "   - Set \$config['check_referer'] = false; to disable referer checking"
echo "   - Update \$config['session_domain'] = 'mail.snakkaz.com';"
echo "   - Ensure database permissions are correct"
echo -e "2. Check database connection:"
echo "   - Verify that the database user has full permissions"
echo "   - Check if the database connection string is correct"
echo "3. Upload the provided roundcube-config.inc.php file to:"
echo "   /home/snakqsqe/mail.snakkaz.com/config/config.inc.php"
echo -e "4. Set proper permissions:"
echo "   chmod 644 /home/snakqsqe/mail.snakkaz.com/config/config.inc.php"
echo

echo "Mail system test complete!"
