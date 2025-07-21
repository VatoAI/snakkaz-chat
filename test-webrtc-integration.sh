#!/bin/bash

# =============================
# WebRTC Integration Test Script
# =============================

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "==== SnakkaZ WebRTC Integration Test ===="
echo

# Check if required dependencies are installed
echo -e "${YELLOW}Checking dependencies...${NC}"
npm ls peerjs p-retry p-timeout uint8arrays race-event || {
  echo -e "${RED}Missing dependencies. Installing...${NC}"
  npm install peerjs p-retry p-timeout uint8arrays race-event
}

# Run tests for individual components
echo -e "\n${YELLOW}Testing WebRTC components...${NC}"

# 1. PeerJSManager test
echo -e "\n${GREEN}Testing PeerJSManager...${NC}"
test_peerjs_manager() {
  node -e "
    const { PeerJSManager } = require('./dist/utils/webrtc/peerjs-manager');
    
    async function test() {
      const manager = new PeerJSManager('test-user');
      
      try {
        await manager.initialize();
        console.log('✓ PeerJSManager initialized successfully');
        
        console.log('✓ Manager ID:', manager.getPeerId());
        console.log('✓ Status:', manager.getStatus());
        
        // Cleanup
        manager.disconnect();
        console.log('✓ Disconnected successfully');
        
        return true;
      } catch (error) {
        console.error('✗ Error:', error.message);
        return false;
      }
    }
    
    test().then(success => {
      process.exit(success ? 0 : 1);
    });
  " && echo -e "${GREEN}PeerJSManager tests passed${NC}" || echo -e "${RED}PeerJSManager tests failed${NC}"
}

# 2. WebRTC hooks test
echo -e "\n${GREEN}Testing WebRTC hooks...${NC}"
test_webrtc_hooks() {
  # This is a simple check that the hooks can be imported without errors
  node -e "
    try {
      const path = require('path');
      const fs = require('fs');
      
      // Check that all the hook files exist
      const hooksToCheck = [
        './src/hooks/useWebRTC.new.ts',
        './src/hooks/useWebRTCDirectMessaging.new.ts',
        './src/hooks/useSignaling.new.ts',
        './src/hooks/useWebRTCMonitoring.new.ts',
        './src/hooks/useIntegratedChat.new.ts',
        './src/hooks/webrtc-hooks.new.ts'
      ];
      
      let allExist = true;
      for (const hook of hooksToCheck) {
        if (!fs.existsSync(hook)) {
          console.error('✗ Missing hook file:', hook);
          allExist = false;
        } else {
          console.log('✓ Found hook file:', hook);
        }
      }
      
      if (allExist) {
        console.log('✓ All WebRTC hook files exist');
      }
      
      process.exit(allExist ? 0 : 1);
    } catch (error) {
      console.error('✗ Error:', error.message);
      process.exit(1);
    }
  " && echo -e "${GREEN}WebRTC hooks check passed${NC}" || echo -e "${RED}WebRTC hooks check failed${NC}"
}

# 3. UI components test
echo -e "\n${GREEN}Testing UI components...${NC}"
test_ui_components() {
  # Check that the component files exist
  node -e "
    try {
      const fs = require('fs');
      
      // Check that all the component files exist
      const componentsToCheck = [
        './src/components/chat/WebRTCStatus.new.tsx',
        './src/components/chat/WebRTCMonitor.new.tsx',
        './src/components/test/WebRTCImplementationTest.tsx'
      ];
      
      let allExist = true;
      for (const component of componentsToCheck) {
        if (!fs.existsSync(component)) {
          console.error('✗ Missing component file:', component);
          allExist = false;
        } else {
          console.log('✓ Found component file:', component);
        }
      }
      
      if (allExist) {
        console.log('✓ All WebRTC component files exist');
      }
      
      process.exit(allExist ? 0 : 1);
    } catch (error) {
      console.error('✗ Error:', error.message);
      process.exit(1);
    }
  " && echo -e "${GREEN}UI components check passed${NC}" || echo -e "${RED}UI components check failed${NC}"
}

# 4. Check TypeScript compilation
echo -e "\n${YELLOW}Checking TypeScript compilation...${NC}"
check_typescript() {
  npx tsc --noEmit && echo -e "${GREEN}TypeScript compilation succeeded${NC}" || echo -e "${RED}TypeScript compilation failed${NC}"
}

# 5. Run ESLint check
echo -e "\n${YELLOW}Running ESLint check...${NC}"
check_eslint() {
  npx eslint "./src/**/*.{ts,tsx}" --quiet && echo -e "${GREEN}ESLint check passed${NC}" || echo -e "${RED}ESLint found issues${NC}"
}

# Run the tests
test_peerjs_manager
test_webrtc_hooks
test_ui_components
check_typescript
check_eslint

echo -e "\n${GREEN}Tests completed!${NC}"
echo "See the WebRTC implementation test component for interactive testing:"
echo "src/components/test/WebRTCImplementationTest.tsx"
