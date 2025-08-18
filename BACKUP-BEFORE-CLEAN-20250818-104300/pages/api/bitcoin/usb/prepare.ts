// api/bitcoin/usb/prepare.ts
// API endpoint for preparing a USB device for Electrum wallet operations

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
      }
    });
  }
  
  return usbWalletManager;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    const { userId, deviceId, password, otpCode, walletId } = req.body;
    
    if (!userId || !deviceId || !password || !otpCode) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters: userId, deviceId, password, otpCode' 
      });
    }
    
    const manager = await getUsbWalletManager();
    
    // Prepare USB device for wallet operations
    const result = await manager.prepareUsbDevice(deviceId, userId, password, otpCode);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Failed to prepare USB device'
      });
    }
    
    return res.status(200).json({
      success: true,
      walletId: result.walletId,
      deviceId,
      mountPath: result.mountPath
    });
    
  } catch (error: any) {
    console.error('Error in USB prepare endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to prepare USB device' 
    });
  }
}

export default authMiddleware(handler);
