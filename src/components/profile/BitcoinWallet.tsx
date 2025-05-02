import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bitcoin, Wallet, Download, ExternalLink, Copy, RefreshCcw, Share2, QrCode } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type WalletProps = {
  userId: string;
  isPremium: boolean;
};

type WalletData = {
  walletId: string;
  address: string;
  balance: number;
  createdAt: string;
  lastSynced: string;
};

export const BitcoinWallet = ({ userId, isPremium }: WalletProps) => {
  const { toast } = useToast();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [downloadFormat, setDownloadFormat] = useState<'electrum' | 'json' | 'paper'>('electrum');

  // Fetch wallet data on component mount
  useEffect(() => {
    if (userId) {
      fetchWalletData();
    }
  }, [userId]);

  const fetchWalletData = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call an API endpoint to fetch the wallet
      // For now, we'll simulate fetching data from Supabase
      const { data, error } = await supabase
        .from('bitcoin_wallets')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching wallet:', error);
        setWalletData(null);
      } else if (data) {
        setWalletData({
          walletId: data.id,
          address: data.address,
          balance: data.balance || 0,
          createdAt: data.created_at,
          lastSynced: data.last_synced || data.created_at,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setWalletData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWallet = async () => {
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passordene samsvarer ikke",
        description: "Vennligst sikre at passordene matcher.",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        variant: "destructive",
        title: "For svakt passord",
        description: "Passordet må være minst 8 tegn langt.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, this would call an API to create a wallet
      // For demonstration, we'll simulate wallet creation
      
      // 1. Generate a new Electrum wallet (simulated)
      const mockWalletAddress = `bc1${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      // 2. Store wallet reference in database
      const { data, error } = await supabase
        .from('bitcoin_wallets')
        .insert({
          user_id: userId,
          address: mockWalletAddress,
          balance: 0,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // 3. Update local state
      setWalletData({
        walletId: data.id,
        address: data.address,
        balance: 0,
        createdAt: data.created_at,
        lastSynced: data.created_at,
      });

      toast({
        title: "Lommebok opprettet",
        description: "Din Bitcoin lommebok er nå klar til bruk.",
      });
      
      // Close dialog
      setShowCreateDialog(false);
      
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast({
        variant: "destructive",
        title: "Kunne ikke opprette lommebok",
        description: "Det oppstod en feil. Vennligst prøv igjen senere.",
      });
    } finally {
      setIsLoading(false);
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleSyncWallet = async () => {
    setIsSyncing(true);
    try {
      // In a real implementation, this would sync with the blockchain
      // For demonstration, we'll just simulate a sync by updating the lastSynced time
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      
      const { error } = await supabase
        .from('bitcoin_wallets')
        .update({
          last_synced: new Date().toISOString(),
          balance: walletData?.balance || 0, // In reality, this would fetch the actual balance
        })
        .eq('id', walletData?.walletId);

      if (error) {
        throw error;
      }

      // Refresh wallet data
      await fetchWalletData();
      
      toast({
        title: "Synkronisert",
        description: "Lommeboken er synkronisert med blokkjeden.",
      });
    } catch (error) {
      console.error('Error syncing wallet:', error);
      toast({
        variant: "destructive",
        title: "Synkroniseringsfeil",
        description: "Kunne ikke synkronisere med blokkjeden. Prøv igjen senere.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyAddress = () => {
    if (walletData?.address) {
      navigator.clipboard.writeText(walletData.address);
      toast({
        title: "Kopiert",
        description: "Bitcoin-adressen er kopiert til utklippstavlen.",
      });
    }
  };

  const prepareDownload = () => {
    setShowDownloadDialog(true);
  };

  const handleDownload = () => {
    if (!walletData) return;
    
    // In a real implementation, this would generate the wallet file in the specified format
    // For demonstration, we'll simulate a download
    
    let filename = '';
    let fileContent = '';
    
    switch (downloadFormat) {
      case 'electrum':
        filename = `electrum-wallet-${new Date().getTime()}.json`;
        fileContent = JSON.stringify({
          type: 'electrum',
          wallet_id: walletData.walletId,
          address: walletData.address,
          created_at: walletData.createdAt,
          // In a real implementation, this would contain encrypted wallet data
        }, null, 2);
        break;
      case 'json':
        filename = `bitcoin-wallet-${new Date().getTime()}.json`;
        fileContent = JSON.stringify({
          wallet_id: walletData.walletId,
          address: walletData.address,
          created_at: walletData.createdAt,
        }, null, 2);
        break;
      case 'paper':
        // In a real implementation, this would generate a PDF or image
        filename = `paper-wallet-${new Date().getTime()}.txt`;
        fileContent = `BITCOIN PAPER WALLET\n\nAddress: ${walletData.address}\nCreated: ${new Date(walletData.createdAt).toLocaleDateString()}\n\nKEEP THIS SAFE AND OFFLINE`;
        break;
    }
    
    const blob = new Blob([fileContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowDownloadDialog(false);
    
    toast({
      title: "Nedlastet",
      description: "Lommebokfilen er nedlastet. Oppbevar den trygt!",
    });
  };

  if (isLoading && !walletData) {
    return (
      <Card className="bg-cyberdark-900 border-cyberdark-700">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-white">
            <Bitcoin className="h-5 w-5" /> Bitcoin Lommebok
          </CardTitle>
          <CardDescription>
            Administrer din Bitcoin lommebok
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex justify-center">
          <div className="w-full space-y-4 py-8">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-10 w-1/2 mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!walletData) {
    return (
      <Card className="bg-cyberdark-900 border-cyberdark-700">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-white">
            <Bitcoin className="h-5 w-5" /> Bitcoin Lommebok
          </CardTitle>
          <CardDescription>
            Opprett din personlige Bitcoin lommebok
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center py-8">
            <Wallet className="h-16 w-16 text-cybergold-500 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Ingen lommebok funnet</h3>
            <p className="text-sm text-gray-400 text-center mb-6">
              Du har ikke opprettet en Bitcoin lommebok ennå. Opprett en for å komme i gang med kryptovaluta.
            </p>
            <Button 
              className="bg-cybergold-600 hover:bg-cybergold-500 text-black font-medium"
              onClick={() => setShowCreateDialog(true)}
            >
              <Bitcoin className="h-4 w-4 mr-2" />
              Opprett Bitcoin lommebok
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-cyberdark-900 border-cyberdark-700">
        <CardHeader>
          <CardTitle className="text-xl flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-cybergold-500" /> Bitcoin Lommebok
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 border-cyberdark-600 text-cybergold-400"
              onClick={handleSyncWallet}
              disabled={isSyncing}
            >
              <RefreshCcw className={`h-3.5 w-3.5 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
              Synkroniser
            </Button>
          </CardTitle>
          <CardDescription>
            Administrer din Bitcoin lommebok via Electrum
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-4 border border-cyberdark-700 rounded-lg bg-cyberdark-800/50">
            <div className="text-xs text-gray-400 mb-1">Saldo</div>
            <div className="text-2xl font-bold text-cybergold-400 flex items-center gap-1.5">
              <Bitcoin className="h-5 w-5" />
              {walletData.balance.toFixed(8)} BTC
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Sist synkronisert: {new Date(walletData.lastSynced).toLocaleString()}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="walletAddress" className="text-gray-400 text-xs">Bitcoin-adresse</Label>
            <div className="flex">
              <Input
                id="walletAddress"
                value={walletData.address}
                readOnly
                className="bg-cyberdark-800 border-cyberdark-600 font-mono text-sm flex-1"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-10 w-10 p-0 text-gray-400 hover:text-white"
                      onClick={handleCopyAddress}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">Kopier adresse</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-10 w-10 p-0 text-gray-400 hover:text-white"
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">Vis QR-kode</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-medium text-white mb-3">Handlinger</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-cyberdark-600 text-gray-300 flex-1"
                onClick={prepareDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Last ned lommebok
              </Button>
              
              <a 
                href="https://electrum.org/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full"
              >
                <Button
                  variant="outline"
                  className="border-cyberdark-600 text-gray-300 w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Åpne i Electrum
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col items-start">
          <p className="text-xs text-cybergold-700 mb-1 flex items-center">
            <Bitcoin className="h-3 w-3 mr-1" /> Opprettet {new Date(walletData.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500">
            For avanserte funksjoner, last ned lommeboken og åpne den i Electrum
          </p>
        </CardFooter>
      </Card>

      {/* Create Wallet Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-cyberdark-900 border-cyberdark-700 text-white">
          <DialogHeader>
            <DialogTitle>Opprett Bitcoin lommebok</DialogTitle>
            <DialogDescription className="text-gray-400">
              Skriv inn et sterkt passord for å beskytte din Bitcoin lommebok.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="wallet-password">Lommebok-passord</Label>
              <Input
                id="wallet-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-cyberdark-800 border-cyberdark-600"
                placeholder="Minimum 8 tegn"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet-confirm-password">Bekreft passord</Label>
              <Input
                id="wallet-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-cyberdark-800 border-cyberdark-600"
              />
            </div>

            <div className="bg-cyberdark-800/50 p-3 rounded border border-cybergold-800/20 mt-2">
              <p className="text-xs text-cybergold-400">
                <strong>Viktig:</strong> Passordet ditt kan ikke gjenopprettes. Hvis du mister det, mister du tilgang til dine bitcoins.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowCreateDialog(false)}
              className="border-cyberdark-600 text-gray-300"
              disabled={isLoading}
            >
              Avbryt
            </Button>
            <Button
              onClick={handleCreateWallet}
              disabled={!password || !confirmPassword || isLoading}
              className="bg-cybergold-600 hover:bg-cybergold-500 text-black"
            >
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 border-2 border-t-transparent border-black rounded-full animate-spin"></span>
                  Oppretter...
                </>
              ) : (
                "Opprett lommebok"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Download Wallet Dialog */}
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="bg-cyberdark-900 border-cyberdark-700 text-white">
          <DialogHeader>
            <DialogTitle>Last ned lommebok</DialogTitle>
            <DialogDescription className="text-gray-400">
              Velg formatet du vil laste ned lommeboken i.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="format-electrum"
                  value="electrum"
                  checked={downloadFormat === 'electrum'}
                  onChange={() => setDownloadFormat('electrum')}
                  className="text-cybergold-500 focus:ring-cybergold-500"
                />
                <Label htmlFor="format-electrum" className="text-white">
                  Electrum format (anbefalt)
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="format-json"
                  value="json"
                  checked={downloadFormat === 'json'}
                  onChange={() => setDownloadFormat('json')}
                  className="text-cybergold-500 focus:ring-cybergold-500"
                />
                <Label htmlFor="format-json" className="text-white">
                  JSON (for sikkerhetskopi)
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="format-paper"
                  value="paper"
                  checked={downloadFormat === 'paper'}
                  onChange={() => setDownloadFormat('paper')}
                  className="text-cybergold-500 focus:ring-cybergold-500"
                />
                <Label htmlFor="format-paper" className="text-white">
                  Papir-lommebok (offline oppbevaring)
                </Label>
              </div>
            </div>

            <div className="bg-cyberdark-800/50 p-3 rounded border border-cybergold-800/20">
              <p className="text-xs text-cybergold-400">
                <strong>Sikkerhetstips:</strong> Oppbevar lommeboken offline på en sikker USB-enhet for optimal sikkerhet.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowDownloadDialog(false)}
              className="border-cyberdark-600 text-gray-300"
            >
              Avbryt
            </Button>
            <Button
              onClick={handleDownload}
              className="bg-cybergold-600 hover:bg-cybergold-500 text-black"
            >
              <Download className="h-4 w-4 mr-2" />
              Last ned
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};