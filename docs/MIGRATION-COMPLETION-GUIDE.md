# Snakkaz Chat Migration: Completion Guide

## Overview

This guide provides step-by-step instructions to complete the migration of Snakkaz Chat from Cloudflare to Namecheap hosting. Major components of the migration have already been completed, including code changes, environment variable fixes, and initial deployment setup. This guide focuses on the remaining tasks to ensure full functionality.

## Prerequisites

1. Access to Namecheap hosting control panel
2. SSH access to the hosting server (if available)
3. FTP credentials for the hosting account
4. Domain administrator access

## Step 1: Verify DNS Configuration

Run the subdomain verification script to check the current DNS configuration:

```bash
chmod +x scripts/verify-subdomain-setup.sh
./scripts/verify-subdomain-setup.sh
```

If any subdomain DNS entries are missing, follow the instructions in `configure-namecheap-subdomains.sh`:

```bash
./scripts/configure-namecheap-subdomains.sh
```

## Step 2: Install SSL Certificates

SSL certificates must be installed for the main domain and all subdomains. Use the SSL installation script:

```bash
chmod +x scripts/install-ssl-certificates.sh
sudo ./scripts/install-ssl-certificates.sh
```

After installation, verify certificate status:

```bash
chmod +x scripts/check-ssl-certificates.sh
./scripts/check-ssl-certificates.sh
```

Ensure all domains show valid certificates with at least 30 days before expiration.

## Step 3: Apply Database Optimizations

The following database optimizations should be applied to ensure optimal performance and security:

1. Run the function search path security fix:
```bash
cd scripts
./apply-supabase-optimizations.sh
```

This script will apply the following optimizations:
- Fix function search path security issues
- Optimize Row Level Security (RLS) policies
- Add missing indexes to foreign keys
- Enable leaked password protection

## Step 4: Deploy Application

Deploy the application to the Namecheap hosting server:

```bash
# Build the application
npm run build

# Deploy to server
./upload-to-namecheap.sh
```

Verify deployment success by checking if all subdomains are accessible.

## Step 5: Perform Performance Testing

Run the performance testing script to evaluate the application's performance:

```bash
chmod +x scripts/performance-test.sh
./scripts/performance-test.sh
```

Review the generated performance report and implement optimizations if necessary.

## Step 6: Conduct Security Evaluation

Evaluate the security posture of the application after migration:

```bash
chmod +x scripts/security-evaluation.sh
./scripts/security-evaluation.sh
```

Review the security recommendations in the generated report and implement critical security improvements.

## Step 7: Test Application Functionality

Test the application thoroughly to ensure all features work as expected:

1. Test authentication
2. Test chat functionality
3. Test media encryption
4. Test notification system
5. Test all subdomains

### Test Authentication

1. Open https://www.snakkaz.com
2. Sign up with a new account
3. Verify email confirmation process
4. Log out and log back in
5. Test password reset functionality

### Test Chat Functionality

1. Create new chat conversations
2. Send and receive messages
3. Create group chats
4. Test file sharing
5. Verify end-to-end encryption

## Step 8: Finalize Migration

Once all tests are successful, finalize the migration:

1. Update the migration status document:
```bash
nano docs/MIGRATION-FINAL-STATUS.md
```

2. Deactivate Cloudflare account or downgrade subscription:
   - Log in to Cloudflare
   - Navigate to account settings
   - Downgrade plan or cancel subscription

3. Set up regular monitoring:
   - Configure uptime monitoring for all domains
   - Set up performance monitoring
   - Configure security alerts

## Step 9: Post-Migration Tasks

### Automatic SSL Renewal

Set up automatic SSL certificate renewal:

```bash
# Add to crontab if you have SSH access
(crontab -l 2>/dev/null; echo "0 0 1 * * /path/to/scripts/install-ssl-certificates.sh --renew") | crontab -
```

Alternatively, set up renewal through Namecheap's control panel.

### Regular Backups

Configure regular database backups:

1. Set up Supabase scheduled backups
2. Configure regular file backups for the web server

### Security Hardening

Implement security recommendations from the security evaluation:

1. Apply recommended security headers
2. Configure firewall rules
3. Implement rate limiting
4. Set up intrusion detection

## Troubleshooting

### Common Issues

1. **DNS Propagation**
   - Issue: Subdomains not resolving
   - Solution: Wait for DNS propagation (can take up to 48 hours)

2. **SSL Certificate Issues**
   - Issue: Certificate errors or warnings
   - Solution: Re-run `install-ssl-certificates.sh` or troubleshoot specific domain issues

3. **FTP Connection Issues**
   - Issue: Upload failures
   - Solution: Verify FTP credentials and server settings, or try using SFTP if available

4. **Supabase Connection Errors**
   - Issue: Application cannot connect to Supabase
   - Solution: Verify Supabase URL and anon key in environment.ts

### Support Resources

- Namecheap Support: https://www.namecheap.com/support/
- Supabase Documentation: https://supabase.com/docs
- Let's Encrypt Documentation: https://letsencrypt.org/docs/

## Final Checklist

Use the migration checklist document to ensure all tasks are completed:

```bash
cat docs/MIGRATION-FINAL-STATUS.md
```

Update the checklist as tasks are completed, and mark the migration as completed once all items are checked.

## Conclusion

The migration from Cloudflare to Namecheap hosting is a complex process, but following this guide will ensure a smooth transition. By completing each step methodically and thoroughly testing the application, you can ensure that Snakkaz Chat continues to function optimally in its new hosting environment.
