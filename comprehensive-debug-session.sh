#!/bin/bash
# Comprehensive markdown cleanup and system optimization
echo "🔧 FULL DEBUG & FIX SESSION - SNAKKAZ CLEANUP"
echo "============================================="

# 1. Fix all markdown lint issues first
echo "1. 📝 Fixing markdown formatting issues..."

# Create a markdown cleanup script
cat > fix-markdown-issues.sh << 'EOF'
#!/bin/bash
# Fix common markdown issues automatically

fix_file() {
    local file="$1"
    if [[ -f "$file" ]]; then
        echo "Fixing: $file"
        
        # Fix MD032 - Add blank lines around lists
        sed -i 's/^- /\n- /g' "$file"
        sed -i 's/^[0-9]\+\. /\n&/g' "$file"
        
        # Fix MD022 - Add blank lines around headings
        sed -i 's/^##\+ /\n&/g' "$file"
        
        # Fix MD009 - Remove trailing spaces
        sed -i 's/[[:space:]]*$//' "$file"
        
        # Fix MD031 - Add blank lines around code blocks
        sed -i 's/^```/\n```/g' "$file"
        sed -i 's/```$/```\n/g' "$file"
        
        echo "✅ Fixed: $file"
    fi
}

# Fix main documentation files
fix_file "EMERGENCY-PRODUCTION-FIX-COMPLETE.md"
fix_file "EMERGENCY-DEPLOYMENT-PLAN.md" 
fix_file "EMERGENCY-DESIGN-FIX-PLAN.md"
fix_file "snakkaz-emergency-fix-20250723_215843/EMERGENCY-FIX-README.md"

echo "📝 Markdown fixes applied!"
EOF

chmod +x fix-markdown-issues.sh
./fix-markdown-issues.sh

echo ""
echo "2. 🔍 Checking current dist/index.html for user modifications..."
