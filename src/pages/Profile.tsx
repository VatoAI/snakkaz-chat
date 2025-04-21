
import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { ProfileNavigation } from "@/components/profile/ProfileNavigation";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ProfileUsernameForm } from "@/components/profile/ProfileUsernameForm";
import { ProfileShareSection } from "@/components/profile/ProfileShareSection";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PinManagement } from "@/components/pin/PinManagement";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

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
            <ProfileUsernameForm />
            <ProfileShareSection />
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
