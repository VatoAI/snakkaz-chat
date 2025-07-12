#!/bin/bash
# Quick script to check what JS/CSS files actually exist in your upload

echo "=== CHECKING PRODUCTION FILES ==="
echo ""
echo "Looking for JavaScript files:"
find . -name "*.js" -type f | head -10
echo ""
echo "Looking for CSS files:"
find . -name "*.css" -type f | head -10
echo ""
echo "Looking for vendor files:"
find . -name "*vendor*" -type f | head -10
echo ""
echo "All files in snakkaz-hotfix (extracted):"
if [ -d "snakkaz-hotfix" ]; then
    ls -la snakkaz-hotfix/ | head -20
fi
echo ""
echo "Main production files that should exist:"
ls -la | grep -E "\.(js|css|html)$" | head -10
