// api/bitcoin/usb/devices.ts
// API endpoint for getting list of connected USB devices

import { NextApiRequest, NextApiResponse } from 'next';
import { UsbElectrumWalletManager } from '@/server/payments/usbElectrumWalletManager';
import { authMiddleware } from '@/middleware/authMiddleware';

// Reference to the USB wallet manager singleton
let usbWalletManager: UsbElectrumWalletManager | null = null;

async function getUsbWalletManager(): Promise<UsbElectrumWalletManager> {
  if (!usbWalletManager) {
    const { OtpService } = await import('@/server/auth/otpService');
    const { WalletSecurity } = await import('@/server/payments/walletSecurity');
    
    usbWalletManager = new UsbElectrumWalletManager({
      otpService: new OtpService(),
      walletSecurity: new WalletSecurity(),
      onEvent: (event: string, data: any) => {
        console.log(`USB Event: ${event}`, data);
        // In a real implementation, this could emit events through a
        // WebSocket to update clients in real-time
      }
    });
  }
  
  return usbWalletManager;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    const manager = await getUsbWalletManager();
    
    // Get all connected devices
    const connectedDevices = Array.from(manager.connectedDevices.entries()).map(([deviceId, info]) => {
      const deviceInfo = manager.getDeviceInfo(info.device);
      return {
        deviceId,
        isElectrumCompatible: info.isElectrumCompatible,
        manufacturer: deviceInfo.manufacturer,
        product: deviceInfo.product,
        vendorId: deviceInfo.vendorId,
        productId: deviceInfo.productId,
        serialNumber: deviceInfo.serialNumber
      };
    });
    
    return res.status(200).json({
      success: true,
      devices: connectedDevices
    });
    
  } catch (error: any) {
    console.error('Error in USB devices endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to get connected USB devices' 
    });
  }
}

export default authMiddleware(handler);
