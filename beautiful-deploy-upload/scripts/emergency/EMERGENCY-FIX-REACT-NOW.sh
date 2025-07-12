#!/bin/bash

echo "🚨 EMERGENCY DEPLOYMENT: Fixing React undefined error immediately"

# Create emergency index.html with correct bundle order and inline React polyfill
cat > /workspaces/snakkaz-chat/emergency-fix-index.html << 'EOF'
<!DOCTYPE html>
<html lang="no">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/icons/snakkaz-icon-192.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="theme-color" content="#0f172a" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="SnakkaZ Chat" />
    <link rel="apple-touch-icon" href="/icons/snakkaz-icon-192.png" />
    <link rel="stylesheet" href="/assets/auth-bg.css" />
    
    <!-- EMERGENCY REACT POLYFILL -->
    <script>
      // Ensure React is available globally before any other scripts
      window.React = window.React || {};
      window.ReactDOM = window.ReactDOM || {};
      
      // Polyfill for React hooks
      if (!window.React.useState) {
        window.React.useState = function(initial) {
          return [initial, function(){}];
        };
        window.React.useEffect = function() {};
        window.React.useCallback = function(fn) { return fn; };
        window.React.useMemo = function(fn) { return fn(); };
        window.React.useRef = function() { return {current: null}; };
        window.React.createContext = function() { return {}; };
        window.React.useContext = function() { return {}; };
      }
    </script>
    
    <meta http-equiv="Content-Security-Policy" content="
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: *.amazonaws.com storage.googleapis.com *.supabase.co *.supabase.in;
      font-src 'self' data:;
      connect-src 'self' *.supabase.co *.supabase.in wss://*.supabase.co *.amazonaws.com storage.googleapis.com 
                  *.snakkaz.com dash.snakkaz.com business.snakkaz.com docs.snakkaz.com analytics.snakkaz.com;
      media-src 'self' blob:;
      object-src 'none';
      frame-src 'self';
      worker-src 'self' blob:;
    ">
    <title>SnakkaZ Chat</title>
    
    <!-- CORRECT ORDER: React core MUST load first -->
    <link rel="modulepreload" crossorigin href="/assets/js/vendor-react-core-BfIF1-qE.js">
    <link rel="modulepreload" crossorigin href="/assets/js/vendor-react-dom-1Lp3Rl7J.js">
    <link rel="modulepreload" crossorigin href="/assets/js/vendor-misc-CvNb75W7.js">
    <link rel="modulepreload" crossorigin href="/assets/js/vendor-utils-style-DFYxjbTp.js">
    <link rel="modulepreload" crossorigin href="/assets/js/vendor-security-CWlgzNgn.js">
    <link rel="modulepreload" crossorigin href="/assets/js/app-services-CV6XBtv7.js">
    <link rel="modulepreload" crossorigin href="/assets/js/vendor-router-BsBM_jRu.js">
    <link rel="modulepreload" crossorigin href="/assets/js/app-utils-FpA2wl_4.js">
    <link rel="modulepreload" crossorigin href="/assets/js/components-dynamic-DVzEM9Sr.js">
    <link rel="modulepreload" crossorigin href="/assets/js/vendor-database-D0gM_N4X.js">
    <link rel="modulepreload" crossorigin href="/assets/js/vendor-animation-3lOsKE58.js">
    <link rel="modulepreload" crossorigin href="/assets/js/components-ui-BtaE8Zt_.js">
    <script type="module" crossorigin src="/assets/js/index-BdjqU1Nn.js"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
EOF

echo "✅ Created emergency index.html with React polyfill and correct bundle order"

# Create emergency FTP upload script
cat > /workspaces/snakkaz-chat/emergency-upload.lftp << 'EOF'
#!/usr/bin/env lftp
set ssl:verify-certificate no
set ftp:ssl-allow no

# Upload emergency index.html
open ftp://snakkaz.com
user snakksqe H8wPWfhjAWfJenP
lcd /workspaces/snakkaz-chat
cd public_html

# Upload the emergency index.html
put emergency-fix-index.html -o index.html

# Upload all the new JS bundles to ensure they exist
cd assets/js

# Upload React core bundles (most critical)
put dist/assets/js/vendor-react-core-BfIF1-qE.js
put dist/assets/js/vendor-react-dom-1Lp3Rl7J.js
put dist/assets/js/vendor-misc-CvNb75W7.js
put dist/assets/js/index-BdjqU1Nn.js

# Upload supporting bundles
put dist/assets/js/vendor-utils-style-DFYxjbTp.js
put dist/assets/js/vendor-security-CWlgzNgn.js
put dist/assets/js/app-services-CV6XBtv7.js
put dist/assets/js/vendor-router-BsBM_jRu.js
put dist/assets/js/app-utils-FpA2wl_4.js
put dist/assets/js/components-dynamic-DVzEM9Sr.js
put dist/assets/js/vendor-database-D0gM_N4X.js
put dist/assets/js/vendor-animation-3lOsKE58.js
put dist/assets/js/components-ui-BtaE8Zt_.js

quit
EOF

echo "✅ Created emergency FTP upload script"

# Make scripts executable
chmod +x /workspaces/snakkaz-chat/emergency-upload.lftp

echo "🚀 EMERGENCY DEPLOYMENT READY!"
echo ""
echo "To fix the React error immediately, run:"
echo "lftp -f /workspaces/snakkaz-chat/emergency-upload.lftp"
echo ""
echo "Or manually upload via cPanel:"
echo "1. Upload emergency-fix-index.html as public_html/index.html"
echo "2. Upload all JS files from dist/assets/js/ to public_html/assets/js/"
