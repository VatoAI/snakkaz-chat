# USB Wallet Integration for Bitcoin/Electrum

This document explains how to use and test the USB wallet integration feature in Snakkaz Chat, which allows users to securely transfer their Bitcoin wallets to USB devices for offline storage.

## Features

- Detect and connect to USB devices as offline Bitcoin wallets
- Secure with 2FA protection
- Integration with Electrum for wallet transfer
- Real-time status updates during transfer
- Premium user feature

## Implementation Details

The USB wallet integration consists of several components:

### Frontend

1. **UsbWalletIntegration Component** (`src/components/payments/UsbWalletIntegration.tsx`)
   - Provides UI for managing USB wallet operations
   - Handles device selection, authentication, and transfer initiation
   - Shows real-time transfer status

2. **BitcoinWallet Component Integration** (`src/components/profile/BitcoinWallet.tsx`)
   - Integrates USB wallet functionality in the "Electrum & USB" tab
   - Only shows for premium users
   - Provides helpful information about offline wallet usage

### Backend

1. **UsbElectrumWalletManager** (`src/server/payments/usbElectrumWalletManager.js`)
   - Core functionality for USB device interaction
   - Handles device detection, authentication, and Electrum operations
   - Maintains transfer state and security checks

2. **API Routes** (under `src/pages/api/bitcoin/usb/`)
   - `monitor.ts` - Start/stop USB monitoring
   - `devices.ts` - List connected USB devices
   - `prepare.ts` - Prepare device with 2FA authentication
   - `launch.ts` - Start Electrum wallet transfer
   - `status/[deviceId].ts` - Check transfer status
   - `stop.ts` - Stop ongoing transfers

## Usage Flow

1. **Access the Feature**
   - Navigate to your Bitcoin wallet in Snakkaz Chat
   - Go to the "Electrum & USB" tab
   - If you're a premium user, you'll see the USB wallet integration section

2. **Connect a USB Device**
   - Click "Start Monitoring" to detect USB devices
   - Connect your USB storage device
   - Select the detected device from the list

3. **Authenticate**
   - Enter your wallet password
   - Provide a 2FA code for additional security
   - Click "Prepare Device"

4. **Transfer Wallet**
   - After successful authentication, click "Start Transfer"
   - Monitor the transfer progress
   - Wait for completion notification

5. **Verify Transfer**
   - Once complete, safely eject your USB device
   - The USB device now contains your Electrum wallet

## Testing

### Manual Testing

1. Navigate to the Bitcoin wallet page in Snakkaz Chat
2. Ensure you're logged in as a premium user
3. Go to the "Electrum & USB" tab
4. Connect a USB device and verify it's detected
5. Test the authentication flow
6. Verify wallet transfer works correctly
7. Check error handling by intentionally disconnecting the device mid-transfer

### Automated Testing

Use the provided test script:

```bash
# Set authentication token for testing
export TEST_AUTH_TOKEN="your_test_token_here"

# Run the test script
node test-usb-wallet-integration.js
```

Follow the prompts in the test script to verify each step of the integration.

## Troubleshooting

### Common Issues

1. **USB Device Not Detected**
   - Ensure the USB device is properly connected
   - Try a different USB port
   - Check if the device is formatted correctly (FAT32 recommended)

2. **Authentication Failures**
   - Verify the wallet password is correct
   - Ensure the 2FA code is current and valid
   - Check that your account has premium access

3. **Transfer Errors**
   - Ensure the USB device has sufficient free space
   - Check if the device is write-protected
   - Verify the Electrum configuration is correct

### Getting Support

If you encounter issues not covered here, please contact support through:
- Email: support@snakkaz.com
- Chat: Use the support chat in the app
- Forum: Visit the Snakkaz community forum

## Security Considerations

- Always eject USB devices safely after transfers
- Store USB wallets in secure, offline locations
- Consider creating backup copies of your wallet
- Never share your 2FA codes or passwords
- Verify each transfer was successful before relying on the USB wallet
