
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Bitcoin } from 'lucide-react';

export interface BitcoinPaymentProps {
  amount: number;
  productType?: string; // Added to fix the type errors
  productId: string;
  onSuccess: () => Promise<void>;
  onError: (error: string) => void;
}

export function BitcoinPayment({ 
  amount, 
  productId,
  productType,
  onSuccess, 
  onError 
}: BitcoinPaymentProps) {
  const [loading, setLoading] = React.useState(false);
  
  const handlePayment = async () => {
    try {
      setLoading(true);
      // Simulate successful payment after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      await onSuccess();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

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
        
        <div className="flex items-center justify-center rounded-md p-4 bg-cyberdark-700">
          <div className="flex flex-col items-center gap-2">
            <Bitcoin className="w-12 h-12 text-cybergold-400" />
            <div className="text-xs text-center text-cybergold-500">
              This is a placeholder for Bitcoin payment QR code
            </div>
          </div>
        </div>
      </div>
      
      <Button
        onClick={handlePayment}
        className="w-full bg-cybergold-600 hover:bg-cybergold-500 text-black"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Complete Payment'
        )}
      </Button>
      
      <div className="text-xs text-center text-cybergold-500">
        *This is a demo component and no actual payment will be processed
      </div>
    </div>
  );
}

export default BitcoinPayment;
