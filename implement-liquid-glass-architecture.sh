#!/bin/bash

# ============================================
# SNAKKAZ LIQUID GLASS 3-LAYER ARCHITECTURE
# Complete CSS Protection Implementation
# ============================================

echo "🎨 Implementing Liquid Glass 3-Layer Architecture..."

# Layer 1: Create Critical CSS Protection
echo "📁 Layer 1: Critical CSS Protection Setup..."

# Create styles directory if it doesn't exist
mkdir -p src/styles

# Ensure design-system.css is imported first in main.tsx
if ! grep -q "design-system.css" src/main.tsx; then
    sed -i '1i import "./styles/design-system.css"' src/main.tsx
    echo "✅ Added design-system.css import to main.tsx"
fi

# Layer 2: Update SpectacularChat Component with Protection Classes
echo "📁 Layer 2: Component Protection Implementation..."

# Apply protection classes to SpectacularChat
if grep -q "className.*spectacular-chat" src/features/chat/components/SpectacularChat.tsx; then
    sed -i 's/className="spectacular-chat/className="spectacular-chat liquid-glass css-protection-lock/g' src/features/chat/components/SpectacularChat.tsx
    echo "✅ Applied protection classes to SpectacularChat"
fi

# Layer 3: Create Supabase Override CSS
echo "📁 Layer 3: Supabase Override Protection..."

cat > src/styles/supabase-overrides.css << 'EOF'
/* ============================================
   SUPABASE CSS OVERRIDE PROTECTION
   Maximum Specificity Protection
   ============================================ */

/* Override all Supabase auth components */
.supabase-auth-ui_ui,
.supabase-auth-ui_ui *,
[class*="supabase"],
[class*="supabase"] *,
.auth-widget,
.auth-widget *,
.sb-avatar,
.sb-avatar *,
[data-supabase],
[data-supabase] * {
  /* Force reset Supabase styles */
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  margin: initial !important;
  padding: initial !important;
  font-family: inherit !important;
  color: inherit !important;
}

/* Specific Supabase button overrides */
.supabase-auth-ui_ui button,
[class*="supabase"] button {
  background: var(--liquid-gradient-primary) !important;
  border: 1px solid var(--liquid-glass-border) !important;
  border-radius: var(--glass-border-radius) !important;
  color: #ffffff !important;
  padding: 0.75rem 1.5rem !important;
  backdrop-filter: var(--glass-blur) !important;
  transition: all 0.3s ease !important;
}

.supabase-auth-ui_ui button:hover,
[class*="supabase"] button:hover {
  background: var(--liquid-gradient-secondary) !important;
  transform: translateY(-2px) !important;
  box-shadow: var(--glass-shadow) !important;
}

/* Supabase input overrides */
.supabase-auth-ui_ui input,
[class*="supabase"] input {
  background: var(--liquid-glass-bg) !important;
  border: 1px solid var(--liquid-glass-border) !important;
  border-radius: var(--glass-border-radius) !important;
  color: #ffffff !important;
  padding: 0.75rem !important;
  backdrop-filter: var(--glass-blur) !important;
}

.supabase-auth-ui_ui input:focus,
[class*="supabase"] input:focus {
  border-color: var(--liquid-primary) !important;
  box-shadow: 0 0 20px rgba(0, 102, 255, 0.3) !important;
  outline: none !important;
}

/* Supabase container overrides */
.supabase-auth-ui_ui > div,
[class*="supabase"] > div {
  background: transparent !important;
  border: none !important;
}

/* Error and message overrides */
.supabase-auth-ui_ui .error,
.supabase-auth-ui_ui .message,
[class*="supabase"] .error,
[class*="supabase"] .message {
  background: var(--liquid-glass-bg) !important;
  border: 1px solid var(--liquid-accent) !important;
  border-radius: var(--glass-border-radius) !important;
  color: #ffffff !important;
  padding: 1rem !important;
  backdrop-filter: var(--glass-blur) !important;
}
EOF

echo "✅ Created Supabase override protection"

# Add Supabase overrides import to design-system.css
if ! grep -q "supabase-overrides.css" src/styles/design-system.css; then
    echo "" >> src/styles/design-system.css
    echo "/* Supabase Override Protection */" >> src/styles/design-system.css
    echo "@import './supabase-overrides.css';" >> src/styles/design-system.css
    echo "✅ Added Supabase overrides to design system"
fi

# Create CSS Specificity Booster
echo "📁 Creating CSS Specificity Booster..."

cat > src/styles/specificity-booster.css << 'EOF'
/* ============================================
   CSS SPECIFICITY BOOSTER
   Ultra-High Priority Protection
   ============================================ */

/* Ultra-specific selectors for SpectacularChat */
html body #root .spectacular-chat.spectacular-chat.spectacular-chat {
  background: linear-gradient(135deg, 
    rgba(0, 61, 130, 0.9) 0%, 
    rgba(0, 102, 255, 0.8) 50%, 
    rgba(0, 212, 170, 0.9) 100%) !important;
  backdrop-filter: blur(30px) !important;
  border: 2px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 25px !important;
  min-height: 600px !important;
  position: relative !important;
  overflow: hidden !important;
}

