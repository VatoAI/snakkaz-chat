/**
 * USB Electrum Wallet Manager
 * 
 * This module handles integration with USB-based Electrum wallets, allowing users
 * to securely transfer funds to offline storage with 2FA protection.
 * 
 * The flow is:
 * 1. Detect when USB device is connected
 * 2. Prompt user for authentication (password + 2FA)
 * 3. Launch local Electrum instance targeting USB wallet
 * 4. Allow secure transfer from Snakkaz wallet to user's offline wallet
 * 5. Verify transfer and close connection
 */

const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const usb = require('usb');
const { WalletSecurity } = require('./walletSecurity');
const { OtpService } = require('../auth/otpService');
const { supabase } = require('../../lib/supabaseClient');
const { logger } = require('../logging/logger');

class UsbElectrumWalletManager {
  constructor(config = {}) {
    this.config = {
      electrumPath: config.electrumPath || process.env.ELECTRUM_EXECUTABLE_PATH,
      tempWalletDir: config.tempWalletDir || path.join(__dirname, '../../temp/wallets'),
      usbMountPoint: config.usbMountPoint || '/media',
      walletSecurity: config.walletSecurity || new WalletSecurity(),
      otpService: config.otpService || new OtpService(),
      maxTransferAmount: config.maxTransferAmount || 5.0, // BTC
      devicePollingInterval: config.devicePollingInterval || 2000, // ms
    };
    
    // Make sure temp wallet directory exists
    if (!fs.existsSync(this.config.tempWalletDir)) {
      fs.mkdirSync(this.config.tempWalletDir, { recursive: true });
    }
    
    // State tracking
    this.isMonitoring = false;
    this.connectedDevices = new Map();
    this.activeTransfers = new Map();
    this.devicePollingIntervalId = null;
  }
  
  /**
   * Start monitoring for USB devices
   * @returns {Promise<void>}
   */
  async startMonitoring() {
    if (this.isMonitoring) return;
    
    try {
      logger.info('Starting USB device monitoring for Electrum wallets');
      this.isMonitoring = true;
      
      // Setup USB device detection
      usb.on('attach', device => this.handleDeviceAttached(device));
      usb.on('detach', device => this.handleDeviceDetached(device));
      
      // Initial scan for already connected devices
      const devices = usb.getDeviceList();
      devices.forEach(device => {
        this.handleDeviceAttached(device);
      });
      
      // Setup polling for device detection as backup
      this.devicePollingIntervalId = setInterval(() => {
        this.pollForDevices();
      }, this.config.devicePollingInterval);
      
      logger.info('USB monitoring started successfully');
    } catch (error) {
      logger.error('Error starting USB monitoring:', error);
      this.isMonitoring = false;
      throw error;
    }
  }
  
  /**
   * Stop monitoring for USB devices
   */
  stopMonitoring() {
    if (!this.isMonitoring) return;
    
    logger.info('Stopping USB device monitoring');
    this.isMonitoring = false;
    
    // Remove USB event listeners
    usb.removeAllListeners('attach');
    usb.removeAllListeners('detach');
    
    // Clear device polling interval
    if (this.devicePollingIntervalId) {
      clearInterval(this.devicePollingIntervalId);
      this.devicePollingIntervalId = null;
    }
    
    // Close any active transfers
    this.activeTransfers.forEach((transfer, deviceId) => {
      this.stopElectrumProcess(deviceId);
    });
    this.activeTransfers.clear();
    this.connectedDevices.clear();
  }
  
  /**
   * Poll for connected USB devices periodically
   * This serves as a backup to the event-based approach
   */
  pollForDevices() {
    try {
      const devices = usb.getDeviceList();
      const currentDeviceIds = new Set(devices.map(d => d.deviceDescriptor.idVendor + ':' + d.deviceDescriptor.idProduct));
      
      // Check for new devices
      currentDeviceIds.forEach(deviceId => {
        if (!this.connectedDevices.has(deviceId)) {
          const device = devices.find(d => 
            (d.deviceDescriptor.idVendor + ':' + d.deviceDescriptor.idProduct) === deviceId
          );
          if (device) {
            this.handleDeviceAttached(device);
          }
        }
      });
      
      // Check for removed devices
      this.connectedDevices.forEach((deviceInfo, deviceId) => {
        if (!currentDeviceIds.has(deviceId)) {
          this.handleDeviceDetached({ deviceId });
        }
      });
    } catch (error) {
      logger.error('Error polling for USB devices:', error);
    }
  }
  
