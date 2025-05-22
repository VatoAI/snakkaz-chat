import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import BitcoinPayment from "@/components/payment/BitcoinPayment";
import { useAuth } from "@/hooks/useAuth";
import { SubscriptionPlan } from "@/services/subscription/types";
import { subscriptionService } from "@/services/subscription/subscriptionService";
import { useToast } from "@/hooks/use-toast";

export const SubscriptionTiers = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const { user, subscription, refreshSubscription, isPremium } = useAuth();
  const { toast } = useToast();

  // Load all subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansData = await subscriptionService.getSubscriptionPlans();
        setPlans(plansData);
      } catch (error) {
        console.error("Failed to load subscription plans", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Handle plan selection
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setPaymentOpen(true);
  };

  // Handle payment success
  const handlePaymentSuccess = async () => {
    if (!user || !selectedPlan) return;
    
    try {
      await subscriptionService.createSubscription(user.id, selectedPlan.id);
      await refreshSubscription();
      
      toast({
        title: "Subscription Activated",
        description: `You now have access to ${selectedPlan.name} features!`,
        variant: "default",
      });
      
      setPaymentOpen(false);
    } catch (error) {
      console.error("Failed to create subscription", error);
      toast({
        title: "Subscription Error",
        description: "Failed to activate your subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle payment error
  const handlePaymentError = (errorMessage: string) => {
    toast({
      title: "Payment Failed",
      description: errorMessage,
      variant: "destructive",
    });
  };

  // Start free trial
  const handleStartTrial = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const success = await subscriptionService.createTrialSubscription(user.id);
      
      if (success) {
        await refreshSubscription();
        toast({
          title: "Trial Activated",
          description: "Your 14-day free trial has been activated!",
          variant: "default",
        });
      } else {
        throw new Error("Failed to start trial");
      }
    } catch (error) {
      console.error("Failed to start trial", error);
      toast({
        title: "Trial Error",
        description: "Failed to start your trial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-cybergold-500" />
      </div>
    );
  }

  // Render active subscription details if user has one
  if (isPremium && subscription) {
    const expiryDate = subscription.current_period_end 
      ? new Date(subscription.current_period_end).toLocaleDateString() 
      : 'Unknown';
    
    const currentPlan = plans.find(p => p.id === subscription.plan_id);
    
    return (
      <div className="space-y-6">
        <Card className="border-cybergold-500 bg-cyberdark-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Active Subscription
              <Badge variant="outline" className="bg-cybergold-700 text-cybergold-100">
                {subscription.status === 'trial' ? 'TRIAL' : 'ACTIVE'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Your {currentPlan?.name || 'Premium'} subscription is active
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-cybergold-400">Plan:</span>
                <span className="font-medium">{currentPlan?.name || 'Premium'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cybergold-400">Status:</span>
                <span className="font-medium">{subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cybergold-400">Renews on:</span>
                <span className="font-medium">{expiryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cybergold-400">Price:</span>
                <span className="font-medium">{currentPlan?.price || 0} kr / month</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={async () => {
                if (user) {
                  await subscriptionService.cancelSubscription(user.id);
                  await refreshSubscription();
                  toast({
                    title: "Subscription Canceled",
                    description: "Your subscription has been canceled.",
                  });
                }
              }}
            >
              Cancel Subscription
            </Button>
          </CardFooter>
        </Card>
        
        <div className="text-sm text-center text-cybergold-500">
          Your subscription will remain active until {expiryDate}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-cybergold-100">Choose Your Premium Plan</h2>
        <p className="mt-2 text-cybergold-400">
          Unlock advanced features with a premium subscription
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative overflow-hidden transition-all ${
              plan.highlighted ? 'border-2 border-cybergold-500 shadow-lg shadow-cybergold-900/20' : ''
            }`}
          >
            {plan.badge_text && (
              <Badge 
                className="absolute top-4 right-4 bg-cybergold-600 text-xs font-semibold uppercase"
              >
                {plan.badge_text}
              </Badge>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price} kr</span>
                <span className="text-cybergold-400"> / {plan.interval}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {Object.entries(plan.features).map(([feature, enabled]) => {
                  // Skip non-boolean feature values (those are details, not yes/no features)
                  if (typeof enabled !== 'boolean') return null;
                  
                  return (
                    <div key={feature} className="flex items-center">
                      {enabled ? (
                        <Check className="h-4 w-4 mr-2 text-cybergold-500" />
                      ) : (
                        <X className="h-4 w-4 mr-2 text-cybergold-800" />
                      )}
                      <span className={!enabled ? "text-cybergold-600" : ""}>
                        {feature.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-cybergold-600 hover:bg-cybergold-500 text-black"
                onClick={() => handleSelectPlan(plan)}
              >
                Subscribe Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-cybergold-400 mb-4">Not ready to commit? Try our premium features for free.</p>
        <Button 
          variant="outline" 
          className="border-cybergold-600 text-cybergold-400 hover:text-cybergold-200"
          onClick={handleStartTrial}
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Start 14-day Free Trial
        </Button>
      </div>
      
      {/* Payment Dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Subscription</DialogTitle>
            <DialogDescription>
              {selectedPlan ? `Subscribe to ${selectedPlan.name} for ${selectedPlan.price} kr per ${selectedPlan.interval}` : ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <BitcoinPayment 
              amount={selectedPlan.price} 
              productId={selectedPlan.id}
              productType={selectedPlan.name}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionTiers;
