# SnakkaZ WebRTC Testing

## Overview

This directory contains tools and resources for testing the WebRTC functionality in SnakkaZ Chat. WebRTC enables direct peer-to-peer communication between users for real-time messaging.

## Testing Approach

Due to the nature of WebRTC, which requires real browser environments and actual network connections, we use a browser-based testing approach rather than trying to fully simulate WebRTC in Jest unit tests.

## Testing Tools

### 1. Browser-based Test Tool

The file `src/tests/webrtc-browser-test.html` provides an interactive environment for testing:

- WebRTC API availability
- ICE server connectivity
- Connection establishment
- Message sending/receiving
- Encryption and security
- Reconnection and fallback mechanisms

### 2. Test Runner Script

The `test-webrtc.sh` script provides a convenient way to:

- Run browser-based WebRTC tests
- Start the application in WebRTC test mode
- Run WebRTC diagnostics

## Testing Instructions

### Running WebRTC Tests

1. Run the test script from the project root:
   ```bash
   ./test-webrtc.sh
   ```

2. Choose the appropriate testing option from the menu:
   - **Option 1**: Run browser-based WebRTC tests
   - **Option 2**: Run application in WebRTC test mode
   - **Option 3**: Run WebRTC diagnostics

### Manual Testing Procedure

For a complete test of the WebRTC functionality:

1. Open the browser-based test tool in two different browsers.
2. In each browser:
   - Enter a unique user ID
   - Enter the other browser's ID as the peer ID
   - Initialize the connection in both browsers
   - Connect to the peer in both browsers

3. Test messaging:
   - Send messages between browsers
   - Verify receipt in the other browser
   - Test encrypted messages

4. Test connection resilience:
   - Test reconnection after disconnecting
   - Test fallback to server when WebRTC fails

## WebRTC Components

The main WebRTC components in the SnakkaZ Chat application are:

- `WebRTCManager`: Core class managing WebRTC connections
- `PeerManager`: Manages peer connections and signaling
- `ConnectionManager`: Handles connection establishment and state
- `MessageHandler`: Processes message sending and receiving
- `ReconnectionManager`: Manages reconnection attempts
- `ConnectionStateManager`: Tracks connection states

## Common Issues and Troubleshooting

1. **Connection Failures**
   - Check firewall settings that might block UDP traffic
   - Ensure STUN servers are accessible
   - Verify that both peers are using compatible browsers

2. **Message Encryption Issues**
   - Check browser support for the WebCrypto API
   - Verify key exchange process

3. **Reconnection Problems**
   - Check network stability
   - Verify reconnection logic in the application

## Testing Notes

- WebRTC requires secure contexts (HTTPS or localhost)
- Mobile browser support may vary
- Network conditions can affect connection quality
- Firewalls and NATs may prevent direct connections

## Documentation

For more detailed information, see:
- `webrtc-testing-guide.md`: Comprehensive testing guide
- `webrtc-test-plan.md`: Detailed test plan
- `webrtc-testing-summary.md`: Summary of testing approach
