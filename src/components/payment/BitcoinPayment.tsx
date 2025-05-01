import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, CheckCircle, AlertCircle, RefreshCw, ExternalLink, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

interface BitcoinPaymentProps {
  amount: number; // i NOK
  onSuccess?: () => void;
  onError?: (error: string) => void;
  productType: 'premium_group' | 'premium_account';
  productId?: string; // Gruppe-ID hvis det er relevant
}

interface TransactionRecord {
  id: string;
  timestamp: string;
  address: string;
  amount: string;
  amountNok: number;
  productType: string;
  productId: string | null;
  status: 'pending' | 'completed' | 'expired' | 'failed';
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
  const [transactionId, setTransactionId] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const { toast } = useToast();

  // Hent gjeldende Bitcoin-kurs fra en ekstern API
  const getBitcoinRate = async () => {
    try {
      // Bruk coindesk API for gjeldende BTC-kurs
      const response = await axios.get('https://api.coindesk.com/v1/bpi/currentprice/NOK.json');
      const rateNOK = response.data.bpi.NOK.rate_float;
      setExchangeRate(rateNOK);
      return rateNOK;
    } catch (error) {
      console.error('Feil ved henting av Bitcoin-kurs:', error);
      // Fallback til en sikker verdi hvis API feiler
      return 450000; // Fallback-verdi
    }
  };

