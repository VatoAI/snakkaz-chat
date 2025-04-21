
import { ProfileNavigation } from "@/components/profile/ProfileNavigation";
import { ProfileCard } from "@/components/profile/ProfileCard";

export const ProfileContainer = () => (
  <div className="min-h-screen bg-cyberdark-950">
    <ProfileNavigation />
    <div className="flex items-center justify-center p-4">
      <ProfileCard />
    </div>
  </div>
);
