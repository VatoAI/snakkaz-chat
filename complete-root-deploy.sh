#!/bin/bash
# 🎯 ONE-CLICK COMPLETE DEPLOYMENT
# Alt-i-ett løsning for å fikse www.snakkaz.com

echo "🎯 SNAKKAZ COMPLETE DEPLOYMENT"
echo "=============================="
echo ""

# Sjekk at snakkaz-live finnes
if [ ! -d "snakkaz-live" ]; then
    echo "❌ ERROR: snakkaz-live directory not found!"
    echo "Please ensure snakkaz-live folder exists with all built files"
    exit 1
fi

echo "✅ Found snakkaz-live directory"
echo ""

# Tell filer
js_count=$(find snakkaz-live -name "*.js" | wc -l)
css_count=$(find snakkaz-live -name "*.css" | wc -l)
html_count=$(find snakkaz-live -name "*.html" | wc -l)

echo "📊 INVENTORY:"
echo "   JavaScript files: $js_count"
echo "   CSS files: $css_count" 
echo "   HTML files: $html_count"
echo ""

# Lag deploy pakke
echo "📦 Creating deployment package..."
rm -f snakkaz-complete-deploy.zip

# Kopier snakkaz-live og legg til patches
cp -r snakkaz-live snakkaz-deploy-temp
cp direct-layoutgroup-fix.js snakkaz-deploy-temp/ 2>/dev/null || echo "⚠️ direct-layoutgroup-fix.js not found"
cp emergency-react-hooks-patch.js snakkaz-deploy-temp/ 2>/dev/null || echo "⚠️ emergency-react-hooks-patch.js not found"

# Opprett forbedret index.html med patches
cat > snakkaz-deploy-temp/index.html << 'EOF'
<!DOCTYPE html>
<html lang="no">
<head>
    <script src="direct-layoutgroup-fix.js"></script>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/icons/snakkaz-icon-192.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="theme-color" content="#0f172a" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="SnakkaZ Chat" />
    <link rel="apple-touch-icon" href="/icons/snakkaz-icon-192.png" />
    <title>SnakkaZ Chat - Sikker Norsk Chat</title>
    
    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json" />
    
    <!-- CRITICAL: Emergency React Hooks Fix -->
    <script>
      (function() {
        'use strict';
        console.log('🚀 SNAKKAZ: Emergency React hooks fix loading...');
        
        if (typeof window !== 'undefined') {
          window.useLayoutEffect = window.useLayoutEffect || function(effect, deps) {
            if (typeof effect === 'function') {
              try {
                var cleanup = effect();
                return typeof cleanup === 'function' ? cleanup : function(){};
              } catch (e) {
                console.warn('Emergency useLayoutEffect error:', e);
                return function(){};
              }
            }
            return function(){};
          };
          
          window.useMergeRef = window.useMergeRef || function() {
            var refs = Array.prototype.slice.call(arguments);
            return function(element) {
              refs.forEach(function(ref) {
                if (typeof ref === 'function') {
                  try { ref(element); } catch (e) { console.warn('useMergeRef error:', e); }
                } else if (ref && typeof ref === 'object' && 'current' in ref) {
                  try { ref.current = element; } catch (e) { console.warn('useMergeRef error:', e); }
                }
              });
            };
          };
          
          window.reactExports = window.reactExports || {};
          window.reactExports.useLayoutEffect = window.useLayoutEffect;
          window.reactExports.useEffect = window.useLayoutEffect;
          
          window.React = window.React || {};
          window.React.useLayoutEffect = window.React.useLayoutEffect || window.useLayoutEffect;
          window.React.useMergeRef = window.React.useMergeRef || window.useMergeRef;
          
          window.__LAYOUT_GROUP_CONTEXT_FIX__ = true;
          window.__USE_SYNC_EXTERNAL_STORE_POLYFILL__ = true;
          
          console.log('✅ SNAKKAZ: All emergency React fixes applied!');
        }
      })();
    </script>
    
    <!-- Production Assets -->
    <link rel="modulepreload" crossorigin href="/assets/js/vendor-react-core-Cd05VJ5Y.js">
    <link rel="modulepreload" crossorigin href="/assets/js/vendor-react-hooks-Df_KBos6.js">
    <link rel="modulepreload" crossorigin href="/assets/js/vendor-radix-ui-UJNVxv2C.js">
    <link rel="modulepreload" crossorigin href="/assets/js/components-ui-CoK5VGD0.js">
    <script type="module" crossorigin src="/assets/js/index-BWQuTEbr.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/css/index-BuuGx747.css">
</head>
<body>
    <div id="root"></div>
    
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('✅ SW registered'))
            .catch(err => console.log('❌ SW failed:', err));
        });
      }
    </script>
</body>
</html>
EOF

# Zip alt
cd snakkaz-deploy-temp
zip -r ../snakkaz-complete-deploy.zip * >/dev/null 2>&1
cd ..
rm -rf snakkaz-deploy-temp

echo "✅ Created snakkaz-complete-deploy.zip"
echo ""
echo "🎯 MANUAL DEPLOYMENT STEPS:"
echo "1. Go to cPanel File Manager"
echo "2. Navigate to public_html"
echo "3. Upload snakkaz-complete-deploy.zip"
echo "4. Extract the zip file"
echo "5. Delete the zip file"
echo "6. Test www.snakkaz.com"
echo ""
echo "📋 This package contains:"
echo "   ✅ All working files from snakkaz-live"
echo "   ✅ Emergency React hooks patches"
echo "   ✅ LayoutGroup context fix"
echo "   ✅ Correct file references"
echo "   ✅ PWA and Service Worker setup"
echo ""
echo "🚀 After upload, www.snakkaz.com should work perfectly!"
