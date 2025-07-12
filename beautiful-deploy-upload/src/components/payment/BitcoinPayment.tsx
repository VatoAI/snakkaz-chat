import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Bitcoin, Check, RefreshCw, AlertCircle, Heart, Shield, Code } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import axios from 'axios';

export interface BitcoinPaymentProps {
  amount: number;
  productType?: string;
  productId: string;
  onSuccess: () => Promise<void>;
  onError: (error: string) => void;
}

interface PaymentData {
  id: string;
  bitcoin_address: string;
  btc_amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  expires_at: string;
}

export function BitcoinPayment({ 
  amount, 
  productId,
  productType,
  onSuccess, 
  onError 
}: BitcoinPaymentProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [statusChecking, setStatusChecking] = useState(false);
  
  // Create payment on component mount
  useEffect(() => {
    createPaymentRequest();
  }, []);
  
  // Set up payment expiration countdown
  useEffect(() => {
    if (!paymentData?.expires_at) return;
    
    const calculateTimeLeft = () => {
      const expiresAt = new Date(paymentData.expires_at).getTime();
      const now = new Date().getTime();
      const difference = expiresAt - now;
      
      if (difference <= 0) {
        return 0;
      }
      
      return Math.floor(difference / 1000); // seconds
    };
    
    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [paymentData?.expires_at]);
  
  // Set up payment status subscription
  useEffect(() => {
    if (!paymentData?.id) return;
    
    // Subscribe to changes on this payment
    const subscription = supabase
      .channel(`payment-${paymentData.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'payments',
          filter: `id=eq.${paymentData.id}`
        },
        (payload) => {
          const updatedPayment = payload.new as PaymentData;
          setPaymentData(updatedPayment);
          
          // Handle payment confirmation
          if (updatedPayment.status === 'confirmed' || updatedPayment.status === 'completed') {
            toast({
              title: 'Payment confirmed!',
              description: 'Your Bitcoin payment has been confirmed.',
            });
            handlePaymentSuccess();
          } else if (updatedPayment.status === 'failed') {
            toast({
              variant: "destructive",
              title: 'Payment failed',
              description: 'Your Bitcoin payment has failed.',
            });
          }
        }
      )
      .subscribe();
      
    // Poll for status updates as well (backup)
    const statusCheckInterval = setInterval(() => {
      checkPaymentStatus();
    }, 30000); // Check every 30 seconds
    
    return () => {
      supabase.removeChannel(subscription);
      clearInterval(statusCheckInterval);
    };
  }, [paymentData?.id]);
  
  // Create a payment request
  const createPaymentRequest = async () => {
    try {
      setLoading(true);
      
      const response = await axios.post('/api/payments', {
        amount,
        currency: 'NOK',
        productType,
        productId,
      });
      
      if (response.data.success && response.data.payment) {
        setPaymentData(response.data.payment);
      } else {
        throw new Error('Failed to create payment request');
      }
    } catch (error) {
      console.error('Payment creation error:', error);
      onError(error instanceof Error ? error.message : 'Failed to create payment request');
    } finally {
      setLoading(false);
    }
  };
  
  // Check payment status manually
  const checkPaymentStatus = async () => {
    if (!paymentData?.id || paymentData.status !== 'pending') return;
    
    try {
      setStatusChecking(true);
      
      const response = await axios.get(`/api/payments/${paymentData.id}`);
      
      if (response.data.success && response.data.payment) {
        setPaymentData(response.data.payment);
        
        // Handle payment confirmation
        if (['confirmed', 'completed'].includes(response.data.payment.status)) {
          handlePaymentSuccess();
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    } finally {
      setStatusChecking(false);
    }
  };
  
  // Handle successful payment
  const handlePaymentSuccess = async () => {
    try {
      await onSuccess();
    } catch (error) {
      console.error('Error in onSuccess callback:', error);
    }
  };

  // Format time remaining
  const formatTimeLeft = (seconds: number | null): string => {
    if (seconds === null || seconds <= 0) return '00:00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      remainingSeconds.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Copy address to clipboard
  const copyAddressToClipboard = () => {
    if (!paymentData?.bitcoin_address) return;
    
    navigator.clipboard.writeText(paymentData.bitcoin_address)
      .then(() => {
        toast({
          title: 'Address copied',
          description: 'Bitcoin address copied to clipboard',
        });
      })
      .catch((err) => {
        console.error('Failed to copy address:', err);
      });
  };
  
  if (loading) {
    return (
      <div className="space-y-4 p-4 flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-cybergold-400" />
        <div className="text-center text-sm">Creating your Bitcoin payment...</div>
      </div>
    );
  }
  
  // If payment is completed or confirmed
  if (paymentData && ['confirmed', 'completed'].includes(paymentData.status)) {
    return (
      <div className="space-y-4 p-4 border border-green-600/30 rounded-lg bg-green-900/20">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Check className="h-8 w-8 text-green-500" />
          <h3 className="text-xl font-medium text-green-400">Payment Successful</h3>
        </div>
        
        <div className="text-center text-sm">
          <p className="mb-2">Your payment has been confirmed.</p>
          <p className="text-gray-400">Transaction ID: <span className="font-mono text-xs">{paymentData.id.substring(0, 8)}...</span></p>
        </div>
        
        <div className="mt-2 p-3 bg-green-900/30 rounded-md">
          <p className="text-xs text-gray-300">
            <span className="font-medium text-green-300">Visste du?</span> Snakkaz Chat tilbyr også integrering med Electrum Bitcoin Wallet. Som premium bruker, kan du opprette og administrere din Bitcoin-lommebok direkte i appen.
          </p>
        </div>
        
        <Button
          className="w-full bg-green-700 hover:bg-green-600 text-white"
          onClick={() => onSuccess()}
        >
          Continue
        </Button>
      </div>
    );
  }
  
  // If payment expired
  if (paymentData && timeLeft === 0) {
    return (
      <div className="space-y-4 p-4 border border-red-600/30 rounded-lg bg-red-900/20">
        <div className="flex items-center justify-center gap-3 mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <h3 className="text-xl font-medium text-red-400">Payment Expired</h3>
        </div>
        
        <div className="text-center text-sm">
          <p className="mb-2">This payment request has expired.</p>
          <p className="text-gray-400">Please create a new payment request to continue.</p>
        </div>
        
        <Button
          className="w-full bg-cybergold-600 hover:bg-cybergold-500 text-black"
          onClick={createPaymentRequest}
        >
          Create New Payment
        </Button>
      </div>
    );
  }
  
  // Normal payment view
  return (
    <div className="space-y-4">
      <div className="p-4 border border-cyberdark-700 rounded-lg bg-cyberdark-800">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-cybergold-400">Amount</div>
          <div className="text-lg font-semibold text-cybergold-200">{amount} kr</div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-cybergold-400">Product</div>
          <div className="text-sm text-cybergold-300">{productType || 'Premium Membership'}</div>
        </div>
        
        {paymentData && (
          <>
            <div className="mb-4">
              <div className="text-xs text-center text-cybergold-500 mb-1">
                Time remaining: {formatTimeLeft(timeLeft)}
              </div>
              <div className="w-full bg-cyberdark-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cybergold-500" 
                  style={{ 
                    width: `${timeLeft && timeLeft > 0 ? (timeLeft / (24 * 60 * 60)) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-center rounded-md p-4 bg-cyberdark-700 mb-4">
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white p-3 rounded-md">
                  <QRCodeSVG 
                    value={`bitcoin:${paymentData.bitcoin_address}?amount=${paymentData.btc_amount}`}
                    size={150}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs text-white mb-1">Send exactly:</p>
                  <p className="text-sm font-mono font-bold text-cybergold-400">
                    {paymentData.btc_amount} BTC
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="p-3 bg-cyberdark-900 rounded-md font-mono text-xs break-all text-center text-gray-300">
                {paymentData.bitcoin_address}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2"
                onClick={copyAddressToClipboard}
              >
                Copy
              </Button>
            </div>
          </>
        )}
      </div>
      
      <Button
        onClick={checkPaymentStatus}
        className="w-full bg-cyberdark-700 hover:bg-cyberdark-600"
        disabled={statusChecking || !paymentData || paymentData.status !== 'pending'}
      >
        {statusChecking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Check Payment Status
          </>
        )}
      </Button>
      
      <div className="text-xs text-center text-gray-500 space-y-1">
        <p>Send the exact amount of Bitcoin to the address above.</p>
        <p>The payment will be automatically confirmed after transaction is detected.</p>
        <p>Payment will expire in 24 hours if not completed.</p>
      </div>
      
      <div className="mt-6 p-4 bg-cyberdark-900 border border-cyberdark-700 rounded-lg">
        <h3 className="text-sm font-medium text-cybergold-400 mb-2 flex items-center justify-center gap-2">
          <Heart className="h-4 w-4 text-red-400" />
          Din støtte betyr mye for oss
        </h3>
        <div className="space-y-3 text-xs text-gray-300">
          <p>
            Ved å bli premium bruker støtter du Snakkaz Chat med å:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Shield className="h-4 w-4 shrink-0 mt-0.5 text-cyberblue-400" />
              <span>Forbedre sikkerheten og personvernet for alle brukere</span>
            </li>
            <li className="flex items-start gap-2">
              <Code className="h-4 w-4 shrink-0 mt-0.5 text-cyberblue-400" />
              <span>Utvikle nye funksjoner og forbedringer av plattformen</span>
            </li>
            <li className="flex items-start gap-2">
              <Bitcoin className="h-4 w-4 shrink-0 mt-0.5 text-cybergold-400" />
              <span>Holde tjenesten uavhengig og reklamefri</span>
            </li>
          </ul>
          <p className="pt-2">
            Vi tar også gjerne imot donasjoner for å støtte videre utvikling. 
            For donasjoner, send valgfritt beløp til vår Bitcoin-adresse: <span className="text-cybergold-400 font-mono">bc1qz7q6hxlevr8y9kgff2p6m2c9t95x85h2knz0wz</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default BitcoinPayment;
