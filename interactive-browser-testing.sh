#!/bin/bash
# SnakkaZ Interactive Browser Testing
# Elegant visuell testing med real-time browser

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🌐 SNAKKAZ INTERACTIVE BROWSER TESTING${NC}"
echo -e "${BLUE}=======================================${NC}"

# Kill any existing server
pkill -f "python3 -m http.server 8081" 2>/dev/null

echo -e "${YELLOW}🚀 Starting SnakkaZ test server...${NC}"

# Start server in background
cd snakkaz-complete-deployment
python3 -m http.server 8081 > /tmp/snakkaz-server.log 2>&1 &
SERVER_PID=$!
cd ..

# Wait for server to start
sleep 2

echo -e "${GREEN}✅ Test server running!${NC}"
echo -e "\n${CYAN}📱 INTERACTIVE TESTING GUIDE${NC}"
echo -e "${BLUE}=============================${NC}"

echo -e "\n${YELLOW}1. BROWSER TESTING:${NC}"
echo -e "   🌐 Open: ${BLUE}http://localhost:8081${NC}"
echo -e "   📝 Check: Liquid glass design loads"
echo -e "   📝 Check: No console errors"
echo -e "   📝 Check: PWA install prompt"

echo -e "\n${YELLOW}2. MOBILE TESTING:${NC}"
echo -e "   📱 Open browser developer tools (F12)"
echo -e "   📱 Toggle device toolbar (Ctrl+Shift+M)"
echo -e "   📱 Test iPhone/Android view"
echo -e "   📱 Check responsive design"

echo -e "\n${YELLOW}3. PWA TESTING:${NC}"
echo -e "   🔧 Check Application tab in DevTools"
echo -e "   🔧 Verify Service Worker registered"
echo -e "   🔧 Test 'Add to Home Screen'"
echo -e "   🔧 Test offline functionality"

echo -e "\n${YELLOW}4. CHAT TESTING:${NC}"
echo -e "   💬 Try to register a test account"
echo -e "   💬 Send a test message"
echo -e "   💬 Check encryption indicators"
echo -e "   💬 Test message delivery"

echo -e "\n${CYAN}🧪 QUICK TESTS TO RUN:${NC}"
echo -e "${BLUE}========================${NC}"

# Real-time monitoring
echo -e "\n${YELLOW}📊 Real-time monitoring starting...${NC}"

# Function to check for errors
check_console_errors() {
    echo -e "${BLUE}Checking server logs for errors...${NC}"
    if [ -f /tmp/snakkaz-server.log ]; then
        error_count=$(grep -i "error" /tmp/snakkaz-server.log | wc -l)
        if [ "$error_count" -eq 0 ]; then
            echo -e "${GREEN}✅ No server errors detected${NC}"
        else
            echo -e "${YELLOW}⚠️  $error_count server warnings (check /tmp/snakkaz-server.log)${NC}"
        fi
    fi
}

# Function to test critical endpoints
test_endpoints() {
    echo -e "\n${BLUE}Testing critical endpoints...${NC}"
    
    endpoints=(
        "/ (Main page)"
        "/manifest.json (PWA manifest)"
        "/service-worker.js (PWA service worker)"
    )
    
    for endpoint_info in "${endpoints[@]}"; do
        endpoint=$(echo "$endpoint_info" | cut -d' ' -f1)
        description=$(echo "$endpoint_info" | cut -d'(' -f2 | cut -d')' -f1)
        
        if curl -s -I "http://localhost:8081$endpoint" | grep -q "200 OK"; then
            echo -e "${GREEN}✅ $description: OK${NC}"
        else
            echo -e "${YELLOW}⚠️  $description: Issue detected${NC}"
        fi
    done
}

# Function to show browser testing checklist
show_browser_checklist() {
    echo -e "\n${CYAN}🔍 BROWSER TESTING CHECKLIST${NC}"
    echo -e "${BLUE}=============================${NC}"
    echo -e "□ Page loads without JavaScript errors"
    echo -e "□ Liquid glass design is visible and beautiful"
    echo -e "□ PWA install prompt appears"
    echo -e "□ Mobile view works perfectly"
    echo -e "□ Chat interface is responsive"
    echo -e "□ Service Worker registers successfully"
    echo -e "□ No 404 errors for assets"
    echo -e "□ Typography and colors look correct"
}

# Interactive menu
show_menu() {
    echo -e "\n${CYAN}🎮 INTERACTIVE TESTING MENU${NC}"
    echo -e "${BLUE}=============================${NC}"
    echo -e "1. 🌐 Open browser to app"
    echo -e "2. 📊 Check server status"
    echo -e "3. 🧪 Test critical endpoints"
    echo -e "4. 📝 Show browser checklist"
    echo -e "5. 📱 Mobile testing tips"
    echo -e "6. 🔍 View server logs"
    echo -e "7. ✅ Mark testing complete"
    echo -e "8. 🛑 Stop server and exit"
    echo -e "\nChoose option (1-8):"
}

# Run initial checks
check_console_errors
test_endpoints
show_browser_checklist

# Interactive loop
while true; do
    show_menu
    read -r choice
    
    case $choice in
        1)
            echo -e "${GREEN}🌐 Opening browser...${NC}"
            echo -e "Visit: ${BLUE}http://localhost:8081${NC}"
            if command -v xdg-open >/dev/null 2>&1; then
                xdg-open http://localhost:8081 2>/dev/null
            elif command -v open >/dev/null 2>&1; then
                open http://localhost:8081 2>/dev/null
            else
                echo -e "${YELLOW}Please open browser manually to: http://localhost:8081${NC}"
            fi
            ;;
        2)
            check_console_errors
            ;;
        3)
            test_endpoints
            ;;
        4)
            show_browser_checklist
            ;;
        5)
            echo -e "\n${CYAN}📱 MOBILE TESTING TIPS${NC}"
            echo -e "${BLUE}======================${NC}"
            echo -e "1. Open DevTools (F12)"
            echo -e "2. Click device toolbar icon (📱)"
            echo -e "3. Select iPhone or Android device"
            echo -e "4. Test touch interactions"
            echo -e "5. Check PWA install on mobile"
            echo -e "6. Test offline mode"
            ;;
        6)
            echo -e "\n${BLUE}📋 Server logs (last 20 lines):${NC}"
            tail -20 /tmp/snakkaz-server.log 2>/dev/null || echo "No logs yet"
            ;;
        7)
            echo -e "\n${GREEN}✅ TESTING COMPLETE!${NC}"
            echo -e "${GREEN}SnakkaZ is ready for deployment!${NC}"
            echo -e "\n${CYAN}Next steps:${NC}"
            echo -e "1. Upload snakkaz-complete-production-ready-v2.zip"
            echo -e "2. Deploy to www.snakkaz.com"
            echo -e "3. Start beta launch!"
            
            echo "$(date): Interactive testing completed - READY FOR DEPLOYMENT" >> /tmp/snakkaz-testing.log
            break
            ;;
        8)
            echo -e "${YELLOW}🛑 Stopping server...${NC}"
            break
            ;;
        *)
            echo -e "${YELLOW}Invalid option. Please choose 1-8.${NC}"
            ;;
    esac
    
    echo -e "\n${BLUE}Press Enter to continue...${NC}"
    read -r
done

# Cleanup
kill $SERVER_PID 2>/dev/null
echo -e "${GREEN}Server stopped. Testing session ended.${NC}"
