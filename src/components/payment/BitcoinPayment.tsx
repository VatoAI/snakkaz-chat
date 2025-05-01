import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, CheckCircle, AlertCircle, RefreshCw, ExternalLink, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';

interface BitcoinPaymentProps {
  amount: number;
  currency?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  userId?: string;
}

interface PaymentData {
  id: string;
  address: string;
  bitcoin_amount: string;
  expires_at: string;
  payment_url?: string;
  qr_code?: string;
}

export function BitcoinPayment({
  amount,
  currency = 'NOK',
  onSuccess,
  onError,
  userId,
}: BitcoinPaymentProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Generate a consistent transaction ID
  useEffect(() => {
    if (!transactionId) {
      setTransactionId(uuidv4());
    }
  }, [transactionId]);

  // Function to create a new payment request
  const createPayment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Prepare payment data
      const data = {
        amount: amount,
        currency: currency,
        callback_url: `${window.location.origin}/payment-callback`,
        metadata: {
          user_id: userId || 'anonymous',
          transaction_id: transactionId,
        },
      };

      // Make API call to create payment
      const response = await axios.post('/api/create-bitcoin-payment', data);
      
      if (response.data && response.data.payment_url) {
        setPaymentData(response.data);
        
        // Save transaction to database
        await saveTransaction(response.data);
      } else {
        throw new Error('Kunne ikke opprette betalingsforespørsel');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 
                          axios.isAxiosError(err) && err.response?.data?.message ? 
                          err.response.data.message : 'En feil oppstod ved opprettelse av betalingsforespørsel';
      setError(errorMessage);
      
      toast({
        title: "Betalingsfeil",
        description: errorMessage,
        variant: "destructive",
      });
      
      if (onError) onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a payment when the component mounts
  useEffect(() => {
    if (!isVerified && !isLoading && !paymentData) {
      createPayment();
    }
  }, [createPayment, isLoading, isVerified, paymentData]);

  // Timer countdown for payment expiry
  useEffect(() => {
    if (paymentData?.expires_at) {
      const interval = setInterval(() => {
        const expiryTime = new Date(paymentData.expires_at).getTime();
        const now = new Date().getTime();
        const diff = Math.max(0, Math.floor((expiryTime - now) / 1000));
        
        setTimeLeft(diff);
        
        if (diff <= 0) {
          clearInterval(interval);
          setError('Betalingsforespørselen har utløpt. Vennligst prøv igjen.');
          toast({
            title: "Betalingen har utløpt",
            description: "Vennligst generer en ny betalingsforespørsel",
            variant: "destructive",
          });
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [paymentData, toast]);

  // Save transaction to database
  const saveTransaction = async (paymentData: PaymentData) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          id: transactionId,
          user_id: userId || null,
          amount: amount,
          currency: currency,
          payment_id: paymentData.id || null,
          payment_address: paymentData.address || null,
          status: 'pending',
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (err: unknown) {
      console.error('Error saving transaction:', err);
    }
  };

  // Update transaction status in database
  const updateTransactionStatus = async (status: string) => {
    if (!transactionId) return;
    
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', transactionId);

      if (error) throw error;
    } catch (err: unknown) {
      console.error('Error updating transaction:', err);
    }
  };

  // Activate premium status for user
  const activatePremium = async () => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_premium: true,
          premium_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        })
        .eq('id', userId);

      if (error) throw error;
    } catch (err: unknown) {
      console.error('Error activating premium:', err);
    }
  };

  // Check payment status
  const checkPaymentStatus = useCallback(async () => {
    if (!paymentData?.id || isVerified || checkingStatus) return;
    
    setCheckingStatus(true);
    try {
      const response = await axios.get(`/api/check-bitcoin-payment/${paymentData.id}`);
      const data = response.data;
      
      if (data?.status === 'completed') {
        setIsVerified(true);
        if (onSuccess) onSuccess();
        
        // Update transaction status in database
        await updateTransactionStatus('completed');
        
        // Activate premium status
        await activatePremium();
        
        toast({
          title: "Betaling bekreftet!",
          description: "Din premium-tilgang er nå aktivert.",
          variant: "default",
        });
      } else if (data?.status === 'failed') {
        setError('Betalingen mislyktes. Vennligst prøv igjen.');
        await updateTransactionStatus('failed');
        
        toast({
          title: "Betalingsfeil",
          description: "Betalingen kunne ikke bekreftes. Vennligst prøv igjen.",
          variant: "destructive",
        });
      }
    } catch (err: unknown) {
      console.error('Error checking payment status:', err);
    } finally {
      setCheckingStatus(false);
    }
  }, [paymentData, isVerified, checkingStatus, onSuccess, toast, updateTransactionStatus, activatePremium]);

  // Automatically check payment status every 15 seconds
  useEffect(() => {
    if (!paymentData || isVerified) return;
    
    const interval = setInterval(checkPaymentStatus, 15000);
    return () => clearInterval(interval);
  }, [paymentData, isVerified, checkPaymentStatus]);

  // Copy address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess('address');
        toast({
          title: "Kopiert!",
          description: "Bitcoin-adressen er kopiert til utklippstavlen.",
          variant: "default",
        });
        setTimeout(() => setCopySuccess(''), 3000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  // Copy amount to clipboard
  const copyAmountToClipboard = (amount: string) => {
    navigator.clipboard.writeText(amount).then(
      () => {
        setCopySuccess('amount');
        toast({
          title: "Kopiert!",
          description: "Beløpet er kopiert til utklippstavlen.",
          variant: "default",
        });
        setTimeout(() => setCopySuccess(''), 3000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  // Format time left
  const formatTimeLeft = (seconds: number | null) => {
    if (seconds === null) return '';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-center font-medium">Oppretter betalingsforespørsel...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-6 space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-center text-destructive font-medium">{error}</p>
        <Button 
          onClick={createPayment} 
          variant="outline"
          className="mt-4 flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Prøv igjen
        </Button>
      </div>
    );
  }

  // Render verified state
  if (isVerified) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-6 space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h3 className="text-xl font-bold text-center">Betaling bekreftet!</h3>
        <p className="text-center">
          Takk for din betaling. Din premium-tilgang er nå aktivert.
        </p>
      </div>
    );
  }

  // Render payment data
  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-6">
          {/* Payment header with timer */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Bitcoin Betaling</h3>
            {timeLeft !== null && (
              <div className="flex items-center text-sm bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full">
                <Clock className="inline h-4 w-4 mr-1" />
                <span>{formatTimeLeft(timeLeft)}</span>
              </div>
            )}
          </div>
          
          {/* Amount */}
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Beløp å betale:</p>
            <div className="flex items-center justify-between bg-muted p-3 rounded-md">
              <p className="font-mono text-lg">
                {paymentData?.bitcoin_amount} BTC
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => paymentData?.bitcoin_amount ? copyAmountToClipboard(paymentData.bitcoin_amount) : undefined}
                className="h-8 px-2"
              >
                {copySuccess === 'amount' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-right">
              ≈ {amount} {currency}
            </p>
          </div>
          
          {/* Address */}
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Send til denne adressen:</p>
            <div className="flex items-center justify-between bg-muted p-3 rounded-md">
              <p className="font-mono text-sm break-all pr-2">
                {paymentData?.address}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => paymentData?.address ? copyToClipboard(paymentData.address) : undefined}
                className="h-8 px-2 shrink-0"
              >
                {copySuccess === 'address' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* QR Code */}
          {paymentData?.qr_code && (
            <div className="flex justify-center my-2">
              <img 
                src={paymentData.qr_code} 
                alt="QR Code for Bitcoin Payment" 
                className="h-48 w-48 object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="default"
              className="flex-1 flex items-center gap-2"
              onClick={checkPaymentStatus}
              disabled={checkingStatus}
            >
              {checkingStatus ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {checkingStatus ? 'Sjekker status...' : 'Sjekk betalingsstatus'}
            </Button>
            
            {paymentData?.payment_url && (
              <Button 
                variant="outline"
                className="flex-1 flex items-center gap-2"
                onClick={() => window.open(paymentData.payment_url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                Åpne i wallet
              </Button>
            )}
          </div>
          
          {/* Instructions */}
          <div className="text-sm text-muted-foreground mt-4">
            <p className="mb-2">Instruksjoner:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Send nøyaktig {paymentData?.bitcoin_amount} BTC til adressen over</li>
              <li>Vent på bekreftelse (vanligvis 1-3 minutter)</li>
              <li>Din konto vil automatisk oppgraderes når betalingen er bekreftet</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}