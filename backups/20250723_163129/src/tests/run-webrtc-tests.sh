#!/bin/bash

# WebRTC Testing Suite for SnakkaZ
# This script runs both Jest unit tests and a browser-based WebRTC test

# Set colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   SnakkaZ WebRTC Test Suite Runner     ${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if jest is installed
if ! command -v npx jest &> /dev/null; then
    echo -e "${RED}Jest is not installed. Make sure you have Jest installed via npm.${NC}"
    exit 1
fi

# Function to run Jest tests
run_jest_tests() {
    echo -e "${YELLOW}Running WebRTC Unit Tests with Jest...${NC}"
    npx jest src/tests/webrtc/webrtc-manager.test.ts --verbose

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Jest tests passed successfully!${NC}"
    else
        echo -e "${RED}Jest tests failed. Check the output above for errors.${NC}"
        echo -e "${YELLOW}Would you like to continue with browser testing? (y/n)${NC}"
        read -r response
        if [[ "$response" != "y" ]]; then
            echo -e "${RED}Testing terminated by user.${NC}"
            exit 1
        fi
    fi
}

# Function to run browser tests
run_browser_tests() {
    echo -e "${YELLOW}Starting browser-based WebRTC test...${NC}"
    
    # Get the absolute path to the test file
    test_file="$(pwd)/src/tests/webrtc-browser-test.html"
    
    # Detect the browser to use
    if command -v google-chrome &> /dev/null; then
        echo -e "${BLUE}Opening test in Google Chrome...${NC}"
        google-chrome "$test_file" &
    elif command -v chromium-browser &> /dev/null; then
        echo -e "${BLUE}Opening test in Chromium...${NC}"
        chromium-browser "$test_file" &
    elif command -v firefox &> /dev/null; then
        echo -e "${BLUE}Opening test in Firefox...${NC}"
        firefox "$test_file" &
    elif command -v brave-browser &> /dev/null; then
        echo -e "${BLUE}Opening test in Brave...${NC}"
        brave-browser "$test_file" &
    else
        echo -e "${RED}No compatible browser found. Please open the test file manually:${NC}"
        echo -e "${YELLOW}$test_file${NC}"
    fi
}

# Main function to run all tests
run_all_tests() {
    run_jest_tests
    
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}   WebRTC Browser Testing              ${NC}"
    echo -e "${BLUE}========================================${NC}"
    
    echo -e "${YELLOW}Jest tests complete. The WebRTC browser test requires manual verification.${NC}"
    echo -e "${YELLOW}Would you like to open the browser-based WebRTC test? (y/n)${NC}"
    read -r response
    
    if [[ "$response" == "y" ]]; then
        run_browser_tests
        
        echo ""
        echo -e "${YELLOW}WebRTC browser test has been opened. Please follow these instructions:${NC}"
        echo "1. Test WebRTC API by clicking 'Test WebRTC API'"
        echo "2. Test ICE Servers by clicking 'Test ICE Servers'"
        echo "3. Test a full connection by clicking 'Test Full Connection'"
        echo "4. Initialize a connection with a unique ID and connect to a peer"
        echo "5. Test sending messages between peers"
        echo "6. Test encryption and secure connections"
        echo "7. Test reconnection and server fallback"
        echo ""
        echo -e "${YELLOW}NOTE: For a complete test, open this HTML file in two different browsers${NC}"
        echo -e "${YELLOW}or browser windows and establish a connection between them.${NC}"
    else
        echo -e "${BLUE}Browser testing skipped.${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}Testing completed!${NC}"
}

# Run the tests
run_all_tests
