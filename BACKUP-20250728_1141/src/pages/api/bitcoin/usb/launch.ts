// api/bitcoin/usb/launch.ts
// API endpoint for launching Electrum for USB wallet transfer

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
    const { userId, deviceId, walletId } = req.body;
    
    if (!userId || !deviceId || !walletId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters: userId, deviceId, walletId' 
      });
    }
    
    const manager = await getUsbWalletManager();
    
    // Launch Electrum for USB wallet transfer
    const result = await manager.launchElectrumForUsbWallet(deviceId, userId, walletId);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Failed to launch Electrum'
      });
    }
    
    return res.status(200).json({
      success: true,
      deviceId,
      walletPath: result.walletPath,
      processId: result.processId
    });
    
  } catch (error: any) {
    console.error('Error in USB launch endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to launch Electrum' 
    });
  }
}

export default authMiddleware(handler);
