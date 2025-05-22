import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { SubscriptionTiers } from "@/components/subscription/SubscriptionTiers";
import { PremiumFeature } from "@/services/subscription/types";
import { Check, AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const SubscriptionPage = () => {
  const { isPremium, subscription } = useAuth();

  return (
    <div className="container py-10 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-cybergold-100">Subscription Management</h1>
        <p className="text-cybergold-400 mt-2">
          Manage your subscription and access premium features
        </p>
      </div>

      <Tabs defaultValue="subscription" className="space-y-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="features">Premium Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscription" className="space-y-4">
          <SubscriptionTiers />
        </TabsContent>
        
        <TabsContent value="features" className="space-y-6">
          <Card className="bg-cyberdark-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                Premium Features
                {isPremium ? (
                  <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-cybergold-900/50 text-cybergold-400 rounded-full">
                    <Check className="h-3 w-3 mr-1" />
                    Active
                  </span>
                ) : (
                  <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-cyberdark-700 text-cybergold-600 rounded-full">
                    <Lock className="h-3 w-3 mr-1" />
                    Locked
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {isPremium 
                  ? "Enjoy all the premium features available with your subscription"
                  : "Upgrade to premium to access these features"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <FeatureCard 
                title="Extended Storage"
                description="Store up to 50GB of files and media in your chats"
                featureKey={PremiumFeature.EXTENDED_STORAGE}
                unlocked={isPremium}
              />
              
              <FeatureCard 
                title="End-to-End Encryption"
                description="Enhanced security with end-to-end encryption for all your messages"
                featureKey={PremiumFeature.END_TO_END_ENCRYPTION}
                unlocked={isPremium}
              />
              
              <FeatureCard 
                title="Premium Groups"
                description="Create groups with up to 500 members and enhanced controls"
                featureKey={PremiumFeature.PREMIUM_GROUPS}
                unlocked={isPremium}
              />
              
              <FeatureCard 
                title="Custom Email Domain"
                description="Use your own email domain for Snakkaz communications"
                featureKey={PremiumFeature.CUSTOM_EMAIL}
                unlocked={isPremium}
              />
              
              <FeatureCard 
                title="Priority Support"
                description="Get priority customer support with 24/7 availability"
                featureKey={PremiumFeature.PRIORITY_SUPPORT}
                unlocked={isPremium}
              />
              
              <FeatureCard 
                title="Custom Themes"
                description="Access exclusive themes and customization options"
                featureKey={PremiumFeature.CUSTOM_THEMES}
                unlocked={isPremium}
              />
              
              <FeatureCard 
                title="API Access"
                description="Access to the Snakkaz API for custom integrations"
                featureKey={PremiumFeature.API_ACCESS}
                unlocked={isPremium}
              />
              
              {!isPremium && (
                <div className="pt-4">
                  <Button 
                    className="w-full bg-cybergold-600 hover:bg-cybergold-500 text-black"
                    onClick={() => {
                      const element = document.querySelector('[data-value="subscription"]');
                      if (element instanceof HTMLElement) {
                        element.click();
                      }
                    }}
                  >
                    Upgrade to Premium
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const FeatureCard = ({ 
  title, 
  description, 
  featureKey, 
  unlocked 
}: { 
  title: string;
  description: string;
  featureKey: PremiumFeature;
  unlocked: boolean;
}) => {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="text-lg font-medium text-cybergold-200">{title}</div>
          <div className="text-sm text-cybergold-400">{description}</div>
        </div>
        {unlocked ? (
          <Check className="h-5 w-5 text-cybergold-500" />
        ) : (
          <Lock className="h-5 w-5 text-cybergold-700" />
        )}
      </div>
      <Separator className="my-4 bg-cyberdark-700" />
    </div>
  );
};

export default SubscriptionPage;
