#!/bin/bash

# WebRTC Test Runner for SnakkaZ Chat
# This script helps users test WebRTC functionality in the application

# Set colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   SnakkaZ WebRTC Test Suite Runner     ${NC}"
echo -e "${BLUE}========================================${NC}"

# Function to run browser tests
run_browser_tests() {
    echo -e "${YELLOW}Starting browser-based WebRTC test...${NC}"
    
    # Get the absolute path to the test file
    test_file="$(pwd)/src/tests/webrtc-browser-test.html"
    
    echo -e "${BLUE}WebRTC browser test file location:${NC}"
    echo -e "${YELLOW}$test_file${NC}"
    echo ""
    echo -e "${YELLOW}Instructions for testing WebRTC:${NC}"
    echo "1. Open this HTML file in your browser"
    echo "2. Test WebRTC API by clicking 'Test WebRTC API'"
    echo "3. Test ICE Servers by clicking 'Test ICE Servers'"
    echo "4. Test a full connection by clicking 'Test Full Connection'"
    echo "5. For a complete test, open this file in two different browsers"
    echo "   and establish a connection between them."
    echo ""
    
    # Detect the browser to use
    if command -v google-chrome &> /dev/null; then
        echo -e "${BLUE}Would you like to open the test in Google Chrome? (y/n)${NC}"
        read -r response
        if [[ "$response" == "y" ]]; then
            echo -e "${GREEN}Opening test in Google Chrome...${NC}"
            google-chrome "$test_file" &
        fi
    elif command -v chromium-browser &> /dev/null; then
        echo -e "${BLUE}Would you like to open the test in Chromium? (y/n)${NC}"
        read -r response
        if [[ "$response" == "y" ]]; then
            echo -e "${GREEN}Opening test in Chromium...${NC}"
            chromium-browser "$test_file" &
        fi
    elif command -v firefox &> /dev/null; then
        echo -e "${BLUE}Would you like to open the test in Firefox? (y/n)${NC}"
        read -r response
        if [[ "$response" == "y" ]]; then
            echo -e "${GREEN}Opening test in Firefox...${NC}"
            firefox "$test_file" &
        fi
    elif command -v brave-browser &> /dev/null; then
        echo -e "${BLUE}Would you like to open the test in Brave? (y/n)${NC}"
        read -r response
        if [[ "$response" == "y" ]]; then
            echo -e "${GREEN}Opening test in Brave...${NC}"
            brave-browser "$test_file" &
        fi
    else
        echo -e "${RED}No compatible browser found automatically. Please open the test file manually:${NC}"
        echo -e "${YELLOW}$test_file${NC}"
    fi
}

# Function to run application in test mode
run_app_test() {
    echo -e "${YELLOW}Starting SnakkaZ Chat application in test mode...${NC}"
    echo -e "${BLUE}This will run the application with WebRTC debugging enabled.${NC}"
    
    # Create a temporary .env file for testing
    echo -e "${YELLOW}Setting up WebRTC test environment...${NC}"
    echo "VITE_WEBRTC_DEBUG=true" > .env.test
    echo "VITE_USE_TEST_ICE_SERVERS=true" >> .env.test
    echo "VITE_WEBRTC_LOG_LEVEL=verbose" >> .env.test
    
    # Run the application in test mode
    echo -e "${GREEN}Starting development server with WebRTC debugging...${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop the server when testing is complete.${NC}"
    npm run dev -- --mode test
}

# Function to run WebRTC diagnostics
run_webrtc_diagnostics() {
    echo -e "${YELLOW}Running WebRTC diagnostics...${NC}"
    
    # Check browser WebRTC support
    echo -e "${BLUE}Checking for WebRTC support in browsers...${NC}"
    
    echo -e "${YELLOW}Chrome/Chromium:${NC}"
    if command -v google-chrome &> /dev/null || command -v chromium-browser &> /dev/null; then
        echo -e "${GREEN}✓ Chrome/Chromium is available and supports WebRTC${NC}"
    else
        echo -e "${RED}Chrome/Chromium not found${NC}"
    fi
    
    echo -e "${YELLOW}Firefox:${NC}"
    if command -v firefox &> /dev/null; then
        echo -e "${GREEN}✓ Firefox is available and supports WebRTC${NC}"
    else
        echo -e "${RED}Firefox not found${NC}"
    fi
    
    # Check network connectivity to STUN servers
    echo -e "${BLUE}\nChecking connectivity to STUN servers...${NC}"
    echo -e "${YELLOW}stun.l.google.com:19302:${NC}"
    if nc -zuw1 stun.l.google.com 19302 2>/dev/null; then
        echo -e "${GREEN}✓ Connection successful${NC}"
    else
        echo -e "${RED}× Connection failed${NC}"
    fi
    
    echo -e "${YELLOW}stun1.l.google.com:19302:${NC}"
    if nc -zuw1 stun1.l.google.com 19302 2>/dev/null; then
        echo -e "${GREEN}✓ Connection successful${NC}"
    else
        echo -e "${RED}× Connection failed${NC}"
    fi
    
    # Check for common firewall issues
    echo -e "${BLUE}\nChecking for common WebRTC connectivity issues...${NC}"
    if [ -f /etc/ufw/ufw.conf ] && grep -q "ENABLED=yes" /etc/ufw/ufw.conf; then
        echo -e "${YELLOW}UFW firewall is enabled. Ensure that UDP ports are allowed for WebRTC.${NC}"
    fi
    
    if command -v iptables &> /dev/null; then
        if iptables -L | grep -q "DROP"; then
            echo -e "${YELLOW}iptables rules may be blocking WebRTC traffic. Check your firewall rules.${NC}"
        fi
    fi
    
    echo -e "${BLUE}\nWebRTC diagnostics complete.${NC}"
}

# Main menu
show_menu() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}   SnakkaZ WebRTC Testing Options       ${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo "1. Run Browser-based WebRTC Tests"
    echo "2. Run Application in WebRTC Test Mode"
    echo "3. Run WebRTC Diagnostics"
    echo "4. Exit"
    echo ""
    echo -e "${YELLOW}Enter your choice [1-4]:${NC}"
    read -r choice
    
    case $choice in
        1) run_browser_tests ;;
        2) run_app_test ;;
        3) run_webrtc_diagnostics ;;
        4) echo -e "${GREEN}Exiting...${NC}"; exit 0 ;;
        *) echo -e "${RED}Invalid choice. Please enter a number between 1 and 4.${NC}"; show_menu ;;
    esac
    
    # Return to menu after operation unless exiting
    if [ "$choice" != "4" ] && [ "$choice" != "2" ]; then
        echo ""
        echo -e "${BLUE}Press Enter to return to the main menu...${NC}"
        read -r
        show_menu
    fi
}

# Start the script
show_menu