  /**
   * Handle new USB device connection
   * @param {Object} device - USB device object
   */
  async handleDeviceAttached(device) {
    try {
      const deviceId = device.deviceDescriptor.idVendor + ':' + device.deviceDescriptor.idProduct;
      
      if (this.connectedDevices.has(deviceId)) {
        return; // Already tracking this device
      }
      
      logger.info(`USB device attached: ${deviceId}`);
      
      // Try to detect if this might be an Electrum-compatible device
      const isElectrumCompatible = await this.checkIfElectrumCompatible(device);
      
      this.connectedDevices.set(deviceId, {
        device,
        mountPath: null,
        isElectrumCompatible,
        connectedAt: new Date(),
      });
      
      // Notify listeners about device connection
      this.emitEvent('device-attached', {
        deviceId,
        isElectrumCompatible,
        deviceInfo: this.getDeviceInfo(device)
      });
      
      if (isElectrumCompatible) {
        logger.info(`Device ${deviceId} appears to be Electrum compatible`);
      }
    } catch (error) {
      logger.error('Error handling device attachment:', error);
    }
  }
  
  /**
   * Handle USB device disconnection
   * @param {Object} device - USB device object
   */
  handleDeviceDetached(device) {
    try {
      // Get device ID depending on whether this is from an event or polling
      const deviceId = device.deviceId || 
        (device.deviceDescriptor.idVendor + ':' + device.deviceDescriptor.idProduct);
      
      if (!this.connectedDevices.has(deviceId)) {
        return; // Not tracking this device
      }
      
      logger.info(`USB device detached: ${deviceId}`);
      
      // Stop any active process for this device
      this.stopElectrumProcess(deviceId);
      
      // Remove from tracked devices
      this.connectedDevices.delete(deviceId);
      
      // Notify listeners about device disconnection
      this.emitEvent('device-detached', { deviceId });
    } catch (error) {
      logger.error('Error handling device detachment:', error);
    }
  }
  
