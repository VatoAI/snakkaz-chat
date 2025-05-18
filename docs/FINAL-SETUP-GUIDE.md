# Snakkaz Chat Final Setup Guide

This guide contains instructions for completing the setup of Snakkaz Chat after migrating from Cloudflare to Namecheap hosting and fixing the MIME type issues.

## Remaining Issues to Address

### 1. SSL Configuration

The website is currently running on HTTP. To properly secure your application, you need to enable SSL to serve your content over HTTPS.

**Solution:**

Run the SSL configuration script:

```bash
./configure-ssl-namecheap.sh
```

This script will guide you through enabling SSL on your Namecheap hosting. It provides three options:

1. **Namecheap AutoSSL** (recommended) - Automatic SSL certificate management
2. **Namecheap PositiveSSL** - Standard SSL certificates
3. **Let's Encrypt** - Free, community-driven SSL certificates

The script also creates a comprehensive guide in `docs/SSL-CONFIGURATION.md` with step-by-step instructions for each option.

### 2. Fix Multiple Supabase Client Instances

The application is showing warnings about multiple GoTrueClient instances.

**Solution:**

Run the Supabase singleton pattern fix script:

```bash
./fix-multiple-supabase-client.sh
```

This script:
- Creates a singleton Supabase client in `src/lib/supabaseClient.ts`
- Updates all files that were directly creating Supabase clients
- Creates documentation with best practices in `docs/SUPABASE-SINGLETON-PATTERN.md`

### 3. Testing Everything Together

After applying the fixes above, you should verify that everything works correctly:

1. **Test SSL Configuration:**
   - Visit your site with HTTPS (https://snakkaz.com)
   - Check for any mixed content warnings in the browser console
   - Verify SSL certificate details using browser tools

2. **Test Supabase Integration:**
   - Check the browser console for the "Multiple GoTrueClient" warning - it should be gone
   - Test authentication functions (if applicable)
   - Verify that data fetching from Supabase works

3. **Test MIME Type Fixes:**
   - Visit your site and check that all CSS and JavaScript files load correctly
   - Check the browser console for any MIME type-related errors
   - Test the `/test-mime-types.html` page created earlier

## Maintenance Tips

### Regular SSL Certificate Monitoring

- Check SSL certificate expiration dates regularly
- Set up email notifications for certificate expiration
- Ensure auto-renewal is configured correctly

### Supabase Best Practices

- Continue using the singleton pattern for Supabase
- Check for any new components that might create their own clients
- Update your documentation when upgrading Supabase versions

### MIME Type Monitoring

- When adding new file types, update the `.htaccess` file and `serve-assets.php`
- Regularly check server logs for any 404 errors or MIME type issues
- Consider using Content-Type headers in your CI/CD pipeline

## Additional Resources

- [Namecheap SSL Documentation](https://www.namecheap.com/support/knowledgebase/article.aspx/786/38/how-do-i-activate-an-ssl-certificate/)
- [Supabase Authentication Documentation](https://supabase.com/docs/guides/auth)
- [Web Server MIME Types Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)
