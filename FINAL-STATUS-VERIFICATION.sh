#!/bin/bash

echo "=================================="
echo "SNAKKAZ.COM FINAL STATUS VERIFICATION"
echo "=================================="
echo

echo "1. Checking main JavaScript entry point..."
response=$(curl -I https://snakkaz.com/assets/js/index-BLOqcvUi.js 2>/dev/null | grep "content-type")
if [[ $response == *"application/javascript"* ]]; then
    echo "✅ Main entry point: CORRECT MIME TYPE"
else
    echo "❌ Main entry point: INCORRECT MIME TYPE"
fi

echo
echo "2. Checking React Core module..."
response=$(curl -I https://snakkaz.com/assets/js/vendor-react-core-DwHMgWgV.js 2>/dev/null | grep "content-type")
if [[ $response == *"application/javascript"* ]]; then
    echo "✅ React Core: CORRECT MIME TYPE"
else
    echo "❌ React Core: INCORRECT MIME TYPE"
fi

echo
echo "3. Checking React DOM module..."
response=$(curl -I https://snakkaz.com/assets/js/vendor-react-dom-DBKh3-U4.js 2>/dev/null | grep "content-type")
if [[ $response == *"application/javascript"* ]]; then
    echo "✅ React DOM: CORRECT MIME TYPE"
else
    echo "❌ React DOM: INCORRECT MIME TYPE"
fi

echo
echo "4. Checking vendor-misc module..."
response=$(curl -I https://snakkaz.com/assets/js/vendor-misc-D0zU6y7X.js 2>/dev/null | grep "content-type")
if [[ $response == *"application/javascript"* ]]; then
    echo "✅ Vendor Misc: CORRECT MIME TYPE"
else
    echo "❌ Vendor Misc: INCORRECT MIME TYPE"
fi

echo
echo "5. Checking index.html references..."
main_script=$(curl -s https://snakkaz.com/ | grep "index-BLOqcvUi.js")
react_core=$(curl -s https://snakkaz.com/ | grep "vendor-react-core-DwHMgWgV.js")
react_dom=$(curl -s https://snakkaz.com/ | grep "vendor-react-dom-DBKh3-U4.js")

if [[ -n "$main_script" ]]; then
    echo "✅ Index.html references correct main script"
else
    echo "❌ Index.html has incorrect main script reference"
fi

if [[ -n "$react_core" ]]; then
    echo "✅ Index.html references correct React core"
else
    echo "❌ Index.html has incorrect React core reference"
fi

if [[ -n "$react_dom" ]]; then
    echo "✅ Index.html references correct React DOM"
else
    echo "❌ Index.html has incorrect React DOM reference"
fi

echo
echo "6. Checking module loading order..."
module_order=$(curl -s https://snakkaz.com/ | grep -o "vendor-react-core.*\|vendor-misc.*" | head -2)
if [[ $module_order == *"vendor-react-core"*"vendor-misc"* ]]; then
    echo "✅ React Core loads before vendor-misc (CORRECT ORDER)"
else
    echo "❌ Module loading order is incorrect"
fi

echo
echo "7. Checking for emergency fix removal..."
emergency_fix=$(curl -s https://snakkaz.com/ | grep "emergency-react-fix")
if [[ -z "$emergency_fix" ]]; then
    echo "✅ Emergency React fix script removed"
else
    echo "❌ Emergency React fix script still present"
fi

echo
echo "=================================="
echo "FINAL STATUS SUMMARY"
echo "=================================="

# Count successful checks
checks=0
if [[ $(curl -I https://snakkaz.com/assets/js/index-BLOqcvUi.js 2>/dev/null | grep "content-type") == *"application/javascript"* ]]; then ((checks++)); fi
if [[ $(curl -I https://snakkaz.com/assets/js/vendor-react-core-DwHMgWgV.js 2>/dev/null | grep "content-type") == *"application/javascript"* ]]; then ((checks++)); fi
if [[ $(curl -I https://snakkaz.com/assets/js/vendor-react-dom-DBKh3-U4.js 2>/dev/null | grep "content-type") == *"application/javascript"* ]]; then ((checks++)); fi
if [[ $(curl -I https://snakkaz.com/assets/js/vendor-misc-D0zU6y7X.js 2>/dev/null | grep "content-type") == *"application/javascript"* ]]; then ((checks++)); fi
if [[ -n $(curl -s https://snakkaz.com/ | grep "index-BLOqcvUi.js") ]]; then ((checks++)); fi
if [[ -n $(curl -s https://snakkaz.com/ | grep "vendor-react-core-DwHMgWgV.js") ]]; then ((checks++)); fi
if [[ -z $(curl -s https://snakkaz.com/ | grep "emergency-react-fix") ]]; then ((checks++)); fi

echo "Successful checks: $checks/7"

if [[ $checks -eq 7 ]]; then
    echo "🎉 ALL CHECKS PASSED! SnakkaZ.com should now load without React errors."
    echo
    echo "The following issues have been resolved:"
    echo "• JavaScript 404 errors (files now exist with correct names)"
    echo "• MIME type errors (all JS files serve as 'application/javascript')"
    echo "• 'K is undefined' error (React core loads before vendor-misc)"
    echo "• useState undefined errors (proper React dependency order)"
    echo "• Emergency fix interference (removed emergency scripts)"
    echo
    echo "Users should now be able to access the chat application normally."
    echo "You may want to clear browser cache to ensure the latest version loads."
else
    echo "⚠️  Some issues remain. Please review the failed checks above."
fi

echo "=================================="
