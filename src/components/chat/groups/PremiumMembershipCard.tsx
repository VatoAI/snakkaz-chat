// Community-focused group membership component for supporting group features
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Shield, Database, Zap, FileUp, Lock, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BitcoinPayment } from "@/components/payment/BitcoinPayment";
import { Group, GroupMember } from "@/types/groups";

interface CommunityMembershipCardProps {
  group: Group;
  currentUserId: string;
  currentMembership: GroupMember | undefined;
  onUpgradeComplete: () => void;
  isMobile?: boolean; // Add isMobile property
}

export function CommunityMembershipCard({
  group,
  currentUserId,
  currentMembership,
  onUpgradeComplete,
  isMobile
}: CommunityMembershipCardProps) {
  const { toast } = useToast();
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const isPremiumMember = currentMembership?.role === "premium";

  const handleSupportSuccess = async () => {
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
        title: "Fellesskapsstøtte aktivert!",
        description: "Du har nå tilgang til utvidede funksjoner i denne gruppen.",
      });

      setShowPayment(false);
      onUpgradeComplete();
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Feil ved oppgradering",
        description: error instanceof Error ? error.message : "Det oppstod en feil ved oppgradering av medlemskapet. Prøv igjen senere.",
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
      <Card className="border-green-500/30 bg-green-900/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Shield className="h-5 w-5" /> Fellesskap Gruppestøtter
            </CardTitle>
            <Badge variant="outline" className="bg-green-500/20 text-green-200 border-green-500/30">
              Aktiv
            </Badge>
          </div>
          <CardDescription>
            Du støtter denne gruppen og har tilgang til alle funksjoner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-green-400" />
              <span>Forbedret ende-til-ende kryptering (256-bit)</span>
            </li>
            <li className="flex items-center gap-2">
              <Database className="h-4 w-4 text-green-400" />
              <span>5GB personlig lagringskvote i gruppen</span>
            </li>
            <li className="flex items-center gap-2">
              <FileUp className="h-4 w-4 text-green-400" />
              <span>Deling av filer opptil 1GB</span>
            </li>
            <li className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-green-400" />
              <span>Rediger meldinger når som helst</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-green-400 mt-2">
            Fellesskapsstøtte for gruppe aktivt
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-green-500/30 bg-green-900/20">
      {showPayment ? (
        <CardContent className="pt-6">
          <BitcoinPayment
            amount={49}
            productType="community_group_support"
            productId={group.id}
            onSuccess={handleSupportSuccess}
            onError={handlePaymentError}
          />
          <Button
            variant="ghost"
            className="w-full mt-4 text-green-300"
            onClick={() => setShowPayment(false)}
          >
            Avbryt
          </Button>
        </CardContent>
      ) : (
        <>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Shield className="h-5 w-5" /> Støtt Gruppen
              </CardTitle>
              <Badge variant="outline" className="bg-green-500/10 text-green-300 border-green-500/20">
                49 kr/mnd
              </Badge>
            </div>
            <CardDescription>
              Støtt denne gruppen og få tilgang til alle funksjoner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-400" />
                <span>Forbedret ende-til-ende kryptering (256-bit)</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="h-4 w-4 text-green-400" />
                <span>5GB personlig lagringskvote i gruppen</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Tilgang til alle fellesskapsfunksjoner</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-400" />
                <span>Prioritert håndtering av meldinger</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => setShowPayment(true)}
              className="w-full bg-gradient-to-r from-green-700 to-green-500 hover:from-green-600 hover:to-green-400"
              disabled={isProcessing}
            >
              {isProcessing ? "Behandler..." : "Støtt Felleskapet"}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
