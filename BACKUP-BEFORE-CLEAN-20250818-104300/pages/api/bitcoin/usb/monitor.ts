// api/bitcoin/usb/monitor.ts
// API endpoint for starting/stopping USB device monitoring

import { NextApiRequest, NextApiResponse } from 'next';
import { UsbElectrumWalletManager } from '@/server/payments/usbElectrumWalletManager';
import { authMiddleware } from '@/middleware/authMiddleware';

// Initialize the USB wallet manager singleton
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
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    const { userId, action } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'Missing required parameter: userId' });
    }
    
    if (!action || !['start', 'stop'].includes(action)) {
      return res.status(400).json({ success: false, error: 'Invalid action, must be "start" or "stop"' });
    }
    
    const manager = await getUsbWalletManager();
    
    if (action === 'start') {
      await manager.startMonitoring();
      return res.status(200).json({ success: true, message: 'USB monitoring started' });
    } 
    else if (action === 'stop') {
      manager.stopMonitoring();
      return res.status(200).json({ success: true, message: 'USB monitoring stopped' });
    }
    
  } catch (error: any) {
    console.error('Error in USB monitor endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to start/stop USB monitoring' 
    });
  }
}

export default authMiddleware(handler);
