
import { cn } from "@/lib/utils";
import { User, Bell, Shield } from "lucide-react";

interface ProfileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ProfileNavigation = ({ activeTab, onTabChange }: ProfileNavigationProps) => {
  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'security', name: 'Sikkerhet', icon: Shield },
    { id: 'notifications', name: 'Varsler', icon: Bell },
  ];

  return (
    <div className="flex overflow-x-auto mb-6 bg-cyberdark-800/50 rounded-lg p-1 border border-cybergold-400/20">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-4 text-sm rounded-md transition-colors duration-200 min-w-[100px]",
            activeTab === tab.id
              ? "bg-gradient-to-r from-cybergold-900/80 to-cybergold-800/60 text-cybergold-300"
              : "text-cyberdark-400 hover:text-cyberdark-300 hover:bg-cyberdark-700/30"
          )}
        >
          <tab.icon className="h-4 w-4" />
          {tab.name}
        </button>
      ))}
    </div>
  );
};
