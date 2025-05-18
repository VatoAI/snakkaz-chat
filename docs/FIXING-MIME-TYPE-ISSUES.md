# Fixing MIME Type Issues for Snakkaz Chat on Namecheap

This document provides step-by-step instructions to fix the MIME type issues observed with CSS and JavaScript files on the Snakkaz Chat application after migrating to Namecheap.

## The Problem

The following error messages were observed when loading the website:

```
The stylesheet http://www.snakkaz.com/assets/auth-bg.css was not loaded because its MIME type, "text/html", is not "text/css".
Loading module from "http://www.snakkaz.com/assets/index-iEerSh2Y.js" was blocked because of a disallowed MIME type ("text/html").
Loading failed for the module with source "http://www.snakkaz.com/assets/index-iEerSh2Y.js".
The stylesheet http://www.snakkaz.com/assets/index-ZtK66PHB.css was not loaded because its MIME type, "text/html", is not "text/css".
```

These errors indicate that:
1. The server is not serving the correct MIME types for CSS and JavaScript files.
2. It's possible that the assets files don't exist at the specified paths.

## Solution Steps

### Step 1: Verify if assets files exist

1. Log in to cPanel
2. Open the File Manager
3. Navigate to `public_html/assets`
4. Check if the following files exist:
   - `auth-bg.css`
   - `index-ZtK66PHB.css`
   - `index-iEerSh2Y.js`

If any of these files are missing, proceed to Step 2. Otherwise, skip to Step 3.

### Step 2: Upload missing asset files

If the files are missing, they need to be uploaded from your local build:

1. Locate the files in your local `dist/assets` directory
2. Upload them to the server using cPanel File Manager or FTP:
   - Upload `dist/assets/auth-bg.css` to `public_html/assets/auth-bg.css`
   - Upload `dist/assets/index-ZtK66PHB.css` to `public_html/assets/index-ZtK66PHB.css`
   - Upload `dist/assets/index-iEerSh2Y.js` to `public_html/assets/index-iEerSh2Y.js`

If the specific files don't exist locally (they may have different hashes), upload the equivalent files:
- Find any `index-*.css` file and upload it as a replacement for `index-ZtK66PHB.css`
- Find any `index-*.js` file and upload it as a replacement for `index-iEerSh2Y.js`

### Step 3: Create or update .htaccess with MIME types

Create a new file named `.htaccess` in the assets directory with the following content:

```apache
# MIME Type Configuration for assets directory
<IfModule mod_mime.c>
    # JavaScript
    AddType application/javascript .js
    AddType application/x-javascript .js
    AddType text/javascript .js
    AddType application/json .json
    
    # CSS
    AddType text/css .css
    
    # Images
    AddType image/svg+xml .svg
    AddType image/svg+xml .svgz
    AddType image/png .png
    AddType image/jpeg .jpg .jpeg
    AddType image/gif .gif
    AddType image/webp .webp
    
    # Fonts
    AddType font/ttf .ttf
    AddType font/otf .otf
    AddType font/woff .woff
    AddType font/woff2 .woff2
    
    # Web App Manifest
    AddType application/manifest+json .webmanifest
    AddType application/manifest+json .manifest
</IfModule>

# Force files to be loaded as their correct MIME type regardless of server config
<FilesMatch "\.js$">
    ForceType application/javascript
</FilesMatch>

<FilesMatch "\.css$">
    ForceType text/css
</FilesMatch>

# Enable CORS for asset files
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
</IfModule>
```

### Step 4: Update main .htaccess file

The main `.htaccess` file in `public_html` should also be updated with MIME type definitions. Add the following section after the `RewriteEngine On` line:

```apache
# Ensure correct MIME types are served
<IfModule mod_mime.c>
    # JavaScript
    AddType application/javascript .js
    AddType application/x-javascript .js
    AddType text/javascript .js
    AddType application/json .json
    
    # CSS
    AddType text/css .css
    
    # Images
    AddType image/svg+xml .svg
    AddType image/svg+xml .svgz
    AddType image/png .png
    AddType image/jpeg .jpg .jpeg
    AddType image/gif .gif
    AddType image/webp .webp
    
    # Fonts
    AddType font/ttf .ttf
    AddType font/otf .otf
    AddType font/woff .woff
    AddType font/woff2 .woff2
    
    # Web App Manifest
    AddType application/manifest+json .webmanifest
    AddType application/manifest+json .manifest
</IfModule>

# Force files to be loaded as their correct MIME type regardless of server config
<FilesMatch "\.js$">
    ForceType application/javascript
</FilesMatch>

<FilesMatch "\.css$">
    ForceType text/css
</FilesMatch>
```

### Step 5: Check if assets.zip was properly extracted

If the assets directory seems incomplete:

1. Navigate to `public_html` in cPanel File Manager
2. Check if `assets.zip` exists
3. If it exists:
   - Right-click on it and select "Extract"
   - Make sure it extracts to `public_html/assets/`
4. If it doesn't exist:
   - Upload it from your local copy
   - Then extract it as described above

### Step 6: Verify server configuration

If the MIME type issues persist after these changes, the problem might be related to server configuration:

1. Contact Namecheap support
2. Ask them to verify that the `mod_mime` module is enabled on your hosting
3. Ask if there are any server-level restrictions that might be affecting MIME types

### Step 7: Test the website

After making these changes:

1. Clear your browser cache completely
2. Open the website in an incognito/private window
3. Check the browser console for any remaining MIME type errors
4. If errors persist, try accessing one of the files directly:
   - http://www.snakkaz.com/assets/index-ZtK66PHB.css
   - Check if it returns the actual CSS content or an error

## Additional Considerations

### Apache vs. Nginx

Namecheap shared hosting typically uses Apache, but if your hosting is using Nginx, the MIME type configuration would be different. Contact Namecheap support to confirm your server type if unsure.

### PHP-based solution

If .htaccess modifications don't work, you can create a simple PHP-based solution:

1. Create a file called `serve-assets.php` in `public_html` with the following content:

```php
<?php
$file = $_GET['file'] ?? '';
$ext = pathinfo($file, PATHINFO_EXTENSION);

// Define MIME types
$mimeTypes = [
    'css' => 'text/css',
    'js' => 'application/javascript',
    'json' => 'application/json',
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'gif' => 'image/gif',
    'svg' => 'image/svg+xml',
    'woff' => 'font/woff',
    'woff2' => 'font/woff2',
    'ttf' => 'font/ttf',
    'otf' => 'font/otf'
];

$filePath = 'assets/' . $file;

if (file_exists($filePath) && isset($mimeTypes[$ext])) {
    header('Content-Type: ' . $mimeTypes[$ext]);
    readfile($filePath);
    exit;
}

// If the file doesn't exist or has an unsupported extension
header('HTTP/1.0 404 Not Found');
echo 'File not found';
?>
```

2. Update your HTML to reference assets through this PHP file:
   - Example: `<link href="serve-assets.php?file=index-ZtK66PHB.css" rel="stylesheet">`

This approach can serve as a fallback if the .htaccess configuration doesn't resolve the issue.
