#!/bin/bash

echo "🔍 DNS Fix Monitor - Watching for MX record removal"
echo "=================================================="
echo "Monitoring: mail.snakkaz.com MX records"
echo "Goal: Should show NO results when fix is complete"
echo "Press Ctrl+C to stop monitoring"
echo

while true; do
    timestamp=$(date '+%H:%M:%S')
    mx_result=$(dig +short MX mail.snakkaz.com)
    
    if [ -n "$mx_result" ]; then
        echo "[$timestamp] ❌ Still has MX record: $mx_result"
    else
        echo "[$timestamp] ✅ SUCCESS! No MX records found - Fix is complete!"
        echo
        echo "🎉 The circular MX reference has been resolved!"
        echo "Your mail configuration is now correct."
        break
    fi
    
    sleep 300  # Check every 5 minutes
done

echo
echo "Final verification:"
echo "✅ mail.snakkaz.com MX records: $(dig +short MX mail.snakkaz.com || echo 'NONE (correct!)')"
echo "✅ mail.snakkaz.com A record: $(dig +short A mail.snakkaz.com)"
echo "✅ snakkaz.com MX records: $(dig +short MX snakkaz.com | wc -l) records found"
