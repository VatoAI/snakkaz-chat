import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Crown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { BitcoinPayment } from "@/components/payment/BitcoinPayment";

interface CreatePremiumGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupCreated?: (groupId: string) => void;
}

const formSchema = z.object({
  name: z.string().min(3, "Gruppenavn må være minst 3 tegn").max(50, "Gruppenavn kan ikke være lenger enn 50 tegn"),
  description: z.string().max(200, "Beskrivelse kan ikke være lenger enn 200 tegn").optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const CreatePremiumGroupModal = ({
  open,
  onOpenChange,
  onGroupCreated
}: CreatePremiumGroupModalProps) => {
  const [step, setStep] = useState<'info' | 'payment' | 'creating'>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [tempGroupId, setTempGroupId] = useState<string | null>(null);
  const { toast } = useToast();
  const { session } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });
  
  const createTempGroup = async (data: FormValues) => {
    try {
      setIsLoading(true);
      
      if (!session?.user) {
        toast({
          title: "Ikke pålogget",
          description: "Du må være pålogget for å opprette en gruppe",
          variant: "destructive"
        });
        return;
      }
      
      // Opprett en midlertidig gruppe (ikke premium ennå)
      const { data: groupData, error } = await supabase
        .from('groups')
        .insert({
          name: data.name,
          description: data.description || '',
          created_by: session.user.id,
          is_premium: false, // Starter som ikke-premium
          is_temp: true // Markerer som midlertidig til betaling er bekreftet
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      // Legg til gruppeeier som medlem med admin-rolle
      if (groupData?.id) {
        await supabase
          .from('group_members')
          .insert({
            group_id: groupData.id,
            user_id: session.user.id,
            role: 'admin'
          });
          
        setTempGroupId(groupData.id);
        setStep('payment');
      }
    } catch (error: any) {
      toast({
        title: "Feil ved opprettelse av gruppe",
        description: error.message || "Noe gikk galt. Vennligst prøv igjen.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePaymentSuccess = async () => {
    try {
      setStep('creating');
      
      // Oppdater gruppen til å være en permanent premium-gruppe
      if (tempGroupId) {
        await supabase
          .from('groups')
          .update({
            is_premium: true,
            is_temp: false,
            premium_active_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('id', tempGroupId);
          
        toast({
          title: "Premium-gruppe opprettet!",
          description: "Din krypterte premium-gruppe er nå klar til bruk.",
          variant: "default"
        });
        
        // Callback til forelderkomponenten
        if (onGroupCreated) onGroupCreated(tempGroupId);
        
        // Lukk modalen og reset
        handleClose();
      }
    } catch (error: any) {
      console.error("Error finalizing group creation:", error);
      toast({
        title: "Feil ved fullføring av gruppe",
        description: "Betalingen ble registrert, men det oppstod en feil ved fullføring av gruppen. Vennligst kontakt support.",
        variant: "destructive"
      });
    }
  };
  
  const handlePaymentError = (errorMessage: string) => {
    toast({
      title: "Betalingsfeil",
      description: errorMessage || "Det oppstod en feil med betalingen. Vennligst prøv igjen senere.",
      variant: "destructive"
    });
    
    // Slett den midlertidige gruppen hvis betaling feiler
    if (tempGroupId) {
      supabase
        .from('groups')
        .delete()
        .eq('id', tempGroupId)
        .then(() => {
          console.log("Temporary group deleted due to payment error");
        });
    }
  };

  const handleClose = () => {
    // Hvis brukeren lukker modalen før betaling, slett den midlertidige gruppen
    if (step === 'payment' && tempGroupId) {
      supabase
        .from('groups')
        .delete()
        .eq('id', tempGroupId)
        .then(() => {
          console.log("Temporary group deleted when modal closed");
        });
    }
    
    // Reset tilstand
    reset();
    setStep('info');
    setTempGroupId(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-cyberdark-900 text-white border-cybergold-500/30 max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-cybergold-400">
            <Crown className="h-5 w-5" />
            {step === 'info' && "Opprett Premium-gruppe"}
            {step === 'payment' && "Betal for Premium-gruppe"}
            {step === 'creating' && "Fullfører oppretting..."}
          </DialogTitle>
        </DialogHeader>

        {step === 'info' && (
          <form onSubmit={handleSubmit(createTempGroup)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-cyberblue-300">
                  Gruppenavn <span className="text-cyberred-400">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Skriv inn gruppenavn"
                  {...register("name")}
                  className="bg-cyberdark-800 border-cyberblue-500/30"
                />
                {errors.name && (
                  <p className="text-sm text-cyberred-400">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-cyberblue-300">
                  Beskrivelse
                </Label>
                <Input
                  id="description"
                  placeholder="Skriv inn beskrivelse (valgfritt)"
                  {...register("description")}
                  className="bg-cyberdark-800 border-cyberblue-500/30"
                />
                {errors.description && (
                  <p className="text-sm text-cyberred-400">{errors.description.message}</p>
                )}
              </div>

              <div className="bg-cyberdark-800/50 p-4 rounded-lg border border-cybergold-500/20">
                <h3 className="text-cybergold-400 font-semibold mb-2 flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Premium-funksjonalitet
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-cybergold-500/20 p-0.5 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-cybergold-500" />
                    </div>
                    <span className="text-cybergold-100">End-to-end kryptering for maksimal sikkerhet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-cybergold-500/20 p-0.5 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-cybergold-500" />
                    </div>
                    <span className="text-cybergold-100">Administrer medlemskap og roller</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-cybergold-500/20 p-0.5 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-cybergold-500" />
                    </div>
                    <span className="text-cybergold-100">99 kr/måned, betal med Bitcoin</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-cyberblue-500/30 text-cyberblue-400"
              >
                Avbryt
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-cybergold-700 to-cybergold-500 hover:from-cybergold-600 hover:to-cybergold-400 text-cyberdark-950 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Oppretter...
                  </div>
                ) : (
                  "Fortsett til betaling"
                )}
              </Button>
            </div>
          </form>
        )}

        {step === 'payment' && tempGroupId && (
          <BitcoinPayment
            amount={99}
            productType="premium_group"
            productId={tempGroupId}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        )}

        {step === 'creating' && (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="h-8 w-8 text-cybergold-400 animate-spin mb-4" />
            <p className="text-sm text-cyberdark-300">Fullfører opprettelse av premium-gruppe...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};