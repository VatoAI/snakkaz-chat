import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  HardDrive, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle, 
  Loader2, 
  KeyRound, 
  Lock, 
  Usb, 
  Send,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

// Define interfaces for UsbWalletIntegration
interface UsbWalletIntegrationProps {
  userId: string;
  walletId?: string;
  onSuccess?: (deviceId: string) => void;
  onError?: (error: string) => void;
}

interface UsbDevice {
  deviceId: string;
  isElectrumCompatible: boolean;
  manufacturer: string;
  product: string;
  vendorId: number;
  productId: number;
  serialNumber?: string;
}

interface TransferStatus {
  deviceId: string;
  userId: string;
  walletId: string;
  status: 'initializing' | 'running' | 'completed' | 'failed' | 'error';
  startTime: string;
  elapsedSeconds: number;
  usbWalletPath: string;
  error?: string;
}

export function UsbWalletIntegration({ 
  userId, 
  walletId, 
  onSuccess, 
  onError 
}: UsbWalletIntegrationProps) {
  // State variables
  const [devices, setDevices] = useState<UsbDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [transferStatus, setTransferStatus] = useState<TransferStatus | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [activeTab, setActiveTab] = useState('devices');
  const { toast } = useToast();

  // Start monitoring for USB devices
  const startMonitoring = async () => {
    try {
      setIsLoading(true);
      
      const response = await axios.post('/api/bitcoin/usb/monitor', {
        userId,
        action: 'start'
      });
      
      if (response.data.success) {
        setIsMonitoring(true);
        toast({
          title: 'USB overvåking aktivert',
          description: 'Systemet vil nå oppdage tilkoblede USB-enheter.',
        });
        
        // Initial fetch of devices
        fetchDevices();
      } else {
        throw new Error(response.data.error || 'Kunne ikke starte USB-overvåking');
      }
    } catch (error) {
      console.error('Error starting USB monitoring:', error);
      toast({
        variant: 'destructive',
        title: 'Feil ved start av USB-overvåking',
        description: error instanceof Error ? error.message : 'Ukjent feil oppstod',
      });
      if (onError) onError('Kunne ikke starte USB-overvåking');
    } finally {
      setIsLoading(false);
    }
  };

  // Stop monitoring for USB devices
  const stopMonitoring = async () => {
    try {
      setIsLoading(true);
      
      const response = await axios.post('/api/bitcoin/usb/monitor', {
        userId,
        action: 'stop'
      });
      
      if (response.data.success) {
        setIsMonitoring(false);
        setDevices([]);
        toast({
          title: 'USB overvåking deaktivert',
          description: 'Systemet vil ikke lenger oppdage USB-enheter.',
        });
      } else {
        throw new Error(response.data.error || 'Kunne ikke stoppe USB-overvåking');
      }
    } catch (error) {
      console.error('Error stopping USB monitoring:', error);
      toast({
        variant: 'destructive',
        title: 'Feil ved stopping av USB-overvåking',
        description: error instanceof Error ? error.message : 'Ukjent feil oppstod',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch connected USB devices
  const fetchDevices = async () => {
    try {
      const response = await axios.get('/api/bitcoin/usb/devices');
      
      if (response.data.success) {
        setDevices(response.data.devices || []);
      } else {
        throw new Error(response.data.error || 'Kunne ikke hente USB-enheter');
      }
    } catch (error) {
      console.error('Error fetching USB devices:', error);
      toast({
        variant: 'destructive',
        title: 'Feil ved henting av USB-enheter',
        description: error instanceof Error ? error.message : 'Ukjent feil oppstod',
      });
    }
  };

  // Prepare a USB device for Electrum wallet operations
  const prepareDevice = async () => {
    if (!selectedDeviceId || !password || !otpCode) {
      toast({
        variant: 'destructive',
        title: 'Manglende informasjon',
        description: 'Velg en USB-enhet og angi passord og 2FA-kode',
      });
      return;
    }
    
    try {
      setIsPreparing(true);
      
      const response = await axios.post('/api/bitcoin/usb/prepare', {
        userId,
        deviceId: selectedDeviceId,
        password,
        otpCode,
        walletId
      });
      
      if (response.data.success) {
        toast({
          title: 'USB-enhet klargjort',
          description: 'USB-enheten er nå klar for Electrum-overføring.',
        });
        setActiveTab('transfer');
        
        // After successful preparation, get wallet ID if not provided
        const walletIdToUse = walletId || response.data.walletId;
        
      } else {
        throw new Error(response.data.error || 'Kunne ikke klargjøre USB-enhet');
      }
    } catch (error) {
      console.error('Error preparing USB device:', error);
      toast({
        variant: 'destructive',
        title: 'Feil ved klargjøring av USB-enhet',
        description: error instanceof Error ? error.message : 'Ukjent feil oppstod',
      });
      if (onError) onError('Kunne ikke klargjøre USB-enhet');
    } finally {
      setIsPreparing(false);
    }
  };

  // Launch Electrum for USB wallet transfer
  const launchElectrum = async () => {
    if (!selectedDeviceId) {
      toast({
        variant: 'destructive',
        title: 'Ingen USB-enhet valgt',
        description: 'Velg en USB-enhet først',
      });
      return;
    }
    
    try {
      setIsTransferring(true);
      
      const response = await axios.post('/api/bitcoin/usb/launch', {
        userId,
        deviceId: selectedDeviceId,
        walletId: walletId
      });
      
      if (response.data.success) {
        toast({
          title: 'Electrum startet',
          description: 'Overføring til USB-lommebok er i gang.',
        });
        
        // Start polling for transfer status
        pollTransferStatus();
      } else {
        throw new Error(response.data.error || 'Kunne ikke starte Electrum');
      }
    } catch (error) {
      console.error('Error launching Electrum:', error);
      toast({
        variant: 'destructive',
        title: 'Feil ved oppstart av Electrum',
        description: error instanceof Error ? error.message : 'Ukjent feil oppstod',
      });
      setIsTransferring(false);
      if (onError) onError('Kunne ikke starte Electrum');
    }
  };

  // Poll for transfer status
  const pollTransferStatus = useCallback(async () => {
    if (!selectedDeviceId) return;
    
    try {
      const response = await axios.get(`/api/bitcoin/usb/status/${selectedDeviceId}`);
      
      if (response.data.success) {
        setTransferStatus(response.data.status);
        
        // Check if transfer is still active
        if (['running', 'initializing'].includes(response.data.status.status)) {
          setTimeout(pollTransferStatus, 2000); // Poll every 2 seconds
        } else {
          setIsTransferring(false);
          
          // Handle completion
          if (response.data.status.status === 'completed') {
            toast({
              title: 'Overføring fullført',
              description: 'Electrum-lommeboken ble opprettet på USB-enheten.',
            });
            if (onSuccess) onSuccess(selectedDeviceId);
          } else if (['failed', 'error'].includes(response.data.status.status)) {
            toast({
              variant: 'destructive',
              title: 'Overføring mislyktes',
              description: response.data.status.error || 'Ukjent feil oppstod',
            });
            if (onError) onError(response.data.status.error || 'Overføring mislyktes');
          }
        }
      } else {
        throw new Error(response.data.error || 'Kunne ikke hente overføringsstatus');
      }
    } catch (error) {
      console.error('Error polling transfer status:', error);
      setIsTransferring(false);
    }
  }, [selectedDeviceId, onSuccess, onError, toast]);

  // Stop an ongoing transfer
  const stopTransfer = async () => {
    if (!selectedDeviceId) return;
    
    try {
      const response = await axios.post('/api/bitcoin/usb/stop', {
        deviceId: selectedDeviceId
      });
      
      if (response.data.success) {
        toast({
          title: 'Overføring stoppet',
          description: 'Electrum-overføring ble avbrutt.',
        });
        setIsTransferring(false);
        setTransferStatus(null);
      } else {
        throw new Error(response.data.error || 'Kunne ikke stoppe overføring');
      }
    } catch (error) {
      console.error('Error stopping transfer:', error);
      toast({
        variant: 'destructive',
        title: 'Feil ved stopping av overføring',
        description: error instanceof Error ? error.message : 'Ukjent feil oppstod',
      });
    }
  };

  // Render the device badge with appropriate color based on compatibility
  const renderDeviceBadge = (device: UsbDevice) => {
    if (device.isElectrumCompatible) {
      return (
        <Badge variant="outline" className="bg-green-700/20 text-green-500 border-green-500">
          <HardDrive className="h-3 w-3 mr-1" />
          Kompatibel
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-orange-700/20 text-orange-500 border-orange-500">
        <AlertCircle className="h-3 w-3 mr-1" />
        Ukjent kompatibilitet
      </Badge>
    );
  };

  // Get transfer status message and color
  const getTransferStatusDetails = () => {
    if (!transferStatus) return { message: 'Ikke startet', color: 'text-gray-400' };
    
    switch (transferStatus.status) {
      case 'initializing':
        return { message: 'Initialiserer...', color: 'text-blue-400' };
      case 'running':
        return { message: 'Overføring pågår...', color: 'text-cybergold-400' };
      case 'completed':
        return { message: 'Fullført!', color: 'text-green-500' };
      case 'failed':
        return { message: 'Mislyktes', color: 'text-red-500' };
      case 'error':
        return { message: `Feil: ${transferStatus.error}`, color: 'text-red-500' };
      default:
        return { message: 'Ukjent status', color: 'text-gray-400' };
    }
  };

  // Calculate progress percentage for transfer
  const getTransferProgress = () => {
    if (!transferStatus) return 0;
    
    switch (transferStatus.status) {
      case 'initializing':
        return 10;
      case 'running':
        // Assume 100% at 60 seconds (just an estimation)
        return Math.min(10 + (transferStatus.elapsedSeconds / 60) * 90, 95);
      case 'completed':
        return 100;
      case 'failed':
      case 'error':
        return 0;
      default:
        return 0;
    }
  };

  // Set up polling for devices
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isMonitoring) {
      // Initial fetch
      fetchDevices();
      
      // Set up polling
      interval = setInterval(() => {
        fetchDevices();
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring, fetchDevices]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // If needed, stop monitoring when component unmounts
      if (isMonitoring) {
        stopMonitoring();
      }
    };
  }, [isMonitoring, stopMonitoring]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Usb className="h-5 w-5 text-cybergold-400" />
          USB Wallet Integration
        </CardTitle>
        <CardDescription>
          Overfør din Bitcoin-lommebok til en USB-enhet for sikker offline oppbevaring
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="devices">USB-enheter</TabsTrigger>
            <TabsTrigger value="auth">Autentisering</TabsTrigger>
            <TabsTrigger value="transfer">Overføring</TabsTrigger>
          </TabsList>
          
          {/* USB Devices Tab */}
          <TabsContent value="devices">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">USB Enhetsgjenkjenning</h3>
                {isMonitoring ? (
                  <Badge variant="outline" className="bg-green-700/20 text-green-500 border-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Aktiv
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-700/20 text-gray-400 border-gray-400">
                    Inaktiv
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                {!isMonitoring ? (
                  <Button
                    onClick={startMonitoring}
                    disabled={isLoading}
                    className="bg-cybergold-600 hover:bg-cybergold-500 text-black"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <HardDrive className="h-4 w-4 mr-2" />
                    )}
                    Start USB-gjenkjenning
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={fetchDevices}
                      variant="outline"
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                      Oppdater enheter
                    </Button>
                    <Button
                      onClick={stopMonitoring}
                      variant="destructive"
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Stopp overvåking
                    </Button>
                  </>
                )}
              </div>
              
              {/* Device List */}
              {isMonitoring && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Oppdagede enheter</h3>
                  
                  {devices.length === 0 ? (
                    <div className="text-gray-400 text-center py-4 border rounded-md border-dashed border-gray-700">
                      <p>Ingen USB-enheter oppdaget</p>
                      <p className="text-xs mt-1">Koble til en USB-enhet og trykk på "Oppdater enheter"</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {devices.map((device) => (
                        <div
                          key={device.deviceId}
                          className={`p-3 border rounded-md flex flex-col gap-2 cursor-pointer transition-colors ${
                            selectedDeviceId === device.deviceId
                              ? 'bg-cyberdark-700 border-cybergold-600'
                              : 'bg-cyberdark-800 border-cyberdark-700 hover:border-cyberdark-600'
                          }`}
                          onClick={() => setSelectedDeviceId(device.deviceId)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium">
                              {device.manufacturer} {device.product}
                            </div>
                            {renderDeviceBadge(device)}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-2">
                            <Usb className="h-3 w-3" />
                            ID: {device.deviceId}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Next button */}
                  <Button
                    onClick={() => setActiveTab('auth')}
                    className="w-full mt-4 bg-cybergold-600 hover:bg-cybergold-500 text-black"
                    disabled={!selectedDeviceId}
                  >
                    Fortsett til autentisering
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Authentication Tab */}
          <TabsContent value="auth">
            <div className="space-y-4">
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Sikker autentisering</AlertTitle>
                <AlertDescription>
                  For å beskytte din lommebok kreves både passord og 2FA-kode. 
                  Dette sikrer at kun du kan overføre lommeboken til USB-enheten.
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="wallet-password">
                    Lommebok passord
                  </label>
                  <div className="relative">
                    <Input
                      id="wallet-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9"
                      placeholder="Skriv inn ditt lommebok-passord"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="otp-code">
                    2FA-kode
                  </label>
                  <div className="relative">
                    <Input
                      id="otp-code"
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="pl-9"
                      placeholder="Skriv inn 6-sifret 2FA-kode"
                      maxLength={6}
                    />
                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('devices')}
                >
                  Tilbake
                </Button>
                <Button
                  onClick={prepareDevice}
                  className="bg-cybergold-600 hover:bg-cybergold-500 text-black ml-auto"
                  disabled={!selectedDeviceId || !password || otpCode.length !== 6 || isPreparing}
                >
                  {isPreparing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 mr-2" />
                  )}
                  Verifiser og fortsett
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Transfer Tab */}
          <TabsContent value="transfer">
            <div className="space-y-4">
              <Alert className="bg-cyberdark-800 border-cybergold-700">
                <Send className="h-4 w-4" />
                <AlertTitle>Electrum wallet overføring</AlertTitle>
                <AlertDescription>
                  Når du starter overføring, vil Electrum åpnes og lommeboken din overføres til USB-enheten.
                  Ikke koble fra USB-enheten før prosessen er fullført.
                </AlertDescription>
              </Alert>
              
              <div className="p-4 border border-cyberdark-700 rounded-md bg-cyberdark-800">
                <h3 className="text-sm font-medium mb-3">Overføringsstatus</h3>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Status:</span>
                    <span className={getTransferStatusDetails().color}>
                      {getTransferStatusDetails().message}
                    </span>
                  </div>
                  <Progress value={getTransferProgress()} className="h-2" />
                </div>
                
                {transferStatus && (
                  <div className="text-xs text-gray-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Starttidspunkt:</span>
                      <span>{new Date(transferStatus.startTime).toLocaleString('nb-NO')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tid brukt:</span>
                      <span>{transferStatus.elapsedSeconds} sekunder</span>
                    </div>
                    {transferStatus.usbWalletPath && (
                      <div className="flex justify-between">
                        <span>USB Fil:</span>
                        <span className="font-mono">{transferStatus.usbWalletPath}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('auth')}
                  disabled={isTransferring}
                >
                  Tilbake
                </Button>
                
                {!isTransferring ? (
                  <Button
                    onClick={launchElectrum}
                    className="bg-cybergold-600 hover:bg-cybergold-500 text-black ml-auto"
                    disabled={!selectedDeviceId}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Start overføring
                  </Button>
                ) : (
                  <Button
                    onClick={stopTransfer}
                    variant="destructive"
                    className="ml-auto"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Avbryt overføring
                  </Button>
                )}
              </div>
              
              {/* Success view */}
              {transferStatus && transferStatus.status === 'completed' && (
                <Alert className="bg-green-900/20 border-green-800 mt-4">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-500">Overføring fullført!</AlertTitle>
                  <AlertDescription>
                    Din lommebok er nå trygt lagret på USB-enheten. Du kan bruke denne
                    med Electrum for å administrere dine Bitcoin offline.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Failure view */}
              {transferStatus && ['failed', 'error'].includes(transferStatus.status) && (
                <Alert className="bg-red-900/20 border-red-800 mt-4">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertTitle className="text-red-500">Overføring mislyktes</AlertTitle>
                  <AlertDescription>
                    Det oppstod en feil under overføringen: {transferStatus.error || 'Ukjent feil'}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default UsbWalletIntegration;