  /**
   * Check if a USB device might be compatible with Electrum wallet storage
   * @param {Object} device - USB device object
   * @returns {Promise<boolean>} - Whether device might be Electrum compatible
   */
  async checkIfElectrumCompatible(device) {
    try {
      // Open device to check
      device.open();
      
      // For now, assume most storage devices might be compatible
      // In a real implementation, we would check for specific signatures
      const isStorageDevice = device.deviceDescriptor.bDeviceClass === 8; // Mass storage
      
      // Check for common USB drive manufacturers
      const knownManufacturers = [0x0781, 0x0951, 0x1058, 0x13fe, 0x054c, 0x0930, 0x1f75];
      const isKnownManufacturer = knownManufacturers.includes(device.deviceDescriptor.idVendor);
      
      // Close device
      device.close();
      
      return isStorageDevice || isKnownManufacturer;
    } catch (error) {
      // If we can't open the device, assume it's not compatible
      logger.debug(`Error checking device compatibility: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Get information about a USB device
   * @param {Object} device - USB device object
   * @returns {Object} - Device information
   */
  getDeviceInfo(device) {
    try {
      return {
        vendorId: device.deviceDescriptor.idVendor,
        productId: device.deviceDescriptor.idProduct,
        manufacturer: device.manufacturer || 'Unknown',
        product: device.product || 'USB Device',
        serialNumber: device.serialNumber || null
      };
    } catch (error) {
      return {
        vendorId: device.deviceDescriptor.idVendor,
        productId: device.deviceDescriptor.idProduct,
        manufacturer: 'Unknown',
        product: 'USB Device',
        serialNumber: null
      };
    }
  }
  
  /**
   * Prepare a USB device for Electrum wallet operations
   * @param {string} deviceId - Device identifier
   * @param {string} userId - User ID requesting the operation
   * @param {string} password - User password for wallet access
   * @param {string} otpCode - 2FA code for verification
   * @returns {Promise<Object>} - Status of preparation
   */
  async prepareUsbDevice(deviceId, userId, password, otpCode) {
    try {
      logger.info(`Preparing USB device ${deviceId} for user ${userId}`);
      
      // Validate device is connected
      if (!this.connectedDevices.has(deviceId)) {
        throw new Error('Device not connected');
      }
      
      // Verify user identity with 2FA
      const otpVerified = await this.config.otpService.verifyOtp(userId, otpCode);
      if (!otpVerified) {
        throw new Error('Invalid 2FA code');
      }
      
      // Get user's wallet from database
      const { data: walletData, error: walletError } = await supabase
        .from('bitcoin_wallets')
        .select('*')
        .eq('user_id', userId)
        .eq('wallet_type', 'electrum')
        .single();
        
      if (walletError || !walletData) {
        throw new Error('Could not find wallet for user');
      }
      
      // Verify wallet password
      const encryptedData = walletData.encrypted_data;
      const passwordValid = await this.config.walletSecurity.verifyPassword(encryptedData, password);
      if (!passwordValid) {
        throw new Error('Invalid wallet password');
      }
      
      // Find USB device mount point
      const mountPath = await this.findUsbMountPoint(deviceId);
      if (!mountPath) {
        throw new Error('Could not locate USB device in filesystem');
      }
      
      // Update device info with mount path
      this.connectedDevices.set(deviceId, {
        ...this.connectedDevices.get(deviceId),
        mountPath
      });
      
      return {
        success: true,
        deviceId,
        mountPath,
        walletId: walletData.id
      };
    } catch (error) {
      logger.error(`Error preparing USB device: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Launch Electrum process targeting the USB wallet
   * @param {string} deviceId - Device identifier
   * @param {string} userId - User ID
   * @param {string} walletId - Wallet ID
   * @returns {Promise<Object>} - Status of Electrum launch
   */
  async launchElectrumForUsbWallet(deviceId, userId, walletId) {
    try {
      // Check if device is ready
      const deviceInfo = this.connectedDevices.get(deviceId);
      if (!deviceInfo || !deviceInfo.mountPath) {
        throw new Error('Device not prepared');
      }
      
      // Check for existing process
      if (this.activeTransfers.has(deviceId)) {
        throw new Error('Electrum process already running for this device');
      }
      
      logger.info(`Launching Electrum for USB wallet transfer - User: ${userId}, Device: ${deviceId}`);
      
      // Prepare wallet path on USB
      const usbWalletDir = path.join(deviceInfo.mountPath, 'snakkaz-electrum');
      if (!fs.existsSync(usbWalletDir)) {
        fs.mkdirSync(usbWalletDir, { recursive: true });
      }
      
      // Generate USB wallet name - never overwrite existing wallet
      let walletName = 'snakkaz-wallet';
      let counter = 0;
      let walletPath = path.join(usbWalletDir, `${walletName}`);
      while (fs.existsSync(walletPath)) {
        counter++;
        walletName = `snakkaz-wallet-${counter}`;
        walletPath = path.join(usbWalletDir, `${walletName}`);
      }
      
      // Launch Electrum process with appropriate parameters
      const electrumArgs = [
        '--offline',
        '--dir', usbWalletDir,
        '--wallet', walletName
      ];
      
      // Start the Electrum process
      const process = execFile(this.config.electrumPath, electrumArgs);
      
      // Store process information
      this.activeTransfers.set(deviceId, {
        process,
        userId,
        walletId,
        startTime: new Date(),
        usbWalletPath: walletPath,
        status: 'running'
      });
      
      // Handle process exit
      process.on('exit', (code) => {
        logger.info(`Electrum process exited with code ${code} for device ${deviceId}`);
        this.handleElectrumProcessExit(deviceId, code);
      });
      
      // Handle process errors
      process.on('error', (error) => {
        logger.error(`Electrum process error for device ${deviceId}:`, error);
        this.handleElectrumProcessError(deviceId, error);
      });
      
      return {
        success: true,
        deviceId,
        walletPath,
        processId: process.pid
      };
    } catch (error) {
      logger.error(`Error launching Electrum: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get status of active USB wallet transfers
   * @param {string} [deviceId] - Optional device ID to filter by
   * @returns {Object|Array} - Status info for specified device or all devices
   */
  getTransferStatus(deviceId = null) {
    if (deviceId) {
      if (!this.activeTransfers.has(deviceId)) {
        return { error: 'No active transfer for this device' };
      }
      
      const transfer = this.activeTransfers.get(deviceId);
      return {
        deviceId,
        userId: transfer.userId,
        walletId: transfer.walletId,
        status: transfer.status,
        startTime: transfer.startTime,
        elapsedSeconds: Math.floor((new Date() - transfer.startTime) / 1000),
        usbWalletPath: transfer.usbWalletPath
      };
    } else {
      // Return all active transfers
      const transfers = [];
      this.activeTransfers.forEach((transfer, id) => {
        transfers.push({
          deviceId: id,
          userId: transfer.userId,
          walletId: transfer.walletId,
          status: transfer.status,
          startTime: transfer.startTime,
          elapsedSeconds: Math.floor((new Date() - transfer.startTime) / 1000),
          usbWalletPath: transfer.usbWalletPath
        });
      });
      return transfers;
    }
  }
  
  /**
   * Stop Electrum process for a device
   * @param {string} deviceId - Device identifier
   * @returns {boolean} - Whether process was stopped
   */
  stopElectrumProcess(deviceId) {
    if (!this.activeTransfers.has(deviceId)) {
      return false;
    }
    
    const transfer = this.activeTransfers.get(deviceId);
    
    try {
      // Try to gracefully end the process
      if (transfer.process && transfer.process.pid) {
        logger.info(`Stopping Electrum process (PID: ${transfer.process.pid}) for device ${deviceId}`);
        transfer.process.kill();
      }
    } catch (error) {
      logger.error(`Error stopping Electrum process: ${error.message}`);
    }
    
    // Clean up regardless of whether kill succeeded
    this.activeTransfers.delete(deviceId);
    return true;
  }
  
  /**
   * Handle Electrum process exit
   * @param {string} deviceId - Device identifier
   * @param {number} exitCode - Process exit code
   */
  handleElectrumProcessExit(deviceId, exitCode) {
    if (!this.activeTransfers.has(deviceId)) return;
    
    const transfer = this.activeTransfers.get(deviceId);
    
    // Update transfer status based on exit code
    if (exitCode === 0) {
      transfer.status = 'completed';
      this.emitEvent('transfer-completed', {
        deviceId,
        userId: transfer.userId,
        walletId: transfer.walletId
      });
    } else {
      transfer.status = 'failed';
      this.emitEvent('transfer-failed', {
        deviceId,
        userId: transfer.userId,
        walletId: transfer.walletId,
        exitCode
      });
    }
    
    // Keep the entry for status querying, but mark as inactive
    this.activeTransfers.set(deviceId, transfer);
    
    // Remove after a delay to allow status to be queried
    setTimeout(() => {
      if (this.activeTransfers.has(deviceId)) {
        this.activeTransfers.delete(deviceId);
      }
    }, 30000); // Keep status for 30 seconds
  }
  
  /**
   * Handle Electrum process errors
   * @param {string} deviceId - Device identifier
   * @param {Error} error - Process error
   */
  handleElectrumProcessError(deviceId, error) {
    if (!this.activeTransfers.has(deviceId)) return;
    
    const transfer = this.activeTransfers.get(deviceId);
    transfer.status = 'error';
    transfer.error = error.message;
    
    this.activeTransfers.set(deviceId, transfer);
    
    this.emitEvent('transfer-error', {
      deviceId,
      userId: transfer.userId,
      walletId: transfer.walletId,
      error: error.message
    });
  }
  
  /**
   * Find the mount point for a USB device
   * @param {string} deviceId - Device identifier
   * @returns {Promise<string|null>} - Mount path or null if not found
   */
  async findUsbMountPoint(deviceId) {
    // This is a simplified implementation
    // In a real system, we would use system-specific tools to find the exact mount point
    // For Linux, we might parse the output of 'lsblk -J' or check /proc/mounts
    // For macOS, we might use 'diskutil list -plist'
    // For Windows, we might use WMI or PowerShell
    
    try {
      // For demo, assume the first directory in the USB mount point is our device
      // In a real implementation, we would match based on device properties
      const mountRoot = this.config.usbMountPoint;
      const dirs = fs.readdirSync(mountRoot);
      
      // Filter to only directories
      const mounts = dirs.filter(dir => {
        const fullPath = path.join(mountRoot, dir);
        return fs.statSync(fullPath).isDirectory();
      });
      
      if (mounts.length > 0) {
        // For a real implementation, match based on device serial or ID
        // Here we just return the first detected mount
        return path.join(mountRoot, mounts[0]);
      }
      
      return null;
    } catch (error) {
      logger.error(`Error finding USB mount point: ${error.message}`);
      return null;
    }
  }
  
  /**
   * Emit event to any listeners
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  emitEvent(event, data) {
    // This is a placeholder for an event system
    // In a real implementation, this would use an EventEmitter or similar
    logger.debug(`Event: ${event}`, data);
    
    // If an event callback is configured, call it
    if (this.config.onEvent) {
      this.config.onEvent(event, data);
    }
  }
}

module.exports = { UsbElectrumWalletManager };
