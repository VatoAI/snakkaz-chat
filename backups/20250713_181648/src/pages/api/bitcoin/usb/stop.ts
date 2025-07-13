// api/bitcoin/usb/stop.ts
// API endpoint for stopping an active USB wallet transfer

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
    const { deviceId } = req.body;
    
    if (!deviceId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameter: deviceId' 
      });
    }
    
    const manager = await getUsbWalletManager();
    
    // Stop the Electrum process for the specified device
    const result = manager.stopElectrumProcess(deviceId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'No active transfer found for this device'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Transfer stopped successfully'
    });
    
  } catch (error: any) {
    console.error('Error in USB stop endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to stop transfer' 
    });
  }
}

export default authMiddleware(handler);
