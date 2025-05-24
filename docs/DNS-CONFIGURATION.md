# Snakkaz DNS Configuration

## Domain Information
- Primary domain: snakkaz.com
- Alternative domain: snakka.com
- Server IP: 162.0.229.214
- Nameservers:
  - dns1.namecheaphosting.com
  - dns2.namecheaphosting.com

## MX Records Configuration

### snakkaz.com MX Records:
- Priority 5: mx1-hosting.jellyfish.systems
- Priority 10: **mail.snakkaz.com** ✅
- Priority 10: mx2-hosting.jellyfish.systems
- Priority 20: mx3-hosting.jellyfish.systems

### snakka.com MX Records:
- Priority 10: **mail.snakkaz.com** ✅ (Added May 24, 2025)

## Configured Subdomains
The following subdomains are configured on the Namecheap hosting:

### Main Domains
- www.snakkaz.com (CNAME → snakkaz.com)
- mail.snakkaz.com
- ftp.snakkaz.com
- webmail.snakkaz.com
- cpanel.snakkaz.com

### Application Subdomains
- dash.snakkaz.com
- business.snakkaz.com
- docs.snakkaz.com
- analytics.snakkaz.com

### Administrative Subdomains
- whm.snakkaz.com
- cpcontacts.snakkaz.com
- cpcalendars.snakkaz.com
- webdisk.snakkaz.com
- autodiscover.snakkaz.com
- autoconfig.snakkaz.com

## DNS Record TTL
All DNS records are set with a TTL (Time To Live) of 14400 seconds (4 hours).

## SPF Records
The domain has SPF records configured for email authentication:
```
v=spf1 +a +mx +ip4:162.0.229.212 +ip4:162.0.229.214 include:spf.web-hosting.com ~all
```

## DKIM Configuration
DKIM (DomainKeys Identified Mail) is configured for email authentication.

## DMARC Policy
DMARC policy is set to monitoring mode:
```
v=DMARC1; p=none;
```

## CalDAV and CardDAV Services
Various SRV records are configured for calendar and contact synchronization services.

## Nameserver Configuration
The domain is currently using Namecheap's nameservers:
- dns1.namecheaphosting.com
- dns2.namecheaphosting.com

This configuration is correct for a domain hosted on Namecheap's Stellar Plus hosting plan. The domain should remain pointed to these nameservers for all hosting services to work correctly.

## Hosting Information
- Provider: Namecheap Stellar Plus
- Expiration Date: May 16, 2026
- Auto-Renew: Enabled
- Server Hostname: premium123.web-hosting.com

## Notes
- DNS changes typically take up to 30 minutes to propagate through the network.
- The server is located in a US Datacenter.
- All subdomains currently point to the same IP address (162.0.229.214).
- SSL certificates need to be configured through cPanel's SSL/TLS section.
