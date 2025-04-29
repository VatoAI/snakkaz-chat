import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Shield, Database, Zap, FileUp, Lock, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BitcoinPayment } from "@/components/payment/BitcoinPayment";
import { Group, GroupMember } from "@/types/groups";

interface PremiumMembershipCardProps {
  group: Group;
  currentUserId: string;
  currentMembership: GroupMember | undefined;
  onUpgradeComplete: () => void;
}

export function PremiumMembershipCard({
  group,
  currentUserId,
  currentMembership,
  onUpgradeComplete
}: PremiumMembershipCardProps) {
  const { toast } = useToast();
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const isPremiumMember = currentMembership?.role === "premium";

  const handlePaymentSuccess = async () => {
    try {
      setIsProcessing(true);
      
      // Oppdater brukerens medlemskap i gruppen til premium
      const { error } = await supabase
        .from('group_members')
        .update({
          role: 'premium',
          storage_quota: 5120, // 5GB i MB
          premium_features: ['enhanced_encryption', 'unlimited_storage', 'file_sharing', 'message_editing']
        })
        .eq('user_id', currentUserId)
        .eq('group_id', group.id);
      
      if (error) throw error;
      
      toast({
        title: "Premium gruppemedlemskap aktivert!",
        description: "Du har nå tilgang til utvidede premium-funksjoner i denne gruppen.",
      });

      setShowPayment(false);
      onUpgradeComplete();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Feil ved oppgradering",
        description: error.message || "Det oppstod en feil ved oppgradering av medlemskapet. Prøv igjen senere.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      variant: "destructive",
      title: "Betalingsfeil",
      description: error || "Det oppstod en feil ved betaling. Prøv igjen senere.",
    });
  };

  if (isPremiumMember) {
    return (
      <Card className="border-cybergold-500/30 bg-cyberdark-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-cybergold-400 flex items-center gap-2">
              <Crown className="h-5 w-5" /> Premium Gruppemedlem
            </CardTitle>
            <Badge variant="outline" className="bg-cybergold-500/20 text-cybergold-200 border-cybergold-500/30">
              Aktiv
            </Badge>
          </div>
          <CardDescription>
            Du har premium-status i denne gruppen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-cybergold-400" />
              <span>Forbedret ende-til-ende kryptering (256-bit)</span>
            </li>
            <li className="flex items-center gap-2">
              <Database className="h-4 w-4 text-cybergold-400" />
              <span>5GB personlig lagringskvote i gruppen</span>
            </li>
            <li className="flex items-center gap-2">
              <FileUp className="h-4 w-4 text-cybergold-400" />
              <span>Deling av filer opptil 1GB</span>
            </li>
            <li className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-cybergold-400" />
              <span>Rediger meldinger når som helst</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-cybergold-400 mt-2">
            Premium gruppemedlemskap aktivt
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-cyberdark-500/30 bg-cyberdark-900">
      {showPayment ? (
        <CardContent className="pt-6">
          <BitcoinPayment
            amount={49}
            productType="premium_group_membership" // Fikset produkttype
            productId={group.id}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
          <Button
            variant="ghost"
            className="w-full mt-4 text-cyberdark-300"
            onClick={() => setShowPayment(false)}
          >
            Avbryt
          </Button>
        </CardContent>
      ) : (
        <>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-cyberblue-400 flex items-center gap-2">
                <Crown className="h-5 w-5" /> Oppgrader til Premium
              </CardTitle>
              <Badge variant="outline" className="bg-cyberblue-500/10 text-cyberblue-300 border-cyberblue-500/20">
                49 kr/mnd
              </Badge>
            </div>
            <CardDescription>
              Få eksklusiv premium-tilgang i denne gruppen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-cyberblue-400" />
                <span>Forbedret ende-til-ende kryptering (256-bit)</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="h-4 w-4 text-cyberblue-400" />
                <span>5GB personlig lagringskvote i gruppen</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-cyberblue-400" />
                <span>Tilgang til premium-grupper og funksjoner</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyberblue-400" />
                <span>Prioritert håndtering av meldinger</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => setShowPayment(true)}
              className="w-full bg-gradient-to-r from-cyberblue-700 to-cyberblue-500 hover:from-cyberblue-600 hover:to-cyberblue-400"
              disabled={isProcessing}
            >
              {isProcessing ? "Behandler..." : "Oppgrader medlemskap"}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}