  const generatePaymentDetails = async () => {
    try {
      setIsLoading(true);
      setError('');
      setRetryCount(0);
      
      // Hent Bitcoin-kurs
      const btcRate = await getBitcoinRate();
      
      // Konverter NOK til BTC (8 desimaler)
      const btcAmount = (amount / btcRate).toFixed(8);
      setBitcoinAmount(btcAmount);

      // Generer en unik transaksjon-ID
      const txId = uuidv4();
      setTransactionId(txId);
      
      // Kall til backend for å generere Bitcoin-adresse
      const { data, error } = await supabase.functions.invoke('generate-bitcoin-address', {
        body: {
          transactionId: txId,
          amountNok: amount,
          amountBtc: btcAmount,
          productType,
          productId
        }
      });

      if (error) throw new Error(error.message);
      
      // Sett Bitcoin-adresse fra backend-responsen
      setBitcoinAddress(data?.address || '');
      
      // Lagre transaksjonsdetaljer i databasen
      await storeTransactionRecord(txId, btcAmount, data?.address);
      
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

  // Lagre transaksjonsdetaljer i databasen
  const storeTransactionRecord = async (txId: string, btcAmount: string, address: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Bruker ikke autentisert');
      
      const transactionRecord: Omit<TransactionRecord, 'id'> = {
        timestamp: new Date().toISOString(),
        address: address,
        amount: btcAmount,
        amountNok: amount,
        productType,
        productId: productId || null,
        status: 'pending'
      };
      
      await supabase
        .from('bitcoin_transactions')
        .upsert({ 
          id: txId,
          user_id: user.id,
          ...transactionRecord
        });
        
    } catch (err) {
      console.error('Feil ved lagring av transaksjonsdata:', err);
    }
  };

  // Sjekk betalingsstatus med eksponentielt økende ventetid
  const checkPaymentStatus = async () => {
    try {
      if (isVerified) return;
      setIsPending(true);
      
      // Sjekk betalingsstatus via backend API
      const { data, error } = await supabase.functions.invoke('check-bitcoin-payment', {
        body: {
          transactionId,
          address: bitcoinAddress,
          expectedAmount: bitcoinAmount
        }
      });

      if (error) throw new Error(error.message);
      
      if (data?.status === 'completed') {
        setIsVerified(true);
        if (onSuccess) onSuccess();
        
        // Oppdater transaksjonsstatus i databasen
        await updateTransactionStatus('completed');
        
        // Aktiver premium-status
        await activatePremium();
        
        toast({
          title: "Betaling bekreftet!",
          description: "Din premium-tilgang er nå aktivert.",
          variant: "success",
        });
      } else if (data?.status === 'pending') {
        // Betaling ikke registrert ennå
        setRefreshCounter(refreshCounter + 1);
        
        // Notifiser brukeren om transaksjonsstatus
        if (refreshCounter % 3 === 0) { // Vis toast hver tredje sjekk
          toast({
            title: "Venter på betaling",
            description: "Transaksjonen er enda ikke bekreftet på blokkjeden. Dette kan ta noen minutter.",
            variant: "default",
          });
        }
        
        // Planlegg neste sjekk med eksponentiell backoff
        const nextRetryDelay = Math.min(2000 * Math.pow(1.5, retryCount), 30000); // Max 30 sekunder
        setRetryCount(retryCount + 1);
        setTimeout(checkPaymentStatus, nextRetryDelay);
      }
    } catch (err: unknown) {
      console.error('Error checking payment status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Kunne ikke verifisere betaling';
      
      // Ikke vis feil direkte til brukeren ved midlertidige nettverksproblemer
      if (retryCount < 5) {
        // Retry med exponential backoff
        const nextRetryDelay = Math.min(2000 * Math.pow(2, retryCount), 30000);
        setRetryCount(retryCount + 1);
        setTimeout(checkPaymentStatus, nextRetryDelay);
      } else {
        setError(errorMessage);
        await updateTransactionStatus('failed');
        if (onError) onError(errorMessage);
      }
    } finally {
      setIsPending(false);
    }
  };
  
  // Oppdater transaksjonsstatus i databasen
  const updateTransactionStatus = async (status: 'pending' | 'completed' | 'expired' | 'failed') => {
    try {
      if (!transactionId) return;
      
      await supabase
        .from('bitcoin_transactions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId);
    } catch (err) {
      console.error('Feil ved oppdatering av transaksjonsstatus:', err);
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
              payment_address: bitcoinAddress,
              transaction_id: transactionId
            });
        }
      }
    } catch (err) {
      console.error('Error activating premium status:', err);
    }
  };
  
  // Start nedtelling og betalingsovervåking
  const startCountdown = () => {
    setRemainingTime(900); // 15 minutter
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Merk transaksjonen som utløpt
          updateTransactionStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Start betalingsovervåking
    setTimeout(checkPaymentStatus, 10000); // Første sjekk etter 10 sekunder
    
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
  
  // Manuelt sjekk betalingsstatus
  const manualCheckStatus = () => {
    if (!isPending) {
      checkPaymentStatus();
      
      toast({
        title: "Sjekker betaling",
        description: "Verifiserer betalingsstatus...",
        variant: "default",
      });
    }
  };
  
  // Vis transaksjonen i en blockchain explorer
  const viewTransaction = () => {
    window.open(`https://www.blockchain.com/btc/address/${bitcoinAddress}`, '_blank');
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
            {exchangeRate > 0 && (
              <p className="text-xs text-cyberdark-400 mt-1">
                Kurs: 1 BTC = {exchangeRate.toLocaleString('nb-NO')} NOK
              </p>
            )}
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
                className="h-full bg-gradient-to-r from-cybergold-500 to-cybergold-300"
                style={{ width: `${(remainingTime / 900) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="flex flex-col w-full mb-3 space-y-2">
            <p className="text-xs text-cyberdark-300">
              Betalingen vil bli bekreftet automatisk så snart den registreres på blokkjeden.
            </p>
          </div>
          
          <div className="flex w-full gap-2">
            <Button
              variant="outline" 
              size="sm"
              className="flex-1 border-cybergold-700/50 text-cybergold-400 hover:bg-cybergold-900/20"
              onClick={manualCheckStatus}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
              Sjekk status
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-cyberblue-700/50 text-cyberblue-400 hover:bg-cyberblue-900/20"
              onClick={viewTransaction}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Se detaljer
            </Button>
          </div>
        </>
      )}
    </div>
  );
};