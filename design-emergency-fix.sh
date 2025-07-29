#!/bin/bash

# SnakkaZ Design Emergency Fix
echo "🚨 SnakkaZ Design Emergency Fix - Fixing CSS conflicts!"

echo "🔧 Step 1: Check for undefined CSS classes in components..."

# Check for problematic CSS classes
echo "❌ Problematic CSS classes found:"
grep -r "cyber-void\|aurora-cyan\|aurora-blue\|cyber-dark" src/pages/ src/components/ || echo "No problematic classes found"

echo ""
echo "🔧 Step 2: Add missing CSS variables to index.css..."

# Add missing CSS for CleanLogin compatibility
cat >> src/index.css << 'EOF'

/* Emergency CSS fixes for component compatibility */
.from-cyber-void { background: #0a0a0f !important; }
.via-cyber-dark { background: #1a1a2e !important; }
.to-cyber-void { background: #0a0a0f !important; }
.bg-aurora-cyan { background-color: var(--aurora-cyan) !important; }
.text-aurora-cyan { color: var(--aurora-cyan) !important; }
.text-aurora-blue { color: var(--aurora-blue) !important; }
.border-aurora-cyan { border-color: var(--aurora-cyan) !important; }
.focus\:border-aurora-cyan:focus { border-color: var(--aurora-cyan) !important; }
.focus\:ring-aurora-cyan:focus { --tw-ring-color: var(--aurora-cyan) !important; }
.from-aurora-cyan { --tw-gradient-from: var(--aurora-cyan) !important; }
.to-aurora-blue { --tw-gradient-to: var(--aurora-blue) !important; }
.text-cyber-dark { color: #0a0a0f !important; }

EOF

echo "✅ Emergency CSS added to index.css"

echo ""
echo "🔧 Step 3: Restart dev server to clear all caches..."
echo "Run: pkill -f vite && npm run dev"

echo ""
echo "🔧 Step 4: Hard refresh browser (Ctrl+Shift+R)"

echo ""
echo "✨ Emergency fix complete!"
echo "🎯 Dette skal fikse design problemene på både mobil og desktop!"
