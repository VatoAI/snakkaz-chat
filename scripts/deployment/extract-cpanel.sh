#!/bin/bash

# Automatic Extraction Script for cPanel
# Attempts to extract the ZIP file automatically via cPanel API

echo "=== SNAKKAZ AUTOMATIC EXTRACTION ==="
echo "Started at: $(date)"
echo ""

# Check if cPanel API token is available
if [ -z "$CPANEL_API_TOKEN" ]; then
    echo "❌ CPANEL_API_TOKEN not set in .env file"
    echo ""
    echo "📋 MANUAL EXTRACTION STEPS:"
    echo "1. In cPanel File Manager, navigate to public_html"
    echo "2. Find snakkaz-dist.zip (11.97 MB)"
    echo "3. Right-click on snakkaz-dist.zip"
    echo "4. Select 'Extract'"
    echo "5. Choose 'Extract files to: /public_html'"
    echo "6. Click 'Extract Files'"
    echo "7. Wait for extraction to complete"
    echo "8. Delete snakkaz-dist.zip"
    echo "9. Visit https://snakkaz.com to verify"
    echo ""
    
    # Create a backup of important files list
    echo "📋 IMPORTANT FILES TO PRESERVE:"
    echo "- index.html (current version)"
    echo "- favicon.ico"
    echo "- Any custom configuration files"
    echo ""
    
    exit 1
fi

# If we have API token, try automated extraction
echo "🔧 Attempting automated extraction..."
EXTRACT_RESPONSE=$(curl -s -H "Authorization: cpanel admin@snakkaz.com:$CPANEL_API_TOKEN" \
    "https://snakkaz.com:2083/execute/Fileman/extract_files" \
    -d "dir=/home/snakqsqe/public_html" \
    -d "file=snakkaz-dist.zip" \
    -d "overwrite=1")

echo "API Response: $EXTRACT_RESPONSE"

if echo "$EXTRACT_RESPONSE" | grep -q '"status":1'; then
    echo "✅ Automatic extraction successful!"
    
    # Try to delete the ZIP file
    DELETE_RESPONSE=$(curl -s -H "Authorization: cpanel admin@snakkaz.com:$CPANEL_API_TOKEN" \
        "https://snakkaz.com:2083/execute/Fileman/delete_files" \
        -d "dir=/home/snakqsqe/public_html" \
        -d "file=snakkaz-dist.zip")
    
    if echo "$DELETE_RESPONSE" | grep -q '"status":1'; then
        echo "✅ ZIP file deleted successfully!"
    else
        echo "⚠️ Could not delete ZIP file automatically"
    fi
    
    echo ""
    echo "🌐 Visit https://snakkaz.com to verify deployment"
else
    echo "❌ Automatic extraction failed"
    echo "Please use manual extraction steps above"
fi

echo ""
echo "Extraction script completed at: $(date)"
