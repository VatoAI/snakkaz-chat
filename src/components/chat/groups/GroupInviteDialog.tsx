
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Users, UserPlus, Mail } from "lucide-react";
import { GroupInvite } from "@/types/group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface GroupInviteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invites: GroupInvite[];
  onAccept: (invite: GroupInvite) => Promise<void>;
  onDecline: (invite: GroupInvite) => Promise<void>;
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null}>;
}

export const GroupInviteDialog = ({
  isOpen,
  onClose,
  invites,
  onAccept,
  onDecline,
  userProfiles = {}
}: GroupInviteDialogProps) => {
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAccept = async (invite: GroupInvite) => {
    setActionLoadingId(invite.id);
    try {
      await onAccept(invite);
      toast({
        title: "Invitasjon akseptert",
        description: `Du er nå med i "${invite.group_name || 'gruppen'}"`,
      });
    } catch (error) {
      toast({
        title: "Kunne ikke bli med i gruppe",
        description: "En feil oppstod. Prøv igjen senere.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDecline = async (invite: GroupInvite) => {
    setActionLoadingId(invite.id);
    try {
      await onDecline(invite);
      toast({
        title: "Invitasjon avslått",
        description: "Invitasjonen ble avslått",
      });
    } catch (error) {
      toast({
        title: "Kunne ikke avslå invitasjon",
        description: "En feil oppstod. Prøv igjen senere.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-cyberdark-900 border border-cybergold-500/30 text-cybergold-200 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-cybergold-500" />
            <span>Gruppe invitasjoner</span>
          </DialogTitle>
          <DialogDescription className="text-cybergold-400">
            {invites.length > 0 
              ? "Du har følgende invitasjoner til grupper" 
              : "Du har ingen aktive gruppeinvitasjoner"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {invites.length > 0 ? (
            <div className="space-y-3">
              {invites.map((invite) => {
                const senderProfile = userProfiles[invite.invited_by];
                const isLoading = actionLoadingId === invite.id;
                const expiryDate = new Date(invite.expires_at);
                const daysLeft = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div 
                    key={invite.id}
                    className="bg-cyberdark-800 border border-cybergold-500/20 rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-cybergold-500/20">
                          <AvatarFallback className="bg-cybergold-500/20 text-cybergold-300">
                            <Users className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h4 className="font-medium text-cybergold-200">
                            {invite.group_name || "Gruppe"}
                          </h4>
                          <p className="text-xs text-cybergold-400 flex items-center gap-1">
                            <UserPlus className="h-3 w-3" />
                            <span>Invitert av {senderProfile?.username || invite.sender_username || "Ukjent"}</span>
                          </p>
                          <p className="text-xs text-cybergold-500/80 mt-1">
                            Utløper om {daysLeft} {daysLeft === 1 ? 'dag' : 'dager'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleDecline(invite)}
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleAccept(invite)}
                          size="sm"
                          className="h-8 px-3 bg-cybergold-600 hover:bg-cybergold-700 text-black"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Check className="h-4 w-4 mr-1" />
                          )}
                          <span>Aksepter</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <Mail className="h-12 w-12 mx-auto mb-2 text-cybergold-400/40" />
              <p className="text-cybergold-400">Ingen invitasjoner</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-cyberdark-800 hover:bg-cyberdark-700 text-cybergold-300"
          >
            Lukk
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
