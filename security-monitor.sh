#!/bin/bash
# security-monitor.sh - Monitor for security threats

LOG_FILE="security.log"
DATE=$(date "+%Y-%m-%d %H:%M:%S")

# Function to log security events
log_security_event() {
    echo "[$DATE] SECURITY: $1" >> $LOG_FILE
    echo "Security event logged: $1"
}

# Check for suspicious activity in web logs
check_access_logs() {
    if [ -f "/var/log/apache2/access.log" ]; then
        # Check for SQL injection attempts
        SQLI_COUNT=$(grep -c "union\|select\|drop\|insert" /var/log/apache2/access.log | tail -1000)
        if [ "$SQLI_COUNT" -gt 10 ]; then
            log_security_event "High number of SQL injection attempts detected: $SQLI_COUNT"
        fi
        
        # Check for XSS attempts
        XSS_COUNT=$(grep -c "script\|javascript\|alert" /var/log/apache2/access.log | tail -1000)
        if [ "$XSS_COUNT" -gt 5 ]; then
            log_security_event "XSS attempts detected: $XSS_COUNT"
        fi
        
        # Check for 404 scanning
        SCAN_COUNT=$(grep " 404 " /var/log/apache2/access.log | tail -1000 | wc -l)
        if [ "$SCAN_COUNT" -gt 50 ]; then
            log_security_event "Potential directory scanning detected: $SCAN_COUNT 404s"
        fi
    fi
}

# Check disk space for potential DoS
check_disk_space() {
    DISK_USAGE=$(df / | awk 'NR==2{print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -gt 90 ]; then
        log_security_event "Disk usage critical: ${DISK_USAGE}% - potential DoS"
    fi
}

# Check for failed login attempts (if using fail2ban)
check_failed_logins() {
    if command -v fail2ban-client &> /dev/null; then
        BANNED_IPS=$(fail2ban-client status sshd | grep "Banned IP list" | wc -w)
        if [ "$BANNED_IPS" -gt 5 ]; then
            log_security_event "High number of banned IPs: $BANNED_IPS"
        fi
    fi
}

# Run checks
echo "Running security monitoring..."
check_access_logs
check_disk_space
check_failed_logins

echo "Security monitoring complete. Check $LOG_FILE for events."
