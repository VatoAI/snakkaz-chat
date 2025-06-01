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
  const handleSupportSuccess = async () => {
    if (!user || !selectedPlan) return;
    
    try {
      await subscriptionService.createSubscription(user.id, selectedPlan.id);
      await refreshSubscription();
      
      toast({
        title: "Takk for din støtte!",
        description: `Du støtter nå fellesskapet med ${selectedPlan.name}!`,
        variant: "default",
      });
      
      setPaymentOpen(false);
    } catch (error) {
      console.error("Failed to create subscription", error);
      toast({
        title: "Støtte Error",
        description: "Kunne ikke aktivere din støtte. Prøv igjen.",
        variant: "destructive",
      });
    }
  };

  // Handle payment error
  const handleSupportError = (errorMessage: string) => {
    toast({
      title: "Støtte mislyktes",
      description: errorMessage,
      variant: "destructive",
    });
  };

  // Start community support
  const handleStartSupport = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const success = await subscriptionService.createTrialSubscription(user.id);
      
      if (success) {
        await refreshSubscription();
        toast({
          title: "Velkommen til fellesskapet!",
          description: "Du har nå tilgang til alle funksjonene våre!",
          variant: "default",
        });
      } else {
        throw new Error("Failed to start trial");
      }
    } catch (error) {
      console.error("Failed to start trial", error);
      toast({
        title: "Oppstart feilet",
        description: "Kunne ikke starte din tilgang. Prøv igjen.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  // Render active community support details if user has one
  if (isPremium && subscription) {
    const expiryDate = subscription.current_period_end 
      ? new Date(subscription.current_period_end).toLocaleDateString() 
      : 'Unknown';
    
    const currentPlan = plans.find(p => p.id === subscription.plan_id);
    
    return (
      <div className="space-y-6">
        <Card className="border-green-500 bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Aktiv fellesskapsstøtte
              <Badge variant="outline" className="bg-green-700 text-green-100">
                {subscription.status === 'trial' ? 'GRATIS TILGANG' : 'SUPPORTER'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Takk for at du støtter {currentPlan?.name || 'SnakkaZ'} fellesskapet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-400">Støttenivå:</span>
                <span className="font-medium">{currentPlan?.name || 'Fellesskapsstøtte'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-400">Status:</span>
                <span className="font-medium">{subscription.status === 'trial' ? 'Gratis tilgang' : 'Aktiv støtte'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-400">Fornyelse:</span>
                <span className="font-medium">{expiryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-400">Bidrag:</span>
                <span className="font-medium">{currentPlan?.price || 0} kr / måned</span>
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
                    title: "Støtte avsluttet",
                    description: "Din støtte til fellesskapet er avsluttet.",
                  });
                }
              }}
            >
              Avslutt støtte
            </Button>
          </CardFooter>
        </Card>
        
        <div className="text-sm text-center text-green-500">
          Din støtte forblir aktiv til {expiryDate}. Takk for at du hjelper oss bygge et bedre fellesskap!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-green-100">Støtt fellesskapet</h2>
        <p className="mt-2 text-green-400">
          Valgfri støtte som hjelper oss bygge en bedre plattform for alle
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative overflow-hidden transition-all border-green-500/20 hover:border-green-400/40 ${
              plan.highlighted ? 'border-2 border-green-500 shadow-lg shadow-green-900/20' : ''
            }`}
          >
            {plan.badge_text && (
              <Badge 
                className="absolute top-4 right-4 bg-green-600 text-xs font-semibold uppercase"
              >
                {plan.badge_text}
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-green-200">{plan.name}</CardTitle>
              <CardDescription className="text-slate-400">{plan.description}</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold text-green-300">{plan.price} kr</span>
                <span className="text-green-400"> / {plan.interval}</span>
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
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 mr-2 text-slate-600" />
                      )}
                      <span className={!enabled ? "text-slate-600" : "text-slate-300"}>
                        {feature.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-green-600 hover:bg-green-500 text-white"
                onClick={() => handleSelectPlan(plan)}
              >
                Støtt med denne
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-green-400 mb-4">
          Vil du teste alle funksjonene først? Få gratis tilgang og se hva vi bygger sammen.
        </p>
        <Button 
          variant="outline" 
          className="border-green-600 text-green-400 hover:text-green-200 hover:bg-green-600/10"
          onClick={handleStartSupport}
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Få gratis tilgang
        </Button>
      </div>
      
      {/* Support Dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Støtt fellesskapet</DialogTitle>
            <DialogDescription>
              {selectedPlan ? `Støtt ${selectedPlan.name} med ${selectedPlan.price} kr per ${selectedPlan.interval}` : ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <BitcoinPayment 
              amount={selectedPlan.price} 
              productId={selectedPlan.id}
              productType={selectedPlan.name}
              onSuccess={handleSupportSuccess}
              onError={handleSupportError}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionTiers;
