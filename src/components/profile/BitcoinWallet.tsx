import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Bitcoin, Copy, Download, RefreshCw, Shield } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { ElectrumService } from "@/services/electrumService";

interface BitcoinWalletProps {
  userId: string;
  isPremium: boolean;
}

interface WalletData {
  id: string;
  address: string;
  balance: number;
  wallet_name: string;
  last_synced: string;
}

export function BitcoinWallet({ userId, isPremium }: BitcoinWalletProps) {
  const { toast } = useToast();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [walletPassword, setWalletPassword] = useState("");
  const [walletConfirmPassword, setWalletConfirmPassword] = useState("");
  const [creatingWallet, setCreatingWallet] = useState(false);
  const [displaySeed, setDisplaySeed] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Use useMemo to ensure electrumService is only created once
  const electrumService = useMemo(() => new ElectrumService(), []);

  // Fetch wallet data from the database
  const fetchWalletData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("bitcoin_wallets")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setWalletData(data as WalletData);
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Fetch wallet data on component mount
  useEffect(() => {
    if (userId) {
      fetchWalletData();
    }
  }, [userId, fetchWalletData]);

  // Connect to Electrum server when wallet data is available
  useEffect(() => {
    if (walletData?.address) {
      electrumService.connect(walletData.address)
        .then(() => {
          console.log("Connected to Electrum server");
        })
        .catch((error) => {
          console.error("Failed to connect to Electrum server:", error);
        });
    }

    return () => {
      electrumService.disconnect();
    };
  }, [walletData?.address, electrumService]);

  // Create a new Bitcoin wallet
  const createWallet = async () => {
    if (walletPassword !== walletConfirmPassword) {
      toast({
        variant: "destructive",
        title: "Passord-feil",
        description: "Passordene stemmer ikke overens.",
      });
      return;
    }

    if (walletPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Svakt passord",
        description: "Passordet må være minst 8 tegn.",
      });
      return;
    }

    setCreatingWallet(true);
    try {
      // Generate a new wallet using Electrum's key derivation method
      const walletDetails = await electrumService.createWallet(walletPassword);
      
      // Store wallet info in the database
      const { data, error } = await supabase.from("bitcoin_wallets").insert([
        {
          user_id: userId,
          address: walletDetails.address,
          balance: 0,
          wallet_name: "Primær lommebok",
          wallet_type: "electrum",
          encrypted_data: walletDetails.encryptedData,
        },
      ]).select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        setWalletData(data[0] as WalletData);
        setDisplaySeed(walletDetails.seed);
        
        toast({
          title: "Lommebok opprettet",
          description: "Din Bitcoin-lommebok er klar til bruk!",
        });
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
      toast({
        variant: "destructive",
        title: "Feil ved opprettelse",
        description: "Kunne ikke opprette lommebok. Prøv igjen senere.",
      });
    } finally {
      setCreatingWallet(false);
    }
  };

  // Sync wallet balance with the blockchain
  const syncWalletBalance = async () => {
    if (!walletData) return;

    setIsSyncing(true);
    try {
      // Get updated balance from Electrum server
      const balance = await electrumService.getBalance(walletData.address);
      
      // Update balance in the database
      const { data, error } = await supabase.rpc("update_wallet_balance", {
        wallet_id: walletData.id,
        new_balance: balance
      });

      if (error) {
        throw error;
      }

      if (data) {
        setWalletData({
          ...walletData,
          balance: balance,
          last_synced: new Date().toISOString()
        });
        
        toast({
          title: "Synkronisert",
          description: "Lommebok-saldo er oppdatert.",
        });
      }
    } catch (error) {
      console.error("Error syncing wallet:", error);
      toast({
        variant: "destructive",
        title: "Synkroniseringsfeil",
        description: "Kunne ikke synkronisere lommebok-saldo.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Download the wallet file for use with Electrum
  const downloadWallet = (format: string) => {
    if (!walletData) return;

    try {
      let content = "";
      let filename = "";
      let contentType = "application/json";

      switch (format) {
        case "electrum":
          content = electrumService.generateElectrumExport(walletData.address);
          filename = `electrum_wallet_${walletData.address.substring(0, 8)}.json`;
          break;
        case "json":
          content = JSON.stringify({
            address: walletData.address,
            wallet_name: walletData.wallet_name,
            created_at: walletData.last_synced,
          }, null, 2);
          filename = `wallet_${walletData.address.substring(0, 8)}.json`;
          break;
        case "paper":
          content = electrumService.generatePaperWallet(walletData.address);
          filename = `paper_wallet_${walletData.address.substring(0, 8)}.html`;
          contentType = "text/html";
          break;
        default:
          throw new Error("Unknown format");
      }

      const blob = new Blob([content], { type: contentType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Nedlasting fullført",
        description: `${format}-lommebok er lastet ned.`,
      });
    } catch (error) {
      console.error("Error downloading wallet:", error);
      toast({
        variant: "destructive",
        title: "Nedlastingsfeil",
        description: "Kunne ikke laste ned lommeboken.",
      });
    }
  };

  // Copy wallet address to clipboard
  const copyAddress = () => {
    if (!walletData?.address) return;

    navigator.clipboard.writeText(walletData.address)
      .then(() => {
        setCopiedAddress(true);
        toast({
          title: "Adresse kopiert",
          description: "Bitcoin-adresse er kopiert til utklippstavlen.",
        });

        setTimeout(() => setCopiedAddress(false), 2000);
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
  };

  // Format BTC balance with proper decimal places
  const formatBtcBalance = (balance: number): string => {
    return balance.toLocaleString("nb-NO", { 
      minimumFractionDigits: 8,
      maximumFractionDigits: 8
    });
  };

  // Convert BTC to NOK (example rate)
  const btcToNok = (btcAmount: number): string => {
    const btcToNokRate = 350000; // Example rate, should be fetched from an API
    return (btcAmount * btcToNokRate).toLocaleString("nb-NO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // If loading, show skeleton UI
  if (isLoading) {
    return (
      <Card className="bg-cyberdark-900 border-cyberdark-700">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-white">
            <Bitcoin className="h-5 w-5" /> Bitcoin-lommebok
          </CardTitle>
          <CardDescription>
            Administrer din Bitcoin-lommebok
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full bg-cyberdark-700" />
            <Skeleton className="h-32 w-full bg-cyberdark-700" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no wallet exists yet, show creation form
  if (!walletData) {
    return (
      <Card className="bg-cyberdark-900 border-cyberdark-700">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-white">
            <Bitcoin className="h-5 w-5" /> Bitcoin-lommebok
          </CardTitle>
          <CardDescription>
            Opprett din egen Bitcoin-lommebok koblet til Electrum
          </CardDescription>
        </CardHeader>
        <CardContent>
          {displaySeed ? (
            <div className="space-y-4">
              <div className="p-4 bg-cyberdark-800 border border-yellow-600/50 rounded-md">
                <h3 className="text-yellow-500 font-semibold mb-2">Viktig: Behold din gjenopprettingsfrase trygt</h3>
                <p className="text-sm text-gray-300 mb-3">
                  Dette er din unike gjenopprettingsfrase. Skriv den ned og oppbevar den på et sikkert sted. 
                  Du trenger den for å gjenopprette lommeboken din hvis du mister tilgang.
                </p>
                <div className="p-3 bg-cyberdark-900 rounded-md font-mono text-sm text-center break-all">
                  {displaySeed}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  <Shield className="inline h-3 w-3 mr-1" />
                  Denne frasen vises kun én gang
                </p>
              </div>
              <Button
                className="w-full bg-cybergold-600 hover:bg-cybergold-500 text-black font-medium"
                onClick={() => setDisplaySeed(null)}
              >
                Jeg har lagret frasen trygt
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wallet-password">Passord for lommebok</Label>
                <Input
                  id="wallet-password"
                  type="password"
                  placeholder="Velg et sterkt passord"
                  value={walletPassword}
                  onChange={(e) => setWalletPassword(e.target.value)}
                  className="bg-cyberdark-800 border-cyberdark-600"
                />
                <p className="text-xs text-gray-400">
                  Dette passordet brukes for å kryptere din private nøkkel
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet-confirm-password">Bekreft passord</Label>
                <Input
                  id="wallet-confirm-password"
                  type="password"
                  placeholder="Gjenta passord"
                  value={walletConfirmPassword}
                  onChange={(e) => setWalletConfirmPassword(e.target.value)}
                  className="bg-cyberdark-800 border-cyberdark-600"
                />
              </div>

              <Button
                className="w-full bg-cybergold-600 hover:bg-cybergold-500 text-black font-medium"
                onClick={createWallet}
                disabled={creatingWallet || !walletPassword || !walletConfirmPassword}
              >
                {creatingWallet ? (
                  <>
                    <span className="mr-2 h-4 w-4 border-2 border-t-transparent border-black rounded-full animate-spin"></span>
                    Oppretter lommebok...
                  </>
                ) : (
                  "Opprett Bitcoin-lommebok"
                )}
              </Button>

              <div className="p-3 bg-cyberdark-800 rounded-md">
                <h3 className="text-sm font-medium text-white mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-cyberblue-400" />
                  Hvorfor integrere med Electrum?
                </h3>
                <p className="text-xs text-gray-400">
                  Electrum er en populær og sikker Bitcoin-lommebok som gir deg full kontroll over dine 
                  private nøkler. Ved å integrere med Electrum kan du bruke lommeboken din både i Snakkaz 
                  og i Electrum-applikasjonen.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Wallet exists, show wallet interface
  return (
    <Card className="bg-cyberdark-900 border-cyberdark-700">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 text-white">
          <Bitcoin className="h-5 w-5" /> Bitcoin-lommebok
        </CardTitle>
        <CardDescription>
          Administrer din Bitcoin-lommebok
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Wallet Balance */}
          <div className="p-4 bg-cyberdark-800 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-400">Saldo</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs" 
                onClick={syncWalletBalance}
                disabled={isSyncing}
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Synkroniserer...' : 'Synkroniser'}
              </Button>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-cybergold-400">
                {formatBtcBalance(walletData.balance)} BTC
              </span>
              <span className="text-sm text-gray-400">
                ≈ {btcToNok(walletData.balance)} NOK
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Sist oppdatert: {new Date(walletData.last_synced).toLocaleString('nb-NO')}
            </div>
          </div>

          {/* Wallet Address with QR Code */}
          <div className="p-4 bg-cyberdark-800 rounded-md flex flex-col items-center">
            <h3 className="text-sm font-medium text-gray-400 self-start mb-3">Din Bitcoin-adresse</h3>
            
            <div className="bg-white p-3 rounded-md mb-3">
              <QRCodeSVG value={walletData.address} size={150} />
            </div>
            
            <div className="relative w-full">
              <Input
                value={walletData.address}
                readOnly
                className="bg-cyberdark-900 border-cyberdark-600 pr-10 font-mono text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={copyAddress}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copiedAddress && (
              <span className="text-xs text-green-500 mt-1">Adresse kopiert!</span>
            )}
          </div>

          {/* Wallet Actions / Downloads */}
          <Tabs defaultValue="download" className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-cyberdark-800">
              <TabsTrigger value="download">Last ned</TabsTrigger>
              <TabsTrigger value="electrum">Electrum</TabsTrigger>
            </TabsList>
            
            <TabsContent value="download" className="mt-2">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="border-cyberdark-600 text-gray-300" 
                    onClick={() => downloadWallet('json')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    JSON-format
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-cyberdark-600 text-gray-300" 
                    onClick={() => downloadWallet('paper')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Papir-lommebok
                  </Button>
                </div>
                
                <p className="text-xs text-gray-400">
                  Last ned din lommebok for sikker offline oppbevaring eller utskrift.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="electrum" className="mt-2">
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full border-cyberdark-600 text-gray-300" 
                  onClick={() => downloadWallet('electrum')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Last ned for Electrum
                </Button>
                
                <div className="p-3 bg-cyberdark-900 rounded-md border border-cyberdark-700">
                  <h4 className="text-xs font-medium text-white mb-1">Slik bruker du med Electrum:</h4>
                  <ol className="text-xs text-gray-400 list-decimal list-inside space-y-1">
                    <li>Last ned Electrum fra <a href="https://electrum.org/" target="_blank" rel="noopener noreferrer" className="text-cyberblue-400 hover:underline">electrum.org</a></li>
                    <li>Start Electrum og velg "Restore a wallet from file"</li>
                    <li>Velg filen du lastet ned herfra</li>
                    <li>Skriv inn passordet du opprettet lommeboken med</li>
                  </ol>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="border-t border-cyberdark-700 pt-4">
        <p className="text-xs text-gray-500 italic">
          Hold private nøkler sikkert. Snakkaz tar ikke ansvar for tap av midler.
          <a href="https://electrum.org/documentation" target="_blank" rel="noopener noreferrer" className="ml-1 text-cyberblue-400 hover:underline">
            Lær mer om sikker Bitcoin-håndtering
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}