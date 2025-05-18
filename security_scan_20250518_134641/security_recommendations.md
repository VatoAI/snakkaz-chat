# Snakkaz Security Recommendations

## After Migration from Cloudflare to Namecheap

Date: Sun May 18 13:46:59 UTC 2025

### Security Headers

1. Implement all missing security headers:
   - Content-Security-Policy: Defines allowed content sources
   - Strict-Transport-Security: Enforces HTTPS
   - X-Content-Type-Options: Prevents MIME type sniffing
   - X-Frame-Options: Prevents clickjacking
   - X-XSS-Protection: Helps prevent XSS attacks
   - Referrer-Policy: Controls referrer information
   - Permissions-Policy: Controls browser features

2. Sample .htaccess configuration for security headers:
```
<IfModule mod_headers.c>
    # Enable HSTS
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    
    # Prevent clickjacking
    Header always set X-Frame-Options "SAMEORIGIN"
    
    # Prevent XSS attacks
    Header always set X-XSS-Protection "1; mode=block"
    
    # Prevent MIME type sniffing
    Header always set X-Content-Type-Options "nosniff"
    
    # Referrer policy
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Content Security Policy (customize based on your needs)
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.gpteng.co; connect-src 'self' *.supabase.co *.supabase.in wss://*.supabase.co *.amazonaws.com storage.googleapis.com *.snakkaz.com cdn.gpteng.co; img-src 'self' data: blob: *.amazonaws.com storage.googleapis.com *.supabase.co *.supabase.in;"
    
    # Permissions policy
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()"
</IfModule>
```

### SSL/TLS Configuration

1. Ensure only secure protocols are enabled (TLS 1.2 and TLS 1.3)
2. Disable SSLv3, TLS 1.0, and TLS 1.1
3. Use strong cipher suites
4. Configure perfect forward secrecy

Sample Apache configuration:
```
<IfModule mod_ssl.c>
    SSLProtocol -all +TLSv1.2 +TLSv1.3
    SSLCipherSuite HIGH:!aNULL:!MD5:!3DES
    SSLHonorCipherOrder on
    SSLCompression off
    SSLSessionTickets off
</IfModule>
```

### WAF Replacement (Cloudflare Alternative)

1. Consider installing ModSecurity on your Namecheap hosting if supported
2. Configure rate limiting in .htaccess:
```
<IfModule mod_rewrite.c>
    RewriteEngine on
    RewriteCond %{REQUEST_METHOD} POST
    RewriteCond %{HTTP:X-Forwarded-For} !=127.0.0.1
    RewriteCond %{REMOTE_ADDR} !=127.0.0.1
    RewriteCond %{HTTP_USER_AGENT} ^$
    RewriteRule .* - [F]
</IfModule>
```

3. Implement IP blocking for malicious traffic:
```
<IfModule mod_rewrite.c>
    RewriteEngine on
    RewriteCond %{REQUEST_URI} !/blocked.html$
    RewriteCond %{REMOTE_ADDR} ^(192\.168\.0\.1|10\.0\.0\.1)$
    RewriteRule .* /blocked.html [R=403,L]
</IfModule>
```

### DNS Security

1. Implement SPF records to prevent email spoofing
2. Set up DMARC policy
3. Consider DNSSEC if supported by Namecheap
4. Implement CAA records to restrict which CAs can issue certificates for your domain

### Additional Security Measures

1. Regular security scans
2. Implement an intrusion detection system
3. Consider a third-party security monitoring service
4. Backup website data regularly
5. Keep all software and libraries updated

