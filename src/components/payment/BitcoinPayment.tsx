import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BitcoinPaymentProps {
  amount: number; // i NOK
  onSuccess?: () => void;
  onError?: (error: string) => void;
  productType: 'premium_group' | 'premium_account';
  productId?: string; // Gruppe-ID hvis det er relevant
}

export const BitcoinPayment = ({ 
  amount = 99, 
  onSuccess, 
  onError,
  productType,
  productId
}: BitcoinPaymentProps) => {
  const [bitcoinAddress, setBitcoinAddress] = useState('');
  const [bitcoinAmount, setBitcoinAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [remainingTime, setRemainingTime] = useState(900); // 15 minutter i sekunder
  const { toast } = useToast();

  // Simulerer Bitcoin-kurs (i virkeligheten ville dette hentes fra en API)
  const getBitcoinRate = async () => {
    return 450000; // NOK per BTC (simulert verdi)
  };

  const generatePaymentDetails = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Hent Bitcoin-kurs
      const btcRate = await getBitcoinRate();
      
      // Konverter NOK til BTC (8 desimaler)
      const btcAmount = (amount / btcRate).toFixed(8);
      setBitcoinAmount(btcAmount);

      // I en reell implementasjon: Generer en unik Bitcoin-adresse per betaling
      // via en tjenesteleverandør som BTCPay Server, BitGo, eller ved å bruke xpub key
      
      // For demo: Simulerer en kall til backend som returnerer en Bitcoin-adresse
      const { data, error } = await supabase.functions.invoke('generate-bitcoin-address', {
        body: {
          amountNok: amount,
          productType,
          productId
        }
      });

      if (error) throw new Error(error.message);
      
      // Normalt ville du få en ekte adresse fra backenden
      // For demo: Bruker en fast adresse
      setBitcoinAddress(data?.address || '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
      
      // Start nedtelling
      startCountdown();
      
    } catch (err: unknown) {
      console.error('Error generating payment details:', err);
      const errorMessage = err instanceof Error ? err.message : 'Kunne ikke generere betalingsinformasjon';
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Sjekk betalingsstatus
  const checkPaymentStatus = async () => {
    try {
      setIsPending(true);
      
      // I en reell implementasjon: Sjekk om betalingen er mottatt via API
      // For demo: Simulerer en kall til backend som sjekker status
      const { data, error } = await supabase.functions.invoke('check-bitcoin-payment', {
        body: {
          address: bitcoinAddress,
          expectedAmount: bitcoinAmount
        }
      });

      if (error) throw new Error(error.message);
      
      // For demo: 10% sjanse for at betalingen simuleres som gjennomført
      const isPaymentComplete = data?.status === 'completed' || Math.random() < 0.1;
      
      if (isPaymentComplete) {
        setIsVerified(true);
        if (onSuccess) onSuccess();
        
        // For demo: Aktiver premium-status i databasen
        await activatePremium();
        
        toast({
          title: "Betaling bekreftet!",
          description: "Din premium-tilgang er nå aktivert.",
          variant: "default",
        });
      } else {
        // Betaling ikke registrert ennå
        setRefreshCounter(refreshCounter + 1);
      }
    } catch (err: unknown) {
      console.error('Error checking payment status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Kunne ikke verifisere betaling';
      setError(errorMessage);
      if (onError) onError(errorMessage);
      // Removed redundant call to onError as we're already handling it above
    } finally {
      setIsPending(false);
    }
  };
  
  // Aktiver premium-status
  const activatePremium = async () => {
    try {
      if (productType === 'premium_group' && productId) {
        // Aktiver premium-status for en gruppe
        await supabase
          .from('groups')
          .update({ 
            is_premium: true,
            premium_active_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() 
          })
          .eq('id', productId);
      } else {
        // Aktiver premium-status for en bruker
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('user_subscriptions')
            .upsert({ 
              user_id: user.id,
              subscription_type: 'premium',
              active_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              payment_method: 'bitcoin',
              payment_address: bitcoinAddress
            });
        }
      }
    } catch (err) {
      console.error('Error activating premium status:', err);
    }
  };
  
  // Start nedtelling
  const startCountdown = () => {
    setRemainingTime(900); // 15 minutter
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Cleanup
    return () => clearInterval(timer);
  };
  
  // Format gjenværende tid
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Kopier Bitcoin-adresse til utklippstavlen
  const copyToClipboard = () => {
    navigator.clipboard.writeText(bitcoinAddress);
    toast({
      title: "Kopiert!",
      description: "Bitcoin-adressen er kopiert til utklippstavlen.",
      variant: "default",
    });
  };
  
  // Generer QR-kode for Bitcoin-adresse
  const getBitcoinQR = () => {
    return `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=bitcoin:${bitcoinAddress}?amount=${bitcoinAmount}`;
  };
  
  // Initialiserer Bitcoin-betalingsdetaljer ved oppstart
  useEffect(() => {
    generatePaymentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Hvis tiden er utløpt
  if (remainingTime === 0 && !isVerified) {
    return (
      <div className="flex flex-col items-center p-6 bg-cyberdark-900 rounded-xl border border-cyberred-500/30 shadow-neon-red/10">
        <AlertCircle className="h-12 w-12 text-cyberred-400 mb-4" />
        <h3 className="text-lg font-semibold text-cyberred-400 mb-2">Tiden er utløpt</h3>
        <p className="text-sm text-cyberdark-300 text-center mb-4">
          Betalingsforespørselen er utløpt. Vennligst start på nytt for å generere en ny Bitcoin-adresse.
        </p>
        <Button 
          onClick={generatePaymentDetails}
          className="bg-cyberred-600 hover:bg-cyberred-700 text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Start på nytt
        </Button>
      </div>
    );
  }
  
  // Vis betalingsinformasjon
  return (
    <div className="flex flex-col items-center p-6 bg-cyberdark-900 rounded-xl border border-cybergold-500/30 shadow-neon-gold/10">
      {isLoading ? (
        <div className="flex flex-col items-center py-8">
          <Loader2 className="h-8 w-8 text-cybergold-400 animate-spin mb-4" />
          <p className="text-sm text-cyberdark-300">Genererer betalingsinformasjon...</p>
        </div>
      ) : isVerified ? (
        <div className="flex flex-col items-center py-4">
          <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-cybergold-400 mb-2">Betaling bekreftet!</h3>
          <p className="text-sm text-cyberdark-300 text-center mb-4">
            Takk for din betaling. Din premium-tilgang er nå aktivert.
          </p>
          <Button 
            onClick={onSuccess}
            className="bg-gradient-to-r from-cybergold-700 to-cybergold-500 hover:from-cybergold-600 hover:to-cybergold-400 text-cyberdark-950 font-semibold"
          >
            Fortsett
          </Button>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center py-4">
          <AlertCircle className="h-12 w-12 text-cyberred-400 mb-4" />
          <h3 className="text-lg font-semibold text-cyberred-400 mb-2">Feil oppstod</h3>
          <p className="text-sm text-cyberdark-300 text-center mb-4">
            {error}
          </p>
          <Button 
            onClick={generatePaymentDetails}
            className="bg-cyberred-600 hover:bg-cyberred-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Prøv igjen
          </Button>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-cybergold-400 mb-4 text-center">
            Betal med Bitcoin
          </h3>
          
          <div className="flex flex-col items-center mb-5">
            <p className="text-xl font-mono font-semibold text-white mb-1">
              {bitcoinAmount} BTC
            </p>
            <p className="text-sm text-cyberdark-300">
              ≈ {amount} NOK
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg mb-5 max-w-full w-64 h-64 flex items-center justify-center">
            <img 
              src={getBitcoinQR()} 
              alt="Bitcoin QR Code"
              className="max-w-full max-h-full"
            />
          </div>
          
          <div className="flex items-center justify-between w-full mb-5 p-3 bg-cyberdark-800 rounded-md">
            <p className="text-sm font-mono text-cybergold-400 truncate mr-2">
              {bitcoinAddress}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-cyberblue-400 hover:text-cyberblue-300 hover:bg-cyberblue-900/20"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="w-full mb-5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-cyberdark-300">Betalingsstatus</span>
              <span className="text-xs text-cybergold-300">Utløper om: {formatTime(remainingTime)}</span>
            </div>
            <div className="h-2 w-full bg-cyberdark-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cybergold-600 to-cybergold-400 animate-pulse"
                style={{ width: `${(remainingTime / 900) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <Button
            onClick={checkPaymentStatus}
            className="w-full bg-cyberblue-600 hover:bg-cyberblue-700 text-white"
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifiserer...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4" />
                {refreshCounter > 0 ? "Sjekk igjen" : "Verifiser betaling"}
              </div>
            )}
          </Button>
          
          <p className="text-xs text-center text-cyberdark-300 mt-5">
            Etter betaling, klikk på "Verifiser betaling" for å aktivere din premium-tilgang.
            <br />Det kan ta noen minutter før betalingen bekreftes på Bitcoin-nettverket.
          </p>
        </>
      )}
    </div>
  );
};