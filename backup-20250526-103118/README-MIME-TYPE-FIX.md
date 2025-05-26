# Snakkaz Chat MIME Type Fix Guide

## Problem Overview

After migrating from Cloudflare to Namecheap hosting, Snakkaz Chat is experiencing MIME type issues with CSS and JavaScript files. The browser console shows the following errors:

```
The stylesheet http://www.snakkaz.com/assets/auth-bg.css was not loaded because its MIME type, "text/html", is not "text/css".
Loading module from "http://www.snakkaz.com/assets/index-iEerSh2Y.js" was blocked because of a disallowed MIME type ("text/html").
Loading failed for the module with source "http://www.snakkaz.com/assets/index-iEerSh2Y.js".
The stylesheet http://www.snakkaz.com/assets/index-ZtK66PHB.css was not loaded because its MIME type, "text/html", is not "text/css".
```

These errors indicate that Namecheap's server is not serving the correct MIME types for Snakkaz Chat's assets.

## Quick Fix Procedure

### 1. Run the Automatic Fix Script

We've created a comprehensive fix script that implements three different solutions:

```bash
cd /workspaces/snakkaz-chat
./scripts/fix-mime-type-issues.sh
```

This script will:
- Create a `.htaccess` file with proper MIME type configurations
- Create a PHP fallback script to serve assets with correct MIME types
- Create a test page to verify MIME types are correct
- Create a verification script to check MIME types on the server

### 2. Upload the Fixes to the Server

Use the upload script to deploy the fixes to the Namecheap server:

```bash
cd /workspaces/snakkaz-chat
./upload-mime-type-fixes.sh
```

This script will upload:
- `.htaccess` file with MIME type configurations
- `serve-assets.php` PHP fallback script
- `test-mime-types.html` test page
- `fallback-index.html` (optional alternative index page)

### 3. Verify the Fixes

Visit the test page to verify MIME types are correct:

```
https://www.snakkaz.com/test-mime-types.html
```

Run the verification script to check server configuration:

```bash
cd /workspaces/snakkaz-chat
./scripts/verify-mime-types-on-server.sh https://www.snakkaz.com
```

## Detailed Fix Explanation

### Solution 1: .htaccess Configuration

This approach tells Apache to serve files with the correct MIME types using `.htaccess` directives:

```apache
# Force files to be loaded with correct MIME type
<FilesMatch "\.js$">
    ForceType application/javascript
</FilesMatch>

<FilesMatch "\.css$">
    ForceType text/css
</FilesMatch>
```

### Solution 2: PHP Fallback Script

If the `.htaccess` approach doesn't work, we provide a PHP script that serves assets with the correct MIME types:

```php
<?php
// Get the requested file name
$file = $_GET['file'] ?? '';

// Security check - prevent directory traversal
$file = str_replace('../', '', $file);

// Get file extension and set MIME type
$ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
$mimeTypes = [
    'css' => 'text/css',
    'js' => 'application/javascript',
    // other mime types...
];

// Serve file with correct MIME type
header('Content-Type: ' . $mimeTypes[$ext]);
readfile('assets/' . $file);
```

Usage:
```html
<link href="serve-assets.php?file=index-ZtK66PHB.css" rel="stylesheet">
<script src="serve-assets.php?file=index-iEerSh2Y.js"></script>
```

### Solution 3: Fallback Index.html

For a more robust solution, we provide an alternative `fallback-index.html` that uses the PHP approach for all assets and includes diagnostic code.

## Integrating with All-in-One Fix Script

We've also integrated these fixes into the existing `all-in-one-fix-snakkaz.sh` script:

```bash
cd /workspaces/snakkaz-chat
./add-mime-type-fixes-to-all-in-one.sh
```

This will add a MIME type fix section to the all-in-one script.

## Manual Fix Instructions

If the automated scripts don't work, you can manually fix the issue:

1. Create a `.htaccess` file in the root directory with the MIME type configurations
2. Create `serve-assets.php` in the root directory
3. Update HTML to reference assets through the PHP script
4. Upload both files to the server
5. Test to make sure assets load correctly

## Troubleshooting

If issues persist:

1. **Check Server Logs**: Access Namecheap cPanel and check error logs
2. **Verify File Extraction**: Make sure all asset files were properly extracted from the zip file
3. **Check File Permissions**: Files should be 644, directories should be 755
4. **Test Directly**: Try accessing assets directly through the browser
5. **Contact Namecheap Support**: Ask about MIME type configuration on their servers

## Documentation

For more detailed documentation, see:
- `docs/FIXING-MIME-TYPE-ISSUES.md` (English)
- `docs/MIME-TYPE-FIKSER.md` (Norwegian)

## Script Reference

- `scripts/fix-mime-type-issues.sh`: Creates all necessary files for fixing MIME types
- `scripts/verify-mime-types-on-server.sh`: Checks if MIME types are correctly configured
- `upload-mime-type-fixes.sh`: Uploads MIME type fixes to the server
- `add-mime-type-fixes-to-all-in-one.sh`: Adds MIME type fixes to the all-in-one script