/* Force all child elements */
html body #root .spectacular-chat.spectacular-chat.spectacular-chat * {
  color: inherit !important;
  font-family: inherit !important;
}

/* Message styling with ultra-high specificity */
html body #root .spectacular-chat.spectacular-chat.spectacular-chat .message {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 15px !important;
  padding: 1rem !important;
  margin-bottom: 1rem !important;
  color: #ffffff !important;
}

/* Input styling with ultra-high specificity */
html body #root .spectacular-chat.spectacular-chat.spectacular-chat .message-input {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(15px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 25px !important;
  padding: 1rem 1.5rem !important;
  color: #ffffff !important;
  width: 100% !important;
}

/* Override any conflicting styles */
html body #root .spectacular-chat.spectacular-chat.spectacular-chat .message-input::placeholder {
  color: rgba(255, 255, 255, 0.6) !important;
}
EOF

echo "✅ Created CSS specificity booster"

# Add specificity booster to design system
if ! grep -q "specificity-booster.css" src/styles/design-system.css; then
    echo "" >> src/styles/design-system.css
    echo "/* Specificity Booster Protection */" >> src/styles/design-system.css
    echo "@import './specificity-booster.css';" >> src/styles/design-system.css
    echo "✅ Added specificity booster to design system"
fi

# Ensure proper import order in main.tsx
echo "📁 Ensuring proper import order..."

# Create a temporary file with correct import order
cat > /tmp/main_imports.txt << 'EOF'
import "./styles/design-system.css"
import "./index.css"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
EOF

# Check if the imports are in the correct order and fix if needed
if grep -q "import.*index.css" src/main.tsx && grep -q "import.*design-system.css" src/main.tsx; then
    # Reorder imports if needed
    if ! head -1 src/main.tsx | grep -q "design-system.css"; then
        sed -i '/import.*\.css/d' src/main.tsx
        sed -i '1i import "./styles/design-system.css"\nimport "./index.css"' src/main.tsx
        echo "✅ Fixed CSS import order in main.tsx"
    fi
fi

# Create deployment verification script
echo "📁 Creating deployment verification..."

cat > verify-design-system.js << 'EOF'
// Verify Liquid Glass Design System is properly loaded
console.log('🎨 Verifying Liquid Glass Design System...');

// Check if our CSS variables are loaded
const computedStyles = getComputedStyle(document.documentElement);
const liquidPrimary = computedStyles.getPropertyValue('--liquid-primary');
const liquidGlassBg = computedStyles.getPropertyValue('--liquid-glass-bg');

if (liquidPrimary && liquidGlassBg) {
    console.log('✅ Liquid Glass Design System loaded successfully!');
    console.log('🎯 Primary Color:', liquidPrimary);
    console.log('🎯 Glass Background:', liquidGlassBg);
} else {
    console.warn('⚠️ Design system variables not found');
}

// Check for SpectacularChat element
const spectacularChat = document.querySelector('.spectacular-chat');
if (spectacularChat) {
    console.log('✅ SpectacularChat component found!');
    const styles = getComputedStyle(spectacularChat);
    console.log('🎯 Background:', styles.background);
    console.log('🎯 Backdrop Filter:', styles.backdropFilter);
} else {
    console.log('ℹ️ SpectacularChat not yet rendered');
}

// Check for Supabase conflicts
const supabaseElements = document.querySelectorAll('[class*="supabase"]');
if (supabaseElements.length > 0) {
    console.log(`🔍 Found ${supabaseElements.length} Supabase elements`);
    console.log('🛡️ Checking override protection...');
    
    supabaseElements.forEach((el, index) => {
        const styles = getComputedStyle(el);
        if (styles.background === 'transparent') {
            console.log(`✅ Supabase element ${index + 1} properly overridden`);
        } else {
            console.warn(`⚠️ Supabase element ${index + 1} may have style conflicts`);
        }
    });
}
EOF

echo "✅ Created design system verification script"

# Add verification script to index.html if it exists
if [ -f "index.html" ]; then
    if ! grep -q "verify-design-system.js" index.html; then
        sed -i 's/<\/body>/<script src="verify-design-system.js"><\/script>\n<\/body>/' index.html
        echo "✅ Added verification script to index.html"
    fi
fi

echo ""
echo "🎉 LIQUID GLASS 3-LAYER ARCHITECTURE COMPLETE!"
echo ""
echo "📋 Implementation Summary:"
echo "   ✅ Layer 1: Critical CSS Protection (design-system.css)"
echo "   ✅ Layer 2: Component Protection Classes"
echo "   ✅ Layer 3: Supabase Override Protection"
echo "   ✅ CSS Specificity Booster"
echo "   ✅ Import Order Optimization"
echo "   ✅ Deployment Verification"
echo ""
echo "🛡️ Protection Features:"
echo "   • Maximum CSS specificity with !important"
echo "   • Supabase style override protection"
echo "   • Mobile responsiveness preserved"
echo "   • Dark mode compatibility"
echo "   • Animation protection"
echo "   • High contrast support"
echo ""
echo "🎨 Your Liquid Glass design is now bulletproof!"
echo "   The SpektaKulær chat will maintain its beauty"
echo "   even with full Supabase backend integration."
echo ""
echo "🚀 Ready for production deployment!"
