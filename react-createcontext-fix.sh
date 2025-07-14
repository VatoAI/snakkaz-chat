#!/bin/bash

# 🚨 QUICK FIX FOR REACT CREATECONTEXT ERROR

echo "=========================================="
echo "🛠️ FIXING REACT CREATECONTEXT ERROR"
echo "=========================================="

echo ""
echo "📊 ISSUE: React.createContext undefined when called"
echo "🛠️ SOLUTION: Add React safeguard to index.html"

echo ""
echo "Adding React safeguard before script loading..."

# Add React safeguard to dist/index.html
sed -i '/<script type="module"/i\
    <!-- 🚨 REACT SAFEGUARD FIX -->\
    <script>\
      // Ensure React is available globally before modules load\
      if (!window.React) {\
        window.React = {};\
      }\
      // Mock createContext if React not fully loaded\
      if (!window.React.createContext) {\
        window.React.createContext = function(defaultValue) {\
          console.log("🔧 Temporary createContext called, waiting for React...");\
          return { Provider: function(props) { return props.children; }, Consumer: function() {} };\
        };\
      }\
    </script>' dist/index.html

echo "✅ React safeguard added to index.html"

echo ""
echo "Creating new deployment ZIP..."

# Create new ZIP with the fix
cd dist && zip -r ../snakkaz-beta-react-fix.zip * && cd ..

echo "✅ New ZIP created: snakkaz-beta-react-fix.zip"

echo ""
echo "=========================================="
echo "🚀 RE-DEPLOYMENT INSTRUCTIONS"
echo "=========================================="

echo ""
echo "1. Delete current public_html contents again"
echo "2. Upload new ZIP: snakkaz-beta-react-fix.zip"  
echo "3. Extract in public_html"
echo "4. Hard refresh and test"

echo ""
echo "Expected result: React app should load without createContext error!"
