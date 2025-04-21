
import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { ProfileNavigation } from "@/components/profile/ProfileNavigation";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PinManagement } from "@/components/pin/PinManagement";
import { useProfileState } from "@/components/profile/hooks/useProfileState";
import { useProfileValidation } from "@/components/profile/hooks/useProfileValidation";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  
  const {
    loading,
    username,
    usernameError,
    avatarUrl,
    uploading,
    handleUsernameChange,
    setUsernameError,
    toast
  } = useProfileState();
  
  const { validateUsername } = useProfileValidation();
  
  // Update profile logic
  async function updateProfile() {
    try {
      const { data: { session } } = await import("@/integrations/supabase/client").then(m => m.supabase.auth.getSession());
      if (!session) {
        toast({
          title: "Feil",
          description: "Du må være logget inn for å oppdatere profilen",
          variant: "destructive",
        });
        return;
      }
      const isValid = await validateUsername(username, setUsernameError);
      if (!isValid) {
        toast({
          title: "Feil",
          description: usernameError || "Ugyldig brukernavn",
          variant: "destructive",
        });
        return;
      }
      const { error } = await import("@/integrations/supabase/client").then(m => m.supabase
        .from('profiles')
        .update({
          username,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id)
      );
      if (error) throw error;
      toast({
        title: "Suksess",
        description: "Profilen din har blitt oppdatert",
      });
      setUsernameError(null);
      document.dispatchEvent(new CustomEvent('username-updated', {
        detail: { userId: session.user.id, username }
      }));
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke oppdatere profilen",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-cyberdark-950 text-white pt-4 pb-8 px-4">
      <Button
        variant="ghost"
        size="sm"
        className="text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800/50 mb-4"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Tilbake
      </Button>

      <ProfileContainer>
        <ProfileNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "profile" && (
          <ProfileCard>
            <ProfileUsernameForm
              username={username}
              usernameError={usernameError}
              loading={loading}
              onUsernameChange={handleUsernameChange}
              onSubmit={updateProfile}
            />
            <ProfileShareSection username={username} />
          </ProfileCard>
        )}
        
        {activeTab === "security" && (
          <ProfileCard>
            <PinManagement />
          </ProfileCard>
        )}
        
        {activeTab === "notifications" && (
          <ProfileCard>
            <h2 className="text-lg font-semibold text-cybergold-300 mb-4">Varslingsinnstillinger</h2>
            <p className="text-cyberdark-300">Varslingsinnstillinger kommer snart.</p>
          </ProfileCard>
        )}
      </ProfileContainer>
    </div>
  );
};

export default Profile;
