// api/bitcoin/usb/status/[deviceId].ts
// API endpoint for getting the status of a USB wallet transfer

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
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    const { deviceId } = req.query;
    
    if (!deviceId || Array.isArray(deviceId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing or invalid deviceId parameter' 
      });
    }
    
    const manager = await getUsbWalletManager();
    
    // Get transfer status for the specified device
    const status = manager.getTransferStatus(deviceId);
    
    if ('error' in status) {
      return res.status(404).json({
        success: false,
        error: status.error
      });
    }
    
    return res.status(200).json({
      success: true,
      status
    });
    
  } catch (error: any) {
    console.error('Error in USB status endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to get transfer status' 
    });
  }
}

export default authMiddleware(handler);
