# Bitcoin/Electrum Wallet Operational Guide

## Overview

This operational guide provides comprehensive instructions for the management, backup, and maintenance of the Bitcoin/Electrum payment system in Snakkaz Chat. It is intended for system administrators and operational staff responsible for the day-to-day operation of the payment infrastructure.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Wallet Backup Procedures](#wallet-backup-procedures)
3. [Routine Maintenance Tasks](#routine-maintenance-tasks)
4. [Monitoring](#monitoring)
5. [Troubleshooting Common Issues](#troubleshooting-common-issues)
6. [Security Incidents](#security-incidents)
7. [Recovery Procedures](#recovery-procedures)

## System Architecture

The Bitcoin payment system consists of the following components:

- **Electrum Wallet Server**: Manages Bitcoin addresses and transactions
- **ElectrumConnector**: Node.js module interfacing with Electrum via JSON-RPC
- **BitcoinElectrumAdapter**: Translation layer between payment system and Electrum
- **ElectrumPaymentProcessor**: Background service monitoring for new payments
- **Database**: Stores payment and wallet metadata in Supabase tables

### Directory Structure

```
/src/server/payments/        - Core payment modules
  electrumConnector.js       - Connection to Electrum server
  bitcoinElectrumAdapter.js  - Adapter for payment service
  
/src/server/jobs/
  electrumPaymentProcessor.js - Background payment processing

/src/services/electrum/
  ElectrumService.ts         - Service for wallet operations
  
/database/
  electrum_integration.sql   - Database schema for Bitcoin payments
```

### Configuration Files

Primary configuration is via environment variables in `.env` file or deployment environment:

```
ENABLE_ELECTRUM_PAYMENTS=true
ELECTRUM_HOST=localhost
ELECTRUM_PORT=50001
ELECTRUM_PROTOCOL=tls
ELECTRUM_WALLET_PATH=/path/to/wallet/file
ELECTRUM_WALLET_PASSWORD=secure-wallet-password
ELECTRUM_MIN_CONFIRMATIONS=3
ELECTRUM_CHECK_INTERVAL=60000
```

## Wallet Backup Procedures

### Daily Automated Backup

A daily backup of the Electrum wallet should be performed automatically:

1. **Wallet File Backup**:

   ```bash
   # Script location: /scripts/backup-electrum-wallet.sh
   
   #!/bin/bash
   DATE=$(date +%Y%m%d)
   WALLET_PATH="/path/to/electrum/wallets/"
   BACKUP_PATH="/secure/backup/bitcoin/$DATE/"
   
   # Create backup directory
   mkdir -p $BACKUP_PATH
   
   # Copy wallet files
   cp -r $WALLET_PATH/* $BACKUP_PATH
   
   # Encrypt the backup
   gpg --encrypt --recipient wallet-admin@snakkaz.com $BACKUP_PATH/*
   
   # Remove unencrypted files
   rm $BACKUP_PATH/*.dat
   
   # Sync to off-site storage
   rclone sync $BACKUP_PATH remote:bitcoin-backups/$DATE/
   
   echo "Backup completed at $(date)"
   ```

2. **Database Backup**:
   
   ```bash
   # Script location: /scripts/backup-bitcoin-db.sh
   
   #!/bin/bash
   DATE=$(date +%Y%m%d)
   BACKUP_PATH="/secure/backup/bitcoin-db/$DATE/"
   
   # Create backup directory
   mkdir -p $BACKUP_PATH
   
   # Backup Bitcoin-related tables from Supabase
   PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -U $DB_USER $DB_NAME \
     -t electrum_payments -t bitcoin_wallets -t electrum_transaction_cache \
     > $BACKUP_PATH/bitcoin-tables.sql
   
   # Encrypt the backup
   gpg --encrypt --recipient db-admin@snakkaz.com $BACKUP_PATH/bitcoin-tables.sql
   
   # Remove unencrypted files
   rm $BACKUP_PATH/bitcoin-tables.sql
   
   # Sync to off-site storage
   rclone sync $BACKUP_PATH remote:bitcoin-db-backups/$DATE/
   
   echo "Database backup completed at $(date)"
   ```

### Verification of Backups

Regularly verify that backups are valid and can be restored:

1. **Weekly Verification Procedure**:

   ```bash
   # Script location: /scripts/verify-bitcoin-backups.sh
   
   #!/bin/bash
   # Pick most recent backup
   LATEST_BACKUP=$(ls -td /secure/backup/bitcoin/*/ | head -1)
   TEST_RESTORE_PATH="/tmp/electrum-test-restore"
   
   # Clean test directory
   rm -rf $TEST_RESTORE_PATH
   mkdir -p $TEST_RESTORE_PATH
   
   # Decrypt and extract
   gpg --decrypt $LATEST_BACKUP/*.gpg > $TEST_RESTORE_PATH/wallet.dat
   
   # Verify wallet file integrity
   electrum -w $TEST_RESTORE_PATH/wallet.dat validateaddress $(electrum -w $TEST_RESTORE_PATH/wallet.dat getunusedaddress)
   
   if [ $? -eq 0 ]; then
     echo "Backup verification successful!"
   else
     echo "BACKUP VERIFICATION FAILED! ALERT ADMIN!"
     # Send alert email
     mail -s "URGENT: Bitcoin wallet backup verification failed" admin@snakkaz.com < /dev/null
   fi
   
   # Clean up
   rm -rf $TEST_RESTORE_PATH
   ```

### Manual Backup Procedure

In addition to automated backups, perform a manual backup monthly:

1. Stop the Electrum daemon:
   ```bash
   sudo systemctl stop electrum
   ```

2. Copy wallet files to encrypted USB drive:
   ```bash
   cp -r /path/to/electrum/wallets/ /media/secure-usb/wallets-backup-$(date +%Y%m%d)/
   ```

3. Export wallet master public keys:
   ```bash
   electrum getmpk > /media/secure-usb/mpk-backup-$(date +%Y%m%d).txt
   ```

4. Restart the Electrum daemon:
   ```bash
   sudo systemctl start electrum
   ```

5. Store the USB drive in a secure, off-site location.

## Routine Maintenance Tasks

### Daily Tasks

1. **Check System Status**:
   ```bash
   # Script location: /scripts/check-electrum-status.sh
   
   #!/bin/bash
   
   # Check if Electrum service is running
   if systemctl is-active --quiet electrum; then
     echo "Electrum service is running"
   else
     echo "WARNING: Electrum service is not running!"
     # Send alert
     mail -s "ALERT: Electrum service down" admin@snakkaz.com < /dev/null
   fi
   
   # Check wallet balance
   BALANCE=$(curl -s -X POST -H "Content-Type: application/json" \
     -d '{"method": "getbalance", "params": [], "id": 1}' \
     http://localhost:7777)
   
   echo "Current wallet balance: $BALANCE"
   
   # Check recent transactions
   TRANSACTIONS=$(curl -s -X POST -H "Content-Type: application/json" \
     -d '{"method": "listtransactions", "params": ["*", 10], "id": 2}' \
     http://localhost:7777)
   
   echo "Recent transactions: $TRANSACTIONS"
   ```

2. **Verify Payment Processing**:
   ```bash
   # Check logs for payment processing activity
   grep "payment" /var/log/snakkaz-chat/application.log | tail -50
   
   # Check for any errors in payment processing
   grep -i "error\|exception\|failed" /var/log/snakkaz-chat/application.log | grep "payment\|bitcoin\|electrum" | tail -20
   ```

### Weekly Tasks

1. **Update Electrum Software** (if updates available):
   ```bash
   # Stop Electrum service
   sudo systemctl stop electrum
   
   # Backup current installation
   cp -r /path/to/electrum /path/to/electrum.backup-$(date +%Y%m%d)
   
   # Update software
   cd /path/to/electrum
   git pull
   ./contrib/build-linux/sdist/build.sh
   
   # Restart service
   sudo systemctl start electrum
   ```

2. **Database Maintenance**:
   ```bash
   # Connect to database
   psql -h $DB_HOST -U $DB_USER $DB_NAME
   
   # Analyze Bitcoin tables
   ANALYZE electrum_payments;
   ANALYZE bitcoin_wallets;
   ANALYZE electrum_transaction_cache;
   
   # Archive old completed payments (optional)
   INSERT INTO electrum_payments_archive
   SELECT * FROM electrum_payments
   WHERE status = 'completed'
   AND created_at < NOW() - INTERVAL '90 days';
   
   DELETE FROM electrum_payments
   WHERE status = 'completed'
   AND created_at < NOW() - INTERVAL '90 days';
   ```

### Monthly Tasks

1. **Security Review**:
   - Review access logs for suspicious activity
   - Check for unauthorized wallet access attempts
   - Verify all admin accounts are secure
   - Update access credentials if needed

2. **Performance Optimization**:
   - Review transaction processing times
   - Optimize database queries related to payments
   - Clean up transaction cache

3. **Cold Storage Transfer**:
   ```bash
   # Connect to admin panel
   # Navigate to Wallet Operations -> Cold Storage Transfer
   # Enter amount to transfer (keep only necessary funds in hot wallet)
   # Verify cold storage address
   # Confirm with 2FA
   ```

## Monitoring

### Metrics to Monitor

1. **Wallet Health**:
   - Current balance
   - Number of addresses in use
   - Connection status to Electrum server

2. **Transaction Metrics**:
   - Payment processing time
   - Confirmation time (average)
   - Success rate of payment confirmations

3. **System Resources**:
   - CPU usage of Electrum processes
   - Memory consumption
   - Disk space for wallet and database

### Monitoring Setup

Configure Prometheus and Grafana to monitor Bitcoin payment system:

```yaml
# /etc/prometheus/prometheus.yml

scrape_configs:
  - job_name: 'snakkaz-bitcoin'
    metrics_path: '/api/metrics/bitcoin'
    scrape_interval: 30s
    static_configs:
      - targets: ['localhost:8080']
```

Key Grafana dashboards:
- Bitcoin Payment Overview
- Transaction Processing Performance
- Wallet Security & Status

### Alerting Rules

Configure alerts for:
1. Electrum service down
2. Unusual wallet balance changes (>10% in 1 hour)
3. High rate of failed payments
4. Connection issues with Electrum server
5. Abnormal transaction patterns

## Troubleshooting Common Issues

### 1. Payment Not Confirmed

**Symptoms:** Payment shows as "pending" for an extended period.

**Troubleshooting Steps:**
1. Check Bitcoin network congestion:
   ```bash
   curl -s https://mempool.space/api/v1/fees/recommended | jq
   ```

2. Verify transaction on blockchain:
   ```bash
   # Get transaction ID
   TXID=$(curl -s -X POST -H "Content-Type: application/json" \
     -d '{"method": "gettransaction", "params": ["payment-reference"], "id": 1}' \
     http://localhost:7777 | jq -r '.result.txid')
     
   # Check transaction status
   curl -s https://blockstream.info/api/tx/$TXID | jq
   ```

3. Check for insufficient fee:
   ```bash
   # Get transaction fee
   curl -s -X POST -H "Content-Type: application/json" \
     -d '{"method": "gettransaction", "params": ["$TXID"], "id": 1}' \
     http://localhost:7777 | jq '.result.fee'
   ```

**Resolution:**
- For network congestion, wait or consider using RBF (Replace-By-Fee)
- For insufficient fee, consider fee bumping if possible
- Update user about delay

### 2. Electrum Connection Issues

**Symptoms:** Unable to connect to Electrum server, connection timeouts.

**Troubleshooting Steps:**
1. Check if Electrum server is running:
   ```bash
   systemctl status electrum
   ```

2. Check server logs:
   ```bash
   journalctl -u electrum --since "1 hour ago"
   ```

3. Verify network connectivity:
   ```bash
   telnet localhost 50001
   ```

**Resolution:**
- Restart Electrum service:
  ```bash
  sudo systemctl restart electrum
  ```
- Check firewall settings
- Try alternate Electrum servers

### 3. Database Synchronization Issues

**Symptoms:** Payments marked as complete in Electrum but not in application database.

**Troubleshooting Steps:**
1. Check payment processor logs:
   ```bash
   grep "ElectrumPaymentProcessor" /var/log/snakkaz-chat/application.log | tail -100
   ```
   
2. Verify payment status in database:
   ```sql
   SELECT * FROM electrum_payments 
   WHERE bitcoin_address = '[address]';
   ```
   
3. Check Electrum payment status:
   ```bash
   curl -s -X POST -H "Content-Type: application/json" \
     -d '{"method": "getaddresshistory", "params": ["[address]"], "id": 1}' \
     http://localhost:7777
   ```

**Resolution:**
- Manually update payment status if needed:
  ```sql
  UPDATE electrum_payments 
  SET status = 'confirmed', updated_at = NOW() 
  WHERE bitcoin_address = '[address]';
  ```
- Restart payment processor:
  ```bash
  curl -X POST http://localhost:8080/api/admin/restart-payment-processor
  ```

## Security Incidents

### Detecting Incidents

Signs of potential security incidents:
- Unexpected transactions from hot wallet
- Failed login attempts to admin panel
- Unusual API access patterns
- System resource anomalies
- Database query pattern changes

### Incident Response Procedure

1. **Immediate Actions**:
   - Disconnect affected systems from network
   - Stop Electrum service
   - Block admin panel access
   - Notify security team

2. **Assessment**:
   - Determine affected components
   - Assess financial impact
   - Identify breach vector
   - Document timeline of events

3. **Containment and Recovery**:
   - Move funds to secure cold wallet
   - Revoke compromised credentials
   - Reset all access tokens
   - Restore from clean backups

4. **Post-Incident**:
   - Conduct thorough investigation
   - Document lessons learned
   - Implement prevention measures
   - Update security protocols

### Emergency Contacts

Maintain a list of emergency contacts:
- Security team lead: [email/phone]
- System administrator: [email/phone]
- Bitcoin specialist: [email/phone]
- Legal counsel: [email/phone]

## Recovery Procedures

### Wallet Recovery

If the hot wallet is compromised or corrupted:

1. **Stop Services**:
   ```bash
   sudo systemctl stop electrum
   sudo systemctl stop snakkaz-payment-processor
   ```

2. **Restore Wallet**:
   ```bash
   # Identify most recent backup
   LATEST_BACKUP=$(ls -td /secure/backup/bitcoin/*/ | head -1)
   
   # Decrypt backup
   gpg --decrypt $LATEST_BACKUP/wallet.gpg > /tmp/wallet.dat
   
   # Verify wallet
   electrum -w /tmp/wallet.dat validateaddress $(electrum -w /tmp/wallet.dat getunusedaddress)
   
   # Restore to proper location
   cp /tmp/wallet.dat /path/to/electrum/wallets/default_wallet
   
   # Secure permissions
   chmod 600 /path/to/electrum/wallets/default_wallet
   chown electrum:electrum /path/to/electrum/wallets/default_wallet
   ```

3. **Restore Database**:
   ```bash
   # Restore from latest backup
   LATEST_DB_BACKUP=$(ls -td /secure/backup/bitcoin-db/*/ | head -1)
   
   # Decrypt backup
   gpg --decrypt $LATEST_DB_BACKUP/bitcoin-tables.sql.gpg > /tmp/bitcoin-tables.sql
   
   # Restore to database
   PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER $DB_NAME < /tmp/bitcoin-tables.sql
   
   # Clean up
   rm /tmp/bitcoin-tables.sql
   ```

4. **Restart Services**:
   ```bash
   sudo systemctl start electrum
   sudo systemctl start snakkaz-payment-processor
   ```

5. **Verify Recovery**:
   - Check wallet balance
   - Verify address generation
   - Test a small transaction

### Database Recovery

If payment database is corrupted:

1. **Restore from Backup**:
   Follow database restore procedure above.

2. **Reconcile with Blockchain**:
   ```bash
   # Run reconciliation script
   node scripts/reconcile-bitcoin-payments.js
   ```

3. **Handle Inconsistencies**:
   - For confirmed blockchain payments not in database, add them
   - For pending database payments not on blockchain, mark as expired
   - Generate reconciliation report for review

## Change Management

All changes to the Bitcoin payment system should follow this procedure:

1. **Document Proposed Change**:
   - Detail what will be modified
   - Explain purpose and benefits
   - List potential risks and mitigation

2. **Review and Approval**:
   - Technical review by senior developer
   - Security review for sensitive changes
   - Management approval for major changes

3. **Testing**:
   - Test changes in staging environment
   - Perform security testing if applicable
   - Verify backup and recovery still function

4. **Implementation**:
   - Schedule change during low-traffic period
   - Create rollback plan
   - Document actual changes made

5. **Monitoring**:
   - Watch system closely after change
   - Verify functionality
   - Document lessons learned

## Appendix

### Important Directories and Files

- Wallet directory: `/path/to/electrum/wallets/`
- Configuration: `/etc/electrum/config`
- Logs: `/var/log/electrum/`
- Backup storage: `/secure/backup/bitcoin/`

### Required Permissions

- Wallet files: `600 (rw-------)`
- Configuration: `640 (rw-r-----)`
- Backup scripts: `700 (rwx------)`
- Log directory: `750 (rwxr-x---)`

### Reference Documentation

- [Electrum Documentation](https://electrum.readthedocs.io/en/latest/)
- [Bitcoin Core Documentation](https://developer.bitcoin.org/reference/)
- [Internal Security Protocols](/docs/Security/BITCOIN-WALLET-SECURITY-REVIEW.md)
- [Database Schema Documentation](/database/README.md)
