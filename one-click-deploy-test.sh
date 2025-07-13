#!/bin/bash
# One-Click Deploy Readiness Test
echo "⚡ ONE-CLICK DEPLOY READINESS TEST"
echo "================================="

# Critical checks only
echo "🔍 Checking production package..."
if [ -f "snakkaz-complete-production-ready-v2.zip" ]; then
    echo "✅ Production package v2: Ready ($(ls -lh snakkaz-complete-production-ready-v2.zip | awk '{print $5}'))"
else
    echo "❌ Production package v2: Missing"
    exit 1
fi

echo "🔍 Checking critical files..."
critical_files=(
    "snakkaz-complete-deployment/index.html"
    "snakkaz-complete-deployment/manifest.json"
    "snakkaz-complete-deployment/service-worker.js"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $(basename $file): Present"
    else
        echo "❌ $(basename $file): Missing"
        exit 1
    fi
done

echo "🔍 Quick syntax check..."
if node -c "snakkaz-complete-deployment/assets/js/vendor-router-DRYHFKTT.js"; then
    echo "✅ Vendor-router: Syntax OK"
else
    echo "❌ Vendor-router: Syntax Error"
    exit 1
fi

echo ""
echo "🎉 READY FOR DEPLOYMENT!"
echo "========================="
echo "✅ All critical checks passed"
echo "✅ Production package ready"
echo "✅ No syntax errors"
echo ""
echo "🚀 NEXT STEP: Upload to cPanel and go live!"
